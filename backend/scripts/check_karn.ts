
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'tharab@sena.co.th';

    console.log(`Checking user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('User KARN not found.');
        return;
    }

    console.log(`✅ User found: ${user.id} (${user.name})`);

    // Check tasks assigned to KARN
    const assignedTasks = await prisma.task.findMany({
        where: { assigneeId: user.id },
        select: { id: true, title: true, status: true }
    });

    // Check tasks created by KARN
    const createdTasks = await prisma.task.findMany({
        where: { createdById: user.id },
        select: { id: true, title: true }
    });

    // Check tasks visible in "My Tasks" (OR logic)
    const myTasks = await prisma.task.findMany({
        where: {
            OR: [
                { assigneeId: user.id },
                { createdById: user.id }
            ]
        },
        select: { id: true, title: true, assignee: { select: { email: true } } }
    });

    console.log(`\n--- KARN Stats ---`);
    console.log(`Assigned to KARN: ${assignedTasks.length}`);
    console.log(`Created by KARN: ${createdTasks.length}`);
    console.log(`Visible in My Tasks: ${myTasks.length}`);

    console.log(`\nSample Tasks in My Tasks:`);
    myTasks.slice(0, 5).forEach(t => console.log(`- ${t.title} (Assignee: ${t.assignee?.email})`));

    console.log('\n----------------------------------------');

    // Check TRI stats for comparison
    const triEmail = 'nattapongm@sena.co.th';
    const tri = await prisma.user.findUnique({ where: { email: triEmail } });
    if (tri) {
        const triTasks = await prisma.task.findMany({
            where: {
                OR: [
                    { assigneeId: tri.id },
                    { createdById: tri.id }
                ]
            }
        });
        console.log(`TRI (${triEmail}) Visible Tasks: ${triTasks.length}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
