import type { PrismaClient } from "@prisma/client";

export async function seedAccounting(prisma: PrismaClient): Promise<void> {
  const assets = await prisma.group.upsert({
    where: {
      groupCode: "AG001",
    },
    update: {},
    create: {
      groupName: "Assets",
      groupCode: "AG001",
    },
  });

  const liabilities = await prisma.group.upsert({
    where: {
      groupCode: "AG010",
    },
    update: {},
    create: {
      groupName: "Liabilities",
      groupCode: "AG010",
    },
  });

  const income = await prisma.group.upsert({
    where: {
      groupCode: "AG016",
    },
    update: {},
    create: {
      groupName: "Income",
      groupCode: "AG016",
    },
  });

  const currentAssets = await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG002",
    },
    update: {},
    create: {
      subGroupName: "Current Assets",
      subGroupCode: "AG002",
      groupId: assets.id,
    },
  });

  const fixedAssets = await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG003",
    },
    update: {},
    create: {
      subGroupName: "Fixed Assets",
      subGroupCode: "AG003",
      groupId: assets.id,
    },
  });

  const currentLiabilities = await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG011",
    },
    update: {},
    create: {
      subGroupName: "Current Liabilities",
      subGroupCode: "AG011",
      groupId: liabilities.id,
    },
  });

  await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG012",
    },
    update: {},
    create: {
      subGroupName: "Long-term Liabilities",
      subGroupCode: "AG012",
      groupId: liabilities.id,
    },
  });

  const revenue = await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG017",
    },
    update: {},
    create: {
      subGroupName: "Revenue",
      subGroupCode: "AG017",
      groupId: income.id,
    },
  });

  const accountGroups = [
    {
      rootGroupName: "Cash & Cash Equivalents",
      groupCode: "AG005",
      groupId: assets.id,
      subGroupId: currentAssets.id,
    },
    {
      rootGroupName: "Bank Accounts",
      groupCode: "AG006",
      groupId: assets.id,
      subGroupId: currentAssets.id,
    },
    {
      rootGroupName: "Accounts Receivable",
      groupCode: "AG007",
      groupId: assets.id,
      subGroupId: currentAssets.id,
    },
    {
      rootGroupName: "Land & Building",
      groupCode: "AG008",
      groupId: assets.id,
      subGroupId: fixedAssets.id,
    },
    {
      rootGroupName: "Plant & Machinery",
      groupCode: "AG009",
      groupId: assets.id,
      subGroupId: fixedAssets.id,
    },
    {
      rootGroupName: "Accounts Payable",
      groupCode: "AG014",
      groupId: liabilities.id,
      subGroupId: currentLiabilities.id,
    },
    {
      rootGroupName: "GST Payable",
      groupCode: "AG015",
      groupId: liabilities.id,
      subGroupId: currentLiabilities.id,
    },
    {
      rootGroupName: "Sales - Retail",
      groupCode: "AG019",
      groupId: income.id,
      subGroupId: revenue.id,
    },
    {
      rootGroupName: "Service Income",
      groupCode: "AG020",
      groupId: income.id,
      subGroupId: revenue.id,
    },
  ];

  for (const accountGroup of accountGroups) {
    await prisma.accountGroup.upsert({
      where: {
        groupCode: accountGroup.groupCode,
      },
      update: {},
      create: accountGroup,
    });
  }

  console.log("Seeded groups, sub-groups, and account groups");
}
