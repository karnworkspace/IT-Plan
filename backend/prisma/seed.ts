
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Prepare User Data
    const email = 'tharab@sena.co.th';
    const name = 'ธรา';
    const passwordRaw = 'Sen@1775';
    const pinRaw = '112233';

    // 2. Hash Password & PIN
    const passwordHash = await bcrypt.hash(passwordRaw, 10);
    const pinHash = await bcrypt.hash(pinRaw, 10);

    // 3. Upsert User (Create if not exists, Update if exists)
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: passwordHash,
            pinHash: pinHash,
            pinSetAt: new Date(), // Set this so it skips setup-pin screen
            name: name,
        },
        create: {
            email,
            name,
            password: passwordHash,
            pinHash: pinHash,
            pinSetAt: new Date(),
            role: 'OWNER', // ให้เป็น Owner เลย
        },
    });

    console.log(`✅ User seeded: ${user.name} (${user.email})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
