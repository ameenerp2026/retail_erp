import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

// ⚠️ Set this to a real admin/system user id before running.
// createdBy / updatedBy are plain Int columns here (no foreign key), so a
// wrong id won't fail, but it will record the wrong user.
const ADMIN_USER_ID = 1;

/**
 * Currencies.
 *
 * currencyCode -> unique key, so this seed uses a real upsert.
 * exchangeRate -> string, rate vs the base currency (INR), e.g. "85.0000".
 *                 The base currency itself is "1".
 * isBase       -> exactly ONE currency should be the base (INR here).
 *                 Defaults to false when omitted.
 * status       -> optional; omitted rows use the schema default ("active").
 *
 * ⚠️ The exchange rates below are rough, illustrative numbers, NOT live
 * rates. Update them in the app (or here before the first seed). They are
 * only written when a currency is first created, so re-running the seed
 * never overwrites rates that were updated later.
 */
const CURRENCIES: {
  countryName?: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  exchangeRate: string;
  isBase?: boolean;
  status?: Status;
}[] = [
  {
    countryName: "India",
    currencyCode: "INR",
    currencyName: "Indian Rupee",
    symbol: "₹",
    exchangeRate: "1",
    isBase: true,
  },
  {
    countryName: "United States",
    currencyCode: "USD",
    currencyName: "US Dollar",
    symbol: "$",
    exchangeRate: "85.0000",
  },
  {
    countryName: "Eurozone",
    currencyCode: "EUR",
    currencyName: "Euro",
    symbol: "€",
    exchangeRate: "95.0000",
  },
  {
    countryName: "United Kingdom",
    currencyCode: "GBP",
    currencyName: "British Pound",
    symbol: "£",
    exchangeRate: "110.0000",
  },
  {
    countryName: "United Arab Emirates",
    currencyCode: "AED",
    currencyName: "UAE Dirham",
    symbol: "AED",
    exchangeRate: "23.0000",
  },
  {
    countryName: "Singapore",
    currencyCode: "SGD",
    currencyName: "Singapore Dollar",
    symbol: "S$",
    exchangeRate: "65.0000",
  },
];

async function main() {
  const baseCount = CURRENCIES.filter((c) => c.isBase).length;
  if (baseCount !== 1) {
    throw new Error(
      `Exactly one currency must have isBase: true, found ${baseCount}.`
    );
  }

  console.log(`Seeding ${CURRENCIES.length} currencies...`);

  for (const c of CURRENCIES) {
    await prisma.currency.upsert({
      where: { currencyCode: c.currencyCode },
      // exchangeRate, isBase and status are deliberately NOT updated on
      // re-runs, so rates and settings changed in the app aren't overwritten.
      update: {
        countryName: c.countryName,
        currencyName: c.currencyName,
        symbol: c.symbol,
        updatedBy: ADMIN_USER_ID,
      },
      create: {
        countryName: c.countryName,
        currencyCode: c.currencyCode,
        currencyName: c.currencyName,
        symbol: c.symbol,
        exchangeRate: c.exchangeRate,
        isBase: c.isBase ?? false,
        ...(c.status && { status: c.status }),
        createdBy: ADMIN_USER_ID,
      },
    });
  }

  console.log("✅ Currencies seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });