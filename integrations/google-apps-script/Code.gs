/**
 * Kiddos Paradise — website enquiry receiver (Google Apps Script web app).
 *
 * Each enquiry from the website form is:
 *   1. appended as a row to the "Enquiries" sheet of the spreadsheet this script is bound to, and
 *   2. emailed as an alert to ALERT_EMAIL.
 *
 * Setup steps: see SETUP.md in this folder.
 */

const ALERT_EMAIL = 'kiddosparadise19@gmail.com';
const SHEET_NAME = 'Enquiries';
const HEADERS = ['Received at', 'Parent / guardian', 'Phone', "Child's age", 'Program', 'Preferred start', 'Message', 'Page'];
const REQUIRED = ['parentName', 'phone', 'childAge', 'program'];
const MAX_LEN = { parentName: 80, phone: 20, childAge: 30, program: 60, startDate: 20, message: 1000, page: 100 };

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Honeypot field: filled only by bots. Pretend success so they don't retry.
  if (p.company) return json({ ok: true });

  const missing = REQUIRED.filter(k => !String(p[k] || '').trim());
  if (missing.length) return json({ ok: false, error: 'Missing fields: ' + missing.join(', ') });
  if (p.consent !== 'yes') return json({ ok: false, error: 'Consent not given' });

  const v = {};
  Object.keys(MAX_LEN).forEach(k => { v[k] = clean(p[k], MAX_LEN[k]); });

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    sheet().appendRow([new Date(), v.parentName, v.phone, v.childAge, v.program, v.startDate, v.message, v.page].map(safeCell));
  } catch (err) {
    console.error('Sheet write failed', err);
    return json({ ok: false, error: 'Could not save enquiry' });
  } finally {
    lock.releaseLock();
  }

  try {
    MailApp.sendEmail({
      to: ALERT_EMAIL,
      subject: `New website enquiry — ${v.program} — ${v.parentName}`,
      body: [
        'New admission enquiry from the Kiddos Paradise website:',
        '',
        `Parent / guardian: ${v.parentName}`,
        `Phone: ${v.phone}`,
        `Child's age: ${v.childAge}`,
        `Program: ${v.program}`,
        `Preferred start date: ${v.startDate || 'Not specified'}`,
        `Message: ${v.message || '—'}`,
        '',
        `All enquiries: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
      ].join('\n'),
    });
  } catch (err) {
    // The enquiry is already saved in the sheet; don't fail the parent's submission over the alert.
    console.error('Alert email failed', err);
  }

  return json({ ok: true });
}

// Lets you open the web app URL in a browser to confirm it is deployed.
function doGet() {
  return json({ ok: true, service: 'Kiddos Paradise enquiries' });
}

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function clean(value, max) {
  return String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

// Stop values like "=HYPERLINK(...)" from being treated as spreadsheet formulas.
function safeCell(value) {
  return typeof value === 'string' && /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor to grant permissions and send yourself a test alert. */
function testSetup() {
  const res = doPost({ parameter: {
    parentName: 'Test Parent', phone: '99999 00000', childAge: '3–4.5 years', program: 'Nursery',
    startDate: '', message: 'Setup test — delete this row.', consent: 'yes', page: '/setup-test',
  } });
  console.log(res.getContent());
}
