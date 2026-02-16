# TaskFlow — User Accounts (Production)

> Created: 2026-02-16
> Import method: pg_dump from local → production

## Existing Users (Imported from Local DB)

| # | Name | Email | Password | Role |
|---|------|-------|----------|------|
| 1 | Adinuna (ADMIN) | adinuna@sena.co.th | 123456 | ADMIN |
| 2 | Tharab (ADMIN) | tharab@sena.co.th | 123456 | ADMIN |
| 3 | Ohm (MEMBER) | ohm@sena.co.th | 123456 | MEMBER |
| 4 | Karn (MEMBER) | karn@sena.co.th | 123456 | MEMBER |

## Users to Register

| # | Name | Email | Password | Role |
|---|------|-------|----------|------|
| 1 | เอกพล (Head Team) | Ekapons@sena.co.th | ekapons123 | Owner |
| 2 | พสิษฐ์ (A.Head Team) | pasitl@sena.co.th | pasitl123 | Owner |
| 3 | รัชย์ศีร์ (Member) | ratsib@sena.co.th | ratsib123 | Member |
| 4 | พลวิทย์ (Head Team) | Ponwits@sena.co.th | ponwits123 | Owner |
| 5 | สิทธิชัย (Member) | Sittichaid@sena.co.th | sittichaid123 | Member |
| 6 | มานิตย์ (Member) | manits@sena.co.th | manits123 | Owner |
| 7 | ชเนษฎ์ (Member) | chanetw@sena.co.th | chanetw123 | Member |
| 8 | ณัฐวุฒิ (Member) | nattawutt@sena.co.th | nattawutt123 | Member |
| 9 | ธนศักดิ์ (Member) | thanasaks@sena.co.th | thanasaks123 | Member |
| 10 | วิเชฐ (Head Team) | Vichate_it@sena.co.th | vichatec123 | Owner |
| 11 | ชยพล (Member) | chayapols@sena.co.th | chayapols123 | Member |
| 12 | ชานนท์ (Member) | chanonk@sena.co.th | chanonk123 | Member |
| 13 | สุขสันต์ (Member) | Sooksunb@sena.co.th | sooksunb123 | Member |
| 14 | ศิริพร (Member) | siripornt@sena.co.th | siripornt123 | Member |
| 15 | ศุภณัฐ (Member) | Supanats@sena.co.th | supanats123 | Member |
| 16 | ปรเมศวร์ (Member) | porametk@sena.co.th | porametk123 | Member |
| 17 | รุจิรา (Member) | Rujiran@sena.co.th | rujiran123 | Member |
| 18 | วัชรินทร์ (Member) | watcharink@sena.co.th | watcharink123 | Member |
| 19 | จรัส (Member) | jaratw@sena.co.th | jaratw123 | Member |
| 20 | สรัญญา (Member) | saranyat@sena.co.th | saranyat123 | Member |
| 21 | วรรณิก (Member) | wanniks@sena.co.th | wanniks123 | Member |
| 22 | ทนงศักดิ์ (Member) | thanongsakn@sena.co.th | tanongsak123 | Member |
| 23 | ธนิสร (Member) | tanisony@sena.co.th | tanisony123 | Member |

## Notes

- Role "Owner" ในตาราง = ADMIN ใน system (ถ้าต้องการ)
- Role "Member" = MEMBER ใน system
- Password ทั้งหมดเป็น default — แนะนำให้ user เปลี่ยนหลัง login ครั้งแรก
- Head Team / A.Head Team = ผู้ดูแลทีม ควรตั้งเป็น ADMIN

---

*Created: 2026-02-16*
