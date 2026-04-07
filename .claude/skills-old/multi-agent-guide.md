---
name: Multi-Agent Guide
description: คู่มือการใช้งาน multi-agent system สำหรับ YTY Project — วิธีเรียกใช้ flow การทำงาน ตัวอย่างการใช้
---

# Multi-Agent System — คู่มือการใช้งาน

## ภาพรวม

ระบบ multi-agent 5 ตัว ทำงานร่วมกันโดยมี **Tech-Lead** เป็น coordinator:

```
User → Tech-Lead → PM / BA / Dev / SA → Tech-Lead → User
```

| Agent | Skill File | หน้าที่หลัก |
|-------|-----------|------------|
| Tech-Lead | `tech-lead.md` | Coordinator — วิเคราะห์ + delegate + สรุปผล |
| PM | `pm.md` | วางแผน, timeline, risk, priority |
| BA | `ba.md` | วิเคราะห์ requirement, เขียน spec |
| Dev | `dev.md` | เขียนโค้ด, implement, test |
| SA | `sa.md` | setup, config, deploy, tuning |

---

## วิธีเรียกใช้

### 1. ผ่าน Tech-Lead (แนะนำ)
บอก Tech-Lead โดยตรง — จะวิเคราะห์และ delegate เอง:
```
"สร้าง feature notification system"
→ Tech-Lead จะ: BA วิเคราะห์ requirement → Dev implement → SA config
```

### 2. เรียก Agent ตรง
ระบุชื่อ agent ที่ต้องการ:
```
"ให้ PM ประเมิน timeline สำหรับ phase 14"
"ให้ BA เขียน spec สำหรับ report module"
"ให้ Dev fix bug ตรง login page"
"ให้ SA optimize database query"
```

---

## Flow ตัวอย่าง

### Feature ใหม่ (ใหญ่)
```
1. Tech-Lead รับงาน → เสนอแผนให้ user approve
2. BA วิเคราะห์ requirement → เขียน spec + acceptance criteria
3. PM ประเมิน timeline + priority + risk
4. Dev implement ตาม spec (Frontend + Backend)
5. SA config deployment (ถ้าต้อง)
6. Tech-Lead รวบรวมผล → รายงาน user
```

### Bug Fix (เล็ก)
```
1. Tech-Lead รับงาน → auto-delegate ให้ Dev
2. Dev debug + fix + verify
3. Tech-Lead รายงานผล
```

### Infrastructure Change
```
1. Tech-Lead รับงาน → delegate ให้ SA
2. SA วิเคราะห์ + เสนอ config change
3. Tech-Lead แจ้ง user (ถ้า impact สูง)
4. SA ดำเนินการ + verify
```

### วางแผนโครงการ
```
1. Tech-Lead รับงาน → delegate ให้ PM + BA
2. BA รวบรวม requirement
3. PM วางแผน timeline + resource
4. Tech-Lead รวบรวม → เสนอ user
```

---

## Spawn Pattern

### Single Agent
```
Agent(subagent_type="general-purpose", prompt="""
คุณเป็น [Role] ของทีม YTY Project
อ่าน .claude/skills/[role].md สำหรับ spec
อ่าน CLAUDE.md + Doc/PROJECT-PROGRESS.md สำหรับ context

งาน: [task description]
Output: [expected format]
""")
```

### Parallel Agents (งานอิสระ)
Spawn หลาย agent พร้อมกันเมื่องานไม่ขึ้นต่อกัน:
```
// พร้อมกัน:
Agent(PM) → ประเมิน timeline
Agent(BA) → วิเคราะห์ requirement
Agent(SA) → ตรวจ infrastructure readiness
```

### Sequential Agents (งานต่อเนื่อง)
```
BA → เขียน spec ก่อน
↓ (รอผล)
Dev → implement ตาม spec
↓ (รอผล)
SA → deploy
```

---

## Tips

1. **งานเล็ก** — Tech-Lead ทำเองได้ ไม่ต้อง spawn agent
2. **งานกลาง** — spawn 1-2 agent ที่เกี่ยวข้อง
3. **งานใหญ่** — เสนอแผนก่อน → spawn หลาย agent ตามลำดับ
4. **ไม่แน่ใจ** — ถาม user ก่อน delegate
