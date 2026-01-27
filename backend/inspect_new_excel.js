
const XLSX = require('xlsx');
const filePath = '/Users/nk-lamy/Desktop/Coding/YTY Project/IT2026.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Read raw data to see structure
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log(`--- Sheet: ${sheetName} ---`);
    console.log('--- First 10 Rows ---');
    console.log(JSON.stringify(data.slice(0, 10), null, 2));

} catch (error) {
    console.error('Error:', error.message);
}
