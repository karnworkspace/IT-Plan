# SENA Project Management - Technical Specification

## Component Inventory

### shadcn/ui Components (Built-in)
- Button - ปุ่มทั้งหมด
- Card - การ์ดแสดงข้อมูล
- Badge - สถานะต่างๆ
- Input - ช่องค้นหา
- Checkbox - ตัวกรองสถานะ
- Avatar - รูปโปรไฟล์
- Progress - แถบความคืบหน้า
- ScrollArea - Scroll ภายใน
- Separator - เส้นแบ่ง
- Tooltip - คำอธิบายเพิ่มเติม

### Custom Components
1. **Sidebar** - แถบนำทางด้านซ้าย
2. **StatCard** - การ์ดแสดงสถิติ
3. **ProjectCard** - การ์ดโปรเจค
4. **ActivityItem** - รายการกิจกรรม
5. **KanbanColumn** - คอลัมน์ Kanban
6. **KanbanCard** - การ์ดใน Kanban
7. **StatusBadge** - แสดงสถานะสี

## Animation Implementation Table

| Animation | Library | Implementation | Complexity |
|-----------|---------|----------------|------------|
| Page Load Fade | Framer Motion | AnimatePresence + motion.div | Low |
| Card Hover Lift | CSS/Tailwind | hover:translate-y-[-2px] hover:shadow-lg | Low |
| Progress Bar Fill | Framer Motion | motion.div width animation | Medium |
| Number Count Up | Custom Hook | useCountUp with requestAnimationFrame | Medium |
| Stagger Children | Framer Motion | staggerChildren in variants | Medium |
| Sidebar Active | CSS | transition-all duration-200 | Low |
| Button Press | CSS | active:scale-[0.98] | Low |
| Scroll Reveal | Framer Motion | whileInView prop | Low |

## Animation Library Choices

**Primary: Framer Motion**
- Page transitions
- Stagger animations
- Progress bar animations
- Scroll reveal

**Secondary: CSS/Tailwind**
- Hover effects
- Active states
- Simple transitions

## Project File Structure

```
app/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ActivityItem.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── KanbanCard.tsx
│   │   └── StatusBadge.tsx
│   ├── hooks/
│   │   └── useCountUp.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   └── Projects.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
└── package.json
```

## Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^11.x",
    "lucide-react": "^0.x",
    "@radix-ui/react-*": "latest"
  }
}
```

## Color Tokens (Tailwind Config)

```javascript
colors: {
  sena: {
    sidebar: '#0F172A',
    'sidebar-hover': '#1E293B',
    accent: '#3B82F6',
    'accent-hover': '#2563EB',
    'page-bg': '#F8FAFC',
    'card-bg': '#FFFFFF',
    border: '#E2E8F0',
  },
  status: {
    active: '#10B981',
    delay: '#EF4444',
    completed: '#3B82F6',
    hold: '#F59E0B',
    cancelled: '#6B7280',
  }
}
```

## Routing

ใช้ React Router สำหรับ navigation:
- `/` - Dashboard
- `/projects` - Projects Page

## Data Structure

```typescript
interface Project {
  id: string;
  name: string;
  projectId: string;
  status: 'active' | 'delay' | 'completed' | 'hold' | 'cancelled';
  progress: number;
  assignees: string[];
  tasksCompleted: number;
  tasksTotal: number;
}

interface Activity {
  id: string;
  action: string;
  projectName: string;
  timeAgo: string;
}

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}
```
