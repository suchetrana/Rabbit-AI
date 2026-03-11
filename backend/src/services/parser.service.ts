import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import path from 'path';

export interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

export const parseFile = (buffer: Buffer, originalName: string): ParsedRow[] => {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.csv') {
    return parseCsv(buffer);
  }

  if (ext === '.xlsx' || ext === '.xls') {
    return parseExcel(buffer);
  }

  throw new Error(`Unsupported file extension: ${ext}`);
};

const parseCsv = (buffer: Buffer): ParsedRow[] => {
  const csvString = buffer.toString('utf-8');
  const result = Papa.parse<ParsedRow>(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message}`);
  }

  return result.data;
};

const parseExcel = (buffer: Buffer): ParsedRow[] => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('Excel file has no sheets');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<ParsedRow>(worksheet);
};
