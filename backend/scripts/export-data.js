const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('./prisma/dev.db', { readonly: true });

console.log('🔍 Exporting data from local SQLite database...\n');

// Export Projects
const projects = db.prepare('SELECT * FROM projects').all();
console.log(`✅ Projects: ${projects.length}`);

// Export Tasks
const tasks = db.prepare('SELECT * FROM tasks').all();
console.log(`✅ Tasks: ${tasks.length}`);

// Export Project Members
const projectMembers = db.prepare('SELECT * FROM project_members').all();
console.log(`✅ Project Members: ${projectMembers.length}`);

// Note: Task assignments are in the tasks table (assigneeId field)
console.log(`✅ Task Assignments: included in tasks\n`);

// Save all data to JSON files
const data = {
    projects,
    tasks,
    projectMembers,
    metadata: {
        exportedAt: new Date().toISOString(),
        counts: {
            projects: projects.length,
            tasks: tasks.length,
            projectMembers: projectMembers.length
        }
    }
};

fs.writeFileSync(
    'data_export.json',
    JSON.stringify(data, null, 2)
);

console.log('💾 Saved to data_export.json');

db.close();
