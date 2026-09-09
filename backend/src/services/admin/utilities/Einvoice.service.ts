import prisma from '../../../config/prisma.js';

export const TRANSACTION_TYPES = [
  { value: 'outward', label: 'Outward' },
  { value: 'inward', label: 'Inward' },
] as const;

export const SUPPLY_TYPES = [
  { value: 'b2b', label: 'Business to Business' },
  { value: 'b2c', label: 'Business to Consumer' },
  { value: 'd2c', label: 'Direct to Consumer' },
] as const;

// Indian financial year runs Apr 1 – Mar 31, e.g. 15 Jun 2025 -> "2025-26"
function financialYearOf(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1–12
  const startYear = month >= 4 ? year : year - 1;
  const endYearShort = String((startYear + 1) % 100).padStart(2, '0');
  return `${startYear}-${endYearShort}`;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Service to handle e-invoice operations
export const einvoiceService = {
  // Function to fetch dropdown/lookup data for the e-invoice form.
  // From GSTIN is picked from the GSTIN model; From/To City and From/To PIN
  // are free text on the form, so they aren't sourced here.
  getFormOptions: async () => {
    const [gstins, hsnCodes] = await Promise.all([
      prisma.gSTIN.findMany({
        // TODO: consider filtering to only "usable" statuses once
        // GSTINStatus values are confirmed, e.g. where: { status: 'APPROVED' }
        select: {
          id: true,
          gstin: true,
          state: true,
          registrationType: true,
          status: true,
          organizationUnit: {
            select: { id: true, organizationUnit: true },
          },
        },
        orderBy: { gstin: 'asc' },
      }),
      prisma.hsnCode.findMany({
        select: { id: true, code: true, description: true, gstRate: true },
        orderBy: { code: 'asc' },
      }),
    ]);

    return {
      transactionTypes: TRANSACTION_TYPES,
      supplyTypes: SUPPLY_TYPES,
      sellerGstProfiles: gstins.map((g) => ({
        id: g.id,
        gstin: g.gstin,
        label: g.gstin,
        legalName: g.organizationUnit?.organizationUnit ?? null,
        stateCode: g.state,
        status: g.status,
        registrationType: g.registrationType,
      })),
      hsnCodes: hsnCodes.map((h) => ({
        id: h.id,
        code: h.code,
        label: h.description ? `${h.code} — ${h.description}` : h.code,
        gstRate: h.gstRate,
      })),
    };
  },

  // Function to create a new e-invoice. Auto-numbers per seller+financial
  // year, and does not call any IRP/GSP — status is always created as 'draft'.
  createEInvoice: async (input: any, userId?: number) => {
    const {
      transactionType,
      supplyType,
      documentDate: documentDateRaw,
      sellerGstProfileId,
      fromPin,
      fromCity,
      toGstin,
      toLegalName,
      toPin,
      toCity,
      items,
    } = input;

    const documentDate = new Date(documentDateRaw);
    const dateOnly = new Date(documentDate.getFullYear(), documentDate.getMonth(), documentDate.getDate());
    if (dateOnly > startOfToday()) {
      const err: any = new Error("Document Date cannot be a future date");
      err.code = "FUTURE_DATE";
      throw err;
    }

    const sellerId = Number(sellerGstProfileId);
    const seller = await prisma.gSTIN.findUnique({ where: { id: sellerId } });
    if (!seller) {
      const err: any = new Error("Selected From GSTIN does not exist");
      err.code = "INVALID_SELLER";
      throw err;
    }

    const hsnCodesInUse: string[] = [...new Set(items.map((i: any) => i.hsnCode))] as string[];
    const validHsnCodes = await prisma.hsnCode.findMany({
      where: { code: { in: hsnCodesInUse } },
      select: { code: true },
    });
    const validHsnSet = new Set(validHsnCodes.map((h) => h.code));
    const unknownHsn = hsnCodesInUse.filter((c) => !validHsnSet.has(c));
    if (unknownHsn.length > 0) {
      const err: any = new Error(`Unknown HSN code(s): ${unknownHsn.join(', ')}`);
      err.code = "INVALID_HSN";
      throw err;
    }

    const financialYear = financialYearOf(documentDate);

    // Sequence claim + invoice create run in the same transaction, so a
    // failed create doesn't leave a "burned" document number behind.
    return prisma.$transaction(async (tx) => {
      const sequence = await tx.documentSequence.upsert({
        where: {
          sellerGstinId_docType_financialYear: {
            sellerGstinId: sellerId,
            docType: 'einvoice',
            financialYear,
          },
        },
        create: { sellerGstinId: sellerId, docType: 'einvoice', financialYear, lastNumber: 1 },
        update: { lastNumber: { increment: 1 } },
      });

      const documentNumber = `INV/${financialYear}/${String(sequence.lastNumber).padStart(5, '0')}`;

      return tx.eInvoice.create({
        data: {
          documentNumber,
          documentDate,
          transactionType,
          supplyType,
          sellerGstProfileId: sellerId,
          fromPin: fromPin?.trim() || null,
          fromCity: fromCity?.trim() || null,
          toGstin: toGstin.trim(),
          toLegalName: toLegalName?.trim() || null,
          toPin: toPin?.trim() || null,
          toCity: toCity?.trim() || null,
          status: 'draft',
          createdBy: userId ?? null,
          items: {
            create: items.map((item: any) => ({
              hsnCode: item.hsnCode,
              description: item.description ?? null,
              quantity: item.quantity ?? 1,
              unit: item.unit ?? null,
              rate: item.rate ?? item.taxableValue,
              taxableValue: item.taxableValue,
              cgstRate: item.cgstRate ?? null,
              sgstRate: item.sgstRate ?? null,
              igstRate: item.igstRate ?? null,
            })),
          },
        },
        include: { items: true, seller: true },
      });
    });
  },
};