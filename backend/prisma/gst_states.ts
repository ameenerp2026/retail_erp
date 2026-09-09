import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ⚠️ Set this to a real admin/system user id before running.
const ADMIN_USER_ID = 1;

/**
 * Official GST State/UT codes as per CBIC.
 * code    -> 2-digit GST state code (display/ordering)
 * isoCode -> short state code, matches BusinessLocation.state
 * name    -> full state name, matches GSTIN.state
 *
 * igstEnabled / cgstSgstEnabled default to true (schema default) — adjust
 * per your business rules if some states should differ.
 * hasSEZ defaults to false — this should reflect whether YOUR org has an
 * SEZ-registered BusinessLocation in that state, not a static fact about
 * the state, so update this after location data is seeded.
 */
const GST_STATES: {
  code: string;
  isoCode: string;
  name: string;
}[] = [
  { code: "01", isoCode: "JK", name: "Jammu and Kashmir" },
  { code: "02", isoCode: "HP", name: "Himachal Pradesh" },
  { code: "03", isoCode: "PB", name: "Punjab" },
  { code: "04", isoCode: "CH", name: "Chandigarh" },
  { code: "05", isoCode: "UK", name: "Uttarakhand" },
  { code: "06", isoCode: "HR", name: "Haryana" },
  { code: "07", isoCode: "DL", name: "Delhi" },
  { code: "08", isoCode: "RJ", name: "Rajasthan" },
  { code: "09", isoCode: "UP", name: "Uttar Pradesh" },
  { code: "10", isoCode: "BR", name: "Bihar" },
  { code: "11", isoCode: "SK", name: "Sikkim" },
  { code: "12", isoCode: "AR", name: "Arunachal Pradesh" },
  { code: "13", isoCode: "NL", name: "Nagaland" },
  { code: "14", isoCode: "MN", name: "Manipur" },
  { code: "15", isoCode: "MZ", name: "Mizoram" },
  { code: "16", isoCode: "TR", name: "Tripura" },
  { code: "17", isoCode: "ML", name: "Meghalaya" },
  { code: "18", isoCode: "AS", name: "Assam" },
  { code: "19", isoCode: "WB", name: "West Bengal" },
  { code: "20", isoCode: "JH", name: "Jharkhand" },
  { code: "21", isoCode: "OD", name: "Odisha" },
  { code: "22", isoCode: "CG", name: "Chhattisgarh" },
  { code: "23", isoCode: "MP", name: "Madhya Pradesh" },
  { code: "24", isoCode: "GJ", name: "Gujarat" },
  { code: "26", isoCode: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "27", isoCode: "MH", name: "Maharashtra" },
  { code: "29", isoCode: "KA", name: "Karnataka" },
  { code: "30", isoCode: "GA", name: "Goa" },
  { code: "31", isoCode: "LD", name: "Lakshadweep" },
  { code: "32", isoCode: "KL", name: "Kerala" },
  { code: "33", isoCode: "TN", name: "Tamil Nadu" },
  { code: "34", isoCode: "PY", name: "Puducherry" },
  { code: "35", isoCode: "AN", name: "Andaman and Nicobar Islands" },
  { code: "36", isoCode: "TS", name: "Telangana" },
  { code: "37", isoCode: "AP", name: "Andhra Pradesh" },
  { code: "38", isoCode: "LA", name: "Ladakh" },
  { code: "97", isoCode: "OT", name: "Other Territory" },
];

async function main() {
  console.log(`Seeding ${GST_STATES.length} GST states...`);

  for (const state of GST_STATES) {
    await prisma.gstState.upsert({
      where: { code: state.code },
      update: {
        isoCode: state.isoCode,
        name: state.name,
      },
      create: {
        code: state.code,
        isoCode: state.isoCode,
        name: state.name,
        igstEnabled: true,
        cgstSgstEnabled: true,
        hasSEZ: false,
        createdById: ADMIN_USER_ID,
      },
    });
  }

  console.log("✅ GST states seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });