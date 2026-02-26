/**
 * Seed Script (Plain JS) — runs inside production container
 * Usage: docker exec taskflow-backend-prod node /app/seed-jo-import.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed: JO data → TaskFlow\n');

  const jsonPath = path.join(__dirname, 'seed-jo-data.json');
  const seedData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📊 Loaded ${seedData.length} projects from JSON`);

  const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
  const emailToId = new Map(allUsers.map(u => [u.email.toLowerCase(), u.id]));

  let totalProjects = 0, totalTasks = 0, skippedProjects = 0, skippedTasks = 0;

  for (const proj of seedData) {
    const ownerId = emailToId.get(proj.ownerEmail.toLowerCase());
    if (!ownerId) { console.error(`❌ Owner not found: ${proj.ownerEmail}`); continue; }

    let project = await prisma.project.findFirst({ where: { projectCode: proj.projectCode } });
    if (project) {
      console.log(`⏭️  Project exists: ${proj.name} (${proj.projectCode})`);
      skippedProjects++;
    } else {
      project = await prisma.project.create({
        data: {
          name: proj.name, description: proj.description, color: proj.color,
          status: proj.status, projectCode: proj.projectCode, category: proj.category,
          sortOrder: proj.sortOrder, ownerId,
        },
      });
      console.log(`✅ Created project: ${proj.name} (${proj.projectCode})`);
      totalProjects++;
    }

    for (const member of proj.members) {
      const userId = emailToId.get(member.email.toLowerCase());
      if (!userId) continue;
      const exists = await prisma.projectMember.findFirst({ where: { projectId: project.id, userId } });
      if (!exists) await prisma.projectMember.create({ data: { projectId: project.id, userId, role: member.role } });
    }

    for (const t of proj.tasks) {
      const existing = await prisma.task.findFirst({ where: { projectId: project.id, title: t.title } });
      if (existing) { skippedTasks++; continue; }

      const createdById = emailToId.get(t.createdByEmail.toLowerCase()) || ownerId;
      const assigneeId = t.assigneeEmail ? emailToId.get(t.assigneeEmail.toLowerCase()) || ownerId : ownerId;
      const assigneeIds = t.assigneeEmails.map(e => emailToId.get(e.toLowerCase())).filter(Boolean);

      await prisma.task.create({
        data: {
          title: t.title, description: t.description, status: t.status,
          priority: t.priority, progress: t.progress, projectId: project.id,
          assigneeId, createdById,
          startDate: t.startDate ? new Date(t.startDate) : null,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          taskAssignees: assigneeIds.length > 0 ? { create: assigneeIds.map(uid => ({ userId: uid })) } : undefined,
        },
      });
      console.log(`   ✅ ${t.status.padEnd(12)} | ${t.title.substring(0, 60)}`);
      totalTasks++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`🌱 Seed Summary:`);
  console.log(`   ✅ Projects created: ${totalProjects} (skipped: ${skippedProjects})`);
  console.log(`   ✅ Tasks created: ${totalTasks} (skipped: ${skippedTasks})`);
  console.log(`${'='.repeat(50)}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error('❌', e); prisma.$disconnect(); process.exit(1); });
