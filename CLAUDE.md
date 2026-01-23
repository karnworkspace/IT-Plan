# CLAUDE.md - YTY Project

---

## ⚠️ CRITICAL: ขั้นตอนบังคับก่อนเริ่มงาน

### 📖 ลำดับการอ่านไฟล์ (ต้องทำทุกครั้ง!)

```
ขั้นตอนที่ 1: อ่านเอกสาร (ตามลำดับ)
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣  Doc/PROJECT-PROGRESS.md    ← อ่านก่อนเสมอ!              │
│     • สถานะโปรเจคปัจจุบัน                                    │
│     • สิ่งที่ทำเสร็จแล้ว / ยังไม่เสร็จ                         │
│     • Bug fixes ล่าสุด                                      │
│     • แนวทางการทำต่อ (Recommended Next Actions)             │
│                                                             │
│ 2️⃣  Doc/QUICK-REFERENCE.md     ← Quick reference            │
│     • Commands ที่ใช้บ่อย                                    │
│     • โครงสร้างไฟล์                                         │
│     • Tech Stack                                            │
│                                                             │
│ 3️⃣  Doc/Quick-Start-Guide.md   ← ถ้าต้อง setup/run          │
│     • วิธีติดตั้ง                                            │
│     • วิธี run development servers                          │
│     • วิธีทดสอบ APIs                                        │
└─────────────────────────────────────────────────────────────┘

ขั้นตอนที่ 2: ตรวจสอบ Code (ถ้าจำเป็น)
┌─────────────────────────────────────────────────────────────┐
│ • backend/src/     ← Backend code                           │
│ • frontend/src/    ← Frontend code                          │
│ • backend/prisma/schema.prisma  ← Database schema           │
└─────────────────────────────────────────────────────────────┘
```

**⛔ ห้ามเริ่มงานก่อนอ่าน PROJECT-PROGRESS.md**

---

## 📝 การบันทึกความคืบหน้า (เมื่อผู้ใช้สั่ง)

เมื่อผู้ใช้สั่ง "บันทึกความคืบหน้า" หรือ "update progress" ต้องอัปเดตไฟล์เหล่านี้:

```
ลำดับการอัปเดต:
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣  Doc/PROJECT-PROGRESS.md    ← อัปเดตเสมอ! (หลัก)         │
│     • เพิ่ม/แก้ไขสถานะ tasks                                 │
│     • เพิ่ม bug fixes ที่ทำ                                  │
│     • อัปเดต completion percentage                          │
│     • อัปเดต Last Updated timestamp                         │
│                                                             │
│ 2️⃣  Doc/QUICK-REFERENCE.md     ← อัปเดตถ้าเกี่ยวข้อง        │
│     • สถานะ features                                        │
│     • commands ใหม่                                         │
│                                                             │
│ 3️⃣  Doc/Quick-Start-Guide.md   ← อัปเดตถ้าเกี่ยวข้อง        │
│     • วิธี setup ที่เปลี่ยน                                   │
│     • dependencies ใหม่                                      │
│                                                             │
│ 4️⃣  CLAUDE.md (ไฟล์นี้)         ← อัปเดตถ้าจำเป็น           │
│     • สถานะโปรเจคใน table                                   │
│     • workflow ที่เปลี่ยน                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## รูปแบบการสนทนา

### ภาษาหลัก: ไทย
- ใช้ภาษาไทยที่กระชับ ตรงประเด็น
- หลีกเลี่ยงคำฟุ่มเฟือย
- ศัพท์เทคนิคใช้ภาษาอังกฤษได้ตามความเหมาะสม
- ตอบสั้น ๆ ก่อน ขยายรายละเอียดเมื่อจำเป็น

### รูปแบบการตอบ
```
[สรุปสิ่งที่ทำ 1-2 ประโยค]
[รายละเอียดเพิ่มเติมถ้าจำเป็น]
[ขั้นตอนถัดไป (ถ้ามี)]
```

---

## สถานะโปรเจคปัจจุบัน (Last Updated: 2026-01-22)

| Component | Status | Progress |
|-----------|--------|----------|
| Frontend | ✅ Complete | 100% |
| Backend | ✅ Complete | 100% |
| API Testing | ✅ Passed | 100% |
| Integration | ⏳ Pending | 0% |
| **Overall** | **In Progress** | **70%** |

**ดูรายละเอียดเพิ่มเติม:** `Doc/PROJECT-PROGRESS.md`

---

## โครงสร้างโปรเจค

```
YTY Project/
├── Doc/                      # 📄 เอกสารทั้งหมด
│   ├── PROJECT-PROGRESS.md   ⭐ สถานะโปรเจค (อ่านก่อน!)
│   ├── QUICK-REFERENCE.md    📋 Quick reference
│   ├── Quick-Start-Guide.md  🚀 Setup guide
│   └── ...
├── frontend/                 # ⚛️ React App (เสร็จแล้ว)
├── backend/                  # 🚀 Express API (เสร็จแล้ว)
├── Design/                   # 🎨 UI Mockups
└── .claude/                  # 🤖 Claude context files
    ├── context/
    ├── skills/
    └── templates/
```

---

## Quick Start

### รัน Backend
```bash
cd backend
npm install
npm run dev
# http://localhost:3000
```

### รัน Frontend
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### ทดสอบ API
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Workflow การพัฒนา

### 1. ก่อนเริ่มงาน
- **อ่าน `Doc/PROJECT-PROGRESS.md` ก่อนเสมอ!**
- ระบุ context files ที่เกี่ยวข้อง
- ระบุ skills ที่ต้องใช้
- เตรียม requirements ให้ชัดเจน

### 2. ระหว่างพัฒนา
- แบ่งงานเป็นขั้นตอนย่อย
- ทดสอบทุกขั้นตอน
- Review โค้ดก่อน commit

### 3. หลังเสร็จงาน
- Test ครบถ้วน
- **Update `Doc/PROJECT-PROGRESS.md`**
- Commit และ push

---

## Coding Standards

### Naming Conventions
| ประเภท | รูปแบบ | ตัวอย่าง |
|--------|--------|----------|
| Files/Components | PascalCase | `UserProfile.tsx` |
| Functions/Variables | camelCase | `getUserById` |
| Constants | UPPER_SNAKE | `MAX_FILE_SIZE` |
| APIs | kebab-case | `user-profile.ts` |

### TypeScript
- ใช้ strict mode
- กำหนด types ชัดเจน
- หลีกเลี่ยง `any`
- Unused params ใช้ `_` prefix (เช่น `_req`, `_next`)

### API Response Format
```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: 'message', details?: [...] }
```

---

## Git Conventions

### Commit Messages
```
<type>(<scope>): <subject>

Types:
- feat: feature ใหม่
- fix: แก้ bug
- docs: แก้ docs
- refactor: ปรับโครงสร้าง
- test: เพิ่ม tests
- chore: งานทั่วไป
```

### ตัวอย่าง
```
feat(auth): เพิ่มระบบ login
fix(api): แก้ปัญหา timeout
docs(readme): อัปเดตวิธีติดตั้ง
```

---

## Quick Commands

### Development
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev
```

### Database
```bash
cd backend
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate client
npx prisma studio         # Open DB GUI
```

### Git
```bash
git status
git add .
git commit -m "feat(scope): message"
git push
```

---

## Best Practices

### Do's
- ✅ อ่าน PROJECT-PROGRESS.md ก่อนเริ่มงาน
- ✅ Validate input ทุกครั้ง
- ✅ ใช้ environment variables
- ✅ Handle errors ครบ
- ✅ Update docs หลังทำงานเสร็จ

### Don'ts
- ❌ เริ่มงานโดยไม่อ่าน progress
- ❌ Hardcode credentials
- ❌ Skip testing
- ❌ Commit sensitive data

---

## Security

### ห้ามใส่ใน repository
- API keys, tokens
- Passwords
- Connection strings ที่มี credentials
- Private keys

### Environment Variables
```bash
# .env.example (commit ได้)
DATABASE_URL=file:./dev.db
JWT_ACCESS_SECRET=your-secret-here

# .env (ห้าม commit)
DATABASE_URL=file:./dev.db
JWT_ACCESS_SECRET=actual-secret-key
```

---

## การขอความช่วยเหลือ

เมื่อต้องการให้ Claude ช่วย:

### งานที่ชัดเจน
```
สร้าง API endpoint สำหรับ user management
- GET /users - list
- POST /users - create
- PUT /users/:id - update
```

### งานที่ต้อง explore
```
ช่วยวิเคราะห์โครงสร้าง codebase นี้
แนะนำวิธีปรับปรุง performance
```

### งานแก้ bug
```
พบปัญหา: [อธิบายปัญหา]
Error: [error message]
ไฟล์ที่เกี่ยวข้อง: [ชื่อไฟล์]
```

---

## Checklists

### ✅ ก่อนเริ่มงาน (บังคับ!)
- [ ] 1️⃣ อ่าน `Doc/PROJECT-PROGRESS.md`
- [ ] 2️⃣ อ่าน `Doc/QUICK-REFERENCE.md`
- [ ] 3️⃣ อ่าน `Doc/Quick-Start-Guide.md` (ถ้าต้อง setup)
- [ ] เข้าใจสถานะปัจจุบัน
- [ ] รู้ว่าต้องทำอะไรต่อ

### ✅ ก่อน Commit
- [ ] โค้ดทำงานถูกต้อง
- [ ] Tests ผ่าน
- [ ] ไม่มี console.log ที่ไม่จำเป็น
- [ ] ไม่มี sensitive data

### ✅ เมื่อบันทึกความคืบหน้า (ตามลำดับ)
- [ ] 1️⃣ อัปเดต `Doc/PROJECT-PROGRESS.md` (บังคับ)
- [ ] 2️⃣ อัปเดต `Doc/QUICK-REFERENCE.md` (ถ้าเกี่ยวข้อง)
- [ ] 3️⃣ อัปเดต `Doc/Quick-Start-Guide.md` (ถ้าเกี่ยวข้อง)
- [ ] 4️⃣ อัปเดต `CLAUDE.md` (ถ้าจำเป็น)

---

**Note:** ไฟล์นี้เป็น living document - อัปเดตเมื่อมีการเปลี่ยนแปลง
**Last Updated:** 2026-01-22
