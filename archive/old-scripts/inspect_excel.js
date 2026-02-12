
const XLSX = require('xlsx');
const path = require('path');

// Path to the Excel file
const filePath = '/Users/nk-lamy/Desktop/Coding/YTY Project/IT- Project Tracking 2026.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Read first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON to see headers and data
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Array of arrays

    console.log('--- Headers ---');
    console.log(JSON.stringify(data[0], null, 2));

    console.log('\n--- Rows 4-10 ---');
    console.log(JSON.stringify(data.slice(3, 11), null, 2));

} catch (error) {
    console.error('Error reading Excel file:', error.message);
}
