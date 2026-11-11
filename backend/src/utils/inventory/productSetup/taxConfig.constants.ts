export const TAX_GROUPS = ["STANDARD", "ESSENTIAL", "PHARMA", "EXEMPT", "ELECTRONICS", "APPEARL", "FMCG", "GROCERY"] as const;

export type TaxGroup = (typeof TAX_GROUPS)[number];

export const isTaxGroup = (value: unknown): value is TaxGroup =>
  typeof value === "string" && TAX_GROUPS.includes(value as TaxGroup);

