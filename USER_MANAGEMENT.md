# User Management Guide - OBE System

This guide explains how different user roles (Admin, Teacher, Student) are created in the OBE System.

## User Creation Methods

### 1. Initial Setup (First Admin User)

**Method**: Database seed script

The first admin user must be created using the seed script before the system can be used.

```bash
cd obebackend
uv run python scripts/seed_data.py --admin-email admin@obesystem.com --admin-password SecurePassword123
```

This will:
- Create roles (Admin, Teacher, Student)
- Create permissions
- Assign permissions to roles
- Create the first admin user

**After running the seed script, you can:**
1. Login as admin at http://localhost:5173/login
2. Use the admin dashboard to create other users
3. Or use the API directly

### 2. Admin Creates Users (Recommended)

**Method**: Admin Dashboard or API

Once an admin is logged in, they can create users with any role:

**Via API:**
```bash
POST /api/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Teacher",
  "role_id": 2  # 1=Admin, 2=Teacher, 3=Student
}
```

**Via Frontend:**
- Login as admin
- Navigate to "Users" section
- Click "Create User"
- Fill in details and select role
- Submit

### 3. Self-Registration (Students Only)

**Method**: Public registration endpoint

Students can register themselves, but they will automatically be assigned the Student role:

**Via API:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePassword123",
  "first_name": "Jane",
  "last_name": "Student"
}
```

**Via Frontend:**
- Visit http://localhost:5173/register
- Fill in registration form
- Submit (automatically becomes Student)

**Note**: Registration always creates Student accounts. To create Teacher or Admin accounts, an existing Admin must create them.

### 4. Google OAuth Registration

**Method**: Google OAuth login

When a user logs in with Google OAuth for the first time:
- A new account is automatically created
- Default role: **Student**
- Admin can later change the role if needed

### 5. Email OTP Registration

**Method**: Email OTP login

When a user logs in with Email OTP for the first time:
- A new account is automatically created
- Default role: **Student**
- Admin can later change the role if needed

## Role IDs Reference

| Role | ID | Description |
|------|-----|-------------|
| Admin | 1 | Full system access |
| Teacher | 2 | Course and assessment management |
| Student | 3 | Personal data access only |

## Step-by-Step: Creating Users

### Step 1: Initial Setup (One-time)

```bash
# 1. Run database schema
psql -U postgres -d obe_db -f obebackend/schema.sql

# 2. Seed roles and create first admin
cd obebackend
uv run python scripts/seed_data.py \
  --admin-email admin@obesystem.com \
  --admin-password YourSecurePassword123
```

### Step 2: Create Additional Admins (Optional)

**Via API (as existing admin):**
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin2@obesystem.com",
    "password": "SecurePassword123",
    "first_name": "Second",
    "last_name": "Admin",
    "role_id": 1
  }'
```

### Step 3: Create Teachers

**Via API (as admin):**
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "SecurePassword123",
    "first_name": "John",
    "last_name": "Teacher",
    "role_id": 2
  }'
```

### Step 4: Students Register Themselves

Students can register via:
- Frontend registration page: http://localhost:5173/register
- API: `POST /api/auth/register`
- Google OAuth (first login)
- Email OTP (first login)

## Changing User Roles

**Only Admins can change user roles:**

**Via API:**
```bash
PUT /api/users/{user_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role_id": 2  # Change to Teacher
}
```

**Via Frontend:**
- Admin dashboard → Users → Edit user → Change role

## User Creation Workflow Summary

```
┌─────────────────────────────────────────────────────────┐
│ Initial Setup (One-time)                                │
│ └─> Run seed_data.py → Creates roles + first admin      │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Admin Login                                              │
│ └─> Use admin credentials from seed script              │
└─────────────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐      ┌──────────────────────┐
│ Create Users │      │ Students Register    │
│ via Admin    │      │ Themselves          │
│ Dashboard    │      │ (Auto: Student)     │
└──────────────┘      └──────────────────────┘
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ System Ready to Use   │
        └───────────────────────┘
```

## Quick Reference Commands

### Create First Admin
```bash
cd obebackend
uv run python scripts/seed_data.py \
  --admin-email admin@obesystem.com \
  --admin-password AdminPass123
```

### Create Teacher (via API)
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "TeacherPass123",
    "first_name": "John",
    "last_name": "Doe",
    "role_id": 2
  }'
```

### List All Users (Admin only)
```bash
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Change User Role (Admin only)
```bash
curl -X PUT http://localhost:8000/api/users/3 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role_id": 2}'
```

## Important Notes

1. **First Admin**: Must be created via seed script (no admin exists yet to create one)
2. **Self-Registration**: Always creates Student accounts
3. **Role Changes**: Only admins can change user roles
4. **OAuth/OTP Users**: Automatically get Student role on first login
5. **Password Requirements**: Minimum 8 characters

## Troubleshooting

### "No admin user exists"
- Run the seed script: `uv run python scripts/seed_data.py --admin-email ... --admin-password ...`

### "Invalid role ID"
- Ensure seed script has been run to create roles
- Check role IDs: Admin=1, Teacher=2, Student=3

### "Email already exists"
- User with that email already exists
- Use PUT endpoint to update existing user instead

