import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

export type ExportColumn<T> = {
  header: string;
  accessor: (row: T) => string | number | boolean | null | undefined;
};

function buildRows<T>(data: T[], columns: ExportColumn<T>[]) {
  return data.map((row) =>
    columns.map((column) => {
      const val = column.accessor(row);
      if (val === null || val === undefined) return '';
      if (typeof val === 'boolean') return val ? 'Yes' : 'No';
      return String(val);
    })
  );
}

export interface ExportPDFOptions {
  filename?: string;
  title?: string;
  orientation?: 'p' | 'portrait' | 'l' | 'landscape';
}

export function exportToPDF<T>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportPDFOptions = {}
) {
  if (!data || data.length === 0) {
    toast.error('No data available to export');
    return;
  }

  const { filename = 'export.pdf', title = 'Export', orientation = 'portrait' } = options;

  const doc = new jspdf({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  doc.setFontSize(14);
  doc.text(title, 14, 15);

  autoTable(doc, {
    startY: 22,
    head: [columns.map((c) => c.header)],
    body: buildRows(data, columns),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [4, 55, 147] },
  });

  doc.save(filename);
}