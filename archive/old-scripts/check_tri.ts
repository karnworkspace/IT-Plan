import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'nattapongm@sena.co.th';
    const name = 'TRI';
    // Default password "123456" for testing
    const passwordRaw = '123456';

    console.log(`Checking user: ${email}...`);

    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('User NOT found. Creating...');
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(passwordRaw, salt);

        user = await prisma.user.create({
            data: {
                email,
                name,
                password,
                role: 'USER',
            }
        });
        console.log(`✅ User created! Email: ${email}, Password: ${passwordRaw}`);
    } else {
        // Force reset password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(passwordRaw, salt);
        await prisma.user.update({
            where: { id: user.id },
            data: { password }
        });
        console.log(`✅ User found & Password RESET to: ${passwordRaw}`);
    }

    // Check tasks
    const tasks = await prisma.task.findMany({
        where: { assigneeId: user.id },
        select: { id: true, title: true, status: true, project: { select: { name: true } } }
    });

    console.log(`\nFound ${tasks.length} tasks assigned to TRI (${email}):`);
    tasks.forEach(t => console.log(`- [${t.project.name || 'No Project'}] ${t.title} (${t.status})`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
