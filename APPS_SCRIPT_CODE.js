// ============================================================
// ADORA COATINGS — Google Apps Script Backend
// Account: ashutosh@adoracoatings.com
// Sheet: https://docs.google.com/spreadsheets/d/1rB16IpL0pDhjDwEIXDmmcKgsCG5puT6QFOHJik31a54
// ============================================================

const SHEET_ID = '1rB16IpL0pDhjDwEIXDmmcKgsCG5puT6QFOHJik31a54'

function doGet(e) {
  try {
    const sheet = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : 'Leads'
    const ss    = SpreadsheetApp.openById(SHEET_ID)
    const ws    = ss.getSheetByName(sheet)
    if (!ws) return json({ error: 'Sheet not found: ' + sheet })
    const rows    = ws.getDataRange().getValues()
    const headers = rows[0]
    const data    = rows.slice(1).filter(r => r.some(c => c !== '')).map(r => {
      const obj = {}
      headers.forEach((h, i) => { obj[h] = r[i] })
      return obj
    })
    return json({ status: 'ok', sheet: sheet, count: data.length, data: data })
  } catch(err) {
    return json({ error: err.message })
  }
}

function doPost(e) {
  try {
    const body    = JSON.parse(e.postData.contents)
    const sheetNm = body.sheet || 'Leads'
    const rowData = body.data
    const ss      = SpreadsheetApp.openById(SHEET_ID)
    let ws        = ss.getSheetByName(sheetNm)
    if (!ws) {
      ws = ss.insertSheet(sheetNm)
      if (rowData) ws.appendRow(Object.keys(rowData))
    }
    if (rowData) {
      const headers = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0]
      const row     = headers.map(h => rowData[h] !== undefined ? rowData[h] : '')
      ws.appendRow(row)
    }
    return json({ status: 'ok', message: 'Row added to ' + sheetNm })
  } catch(err) {
    return json({ error: err.message })
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

// ============================================================
// Run this ONCE to setup all sheets with headers
// ============================================================
function setupSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID)

  const SHEETS = {
    'Leads':  ['Name','Phone','Email','Source','Stage','Status','Via','Location','Added By','Date Added'],
    'Orders': ['Sl','Project Name','Invoice No','Date','Base Value','GST','Total','Received','Profit','Status'],
    'Stock':  ['Product','Location','Qty','Pack Size','Notes','Updated By','Date'],
    'Staff':  ['Name','Role','Phone','Email','Status'],
  }

  Object.entries(SHEETS).forEach(([name, headers]) => {
    let ws = ss.getSheetByName(name)
    if (!ws) {
      ws = ss.insertSheet(name)
      ws.appendRow(headers)
      ws.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4a7c1f').setFontColor('#ffffff')
    }
  })

  const staff = ss.getSheetByName('Staff')
  if (staff && staff.getLastRow() <= 1) {
    const staffData = [
      ['Ashutosh Mehraa', 'Super Admin', '98800 33353', 'ashutosh@adoracoatings.com', 'Active'],
      ['Muniraj Sir',     'Supervisor',  '8618729631',  'muniraj@adoracoatings.com',   'Active'],
      ['Anil Sir',        'Supervisor',  '9902549969',  'anil@adoracoatings.com',       'Active'],
      ['Abhishek',        'Marketing',   '9343454874',  'abhishek@adoracoatings.com',   'Active'],
    ]
    staffData.forEach(row => staff.appendRow(row))
  }

  Logger.log('All sheets created!')
}
