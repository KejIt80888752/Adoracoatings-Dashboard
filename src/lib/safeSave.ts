import { fetchSheet, addRow, deleteRow } from './api'

type Row = Record<string, unknown>

const norm = (v: unknown) => String(v ?? '').trim()
const sameOn = (a: Row, b: Row, fields: string[]) => fields.every(f => norm(a[f]) === norm(b[f]))
const countOn = (rows: Row[], data: Row, fields: string[]) => rows.filter(r => sameOn(r, data, fields)).length

// The Apps Script endpoint sometimes answers a successful write with an HTML
// page, so a response that isn't {status:'ok'} does not mean the row is missing.
// Re-read the sheet and compare instead of trusting the response.
export async function addRowVerified(sheet: string, data: Row, fields: string[]) {
  const before = await fetchSheet<Row>(sheet)
  const result = await addRow(sheet, data)
  const after = await fetchSheet<Row>(sheet)
  const saved = result?.status === 'ok' || countOn(after, data, fields) > countOn(before, data, fields)
  return { saved, rows: after }
}

// Add the new version first, confirm it landed, and only then remove the old
// row. Delete-then-add loses the record if the add fails after the delete.
export async function replaceRowSafely(sheet: string, old: Row & { rowIndex: number }, data: Row, fields: string[]) {
  const { saved, rows } = await addRowVerified(sheet, data, fields)
  if (!saved) return { saved: false, oldRemoved: false }

  let idx = -1
  const atOldIndex = rows[old.rowIndex - 2]
  if (atOldIndex && sameOn(atOldIndex, old, fields)) idx = old.rowIndex
  else {
    const j = rows.findIndex(r => sameOn(r, old, fields))
    if (j >= 0) idx = j + 2
  }
  if (idx < 0) return { saved: true, oldRemoved: true }

  const del = await deleteRow(sheet, idx)
  if (del?.status === 'ok') return { saved: true, oldRemoved: true }
  const after = await fetchSheet<Row>(sheet)
  return { saved: true, oldRemoved: after.length < rows.length }
}
