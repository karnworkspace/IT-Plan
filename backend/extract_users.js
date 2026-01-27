
const XLSX = require('xlsx');
const fs = require('fs');
const filePath = '/Users/nk-lamy/Desktop/Coding/YTY Project/IT2026.xlsx';
const mappingFile = '/Users/nk-lamy/Desktop/Coding/YTY Project/user_mapping.csv';

try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const pmSet = new Set();

    // Start from row 5 (index 4)
    for (let i = 4; i < data.length; i++) {
        const row = data[i];
        if (!row) continue;

        // Col E (Index 4) is PM
        const pmRaw = row[4];
        if (pmRaw && typeof pmRaw === 'string') {
            // Split by comma or slash if multiple
            const parts = pmRaw.split(/[,/]/).map(s => s.trim());
            parts.forEach(p => {
                if (p) pmSet.add(p);
            });
        }
    }

    let csv = "NameInExcel,EmailInSystem\n";
    pmSet.forEach(pm => {
        csv += `${pm},\n`; // Leave email empty for user to fill
    });

    fs.writeFileSync(mappingFile, csv);
    console.log(`✅ User Mapping Template created: ${mappingFile}`);
    console.log('Found PMs:', Array.from(pmSet));

} catch (error) {
    console.error(error);
}
