import prisma from '../../../config/prisma.js';

export const TRANSPORT_MODES = [
  { value: 'road', label: 'Road' },
  { value: 'rail', label: 'Rail' },
  { value: 'air', label: 'Air' },
  { value: 'ship', label: 'Ship' },
] as const;

// Distance-to-validity table — matches the rules shown in the E-Way Bill
// page's sidebar. Kept as a static constant, not DB-backed, since these are
// regulatory constants rather than user-editable master data.
const VALIDITY_RULES = [
  { id: '1', distance: 'Up to 100 km', maxKm: 100, validityDays: 1 },
  { id: '2', distance: '100 – 300 km', maxKm: 300, validityDays: 3 },
  { id: '3', distance: '300 – 500 km', maxKm: 500, validityDays: 5 },
  { id: '4', distance: '500 – 1000 km', maxKm: 1000, validityDays: 10 },
  { id: '5', distance: 'Above 1000 km', maxKm: Infinity, validityDays: 15 },
] as const;

const COMPLIANCE_NOTICE =
  'E-Way Bill is mandatory for inter-state movement of goods worth above ₹50,000.';

function validityDaysForDistance(km: number): number {
  const rule = VALIDITY_RULES.find((r) => km <= r.maxKm);
  return rule ? rule.validityDays : VALIDITY_RULES[VALIDITY_RULES.length - 1].validityDays;
}

// Indian financial year runs Apr 1 – Mar 31, e.g. 15 Jun 2025 -> "2025-26"
function financialYearOf(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  const endYearShort = String((startYear + 1) % 100).padStart(2, '0');
  return `${startYear}-${endYearShort}`;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Service to handle e-way bill operations
export const ewaybillService = {
  // Function to fetch dropdown/lookup + reference data for the e-way bill form
  getFormOptions: async () => {
    const [gstins, hsnCodes] = await Promise.all([
      prisma.gSTIN.findMany({
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
      transportModes: TRANSPORT_MODES,
      validityRules: VALIDITY_RULES.map((r) => ({ id: r.id, distance: r.distance, validity: `${r.validityDays} day${r.validityDays > 1 ? 's' : ''}` })),
      complianceNotice: COMPLIANCE_NOTICE,
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

  // Function to create a new e-way bill. Auto-numbers per seller+financial
  // year (sharing DocumentSequence with e-invoices, disambiguated by
  // docType), and does not call any government E-Way Bill system — status
  // is always created as 'draft'.
  createEWayBill: async (input: any, userId?: number) => {
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
      hsnCode,
      taxableValue,
      vehicleNumber,
      transportMode,
      distanceKm,
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

    const hsn = await prisma.hsnCode.findUnique({ where: { code: hsnCode } });
    if (!hsn) {
      const err: any = new Error(`Unknown HSN code: ${hsnCode}`);
      err.code = "INVALID_HSN";
      throw err;
    }

    const financialYear = financialYearOf(documentDate);
    const validityDays = validityDaysForDistance(Number(distanceKm));
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    // Sequence claim + e-way bill create run in the same transaction, so a
    // failed create doesn't leave a "burned" document number behind.
    return prisma.$transaction(async (tx) => {
      const sequence = await tx.documentSequence.upsert({
        where: {
          sellerGstinId_docType_financialYear: {
            sellerGstinId: sellerId,
            docType: 'ewaybill',
            financialYear,
          },
        },
        create: { sellerGstinId: sellerId, docType: 'ewaybill', financialYear, lastNumber: 1 },
        update: { lastNumber: { increment: 1 } },
      });

      const documentNumber = `EWB/${financialYear}/${String(sequence.lastNumber).padStart(5, '0')}`;

      return tx.eWayBill.create({
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
          hsnCode,
          taxableValue,
          vehicleNumber: vehicleNumber.trim(),
          transportMode,
          distanceKm: Number(distanceKm),
          validUntil,
          status: 'draft',
          createdBy: userId ?? null,
        },
        include: { seller: true },
      });
    });
  },
};