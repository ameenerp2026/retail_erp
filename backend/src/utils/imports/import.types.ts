export type ImportColumnKind = "text" | "number" | "percent" | "date";

export type ImportColumn<K extends string = string> = {
  key: K;                       // field name in code, e.g. "hsnCode"
  header: string;               // column title in Excel, e.g. "HSN Code"
  kind: ImportColumnKind;       // how to read the cell
  width?: number;               // column width in the template
  options?: readonly string[];  // dropdown values in the template
};

export type ImportRowError = {
  row: number;      // Excel row number
  column: string;   // Excel column title
  message: string;
};

export type ParsedRow<T> =
  | { ok: true; data: T }
  | { ok: false; field: string; error: string };

export type ImportDefinition<T, K extends string = string> = {
  label: string;                                  // "tax configurations", for messages
  sheetName: string;                              // template sheet name
  columns: readonly ImportColumn<K>[];
  instructions: [string, string][];               // rows for the Instructions sheet
  maxRows?: number;                               // default 1000

  parseRow: (raw: Record<K, string>) => ParsedRow<T>;  // check one row
  uniqueKey: (row: T) => string;                  // e.g. row.hsnCode
  uniqueColumn: string;                           // e.g. "HSN Code", for duplicate errors
  findExisting: (keys: string[]) => Promise<string[]>; // keys already in the database
  save: (rows: T[], userId: number) => Promise<number>; // returns how many were saved
};