import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface CSVRow {
  projectName: string;
  projectDesc: string;
  ownerEmail: string;
  taskTitle: string;
  taskDesc: string;
  status: string;
  priority: string;
  assigneeEmail: string;
  startDate: string;
  dueDate: string;
}

function parseCSV(filePath: string): CSVRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  const rows: CSVRow[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parsing (handles quoted fields)
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    
    if (fields.length >= 10) {
      rows.push({
        projectName: fields[0].replace(/^"|"$/g, ''),
        projectDesc: fields[1].replace(/^"|"$/g, ''),
        ownerEmail: fields[2].replace(/^"|"$/g, ''),
        taskTitle: fields[3].replace(/^"|"$/g, ''),
        taskDesc: fields[4].replace(/^"|"$/g, ''),
        status: fields[5].replace(/^"|"$/g, ''),
        priority: fields[6].replace(/^"|"$/g, ''),
        assigneeEmail: fields[7].replace(/^"|"$/g, ''),
        startDate: fields[8].replace(/^"|"$/g, ''),
        dueDate: fields[9].replace(/^"|"$/g, ''),
      });
    }
  }
  
  return rows;
}

async function importData() {
  const csvPath = path.join(__dirname, '../../master_import_final.csv');
  const rows = parseCSV(csvPath);
  
  console.log(`📊 Found ${rows.length} tasks to import`);
  
  // Get unique projects
  const projectMap = new Map<string, string>();
  const uniqueProjects = [...new Map(rows.map(r => [r.projectName, r])).values()];
  
  console.log(`📁 Found ${uniqueProjects.length} unique projects`);
  
  // Find KARN's ID (as project owner)
  const karn = await prisma.user.findUnique({ where: { email: 'tharab@sena.co.th' } });
  if (!karn) {
    console.error('❌ KARN user not found');
    process.exit(1);
  }
  
  // Create projects
  console.log('\n=== Creating Projects ===');
  for (const proj of uniqueProjects) {
    try {
      const existing = await prisma.project.findFirst({ where: { name: proj.projectName } });
      if (existing) {
        console.log(`⏭️  Skipped: ${proj.projectName}`);
        projectMap.set(proj.projectName, existing.id);
        continue;
      }
      
      const created = await prisma.project.create({
        data: {
          name: proj.projectName,
          description: proj.projectDesc,
          color: '#1890ff',
          ownerId: karn.id,
        },
      });
      
      console.log(`✅ Created: ${proj.projectName} (${created.id})`);
      projectMap.set(proj.projectName, created.id);
    } catch (error: any) {
      console.error(`❌ Failed to create project ${proj.projectName}:`, error.message);
    }
  }
  
  // Get all users for assignee lookup
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  const userMap = new Map(users.map(u => [u.email, u.id]));
  
  // Create tasks
  console.log('\n=== Creating Tasks ===');
  let created = 0;
  let skipped = 0;
  
  for (const row of rows) {
    try {
      const projectId = projectMap.get(row.projectName);
      if (!projectId) {
        console.error(`❌ Project not found: ${row.projectName}`);
        continue;
      }
      
      // Map status
      let status = row.status;
      if (!['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].includes(status)) {
        status = 'TODO';
      }
      
      // Map priority
      let priority = row.priority;
      if (!['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
        priority = 'MEDIUM';
      }
      
      // Get assignee ID (or null if not found)
      let assigneeId = userMap.get(row.assigneeEmail);
      if (!assigneeId && row.assigneeEmail !== 'Pending to search email') {
        // Create placeholder user
        const newUser = await prisma.user.create({
          data: {
            email: row.assigneeEmail,
            password: 'placeholder123',
            name: row.assigneeEmail.split('@')[0].toUpperCase(),
          },
        });
        assigneeId = newUser.id;
        userMap.set(row.assigneeEmail, newUser.id);
        console.log(`👤 Created user: ${row.assigneeEmail}`);
      }
      
      // Check if task already exists
      const existing = await prisma.task.findFirst({
        where: { projectId, title: row.taskTitle },
      });
      
      if (existing) {
        skipped++;
        continue;
      }
      
      await prisma.task.create({
        data: {
          title: row.taskTitle,
          description: row.taskDesc,
          status,
          priority,
          projectId,
          assigneeId,
          createdById: karn.id,
        },
      });
      
      created++;
      if (created % 10 === 0) {
        process.stdout.write('.');
      }
    } catch (error: any) {
      console.error(`\n❌ Failed to create task ${row.taskTitle}:`, error.message);
    }
  }
  
  console.log(`\n\n📊 Summary:`);
  console.log(`   ✅ Created: ${created} tasks`);
  console.log(`   ⏭️  Skipped: ${skipped} (already exist)`);
  console.log(`   📝 Total: ${rows.length}`);
  
  await prisma.$disconnect();
}

importData().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
