/**
 * Seed Script: Import JO data from JSON (no Excel dependency)
 *
 * Creates 3 projects (CMS, AMS, SF) + 9 tasks under SOFTWARE_DEVELOPMENT
 * Idempotent: skips existing projects/tasks by projectCode/title
 *
 * Usage: cd backend && npx ts-node scripts/seed-jo-import.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface SeedTask {
  title: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  startDate: string | null;
  dueDate: string | null;
  assigneeEmail: string | null;
  createdByEmail: string;
  assigneeEmails: string[];
}

interface SeedProject {
  name: string;
  description: string;
  color: string;
  status: string;
  projectCode: string;
  category: string;
  sortOrder: number;
  ownerEmail: string;
  members: { email: string; role: string }[];
  tasks: SeedTask[];
}

async function main() {
  console.log('🌱 Seed: JO data → TaskFlow\n');

  // 1. Read JSON
  const jsonPath = path.join(__dirname, 'seed-jo-data.json');
  const seedData: SeedProject[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📊 Loaded ${seedData.length} projects from JSON`);

  // 2. Build email → userId map
  const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
  const emailToId = new Map(allUsers.map(u => [u.email.toLowerCase(), u.id]));

  let totalProjects = 0;
  let totalTasks = 0;
  let skippedProjects = 0;
  let skippedTasks = 0;

  for (const proj of seedData) {
    const ownerId = emailToId.get(proj.ownerEmail.toLowerCase());
    if (!ownerId) {
      console.error(`❌ Owner not found: ${proj.ownerEmail}`);
      continue;
    }

    // 3. Upsert project
    let project = await prisma.project.findFirst({ where: { projectCode: proj.projectCode } });
    if (project) {
      console.log(`⏭️  Project exists: ${proj.name} (${proj.projectCode})`);
      skippedProjects++;
    } else {
      project = await prisma.project.create({
        data: {
          name: proj.name,
          description: proj.description,
          color: proj.color,
          status: proj.status,
          projectCode: proj.projectCode,
          category: proj.category,
          sortOrder: proj.sortOrder,
          ownerId,
        },
      });
      console.log(`✅ Created project: ${proj.name} (${proj.projectCode})`);
      totalProjects++;
    }

    // 4. Add members
    for (const member of proj.members) {
      const userId = emailToId.get(member.email.toLowerCase());
      if (!userId) continue;
      const exists = await prisma.projectMember.findFirst({
        where: { projectId: project.id, userId },
      });
      if (!exists) {
        await prisma.projectMember.create({
          data: { projectId: project.id, userId, role: member.role },
        });
      }
    }

    // 5. Create tasks
    for (const t of proj.tasks) {
      // Check duplicate
      const existing = await prisma.task.findFirst({
        where: { projectId: project.id, title: t.title },
      });
      if (existing) {
        skippedTasks++;
        continue;
      }

      const createdById = emailToId.get(t.createdByEmail.toLowerCase()) || ownerId;
      const assigneeId = t.assigneeEmail
        ? emailToId.get(t.assigneeEmail.toLowerCase()) || ownerId
        : ownerId;
      const assigneeIds = t.assigneeEmails
        .map(e => emailToId.get(e.toLowerCase()))
        .filter(Boolean) as string[];

      await prisma.task.create({
        data: {
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          progress: t.progress,
          projectId: project.id,
          assigneeId,
          createdById,
          startDate: t.startDate ? new Date(t.startDate) : null,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          taskAssignees: assigneeIds.length > 0 ? {
            create: assigneeIds.map(uid => ({ userId: uid })),
          } : undefined,
        },
      });

      console.log(`   ✅ ${t.status.padEnd(12)} | ${t.title.substring(0, 60)}`);
      totalTasks++;
    }
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🌱 Seed Summary:`);
  console.log(`   ✅ Projects created: ${totalProjects} (skipped: ${skippedProjects})`);
  console.log(`   ✅ Tasks created: ${totalTasks} (skipped: ${skippedTasks})`);
  console.log(`${'='.repeat(50)}`);

  await prisma.$disconnect();
}

main().catch(error => {
  console.error('❌ Error:', error);
  prisma.$disconnect();
  process.exit(1);
});
