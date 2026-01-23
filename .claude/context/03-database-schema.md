# Database Schema

## Overview
[อธิบายโครงสร้าง database โดยรวม]

## Entity Relationship Diagram
```
[User] 1--* [Order]
[Order] 1--* [OrderItem]
[OrderItem] *--1 [Product]
```

## Tables

### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| name | VARCHAR(100) | NOT NULL | Display name |
| role | ENUM | NOT NULL | user/admin |
| created_at | TIMESTAMP | NOT NULL | Created date |
| updated_at | TIMESTAMP | NOT NULL | Last update |

### [table_name]
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ... | ... | ... | ... |

## Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

## Relations
- users 1:N orders (user_id FK)
- orders 1:N order_items (order_id FK)

## Notes
- ใช้ UUID เป็น primary key
- ทุก table มี created_at, updated_at
- Soft delete ใช้ deleted_at field
