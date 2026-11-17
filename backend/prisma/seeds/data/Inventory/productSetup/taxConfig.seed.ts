import type { TaxGroup } from "../../../../../src/utils/inventory/productSetup/taxConfig.constants.js";

export type TaxConfigSeed = {
  hsnCode: string;
  taxGroup: TaxGroup;
  gstRate: number;
  label: string; // for readability only, not saved
};

// SAMPLE DATA FOR DEVELOPMENT ONLY — rates are not verified
export const sampleTaxConfigs: TaxConfigSeed[] = [
  // Standard 18% — electronics, appliances, household
  { hsnCode: "85171300", taxGroup: "STANDARD", gstRate: 18, label: "Mobile phones" },
  { hsnCode: "84713010", taxGroup: "STANDARD", gstRate: 18, label: "Laptops" },
  { hsnCode: "85285200", taxGroup: "STANDARD", gstRate: 18, label: "Monitors" },
  { hsnCode: "85044030", taxGroup: "STANDARD", gstRate: 18, label: "Chargers" },
  { hsnCode: "84433100", taxGroup: "STANDARD", gstRate: 18, label: "Printers" },
  { hsnCode: "85183000", taxGroup: "STANDARD", gstRate: 18, label: "Headphones" },
  { hsnCode: "85176290", taxGroup: "STANDARD", gstRate: 18, label: "Routers" },
  { hsnCode: "84714190", taxGroup: "STANDARD", gstRate: 18, label: "Desktop computers" },
  { hsnCode: "85234910", taxGroup: "STANDARD", gstRate: 18, label: "Optical discs" },
  { hsnCode: "85258020", taxGroup: "STANDARD", gstRate: 18, label: "Digital cameras" },
  { hsnCode: "94036000", taxGroup: "STANDARD", gstRate: 18, label: "Wooden furniture" },
  { hsnCode: "94032090", taxGroup: "STANDARD", gstRate: 18, label: "Metal furniture" },
  { hsnCode: "39241090", taxGroup: "STANDARD", gstRate: 18, label: "Plastic tableware" },
  { hsnCode: "73239390", taxGroup: "STANDARD", gstRate: 18, label: "Steel kitchenware" },
  { hsnCode: "76151030", taxGroup: "STANDARD", gstRate: 18, label: "Aluminium utensils" },
  { hsnCode: "84181010", taxGroup: "STANDARD", gstRate: 18, label: "Refrigerators" },
  { hsnCode: "84501100", taxGroup: "STANDARD", gstRate: 18, label: "Washing machines" },
  { hsnCode: "85165000", taxGroup: "STANDARD", gstRate: 18, label: "Microwave ovens" },
  { hsnCode: "85098000", taxGroup: "STANDARD", gstRate: 18, label: "Mixer grinders" },
  { hsnCode: "85161000", taxGroup: "STANDARD", gstRate: 18, label: "Water heaters" },

  // Standard 40% — luxury goods
  { hsnCode: "22021010", taxGroup: "STANDARD", gstRate: 40, label: "Aerated drinks" },
  { hsnCode: "22021090", taxGroup: "STANDARD", gstRate: 40, label: "Flavoured drinks" },
  { hsnCode: "87112019", taxGroup: "STANDARD", gstRate: 40, label: "Large motorcycles" },
  { hsnCode: "89039100", taxGroup: "STANDARD", gstRate: 40, label: "Yachts" },

  // Essential 5% — groceries and personal care
  { hsnCode: "1006", taxGroup: "ESSENTIAL", gstRate: 5, label: "Packaged rice" },
  { hsnCode: "11010000", taxGroup: "ESSENTIAL", gstRate: 5, label: "Packaged atta" },
  { hsnCode: "0409", taxGroup: "ESSENTIAL", gstRate: 5, label: "Honey" },
  { hsnCode: "1701", taxGroup: "ESSENTIAL", gstRate: 5, label: "Sugar" },
  { hsnCode: "0902", taxGroup: "ESSENTIAL", gstRate: 5, label: "Tea" },
  { hsnCode: "0901", taxGroup: "ESSENTIAL", gstRate: 5, label: "Coffee" },
  { hsnCode: "1507", taxGroup: "ESSENTIAL", gstRate: 5, label: "Soya oil" },
  { hsnCode: "19053100", taxGroup: "ESSENTIAL", gstRate: 5, label: "Biscuits" },
  { hsnCode: "2201", taxGroup: "ESSENTIAL", gstRate: 5, label: "Packaged water" },
  { hsnCode: "04059020", taxGroup: "ESSENTIAL", gstRate: 5, label: "Ghee" },
  { hsnCode: "3401", taxGroup: "ESSENTIAL", gstRate: 5, label: "Soap" },
  { hsnCode: "33051090", taxGroup: "ESSENTIAL", gstRate: 5, label: "Shampoo" },

  // Pharma 5% — medicines and medical supplies
  { hsnCode: "30049099", taxGroup: "PHARMA", gstRate: 5, label: "Medicines" },
  { hsnCode: "30049011", taxGroup: "PHARMA", gstRate: 5, label: "Ayurvedic medicines" },
  { hsnCode: "30042019", taxGroup: "PHARMA", gstRate: 5, label: "Antibiotics" },
  { hsnCode: "30051090", taxGroup: "PHARMA", gstRate: 5, label: "Bandages" },
  { hsnCode: "90183100", taxGroup: "PHARMA", gstRate: 5, label: "Syringes" },
  { hsnCode: "30061010", taxGroup: "PHARMA", gstRate: 5, label: "Surgical sutures" },

  // Exempt 0% — fresh produce and books
  { hsnCode: "0401", taxGroup: "EXEMPT", gstRate: 0, label: "Fresh milk" },
  { hsnCode: "0701", taxGroup: "EXEMPT", gstRate: 0, label: "Potatoes" },
  { hsnCode: "0702", taxGroup: "EXEMPT", gstRate: 0, label: "Tomatoes" },
  { hsnCode: "07031010", taxGroup: "EXEMPT", gstRate: 0, label: "Onions" },
  { hsnCode: "0803", taxGroup: "EXEMPT", gstRate: 0, label: "Bananas" },
  { hsnCode: "0805", taxGroup: "EXEMPT", gstRate: 0, label: "Citrus fruits" },
  { hsnCode: "0810", taxGroup: "EXEMPT", gstRate: 0, label: "Other fresh fruits" },
  { hsnCode: "49011010", taxGroup: "EXEMPT", gstRate: 0, label: "Printed books" },
];