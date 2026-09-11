import jsPDF from 'jspdf'

export interface PdfField {
  label: string
  value: string
}

export interface PdfSection {
  title: string
  fields: PdfField[]
}

export interface PdfDocumentSpec {
  documentTitle: string          // e.g. 'E-Invoice', 'E-Way Bill'
  referenceLabel: string         // e.g. 'INVOICE REFERENCE NUMBER (IRN)', 'E-WAY BILL NUMBER (EWB)'
  referenceValue: string         // e.g. result.irn, result.ewbNumber
  metaLine: string               // e.g. 'Ack No: ... · Ack Date: ...' or 'Generated: ... Valid Until: ...'
  sectionRows: PdfSection[][]    // each inner array renders side-by-side (1 or 2 sections per row)
  totalLabel: string             // e.g. 'Grand Total', 'Taxable Value'
  totalValue: string             // pre-formatted, e.g. 'Rs. 1,94,700.00'
  footerNote: string
  filename: string
}

const BRAND_BLUE: [number, number, number] = [4, 55, 147] // #043793
const MUTED: [number, number, number] = [120, 120, 120]
const BODY: [number, number, number] = [60, 60, 60]
const FAINT: [number, number, number] = [180, 180, 180]
const LINE: [number, number, number] = [230, 230, 230]

const MARGIN_X = 48
const PAGE_RIGHT = 547
const COL_GAP = 260
const LINE_HEIGHT = 13

export function generateDocumentPdf(spec: PdfDocumentSpec) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  let y = 56

  // Title
  doc.setFontSize(16)
  doc.setTextColor(...BRAND_BLUE)
  doc.text(spec.documentTitle, MARGIN_X, y)

  // Reference block
  y += 28
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text(spec.referenceLabel, MARGIN_X, y)
  y += 14
  doc.setFontSize(10)
  doc.setTextColor(...BRAND_BLUE)
  doc.text(spec.referenceValue, MARGIN_X, y)

  y += 16
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text(spec.metaLine, MARGIN_X, y)

  y += 26

  // Section rows — each row can have 1 or 2 sections rendered side by side
  for (const row of spec.sectionRows) {
    const rowStartY = y
    let maxRowHeight = 0

    row.forEach((section, colIndex) => {
      const colX = colIndex === 0 ? MARGIN_X : MARGIN_X + COL_GAP
      let colY = rowStartY

      doc.setFontSize(9)
      doc.setTextColor(...MUTED)
      doc.text(section.title, colX, colY)
      colY += 14

      doc.setFontSize(9)
      doc.setTextColor(...BODY)
      section.fields.forEach((field) => {
        doc.text(`${field.label}: ${field.value}`, colX, colY)
        colY += LINE_HEIGHT
      })

      const colHeight = colY - rowStartY
      if (colHeight > maxRowHeight) maxRowHeight = colHeight
    })

    y = rowStartY + maxRowHeight + 12
  }

  // Divider
  doc.setDrawColor(...LINE)
  doc.line(MARGIN_X, y, PAGE_RIGHT, y)
  y += 24

  // Total
  doc.setFontSize(11)
  doc.setTextColor(...BRAND_BLUE)
  doc.text(`${spec.totalLabel}: ${spec.totalValue}`, MARGIN_X, y)

  // Footer
  y += 40
  doc.setFontSize(8)
  doc.setTextColor(...FAINT)
  doc.text(spec.footerNote, MARGIN_X, y)

  doc.save(spec.filename)
}