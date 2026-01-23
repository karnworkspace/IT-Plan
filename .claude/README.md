# Claude Code Configuration

## Overview
Directory นี้เก็บ context และ skills สำหรับ AI-assisted development ด้วย Claude Code

## Structure
```
.claude/
├── context/     # ข้อมูลพื้นฐานโปรเจค
├── skills/      # วิธีทำงานที่ใช้บ่อย
└── templates/   # Code templates
```

## Context Files
| File | Description |
|------|-------------|
| 01-architecture.md | สถาปัตยกรรมระบบ |
| 02-tech-stack.md | เทคโนโลยีที่ใช้ |
| 03-database-schema.md | โครงสร้าง database |
| 05-coding-standards.md | มาตรฐานการเขียนโค้ด |

## Skills
| Skill | Description |
|-------|-------------|
| api-creation.md | สร้าง API endpoints |
| database-operations.md | จัดการ database |
| deployment-process.md | Deploy application |

## Usage

### Basic
```
สร้าง API สำหรับ user management ตาม context และ skills
```

### With Specific Files
```
ใช้ skills/api-creation.md สร้าง endpoints:
- GET /api/users
- POST /api/users
```

## Maintenance
- Update context เมื่อ architecture เปลี่ยน
- เพิ่ม skills จาก lessons learned
- Review เป็นประจำ

## Guidelines
1. Load context ก่อนเริ่มงาน
2. ทำตาม coding standards
3. Test ก่อน commit
4. Update docs เมื่อมีการเปลี่ยนแปลง
