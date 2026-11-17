import ExcelJS from "exceljs";
import { DEFAULT_MAX_ROWS } from "./excelReader.js";
import type { ImportColumn, ImportDefinition } from "./import.types.js";

// How each kind of column is formatted in Excel
const formatFor = (kind: ImportColumn["kind"]) => {
  if (kind === "text") return { numFmt: "@" };          // keeps leading zeros, e.g. 0401
  if (kind === "date") return { numFmt: "yyyy-mm-dd" };
  return {};                                            // numbers and percents: plain numbers
};

export function buildTemplate<T, K extends string>(definition: ImportDefinition<T, K>) {
  const workbook = new ExcelJS.Workbook();
  const maxRows = definition.maxRows ?? DEFAULT_MAX_ROWS;

  // 1. Data sheet: one column per definition column
  const sheet = workbook.addWorksheet(definition.sheetName);

  sheet.columns = definition.columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width ?? Math.max(12, column.header.length + 4),
    style: formatFor(column.kind),
  }));

  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }]; // header stays visible when scrolling

  // 2. Dropdowns for columns with fixed options
  definition.columns.forEach((column, index) => {
    const options = column.options;
    if (!options || options.length === 0) return;

    const letter = sheet.getColumn(index + 1).letter; // 1 → "A", 2 → "B"

    for (let row = 2; row <= maxRows + 1; row++) {
      sheet.getCell(`${letter}${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${options.join(",")}"`],
        showErrorMessage: true,
        errorTitle: `Invalid ${column.header}`,
        error: `Choose one of: ${options.join(", ")}`,
      };
    }
  });

  // 3. Instructions sheet
  const help = workbook.addWorksheet("Instructions");
  help.columns = [{ width: 20 }, { width: 80 }];
  help.addRows([["Column", "Rule"], ...definition.instructions]);
  help.getRow(1).font = { bold: true };

  return workbook;
}