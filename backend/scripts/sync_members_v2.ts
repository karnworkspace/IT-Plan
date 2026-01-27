
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Syncing Project Members (v2)...');

    // Use 'any' type to avoid TS inference issues in script
    const projects: any[] = await prisma.project.findMany({
        include: {
            tasks: {
                where: { NOT: { assigneeId: null } },
                select: { assigneeId: true }
            },
            members: { select: { userId: true } }
        }
    });

    for (const p of projects) {
        const participantIds = new Set<string>();

        if (p.ownerId) {
            participantIds.add(p.ownerId);
        }

        if (p.tasks) {
            p.tasks.forEach((t: any) => {
                if (t.assigneeId) participantIds.add(t.assigneeId);
            });
        }

        const existingMemberIds = new Set(p.members?.map((m: any) => m.userId) || []);

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
