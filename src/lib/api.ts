// ── Adora Coatings — Google Sheets Backend ───────────────────────
// Apps Script: ashutosh@adoracoatings.com account
// Sheet: https://docs.google.com/spreadsheets/d/1rB16IpL0pDhjDwEIXDmmcKgsCG5puT6QFOHJik31a54

const SHEET_ID = '1rB16IpL0pDhjDwEIXDmmcKgsCG5puT6QFOHJik31a54'
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6uvsjsOppTr6I5OmGsWa_F9ul_uLQ-8iSCE1a4NbjMOxsllU54QwqgXFEskvJg5lHCQ/exec'
const API_KEY = 'adora_9f3k7m2q_2026'
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}`

// ── Fetch sheet data via Apps Script (GET) ────────────────────────
export async function fetchSheet<T>(sheet: string): Promise<T[]> {
  try {
    const res  = await fetch(`${APPS_SCRIPT_URL}?sheet=${encodeURIComponent(sheet)}&key=${API_KEY}`)
    const json = await res.json()
    if (json.status === 'ok' && Array.isArray(json.data)) {
      return json.data as T[]
    }
    return []
  } catch {
    return []
  }
}

// ── Add a row via Apps Script (POST) ─────────────────────────────
export async function addRow(sheet: string, rowData: Record<string, unknown>) {
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ sheet, data: rowData, key: API_KEY }),
    })
    return await res.json()
  } catch {
    return { error: 'Failed to add row' }
  }
}

// ── Trigger a live Instagram profile + media pull (GET) ───────────
export async function syncInstagram() {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=syncInstagram&key=${API_KEY}`)
    return await res.json()
  } catch {
    return { error: 'Failed to sync Instagram' }
  }
}
