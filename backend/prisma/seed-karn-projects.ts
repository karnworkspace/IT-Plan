import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

// KARN Projects from IT Strategic 2026
const projects = [
  {
    name: 'Booking-to-Transfer Tracking',
    description: 'Integrate กับ REM,LivNex,RentNex, Sitemaps,Fast Inspect รองรับวงจรประสิทธิภาพ 30 วัน',
    color: '#f5222d',
    tasks: []
  },
  {
    name: 'Corporate OKR System',
    description: 'ระบบ OKR สำหรับองค์กร',
    color: '#fa8c16',
    tasks: [
      { title: 'Center KPI', priority: 'HIGH', dueDate: '2026-09-30' },
      { title: 'KPI-Performance พนักงานรายบุคคล OP1,OP2,OP3,OP4', priority: 'MEDIUM', dueDate: '2026-12-31' }
    ]
  },
  {
    name: 'REM Improvement',
    description: 'ปรับปรุงระบบ REM',
    color: '#1890ff',
    tasks: [
      { title: 'AI - Auto split customer documents', priority: 'HIGH', dueDate: '2026-03-31' },
      { title: 'AI - Sales Activity Analysis', priority: 'MEDIUM', dueDate: '2026-06-30' },
      { title: 'AI - Sales process automations', priority: 'HIGH', dueDate: '2026-12-31' }
    ]
  },
  {
    name: 'REM LivNex/RentNex Improvement 2026',
    description: 'ปรับปรุงระบบ REM LivNex/RentNex',
    color: '#52c41a',
    tasks: [
      { title: 'REM-Livnex ตารางเข้าตรวจสภาพห้อง', priority: 'HIGH', dueDate: '2026-03-31' },
      { title: 'LivNex/RentNex - Exit Process', priority: 'MEDIUM', dueDate: '2026-06-30' },
      { title: 'Smartify Order on REM LivNex', priority: 'MEDIUM', dueDate: '2026-06-30' }
    ]
  },
  {
    name: 'Referral - RentNex,LivNex',
    description: 'ระบบ Referral',
    color: '#722ed1',
    tasks: [
      { title: 'Friend Get Friends', priority: 'HIGH', dueDate: '2026-06-30' },
      { title: 'SENA Agent Portal', priority: 'MEDIUM', dueDate: '2026-12-31' }
    ]
  },
  {
    name: 'SENA 360 Revamp 2025',
    description: 'ปรับปรุงระบบ SENA 360',
    color: '#13c2c2',
    tasks: [
      { title: 'SENA 360 Revamp Projects', priority: 'URGENT', dueDate: '2026-06-30' },
      { title: 'SENA Agent Portal', priority: 'HIGH', dueDate: '2026-09-30' },
      { title: 'SENA 360 for Cashless payment', priority: 'HIGH', dueDate: '2026-09-30' }
    ]
  },
  {
    name: 'SENA AI Automation',
    description: 'ระบบ AI Automation สำหรับ SENA',
    color: '#eb2f96',
    tasks: [
      { title: 'AR/AP Automation (ต่อเนื่อง)', priority: 'HIGH', dueDate: '2026-12-31' },
      { title: 'BOQ Update เข้าระบบ CMS ด้วย AI', priority: 'MEDIUM', dueDate: '2026-04-30' },
      { title: 'ประสานงานราชการ FL.6 -> REM', priority: 'MEDIUM', dueDate: '2026-05-31' },
      { title: 'AMS to CMS with AI', priority: 'LOW', dueDate: '2026-12-31' }
    ]
  },
  {
    name: 'SENA Cashless Journey',
    description: 'ระบบ Cashless Payment',
    color: '#faad14',
    tasks: [
      { title: 'Web Payment Gateway & Integration with SENA360', priority: 'HIGH', dueDate: '2026-12-31' }
    ]
  },
  {
    name: 'SENA RentNex Application',
    description: 'แอปพลิเคชัน RentNex',
    color: '#a0d911',
    tasks: [
      { title: 'SENA RentNex App (Customer self service)', priority: 'URGENT', dueDate: '2026-09-30' },
      { title: 'APP สำหรับส่งมอบห้อง RentNex (Scan ทรัพย์สินในห้อง)', priority: 'HIGH', dueDate: '2026-09-30' }
    ]
  },
  {
    name: 'SenProp Improvement 2025',
    description: 'ปรับปรุงระบบ SenProp',
    color: '#2f54eb',
    tasks: [
      { title: 'Batch 1 (H1)', priority: 'HIGH', dueDate: '2026-06-30' },
      { title: 'Batch 2 (H2)', priority: 'MEDIUM', dueDate: '2026-12-31' }
    ]
  },
  {
    name: 'SenX Complain Management with AI',
    description: 'ระบบจัดการข้อร้องเรียนด้วย AI',
    color: '#f5222d',
    tasks: [
      { title: 'Merge ทุก Channel แยก Category อัตโนมัติ ด้วย AI', priority: 'URGENT', dueDate: '2026-02-28' },
      { title: 'Integration to Construction Quality Tracking Process', priority: 'MEDIUM', dueDate: '2026-12-31' },
      { title: 'Report/Dashboard', priority: 'MEDIUM', dueDate: '2026-09-30' }
    ]
  },
  {
    name: 'Smartify-Backend',
    description: 'สร้างระบบทดแทนการใช้ Google Appsheet',
    color: '#fa541c',
    tasks: []
  },
  {
    name: 'E-Contract',
    description: 'ระบบ E-Contract',
    color: '#1890ff',
    tasks: [
      { title: 'E-Contract for Real Estate', priority: 'URGENT', dueDate: '2026-03-31' },
      { title: 'E-Contract for RentNex', priority: 'HIGH', dueDate: '2026-06-30' },
      { title: 'E-Contract for LivNex', priority: 'HIGH', dueDate: '2026-06-30' }
    ]
  },
  {
    name: 'Sales-Kit + AI',
    description: 'เครื่องมือช่วยขายพร้อม AI',
    color: '#52c41a',
    tasks: [
      { title: 'Sales - ToDo(REM)', priority: 'HIGH', dueDate: '2026-03-31' },
      { title: 'Sales - Dashboard (Performance)', priority: 'HIGH', dueDate: '2026-03-31' },
      { title: 'Sales - ToDo(LivNex,RentNex,Smartify)', priority: 'MEDIUM', dueDate: '2026-06-30' }
    ]
  },
  {
    name: 'SenX-Bot',
    description: 'Bot สำหรับช่วยทำงานเก็บข้อมูลใน LineGroup ที่มีการคุยกัน',
    color: '#722ed1',
    tasks: []
  },
  {
    name: 'Site Survey Checklist',
    description: 'Checklist สำหรับ Site Survey',
    color: '#13c2c2',
    tasks: []
  },
  {
    name: 'ระบบคำนวณภาษีที่ดิน',
    description: 'ระบบคำนวณภาษีที่ดินและสิ่งปลูกสร้าง',
    color: '#eb2f96',
    tasks: []
  },
  {
    name: 'ระบบตรวจนับทรัพย์สินโครงการ',
    description: 'Mobile app สำหรับตรวจนับทรัพย์สิน',
    color: '#faad14',
    tasks: []
  },
  {
    name: 'ระบบบริหารห้องเช่า SENA Fast',
    description: 'Improvement 2026',
    color: '#a0d911',
    tasks: [
      { title: 'ศึกษาความเป็นไปได้ เพื่อนำเอามาใช้ร่วมกันกับ RentNex', priority: 'MEDIUM', dueDate: '2026-06-30' }
    ]
  },
  {
    name: 'วิเคราะห์สินเชื่อด้วย DATA, Rules, AI',
    description: 'ระบบวิเคราะห์สินเชื่อ',
    color: '#2f54eb',
    tasks: []
  },
  {
    name: 'SENA IDEA Job Design Workflow',
    description: 'ระบบ Workflow สำหรับ SENA IDEA',
    color: '#f5222d',
    tasks: []
  },
  {
    name: 'ระบบบริหารค่าแรง',
    description: 'เพิ่มให้รองรับประกันสังคม',
    color: '#fa541c',
    tasks: []
  },
  {
    name: 'Contract verification with AI (LAW)',
    description: 'ตรวจสอบสัญญาด้วย AI',
    color: '#1890ff',
    tasks: []
  },
  {
    name: 'Pricing Management, Audit with AI',
    description: 'ระบบจัดการราคาและตรวจสอบด้วย AI',
    color: '#52c41a',
    tasks: []
  },
  {
    name: 'Sales-Bot',
    description: 'Bot สำหรับช่วยทำงานเก็บข้อมูลใน LineGroup ที่มีการคุยกับธนาคาร',
    color: '#722ed1',
    tasks: []
  }
];

async function main() {
  console.log('Seeding KARN projects...');

  // Get or create KARN user (use existing test user)
  let user = await prisma.user.findUnique({
    where: { email: 'test2@example.com' }
  });

  if (!user) {
    const hashedPassword = await hashPassword('password123');
    user = await prisma.user.create({
      data: {
        email: 'test2@example.com',
        password: hashedPassword,
        name: 'KARN',
        role: 'USER'
      }
    });
    console.log('Created user: KARN');
  }

  // Create projects and tasks
  for (const projectData of projects) {
    // Check if project exists
    const existingProject = await prisma.project.findFirst({
      where: { name: projectData.name, ownerId: user.id }
    });

    if (existingProject) {
      console.log(`Project "${projectData.name}" already exists, skipping...`);
      continue;
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: projectData.name,
        description: projectData.description,
        color: projectData.color,
        status: 'ACTIVE',
        ownerId: user.id
      }
    });
    console.log(`Created project: ${project.name}`);

    // Create tasks
    for (const taskData of projectData.tasks) {
      await prisma.task.create({
        data: {
          title: taskData.title,
          description: `Task for ${projectData.name}`,
          status: 'TODO',
          priority: taskData.priority as any,
          dueDate: new Date(taskData.dueDate),
          progress: 0,
          projectId: project.id,
          createdById: user.id,
          assigneeId: user.id
        }
      });
      console.log(`  - Created task: ${taskData.title}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
