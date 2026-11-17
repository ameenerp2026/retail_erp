import { DEFAULT_MAX_ROWS, importError, readExcelRows } from "./excelReader.js";
import type { ImportDefinition, ImportRowError } from "./import.types.js";

export type ImportResult = { imported: number };

export async function runImport<T, K extends string>(
  definition: ImportDefinition<T, K>,
  buffer: Buffer,
  userId: number,
): Promise<ImportResult> {
  // 1. Read the Excel rows as text
  const excelRows = await readExcelRows(
    buffer,
    definition.columns,
    definition.maxRows ?? DEFAULT_MAX_ROWS,
  );

  const columnLabel = (field: string) =>
    definition.columns.find((column) => column.key === field)?.header ?? field;

  const errors: ImportRowError[] = [];
  const validRows: { rowNumber: number; key: string; data: T }[] = [];
  const firstRowByKey = new Map<string, number>();

  // 2. Check each row with the screen's own rules
  for (const { rowNumber, raw } of excelRows) {
    const parsed = definition.parseRow(raw);

    if (!parsed.ok) {
      errors.push({ row: rowNumber, column: columnLabel(parsed.field), message: parsed.error });
      continue;
    }

    // 3. Find duplicates inside the file
    const key = definition.uniqueKey(parsed.data);
    const firstRow = firstRowByKey.get(key);

    if (firstRow !== undefined) {
      errors.push({
        row: rowNumber,
        column: definition.uniqueColumn,
        message: `Same ${definition.uniqueColumn} as row ${firstRow}`,
      });
      continue;
    }

    firstRowByKey.set(key, rowNumber);
    validRows.push({ rowNumber, key, data: parsed.data });
  }

  // 4. Find values that already exist in the database, with one query
  if (validRows.length > 0) {
    const existingKeys = new Set(await definition.findExisting(validRows.map((r) => r.key)));

    for (const row of validRows) {
      if (existingKeys.has(row.key)) {
        errors.push({
          row: row.rowNumber,
          column: definition.uniqueColumn,
          message: `${definition.uniqueColumn} already exists`,
        });
      }
    }
  }

  // 5. Any error: save nothing
  if (errors.length > 0) {
    errors.sort((a, b) => a.row - b.row);
    throw importError(`${errors.length} error(s) found. Nothing was imported.`, errors);
  }

  // 6. All valid: save all rows
  const imported = await definition.save(
    validRows.map((row) => row.data),
    userId,
  );

  return { imported };
}