import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function importUsers() {
    console.log('📂 Reading users_export.json...');

    const usersData = JSON.parse(
        fs.readFileSync('users_export.json', 'utf-8')
    );

    console.log(`📥 Importing ${usersData.length} users to production database...`);

    let imported = 0;
    let skipped = 0;

    for (const user of usersData) {
        try {
            // Check if user already exists
            const existing = await prisma.user.findUnique({
                where: { email: user.email },
            });

            if (existing) {
                console.log(`⏭️  Skipped: ${user.email} (already exists)`);
                skipped++;
                continue;
            }

            // Import user with original data
            await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                    password: user.password, // Already hashed
                    name: user.name,
                    role: user.role,
                    pinHash: user.pinHash, // Already hashed
                    pinSetAt: user.pinSetAt ? new Date(user.pinSetAt) : null,
                    loginAttempts: user.loginAttempts || 0,
                    lockedUntil: user.lockedUntil ? new Date(user.lockedUntil) : null,
                    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt),
                },
            });

            console.log(`✅ Imported: ${user.email}`);
            imported++;
        } catch (error: any) {
            console.error(`❌ Failed to import ${user.email}:`, error.message);
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📝 Total: ${usersData.length}`);

    await prisma.$disconnect();
}

importUsers()
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
