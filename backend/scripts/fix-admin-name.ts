import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fix admin user display name
 * adinuna@sena.co.th: "OHM" → "อดินันท์ (OHM)"
 */
async function fixAdminName() {
    console.log('🔍 Looking up admin user...');

    const user = await prisma.user.findUnique({
        where: { email: 'adinuna@sena.co.th' },
        select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
        console.log('❌ User adinuna@sena.co.th not found');
        return;
    }

    console.log(`📋 Current: ${user.name} (${user.email}) [${user.role}]`);

    const updated = await prisma.user.update({
        where: { email: 'adinuna@sena.co.th' },
        data: { name: 'อดินันท์ (OHM)' },
        select: { id: true, email: true, name: true, role: true },
    });

    console.log(`✅ Updated: ${updated.name} (${updated.email}) [${updated.role}]`);
}

fixAdminName()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
