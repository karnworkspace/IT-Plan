import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
    console.log('📂 Reading data_export.json...\n');

    const data = JSON.parse(
        fs.readFileSync('data_export.json', 'utf-8')
    );

    console.log('📊 Data to import:');
    console.log(`   - Projects: ${data.projects.length}`);
    console.log(`   - Tasks: ${data.tasks.length}`);
    console.log(`   - Project Members: ${data.projectMembers.length}\n`);

    let stats = {
        projects: { imported: 0, skipped: 0, failed: 0 },
        tasks: { imported: 0, skipped: 0, failed: 0 },
        projectMembers: { imported: 0, skipped: 0, failed: 0 }
    };

    // 1. Import Projects
    console.log('📥 Importing Projects...');
    for (const project of data.projects) {
        try {
            const existing = await prisma.project.findUnique({
                where: { id: project.id },
            });

            if (existing) {
                stats.projects.skipped++;
                continue;
            }

            await prisma.project.create({
                data: {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    status: project.status,
                    color: project.color,
                    icon: project.icon,
                    startDate: project.startDate ? new Date(project.startDate) : null,
                    endDate: project.endDate ? new Date(project.endDate) : null,
                    ownerId: project.ownerId,
                    createdAt: new Date(project.createdAt),
                    updatedAt: new Date(project.updatedAt),
                },
            });

            stats.projects.imported++;
        } catch (error: any) {
            console.error(`❌ Failed to import project ${project.name}:`, error.message);
            stats.projects.failed++;
        }
    }
    console.log(`   ✅ Imported: ${stats.projects.imported} | ⏭️ Skipped: ${stats.projects.skipped} | ❌ Failed: ${stats.projects.failed}\n`);

    // 2. Import Project Members
    console.log('📥 Importing Project Members...');
    for (const member of data.projectMembers) {
        try {
            const existing = await prisma.projectMember.findUnique({
                where: {
                    projectId_userId: {
                        projectId: member.projectId,
                        userId: member.userId,
                    },
                },
            });

            if (existing) {
                stats.projectMembers.skipped++;
                continue;
            }

            await prisma.projectMember.create({
                data: {
                    id: member.id,
                    projectId: member.projectId,
                    userId: member.userId,
                    role: member.role,
                    joinedAt: new Date(member.joinedAt),
                },
            });

            stats.projectMembers.imported++;
        } catch (error: any) {
            console.error(`❌ Failed to import member:`, error.message);
            stats.projectMembers.failed++;
        }
    }
    console.log(`   ✅ Imported: ${stats.projectMembers.imported} | ⏭️ Skipped: ${stats.projectMembers.skipped} | ❌ Failed: ${stats.projectMembers.failed}\n`);

    // 3. Import Tasks
    console.log('📥 Importing Tasks...');
    for (const task of data.tasks) {
        try {
            const existing = await prisma.task.findUnique({
                where: { id: task.id },
            });

            if (existing) {
                stats.tasks.skipped++;
                continue;
            }

            await prisma.task.create({
                data: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    startDate: task.startDate ? new Date(task.startDate) : null,
                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                    progress: task.progress || 0,
                    projectId: task.projectId,
                    assigneeId: task.assigneeId,
                    createdById: task.createdById,
                    createdAt: new Date(task.createdAt),
                    updatedAt: new Date(task.updatedAt),
                },
            });

            stats.tasks.imported++;
        } catch (error: any) {
            console.error(`❌ Failed to import task ${task.title}:`, error.message);
            stats.tasks.failed++;
        }
    }
    console.log(`   ✅ Imported: ${stats.tasks.imported} | ⏭️ Skipped: ${stats.tasks.skipped} | ❌ Failed: ${stats.tasks.failed}\n`);

    // Summary
    console.log('📊 Final Summary:');
    console.log(`   Projects: ${stats.projects.imported} imported, ${stats.projects.skipped} skipped, ${stats.projects.failed} failed`);
    console.log(`   Project Members: ${stats.projectMembers.imported} imported, ${stats.projectMembers.skipped} skipped, ${stats.projectMembers.failed} failed`);
    console.log(`   Tasks: ${stats.tasks.imported} imported, ${stats.tasks.skipped} skipped, ${stats.tasks.failed} failed`);

    await prisma.$disconnect();
}

importData()
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
