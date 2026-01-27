
const XLSX = require('xlsx');

const filePath = '/Users/nk-lamy/Desktop/Coding/YTY Project/IT- Project Tracking 2026.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    console.log('All Sheets:', workbook.SheetNames);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log('--- Scanning Columns for Assignee Names ---');
    // Print Headers again
    console.log('Row 4 (Headers):', JSON.stringify(data[3]));

    // Check Rows 5-20
    for (let i = 5; i < 20; i++) {
        const row = data[i];
        if (row && row.length > 0) {
            console.log(`\nRow ${i + 1}:`);
            // Show Index and Value to identify Column E (Index 4) vs others
            row.forEach((val, idx) => {
                const colLetter = String.fromCharCode(65 + idx); // 0->A, 1->B, 4->E
                if (val !== null && val !== undefined) {
                    console.log(`  [${colLetter}] ${val}`);
                }
            });
        }
    }

} catch (error) {
    console.error(error);
}
