
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputFile = '/Users/nk-lamy/Desktop/Coding/YTY Project/IT2026.xlsx';
const mappingFile = '/Users/nk-lamy/Desktop/Coding/YTY Project/user_mapping.csv';
const outputFile = '/Users/nk-lamy/Desktop/Coding/YTY Project/master_import_final.csv';

// Default Assignee if not found in mapping
const DEFAULT_ASSIGNEE = 'tharab@sena.co.th';

// Load User Mapping
let userMap = {};
try {
    const rawMap = fs.readFileSync(mappingFile, 'utf-8');
    rawMap.split('\n').forEach(line => {
        const [name, email] = line.split(','); // Assuming standard CSV format
        if (name && email && email.trim()) {
            userMap[name.trim()] = email.trim();
        }
    });
    console.log('✅ Loaded User Mapping:', Object.keys(userMap).length, 'users');
} catch (e) {
    console.warn('⚠️ Could not load user mapping, using empty map.');
}

// Helpers
function escapeCsv(txt) {
    if (!txt) return '';
    return `"${String(txt).replace(/"/g, '""')}"`;
}

function getMonthDate(monthIndex, isEnd = false) {
    // monthIndex 0=JAN, 1=FEB... 
    const year = 2026;
    const month = monthIndex + 1; // 1-12
    const mStr = month.toString().padStart(2, '0');

    if (isEnd) {
        // Last day of month
        const d = new Date(year, month, 0).getDate(); // last day
        return `${year}-${mStr}-${d}`;
    }
    return `${year}-${mStr}-01`;
}

try {
    const workbook = XLSX.readFile(inputFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let csvContent = "Project Name,Project Description,Project Owner Email,Task Title,Task Description,Status,Priority,Assignee Email,Start Date,Due Date\n";

    // Row 5 (Index 4) starts data based on previous inspection
    // Col B (1): Project ID
    // Col C (2): Main Task (Project Name)
    // Col D (3): Sub Task (Task Name)
    // Col E (4): PM (Assignee)
    // Col F-Q (5-16): JAN-DEC

    let currentProjectName = '';
    let currentProjectID = '';
    let currentProjectOwner = DEFAULT_ASSIGNEE; // Default owner if not specified

    for (let i = 4; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        // 1. Detect Project (MainTask or Project ID)
        // Logic: MainTask defines Project Name context.
        const rawMainTask = row[2];
        const rawProjID = row[1];

        // If Main Task exists, it's a new Project context usually.
        if (rawMainTask) {
            currentProjectName = rawMainTask.toString().trim();
            // Project ID sometimes is in this row too
            if (rawProjID) currentProjectID = rawProjID.toString().trim();
        } else if (rawProjID && !currentProjectName) {
            // Fallback if no MainTask but ID exists
            currentProjectName = `Project ${rawProjID}`;
            currentProjectID = rawProjID.toString().trim();
        }

        // 2. Identify Task
        // SubTask is the Task. If empty, maybe MainTask row IS the task itself (if project is just 1 line)
        // Let's assume SubTask is the primary Task unit.
        // If SubTask exists -> Create Task under `currentProjectName`
        // If SubTask empty BUT MainTask exists, maybe this row is header... or a task?
        // Let's look at pattern:
        // Row 5: MainTask="SiteMaps...", SubTask=null -> This looks like Project Header row.
        // Row 6: MainTask=null, SubTask="Construction Dashboard" -> This is a Task.

        let taskTitle = '';
        let isTaskRow = false;

        const rawSubTask = row[3];
        if (rawSubTask) {
            taskTitle = rawSubTask.toString().trim();
            isTaskRow = true;
        }

        // If it is a task row, extract details
        if (isTaskRow && currentProjectName) {

            // Assignee (PM)
            const pmRaw = row[4];
            let assigneeEmail = DEFAULT_ASSIGNEE;

            if (pmRaw) {
                // Handle multiple PMs
                const pms = pmRaw.toString().split(/[,/]/).map(s => s.trim());

                // Find first valid email
                for (const pm of pms) {
                    if (userMap[pm]) {
                        assigneeEmail = userMap[pm];
                        break; // Take the first one found
                    }
                }
            }

            // Timeline (JAN-DEC: Col 5-16)
            let startMonth = -1;
            let endMonth = -1;

            for (let m = 0; m < 12; m++) {
                const val = row[5 + m];
                if (val !== undefined && val !== null && val.toString().trim() !== '') {
                    if (startMonth === -1) startMonth = m;
                    endMonth = m;
                }
            }

            const startDate = (startMonth !== -1) ? getMonthDate(startMonth, false) : '';
            const dueDate = (endMonth !== -1) ? getMonthDate(endMonth, true) : '';

            // Status (Default TODO)
            // Description: Append Project ID
            const taskDesc = `Ref: ${currentProjectID}`;

            const line = [
                escapeCsv(currentProjectName),
                escapeCsv(`Project ID: ${currentProjectID}`), // Project Desc
                currentProjectOwner,
                escapeCsv(taskTitle),
                escapeCsv(taskDesc),
                'TODO',
                'MEDIUM',
                assigneeEmail,
                startDate,
                dueDate
            ].join(',');

            csvContent += line + '\n';
        }
    }

    fs.writeFileSync(outputFile, csvContent);
    console.log(`✅ Final Import CSV Generated: ${outputFile}`);

} catch (error) {
    console.error('Error:', error);
}
