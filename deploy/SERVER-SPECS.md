# Server Specifications — YTY Project

## OS
| Item | Detail |
|------|--------|
| OS | Ubuntu 24.04.3 LTS |
| Kernel | 6.8.0-90-generic |
| Arch | x86_64 |

## CPU
| Item | Detail |
|------|--------|
| Model | Intel Xeon E-2334 @ 3.40GHz |
| vCPU | 2 |
| Threads per Core | 2 |

## Memory (RAM)
| Item | Detail |
|------|--------|
| Usage | ~41% used |

## Disk
| Device | Size | Mount | Note |
|--------|------|-------|------|
| /dev/sda | 120 GB | — | Main disk |
| /dev/sda1 | 1 GB | EFI System | Boot partition |
| /dev/sda2 | 2 GB | /boot | Kernel/initramfs |
| /dev/sda3 | 116.9 GB | LVM | ubuntu--vg-ubuntu--lv |
| LVM (/) | 58.5 GB usable | `/` | Root filesystem |

## Network
- Provider: (TBD)
- Public IP: (TBD)
- Firewall: (TBD)

---

## Existing Docker Containers (Ports in Use)

| # | Name | Type | Port | Status |
|---|------|------|------|--------|
| 1 | shiftwork-frontend | Frontend (Nginx) | 5080 | OK |
| 2 | shiftwork-backend | Backend (Node) | 5000 | OK |
| 3 | moltbot-gateway | Bot Gateway (Node) | 18789 | OK |
| 4 | sena_api | Backend API | 4000 | OK |
| 5 | sena_phpmyadmin | phpMyAdmin | 8080 | OK |
| 6 | sena_mysql | MySQL 8.0 | 3306 | OK |
| 7 | sena-timesheet-dashboard | Streamlit Dashboard | 8501 | unhealthy |
| 8 | jaidee-frontend-prod | Frontend (Nginx) | 3100 | OK |
| 9 | jaidee-backend-prod | Backend (Node) | 3101 | OK |

**Ports reserved:** 3100, 3101, 3306, 4000, 5000, 5080, 8080, 8501, 18789

---

## TaskFlow — Port Assignment

| Service | Port | Container Name |
|---------|------|----------------|
| Frontend (Nginx) | **4200** | taskflow-frontend-prod |
| Backend (Node) | **4201** | taskflow-backend-prod |
| PostgreSQL 16 | **5432** | taskflow-db-prod |

---

## Planned Stack (Docker-based)
- **PostgreSQL 16** — Database (port 5432)
- **Node.js 20** — Backend / Express + Prisma (port 4201)
- **Nginx** — Serve frontend static files (port 4200)
- **Host Nginx** — Reverse proxy (port 80/443) → route to all apps
- **Docker + Docker Compose** — Container orchestration

---

*Last updated: 2026-02-15*
