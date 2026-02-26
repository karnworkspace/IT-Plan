/**
 * ETL Script: Import data_import_jo.xlsx → Projects & Tasks
 *
 * Creates 3 projects (CMS, AMS, SF) under category "SOFTWARE_DEVELOPMENT"
 * Maps tasks from Excel rows with proper status, priority, dates, assignees
 *
 * Usage: cd backend && npx ts-node scripts/import-jo-excel.ts
 */

import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================================
// Config
// ============================================================

const EXCEL_PATH = path.join(__dirname, '../../Data-edit/data_import_jo.xlsx');
const CATEGORY = 'SOFTWARE_DEVELOPMENT';
const OWNER_EMAIL = 'Ekapons@sena.co.th'; // Joe = เอกพล (Head Team)

// User mapping: Excel name → email
const USER_MAP: Record<string, string> = {
  'joe': 'Ekapons@sena.co.th',
  'tarn': 'Sittichaid@sena.co.th',
};

// Project config: system code → project details
const PROJECT_CONFIG: Record<string, { name: string; color: string; codeIndex: number }> = {
  'CMS': { name: 'CMS - Construction Material System', color: '#F59E0B', codeIndex: 30 },
  'AMS': { name: 'AMS - Asset Management System', color: '#3B82F6', codeIndex: 31 },
  'SF':  { name: 'SF - Salesforce Integration', color: '#10B981', codeIndex: 32 },
};

// Status mapping: Thai → system status
function mapStatus(raw: string): string {
  const s = raw.toLowerCase().trim();
  if (s.includes('finished') || s.includes('เสร็จ') || s.includes('deploy')) return 'DONE';
  if (s.includes('ระหว่างพัฒนา') || s.includes('อยู่ระหว่าง') || s.includes('กำลัง')) return 'IN_PROGRESS';
  if (s.includes('ยังไม่เริ่ม') || s.includes('รอ')) return 'TODO';
  if (s.includes('hold') || s.includes('เลื่อน')) return 'HOLD';
  return 'TODO';
}

// Priority mapping: ขนาดงาน → priority
function mapPriority(size: string): string {
  const s = (size || '').toLowerCase().trim();
  if (s === 'large') return 'HIGH';
  if (s === 'middle') return 'MEDIUM';
  if (s === 'small') return 'LOW';
  return 'MEDIUM';
}

// Parse assignees: "Joe, Tarn" → ['Ekapons@sena.co.th', 'Sittichaid@sena.co.th']
function parseAssignees(raw: string): string[] {
  if (!raw) return [];
  return raw.split(',')
    .map(name => name.trim().toLowerCase())
    .map(name => USER_MAP[name])
    .filter(Boolean) as string[];
}

// Create short title from long description
function createTitle(rawTitle: string): string {
  // Take first line, trim to 120 chars
  const firstLine = rawTitle.split('\n')[0].trim();
  if (firstLine.length <= 120) return firstLine;
  return firstLine.substring(0, 117) + '...';
}

// ============================================================
// Excel row interface
// ============================================================

interface ExcelRow {
  no: number;
  theme: string;
  requester: string;       // ผู้แจ้ง
  department: string;      // ฝ่าย
  system: string;          // ระบบ (CMS, AMS, SF)
  size: string;            // ขนาดงาน
  notifyDate: Date | null; // ND
  actualDate: Date | null; // Actual
  ecd: Date | null;        // ECD
  detail: string;          // รายการ
  solution: string;        // แก้ปัญหา
  value: number;           // มูลค่างาน
  assignee: string;        // ผู้ดำเนินการ
  status: string;          // สถานะ
  sheetName: string;       // ม.ค., ก.พ.
}

// ============================================================
// Read Excel
// ============================================================

function readExcel(): ExcelRow[] {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const rows: ExcelRow[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(sheet, { header: 1, defval: null });

    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[0]) continue; // skip empty rows

      const parseDate = (val: any): Date | null => {
        if (!val) return null;
        if (typeof val === 'number') {
          // Excel serial date
          const d = XLSX.SSF.parse_date_code(val);
          return new Date(d.y, d.m - 1, d.d);
        }
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      };

      rows.push({
        no: row[0],
        theme: row[1] || '',
        requester: row[2] || '',
        department: row[3] || '',
        system: (row[4] || '').trim().toUpperCase(),
        size: row[5] || '',
        notifyDate: parseDate(row[6]),
        actualDate: parseDate(row[7]),
        ecd: parseDate(row[8]),
        detail: row[9] || '',
        solution: row[10] || '',
        value: row[11] || 0,
        assignee: row[12] || '',
        status: row[13] || '',
        sheetName,
      });
    }
  }

  return rows;
}

// ============================================================
// Main ETL
// ============================================================

async function main() {
  console.log('🚀 ETL: data_import_jo.xlsx → TaskFlow\n');

  // 1. Read Excel
  const rows = readExcel();
  console.log(`📊 Read ${rows.length} rows from Excel`);

  // Group by system
  const grouped = new Map<string, ExcelRow[]>();
  for (const row of rows) {
    const system = row.system;
    if (!grouped.has(system)) grouped.set(system, []);
    grouped.get(system)!.push(row);
  }

  console.log(`📁 Systems found: ${[...grouped.keys()].join(', ')}`);
  for (const [sys, items] of grouped) {
    console.log(`   ${sys}: ${items.length} tasks`);
  }

  // 2. Get owner user
  const owner = await prisma.user.findFirst({ where: { email: { equals: OWNER_EMAIL, mode: 'insensitive' } } });
  if (!owner) {
    console.error(`❌ Owner not found: ${OWNER_EMAIL}`);
    process.exit(1);
  }
  console.log(`👤 Owner: ${owner.name} (${owner.email})`);

  // 3. Get all users for assignee lookup
  const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
  const emailToId = new Map(allUsers.map(u => [u.email.toLowerCase(), u.id]));

  // 4. Create projects & tasks
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const [system, taskRows] of grouped) {
    const config = PROJECT_CONFIG[system];
    if (!config) {
      console.warn(`⚠️  Unknown system: ${system}, skipping ${taskRows.length} tasks`);
      continue;
    }

    const projectCode = `PP26000-${String(config.codeIndex).padStart(2, '0')}-00`;

    // Upsert project
    let project = await prisma.project.findFirst({ where: { projectCode } });
    if (!project) {
      project = await prisma.project.create({
        data: {
          name: config.name,
          description: `${system} tasks imported from JO Excel`,
          color: config.color,
          status: 'ACTIVE',
          projectCode,
          category: CATEGORY,
          sortOrder: config.codeIndex,
          ownerId: owner.id,
        },
      });
      console.log(`\n✅ Created project: ${config.name} (${projectCode})`);
    } else {
      console.log(`\n⏭️  Project exists: ${config.name} (${projectCode})`);
    }

    // Add owner as project member
    const memberExists = await prisma.projectMember.findFirst({
      where: { projectId: project.id, userId: owner.id },
    });
    if (!memberExists) {
      await prisma.projectMember.create({
        data: { projectId: project.id, userId: owner.id, role: 'OWNER' },
      });
    }

    // Add Tarn as project member
    const tarnId = emailToId.get('sittichaid@sena.co.th');
    if (tarnId) {
      const tarnMember = await prisma.projectMember.findFirst({
        where: { projectId: project.id, userId: tarnId },
      });
      if (!tarnMember) {
        await prisma.projectMember.create({
          data: { projectId: project.id, userId: tarnId, role: 'MEMBER' },
        });
      }
    }

    // Create tasks
    for (const row of taskRows) {
      const title = createTitle(row.detail);

      // Check duplicate
      const existing = await prisma.task.findFirst({
        where: { projectId: project.id, title },
      });
      if (existing) {
        console.log(`   ⏭️  Skipped (exists): ${title.substring(0, 50)}...`);
        totalSkipped++;
        continue;
      }

      // Build description
      const descParts: string[] = [];
      if (row.detail) descParts.push(row.detail);
      if (row.solution) descParts.push(`\n---\nแนวทางแก้ไข: ${row.solution}`);
      if (row.requester) descParts.push(`\nผู้แจ้ง: ${row.requester} (${row.department})`);
      if (row.value) descParts.push(`มูลค่างาน: ${row.value.toLocaleString()} บาท`);
      if (row.theme) descParts.push(`Theme: ${row.theme}`);
      const description = descParts.join('\n');

      // Resolve assignees
      const assigneeEmails = parseAssignees(row.assignee);
      const assigneeIds = assigneeEmails
        .map(email => emailToId.get(email.toLowerCase()))
        .filter(Boolean) as string[];
      const primaryAssigneeId = assigneeIds[0] || owner.id;

      // Map fields
      const status = mapStatus(row.status);
      const priority = mapPriority(row.size);
      const progress = status === 'DONE' ? 100 : status === 'IN_PROGRESS' ? 30 : 0;

      const task = await prisma.task.create({
        data: {
          title,
          description,
          status,
          priority,
          progress,
          projectId: project.id,
          assigneeId: primaryAssigneeId,
          createdById: owner.id,
          startDate: row.notifyDate,
          dueDate: row.ecd,
          taskAssignees: assigneeIds.length > 0 ? {
            create: assigneeIds.map(uid => ({ userId: uid })),
          } : undefined,
        },
      });

      console.log(`   ✅ ${status.padEnd(12)} | ${priority.padEnd(6)} | ${title.substring(0, 60)}`);
      totalCreated++;
    }
  }

  // 5. Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 ETL Summary:`);
  console.log(`   ✅ Created: ${totalCreated} tasks`);
  console.log(`   ⏭️  Skipped: ${totalSkipped} (duplicates)`);
  console.log(`   📁 Projects: ${[...grouped.keys()].filter(s => PROJECT_CONFIG[s]).length}`);
  console.log(`   📂 Category: ${CATEGORY}`);
  console.log(`${'='.repeat(50)}`);

  await prisma.$disconnect();
}

main().catch(error => {
  console.error('❌ Error:', error);
  prisma.$disconnect();
  process.exit(1);
});
