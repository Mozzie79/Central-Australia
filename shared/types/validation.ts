// A single row's computed-vs-workbook comparison, produced by comparing a
// calculator's output against the value the original workbook itself stored
// for that row - the project's core correctness methodology, since .xlsb
// formulas can't be read directly.
export type RowResult = {
  row: string;
  computed: number;
  expected: number;
  diffPct: number;
  status: 'matched' | 'approximate' | 'flagged';
};

export type SheetValidation = {
  sheetName: string;
  results: RowResult[];
};

export type ValidationResponse = {
  sheets: SheetValidation[];
};
