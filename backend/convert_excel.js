
const XLSX = require('xlsx');
const fs = require('fs');

const inputFile = '/Users/nk-lamy/Desktop/Coding/YTY Project/IT- Project Tracking 2026.xlsx';
const outputFile = '/Users/nk-lamy/Desktop/Coding/YTY Project/master_form_filled.csv';

// Default Owner
const OWNER_EMAIL = 'tharab@sena.co.th';

function parseQuarterToDate(qStr) {
    if (!qStr) return '';
    const cleanStr = qStr.trim().toUpperCase();
    const year = cleanStr.includes('2526') ? '2526' : (cleanStr.includes('2026') ? '2026' : '2026'); // Handle typo 2526 -> assume 2026 logic or keep raw
    // Fix Thai year typo if acts like 2026. Let's assume 2026.
    const y = '2026'; // Hardcode 2026 based on filename

    if (cleanStr.includes('Q1')) return `${y}-03-31`;
    if (cleanStr.includes('Q2')) return `${y}-06-30`;
    if (cleanStr.includes('Q3')) return `${y}-09-30`;
    if (cleanStr.includes('Q4')) return `${y}-12-31`;
    return '';
}

function cleanText(text) {
    if (!text) return '';
    return text.toString().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

try {
    const workbook = XLSX.readFile(inputFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let csvContent = "Project Name,Project Description,Project Owner Email,Task Title,Task Description,Status,Priority,Assignee Email,Due Date,Start Date\n";

    let currentProjectName = '';
    let currentProjectDesc = '';

    // Start iterating from row 6 (index 5) based on visual inspection
    // Wait, your inspection showed 'One Customer ID' at row index 5 (0-based) in 'First 3 Rows' call? 
    // No, index 5 in the slice(3,11) output means relative index 2.
    // Let's look at output again.
    // Row 4 (index 3): Headers.
    // Row 5 (index 4): Headers Continued? (null, "Commit KPI"...)
    // Row 6 (index 5): "1", "One Customer ID..." -> THIS IS DATA START.

    const startIndex = 5;

    for (let i = startIndex; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        // Col 1 (B) : Project Name
        const rawProjName = row[1];
        if (rawProjName) {
            currentProjectName = cleanText(rawProjName);
            // Col 2 (C) : Project Desc
            currentProjectDesc = cleanText(row[2]);
        }

        // Col 3 (D) : Task Title (or Plan)
        const rawTaskTitle = row[3];
        if (rawTaskTitle) {
            const taskTitle = cleanText(rawTaskTitle);

            // Col 4 (E) : Timeline
            const dueDate = parseQuarterToDate(row[4]);

            // Col 6/7 ? End Q1, Action Plan... -> Task Description
            // Let's use Col 7 (H) as Task Description if available
            let taskDesc = '';
            if (row[7]) taskDesc = cleanText(row[7]);

            // Escape CSV (handle commas in text)
            const escape = (txt) => `"${txt.replace(/"/g, '""')}"`;

            if (currentProjectName) {
                const line = [
                    escape(currentProjectName),
                    escape(currentProjectDesc),
                    OWNER_EMAIL,                // Owner
                    escape(taskTitle),          // Task Title
                    escape(taskDesc),           // Task Desc
                    'TODO',                     // Status
                    'MEDIUM',                   // Priority
                    OWNER_EMAIL,                // Assignee (Default to Owner)
                    dueDate,                    // Due Date
                    ''                          // Start Date
                ].join(',');

                csvContent += line + '\n';
            }
        }
    }

    fs.writeFileSync(outputFile, csvContent);
    console.log(`✅ Converted Excel to CSV: ${outputFile}`);

} catch (error) {
    console.error('Error converting file:', error);
}
