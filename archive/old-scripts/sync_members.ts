
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Syncing Project Members from Task Assignees...');

    const projects = await prisma.project.findMany({
        include: {
            tasks: {
                where: { assigneeId: { not: null } },
                select: { assigneeId: true }
            },
            members: { select: { userId: true } }
        }
    });

    for (const p of projects) {
        // 1. Collect User IDs participating in this project
        const participantIds = new Set<string>();

        // Add Owner
        if (p.ownerId) {
            participantIds.add(p.ownerId);
        }

        // Add Task Assignees
        p.tasks.forEach(t => {
            if (t.assigneeId) participantIds.add(t.assigneeId);
        });

        // Existing Members
        const existingMemberIds = new Set(p.members.map(m => m.userId));

        const newMembers = [...participantIds].filter(uid => !existingMemberIds.has(uid));

        if (newMembers.length > 0) {
            console.log(`Project "${p.name}": Adding ${newMembers.length} members...`);

            await prisma.projectMember.createMany({
                data: newMembers.map(uid => ({
                    projectId: p.id,
                    userId: uid,
                    role: uid === p.ownerId ? 'OWNER' : 'MEMBER'
                }))
            });
        }
    }
    console.log('Sync complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
