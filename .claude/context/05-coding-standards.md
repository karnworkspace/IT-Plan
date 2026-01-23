# Coding Standards

## File Organization
```
src/
├── app/              # Pages/Routes
├── components/
│   ├── ui/           # Reusable UI
│   └── features/     # Feature-specific
├── lib/              # Utilities
├── types/            # TypeScript types
└── services/         # Business logic
```

## Naming Conventions

### Files
- Components: `UserProfile.tsx` (PascalCase)
- Utilities: `formatDate.ts` (camelCase)
- Types: `User.types.ts` (PascalCase)
- APIs: `user-profile.ts` (kebab-case)

### Code
```typescript
// Variables: camelCase
const userName = "John";
const isActive = true;

// Functions: camelCase
function getUserById(id: string) { }

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Types/Interfaces: PascalCase
interface User { }
type UserResponse = { };
```

## TypeScript Rules
- Always use TypeScript (no .js)
- Enable strict mode
- Avoid `any` type
- Use interface for objects
- Use type for unions/intersections

## Component Pattern
```typescript
interface Props {
  title: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onClick, variant = 'primary' }: Props) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {title}
    </button>
  );
}
```

## API Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // Business logic

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
```

## Error Handling
- ใช้ try-catch สำหรับ async
- Return structured responses
- Log errors ด้วย context
- ไม่ expose sensitive info

## Comments
```typescript
// Good: อธิบาย "ทำไม"
// Calculate discount - premium users get 15%
const discount = isPremium ? 0.15 : 0.05;

// Bad: อธิบายสิ่งที่เห็นอยู่แล้ว
// Add price and tax
const total = price + tax;
```

## Git Commits
```
feat(scope): add feature
fix(scope): fix bug
docs(scope): update docs
refactor(scope): improve code
test(scope): add tests
chore(scope): maintenance
```
