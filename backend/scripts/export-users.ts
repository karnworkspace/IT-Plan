import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function exportUsers() {
    console.log('🔍 Exporting users from local database...');

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
            pinHash: true,
            pinSetAt: true,
            loginAttempts: true,
            lockedUntil: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    console.log(`✅ Found ${users.length} users`);

    // Save to JSON file
    fs.writeFileSync(
        'users_export.json',
        JSON.stringify(users, null, 2)
    );

    console.log('💾 Saved to users_export.json');

    await prisma.$disconnect();
}

exportUsers()
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
