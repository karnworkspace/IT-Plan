/**
 * Seed script: ใส่ category, projectCode, sortOrder, timeline ลง projects
 * อิงจาก Excel "IT Project Tracking 2026"
 *
 * Usage: cd backend && npx tsx scripts/seed-timeline.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Category definitions
const CATEGORIES = {
  CONSTRUCTION_OPERATION: 'CONSTRUCTION_OPERATION',
  SALES_MARKETING: 'SALES_MARKETING',
  CORPORATE: 'CORPORATE',
  PRODUCT: 'PRODUCT',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE',
} as const;

// Full-year planned timeline (all 12 months)
const FULL_YEAR = { "2026": { "1":"planned","2":"planned","3":"planned","4":"planned","5":"planned","6":"planned","7":"planned","8":"planned","9":"planned","10":"planned","11":"planned","12":"planned" } };
const H1_ONLY = { "2026": { "1":"planned","2":"planned","3":"planned","4":"planned","5":"planned","6":"planned" } };
const H2_ONLY = { "2026": { "7":"planned","8":"planned","9":"planned","10":"planned","11":"planned","12":"planned" } };
const Q1_Q2 = { "2026": { "1":"planned","2":"planned","3":"planned","4":"planned","5":"planned","6":"planned" } };
const Q2_Q4 = { "2026": { "4":"planned","5":"planned","6":"planned","7":"planned","8":"planned","9":"planned","10":"planned","11":"planned","12":"planned" } };

// Map: project name pattern → { category, projectCode, sortOrder, timeline }
// Match by partial name (case-insensitive contains)
const PROJECT_MAPPING: Array<{
  pattern: string;
  category: string;
  projectCode: string;
  sortOrder: number;
  businessOwner?: string;
  timeline: object;
}> = [
  // === CONSTRUCTION OPERATION SUPPORT (1-4) ===
  { pattern: 'SENA SiteMaps', category: CATEGORIES.CONSTRUCTION_OPERATION, projectCode: 'PP26000-01-00', sortOrder: 1, timeline: FULL_YEAR },
  { pattern: 'CMS-POJJAMAN', category: CATEGORIES.CONSTRUCTION_OPERATION, projectCode: 'PP26000-02-00', sortOrder: 2, timeline: FULL_YEAR },

  // === SALES & MARKETING (5-14) ===
  { pattern: 'CDP/CRM', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-05-00', sortOrder: 5, timeline: FULL_YEAR },
  { pattern: 'Meta CAPI', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-06-00', sortOrder: 6, timeline: Q1_Q2 },
  { pattern: 'Booking-to-Transfer', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-07-00', sortOrder: 7, timeline: FULL_YEAR },
  { pattern: 'Sales-Bot', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-08-00', sortOrder: 8, timeline: FULL_YEAR },
  { pattern: 'Pricing Management', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-09-00', sortOrder: 9, timeline: FULL_YEAR },
  { pattern: 'REM LivNex', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-10-00', sortOrder: 10, timeline: FULL_YEAR },
  { pattern: 'Referral', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-11-00', sortOrder: 11, timeline: Q2_Q4 },
  { pattern: 'Sales-Kit', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-12-00', sortOrder: 12, timeline: FULL_YEAR },
  { pattern: 'REM Improvement', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-13-00', sortOrder: 13, timeline: FULL_YEAR },
  { pattern: 'SENA Cashless', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-14-00', sortOrder: 14, timeline: Q2_Q4 },
  { pattern: 'E-Constract', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-15-00', sortOrder: 15, timeline: H2_ONLY },
  { pattern: 'Master Customer', category: CATEGORIES.SALES_MARKETING, projectCode: 'PP26000-16-00', sortOrder: 16, timeline: FULL_YEAR },

  // === CORPORATE (17-20) ===
  { pattern: 'Corporate OKR', category: CATEGORIES.CORPORATE, projectCode: 'PP26000-17-00', sortOrder: 17, timeline: FULL_YEAR },
  { pattern: 'New HR System', category: CATEGORIES.CORPORATE, projectCode: 'PP26000-18-00', sortOrder: 18, timeline: FULL_YEAR },

  // === PRODUCT (21-24) ===
  { pattern: 'Product Single View', category: CATEGORIES.PRODUCT, projectCode: 'PP26000-21-00', sortOrder: 21, timeline: FULL_YEAR },
  { pattern: 'SENA 360', category: CATEGORIES.PRODUCT, projectCode: 'PP26000-22-00', sortOrder: 22, timeline: FULL_YEAR },
  { pattern: 'SENA RentNex', category: CATEGORIES.PRODUCT, projectCode: 'PP26000-23-00', sortOrder: 23, timeline: Q2_Q4 },
  { pattern: 'SenProp Improvement', category: CATEGORIES.PRODUCT, projectCode: 'PP26000-24-00', sortOrder: 24, timeline: FULL_YEAR },
  { pattern: 'ระบบบริหารห้องเช่า', category: CATEGORIES.PRODUCT, projectCode: 'PP26000-25-00', sortOrder: 25, timeline: FULL_YEAR },

  // === CUSTOMER SERVICE (25-28) ===
  { pattern: 'SenX Complain', category: CATEGORIES.CUSTOMER_SERVICE, projectCode: 'PP26000-26-00', sortOrder: 26, timeline: FULL_YEAR },
  { pattern: 'SenX-Bot', category: CATEGORIES.CUSTOMER_SERVICE, projectCode: 'PP26000-27-00', sortOrder: 27, timeline: FULL_YEAR },
  { pattern: 'Smartify-Backend', category: CATEGORIES.CUSTOMER_SERVICE, projectCode: 'PP26000-28-00', sortOrder: 28, timeline: FULL_YEAR },
  { pattern: 'SENA AI Automation', category: CATEGORIES.CUSTOMER_SERVICE, projectCode: 'PP26000-29-00', sortOrder: 29, timeline: FULL_YEAR },
];

async function main() {
  console.log('🔄 Seeding project timeline data...\n');

  const projects = await prisma.project.findMany({ select: { id: true, name: true } });
  console.log(`Found ${projects.length} projects in DB\n`);

  let updated = 0;
  let skipped = 0;

  for (const project of projects) {
    // Skip test projects
    if (project.name.toLowerCase().includes('ohm test')) {
      console.log(`⏭️  Skip test: ${project.name}`);
      skipped++;
      continue;
    }

    // Find matching mapping
    const mapping = PROJECT_MAPPING.find(m =>
      project.name.toLowerCase().includes(m.pattern.toLowerCase())
    );

    if (mapping) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          projectCode: mapping.projectCode,
          category: mapping.category,
          sortOrder: mapping.sortOrder,
          timeline: mapping.timeline,
          ...(mapping.businessOwner ? { businessOwner: mapping.businessOwner } : {}),
        },
      });
      console.log(`✅ ${mapping.projectCode} | ${mapping.category.padEnd(25)} | ${project.name.substring(0, 60)}`);
      updated++;
    } else {
      console.log(`⚠️  No mapping: ${project.name.substring(0, 60)}`);
      skipped++;
    }
  }

  console.log(`\n✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
