import ExcelJS from "exceljs";
import type { Cell, CellValue } from "exceljs";
import type { ImportColumn, ImportColumnKind, ImportRowError } from "./import.types.js";

export const DEFAULT_MAX_ROWS = 1000;

export type ExcelRow<K extends string> = {
  rowNumber: number;          // Excel row number, shown in errors
  raw: Record<K, string>;     // cell text, keyed by column key
};

// An error with a 400 status and an optional list of row errors
export const importError = (message: string, errors: ImportRowError[] = []) =>
  Object.assign(new Error(message), { status: 400, errors });

const normalizeHeader = (value: unknown) =>
  String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

// Excel cells can hold text, numbers, dates, formulas, links or rich text
const cellToValue = (value: CellValue): unknown => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value;
  if (typeof value === "object") {
    if ("result" in value) return cellToValue(value.result as CellValue);
    if ("richText" in value) return value.richText.map((part) => part.text).join("");
    if ("text" in value) return value.text;
    return "";
  }
  return value;
};

const toText = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").trim();
};

// Dates may arrive as a Date, as text, or as an Excel serial number
const toDateText = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "number") {
    return new Date(Math.round((value - 25569) * 86_400_000)).toISOString().slice(0, 10);
  }
  return toText(value);
};

const readCell = (cell: Cell, kind: ImportColumnKind): string => {
  const value = cellToValue(cell.value);

  switch (kind) {
    case "date":
      return toDateText(value);
    case "percent":
      // A cell formatted as % stores 18% as 0.18
      if (typeof value === "number" && cell.numFmt?.includes("%")) {
        return String(Math.round(value * 10000) / 100);
      }
      return toText(value);
    default:
      return toText(value);
  }
};

export async function readExcelRows<K extends string>(
  buffer: Buffer,
  columns: readonly ImportColumn<K>[],
  maxRows = DEFAULT_MAX_ROWS,
): Promise<ExcelRow<K>[]> {
  // 1. Open the file
  const workbook = new ExcelJS.Workbook();
  try {
     await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
} catch {
  throw importError("The file could not be read. Upload a valid .xlsx file.");
}

  const sheet = workbook.worksheets[0];
  if (!sheet) throw importError("The file has no worksheet.");

  // 2. Find each column by its header, so column order doesn't matter
  const columnIndex = new Map<string, number>();
  sheet.getRow(1).eachCell((cell, col) => {
    columnIndex.set(normalizeHeader(cellToValue(cell.value)), col);
  });

  const missing = columns.filter((c) => !columnIndex.has(normalizeHeader(c.header)));
  if (missing.length > 0) {
    throw importError(
      `Missing columns: ${missing.map((c) => c.header).join(", ")}. Download the template and try again.`,
    );
  }

  // 3. Read every data row
  const rows: ExcelRow<K>[] = [];

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    const raw = {} as Record<K, string>;

    for (const column of columns) {
      const cell = row.getCell(columnIndex.get(normalizeHeader(column.header))!);
      raw[column.key] = readCell(cell, column.kind);
    }

    if (Object.values<string>(raw).every((value) => value === "")) continue; // empty row

    if (rows.length >= maxRows) {
      throw importError(`The file has more than ${maxRows} rows. Split it into smaller files.`);
    }

    rows.push({ rowNumber, raw });
  }

  if (rows.length === 0) throw importError("The file has no data rows.");

  return rows;
}