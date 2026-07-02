function doGet(e) {
  return HtmlService.createHtmlOutput('Appointment form endpoint is running.');
}

function doPost(e) {
  const spreadsheetId = 'YOUR_SPREADSHEET_ID';
  const sheetName = 'Sheet1';

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  const row = [
    new Date(),
    e.parameter.name || '',
    e.parameter.phone || '',
    e.parameter.email || '',
    e.parameter.service || '',
    e.parameter.date || '',
    e.parameter.referral || '',
    e.parameter.message || '',
    e.parameter.submittedAt || ''
  ];

  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
