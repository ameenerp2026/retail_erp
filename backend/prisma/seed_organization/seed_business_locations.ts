import {
  PrismaClient,
  LocationType,
  BusinessCategory,
  LocationStatus,
  RegistrationType,
} from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Business locations (head offices, branches, warehouses, stores).
 *
 * organizationUnit -> NAME of an existing OrganizationUnit.
 * gstin            -> the GSTIN string of an existing GSTIN row (unique).
 *                     Both are resolved to ids at run time, so the org unit
 *                     and GSTIN seeds must run first.
 * registrationType -> optional. When omitted, it is copied from the linked
 *                     GSTIN, which keeps the two consistent.
 * state            -> full state name, matching the GSTIN seed. The seed warns
 *                     if it differs from the linked GSTIN's state.
 * Boolean flags    -> default to false when omitted, as in the schema.
 * status           -> optional; omitted rows use the schema default (ACTIVE).
 *
 * The schema has no unique key on BusinessLocation, so the seed treats
 * (locationName, organizationUnit) as the identity and uses find + update/
 * create.
 *
 * ⚠️ The rows below are examples with made-up addresses and contacts.
 * Replace them with your real locations.
 */
const LOCATIONS: {
  locationName: string;
  organizationUnit: string;
  locationType: LocationType;
  businessCategory: BusinessCategory;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  contactPerson: string;
  phoneNumber?: string;
  email?: string;
  emergencyContact?: string;
  gstin: string;
  registrationType?: RegistrationType;
  defaultBillingLocation?: boolean;
  defaultStockLocation?: boolean;
  allowSales?: boolean;
  allowPurchase?: boolean;
  allowInventory?: boolean;
  allowDispatch?: boolean;
  allowPOS?: boolean;
  status?: LocationStatus;
}[] = [
  {
    locationName: "Mumbai South - Head Office",
    organizationUnit: "Mumbai South",
    locationType: "HEAD_OFFICE",
    businessCategory: "RETAIL",
    addressLine1: "1 Example Road, Fort",
    city: "Mumbai",
    state: "Maharashtra",
    country: "IN",
    pinCode: "400001",
    contactPerson: "Raj Kumar",
    phoneNumber: "+91 22 0000 0000",
    email: "mumbai.ho@acme.example",
    gstin: "27AABCS1429B1ZB",
    defaultBillingLocation: true,
    allowSales: true,
    allowPurchase: true,
  },
  {
    locationName: "Mumbai Andheri Store",
    organizationUnit: "Mumbai South",
    locationType: "STORE",
    businessCategory: "RETAIL",
    addressLine1: "22 Sample Complex, Andheri West",
    landmark: "Near the metro station",
    city: "Mumbai",
    state: "Maharashtra",
    country: "IN",
    pinCode: "400053",
    contactPerson: "Asha Nair",
    phoneNumber: "+91 22 0000 0001",
    gstin: "27AABCS1429B1ZB",
    allowSales: true,
    allowInventory: true,
    allowPOS: true,
  },
  {
    locationName: "Bengaluru East Warehouse",
    organizationUnit: "Bengaluru East",
    locationType: "WAREHOUSE",
    businessCategory: "DISTRIBUTION",
    addressLine1: "Plot 5, Sample Industrial Area",
    addressLine2: "Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    country: "IN",
    pinCode: "560066",
    contactPerson: "Ravi Kumar",
    emergencyContact: "+91 80 0000 0002",
    gstin: "29BLRO05160B1DU",
    defaultStockLocation: true,
    allowPurchase: true,
    allowInventory: true,
    allowDispatch: true,
  },
  {
    locationName: "Bhopal West Branch",
    organizationUnit: "Bhopal West",
    locationType: "BRANCH",
    businessCategory: "WHOLESALE",
    addressLine1: "10 Example Market, MP Nagar",
    city: "Bhopal",
    state: "Madhya Pradesh",
    country: "IN",
    pinCode: "462011",
    contactPerson: "Ramya",
    email: "bhopal@acme.example",
    gstin: "23BPLC02452C1DU",
    allowSales: true,
    allowPurchase: true,
    allowInventory: true,
  },
];

async function main() {
  console.log(`Seeding ${LOCATIONS.length} business locations...`);

  for (const l of LOCATIONS) {
    const unit = await prisma.organizationUnit.findFirst({
      where: { organizationUnit: l.organizationUnit },
    });
    if (!unit) {
      throw new Error(
        `OrganizationUnit "${l.organizationUnit}" not found for location "${l.locationName}". Seed org units first.`
      );
    }

    const gst = await prisma.gSTIN.findUnique({ where: { gstin: l.gstin } });
    if (!gst) {
      throw new Error(
        `GSTIN "${l.gstin}" not found for location "${l.locationName}". Seed GSTINs first.`
      );
    }

    if (gst.state !== l.state) {
      console.warn(
        `⚠️  "${l.locationName}": location state "${l.state}" differs from GSTIN state "${gst.state}".`
      );
    }

    // Everything the form's "address / contact / GST" sections hold.
    const details = {
      locationType: l.locationType,
      businessCategory: l.businessCategory,
      addressLine1: l.addressLine1,
      addressLine2: l.addressLine2,
      landmark: l.landmark,
      city: l.city,
      state: l.state,
      country: l.country,
      pinCode: l.pinCode,
      contactPerson: l.contactPerson,
      phoneNumber: l.phoneNumber,
      email: l.email,
      emergencyContact: l.emergencyContact,
      linkedGSTINId: gst.id,
      registrationType: l.registrationType ?? gst.registrationType,
    };

    const existing = await prisma.businessLocation.findFirst({
      where: {
        locationName: l.locationName,
        parentOrganizationUnitId: unit.id,
      },
    });

    if (existing) {
      // Default-location flags, operational toggles and status are NOT
      // updated on re-runs, so changes made in the app aren't overwritten.
      await prisma.businessLocation.update({
        where: { id: existing.id },
        data: details,
      });
    } else {
      await prisma.businessLocation.create({
        data: {
          locationName: l.locationName,
          parentOrganizationUnitId: unit.id,
          ...details,
          defaultBillingLocation: l.defaultBillingLocation ?? false,
          defaultStockLocation: l.defaultStockLocation ?? false,
          allowSales: l.allowSales ?? false,
          allowPurchase: l.allowPurchase ?? false,
          allowInventory: l.allowInventory ?? false,
          allowDispatch: l.allowDispatch ?? false,
          allowPOS: l.allowPOS ?? false,
          ...(l.status && { status: l.status }),
        },
      });
    }
  }

  console.log("✅ Business locations seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });