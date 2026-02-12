
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 1. Promote CHIAN to ADMIN
    const emailChian = 'monchiant@sena.co.th';
    console.log(`Promoting ${emailChian} to ADMIN...`);
    await prisma.user.updateMany({
        where: { email: emailChian },
        data: { role: 'ADMIN' }
    });
    console.log('✅ CHIAN is now ADMIN.');

    // 2. Create TEAM User (Shared Account bucket)
    const teamEmail = 'team@sena.co.th'; // Dummy email
    let teamUser = await prisma.user.findUnique({ where: { email: teamEmail } });

    if (!teamUser) {
        console.log('Creating TEAM user...');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('123456', salt);
        teamUser = await prisma.user.create({
            data: {
                email: teamEmail,
                name: 'TEAM',
                password: hash,
                role: 'MEMBER'
            }
        });
        console.log('✅ TEAM user created:', teamUser.id);
    } else {
        console.log('ℹ️ TEAM user already exists:', teamUser.id);
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
