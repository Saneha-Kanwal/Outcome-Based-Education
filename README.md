# OBE System - Outcome-Based Education Management System

<div align="center">

![OBE System](https://img.shields.io/badge/OBE-System-blue)
![Python](https://img.shields.io/badge/Python-3.10+-green)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-teal)
![License](https://img.shields.io/badge/license-MIT-green)
 
**A comprehensive full-stack web application for managing Outcome-Based Education (OBE) in educational institutions.**

[Features](#-key-features) • [Technologies](#-technologies--frameworks) • [Architecture](#-system-architecture) • [Setup](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 🚀 Quick Running Commands

<div align="center">

### Backend (FastAPI)
```bash
cd OBEfinal/obebackend
uv run uvicorn obebackend.main:app --reload --host 0.0.0.0 --port 8000
```
**→ http://localhost:8000** | **Docs:** http://localhost:8000/docs

### Frontend (React + Vite)
```bash
cd OBEfinal/obefrontend
npm run dev
```
**→ http://localhost:5173**

</div>

> **Note:** Backend must be running before starting frontend. See [Quick Start Section](#-quick-start---running-commands) for detailed instructions.

---
## 📋 Pictures
**Admin Dashboard**
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/ac2be148-a02f-4880-a534-9f453be2efe3" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/e2b75d2a-817b-48c8-a5e4-f06954e82b99" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/b7e97e97-e3d0-4d65-ba6b-18abd92be875" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/8caaaa67-4dcb-450d-87ab-ac465592aac2" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/b3756eb5-e219-48df-9816-bca118ef7947" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/42670888-18ae-44a1-b726-a90f084bc231" />

**Teacher Dashboard**
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/b4993a2b-86cc-4478-b00b-5ae584d4ef04" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/3e133161-f7b3-4d8b-bdb0-9f714fcd8499" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/66c59396-83f1-40c5-ad9e-b6ee2e5fcc14" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/db42e0dd-2741-48c3-b94f-7bec51642060" />

**Student Dashboard**
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/1015fb96-0d8e-4153-9a2d-63b796cc6a72" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/1b6bc4f1-032b-473a-bd7b-f11ee65cc680" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/4dd588e5-8f40-4a61-82c9-a41e5418f173" />







---
## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technologies & Frameworks](#-technologies--frameworks)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Authentication Methods](#-authentication-methods)
- [User Roles & Permissions](#-user-roles--permissions)
- [System Flowcharts](#-system-flowcharts)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

The **Outcome-Based Education (OBE) Management System** is a comprehensive full-stack application designed to manage and track educational outcomes, assessments, and student progress in an outcome-based education framework. The system enables educational institutions to:

- Define Program Learning Outcomes (PLOs) and Course Learning Outcomes (CLOs)
- Map relationships between courses, CLOs, and PLOs
- Create and manage assessments linked to specific outcomes
- Track student progress and achievement against outcomes
- Generate comprehensive reports and analytics
- Support multiple authentication methods for secure access

### System Purpose

The OBE System provides a centralized platform for:
- **Admins**: Full system management including user administration, course configuration, outcome definitions, and system-wide analytics
- **Teachers**: Course management, assessment creation, result entry, and course-level reporting
- **Students**: Access to enrolled courses, assessment results, grades, feedback, and progress tracking

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Multiple Authentication Methods**:
  - JWT-based email/password authentication
  - Google OAuth2 integration
  - Email-based OTP (One-Time Password) authentication
- **Role-Based Access Control (RBAC)**: Three distinct roles with granular permissions
- **Secure Password Hashing**: bcrypt with 12 salt rounds
- **Token Management**: Access tokens (15 min) and refresh tokens (7 days)
- **CORS Protection**: Configurable Cross-Origin Resource Sharing

### 👥 User Management
- User registration and profile management
- Role assignment (Admin, Teacher, Student)
- User activation/deactivation
- Bulk user import capabilities
- Profile updates and self-service management

### 📚 Course Management
- Create, update, and manage courses
- Multiple teachers per course support
- Student enrollment tracking
- Soft-delete functionality for historical data preservation
- Course code and metadata management

### 🎯 Outcome Management
- **Program Learning Outcomes (PLOs)**: Define program-level outcomes
- **Course Learning Outcomes (CLOs)**: Define course-specific outcomes
- **CO-PO Mapping**: Create mappings between CLOs and PLOs with strength indicators
- Outcome achievement tracking and visualization

### 📝 Assessment & Results
- Create assessments (Quiz, Assignment, Exam, Project)
- Link assessments to specific CLOs
- Weight-based assessment configuration
- Bulk result entry capabilities
- Automatic grade calculation
- Teacher feedback on student results

### 📊 Analytics & Reporting
- Program-level outcome achievement reports
- Course-level performance analytics
- Student progress tracking
- Visual charts and graphs
- Export reports in multiple formats (PDF, Excel)
- Date-range filtering and advanced filtering options

### 💻 User Interface
- **Responsive Design**: Mobile-first approach supporting mobile, tablet, and desktop
- **Modern UI/UX**: Clean, intuitive interface built with React
- **Real-time Updates**: Live data synchronization
- **Role-specific Dashboards**: Customized views for each user role

---

## 🛠 Technologies & Frameworks

### Backend Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Python | 3.10+ | Backend programming language |
| **Web Framework** | FastAPI | 0.104.1 | High-performance async web framework |
| **ASGI Server** | Uvicorn | 0.24.0 | Production-ready ASGI server |
| **Database** | PostgreSQL | 12+ | Relational database management system |
| **Database Driver** | psycopg2-binary | 2.9.9 | PostgreSQL adapter for Python |
| **Authentication** | python-jose | 3.3.0 | JWT token handling |
| **Password Hashing** | bcrypt | 4.1.2 | Secure password hashing |
| **Password Utils** | passlib | 1.7.4 | Password hashing library |
| **OAuth** | google-auth | 2.25.2 | Google OAuth2 authentication |
| **OAuth Utils** | google-auth-oauthlib | 1.2.0 | Google OAuth utilities |
| **OAuth HTTP** | google-auth-httplib2 | 0.2.0 | HTTP client for OAuth |
| **Validation** | Pydantic | 2.5.2 | Data validation and settings management |
| **Settings** | pydantic-settings | 2.1.0 | Settings management |
| **Email Validation** | email-validator | 2.1.0 | Email format validation |
| **Environment** | python-dotenv | 1.0.0 | Environment variable management |
| **Multipart** | python-multipart | 0.0.6 | Form data handling |
| **CORS** | python-cors | 1.0.0 | Cross-Origin Resource Sharing |
| **Package Manager** | uv | Latest | Fast Python package manager |

### Frontend Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | JavaScript (ES6+) | Latest | Frontend programming language |
| **Framework** | React | 19.1.1 | UI library for building user interfaces |
| **Build Tool** | Vite | 7.1.14 (rolldown) | Next-generation frontend build tool |
| **Routing** | React Router DOM | 6.21.0 | Declarative routing for React |
| **HTTP Client** | Axios | 1.6.2 | Promise-based HTTP client |
| **State Management** | Context API | Built-in | React's built-in state management |
| **Styling** | CSS3 | Latest | Cascading Style Sheets |
| **Code Quality** | ESLint | 9.36.0 | JavaScript linting tool |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **ESLint** | JavaScript/React code linting |
| **Black** | Python code formatting |
| **Ruff** | Python linting and code quality |
| **pytest** | Python testing framework |
| **Jest** | JavaScript testing framework |
| **React Testing Library** | React component testing |

### Database & Infrastructure

| Component | Technology | Details |
|-----------|-----------|---------|
| **Database** | PostgreSQL 12+ | Raw SQL queries (no ORM) |
| **Connection Pooling** | psycopg2 | Built-in connection pooling |
| **Query Management** | Raw SQL | Organized in query modules |

---

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Frontend (SPA)                          │  │
│  │  - React 19.1.1                                            │  │
│  │  - React Router for navigation                             │  │
│  │  - Context API for state management                        │  │
│  │  - Axios for API communication                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              FastAPI Backend                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │   Routes     │  │ Controllers  │  │  Middleware  │   │  │
│  │  │  - Auth      │  │  - Business  │  │  - Auth      │   │  │
│  │  │  - Users     │  │    Logic     │  │  - RBAC      │   │  │
│  │  │  - Courses   │  │  - Validation│  │  - Error     │   │  │
│  │  │  - Outcomes  │  │  - Processing│  │  - CORS      │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │   Schemas    │  │    Utils     │  │  Database    │   │  │
│  │  │  - Pydantic  │  │  - Security  │  │  - Connection│   │  │
│  │  │  - Validation│  │  - OAuth     │  │  - Queries   │   │  │
│  │  │  - Models    │  │  - OTP       │  │  - Pooling   │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                           │  │
│  │  - Raw SQL (no ORM)                                       │  │
│  │  - Connection pooling                                     │  │
│  │  - Indexed tables for performance                         │  │
│  │  - Transaction support                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │   Services   │         │
│  │              │  │              │  │              │         │
│  │  - Admin     │  │  - Common    │  │  - API Client│         │
│  │  - Teacher   │  │  - Auth      │  │  - Auth      │         │
│  │  - Student   │  │  - Dashboard │  │  - Users     │         │
│  │  - Auth      │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Contexts   │  │    Hooks     │  │    Utils     │         │
│  │              │  │              │  │              │         │
│  │  - Auth      │  │  - useAuth   │  │  - Validators│         │
│  │  - User      │  │  - useRole   │  │  - Formatters│         │
│  │              │  │  - Protected │  │  - Helpers   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │
┌──────────────────────────────────────────────────────────────────┐
│                          BACKEND                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Routes    │  │ Controllers  │  │  Middleware  │         │
│  │              │  │              │  │              │         │
│  │  - auth.py   │  │  - auth_     │  │  - auth_     │         │
│  │  - users.py  │  │    controller│  │    middleware│         │
│  │  - courses.py│  │  - user_     │  │  - rbac_     │         │
│  │  - outcomes  │  │    controller│  │    middleware│         │
│  │  - mappings  │  │  - course_   │  │  - error_    │         │
│  │  - assessments│ │    controller│  │    handler   │         │
│  │  - results   │  │  - ...       │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Schemas    │  │    Utils     │  │   Database   │         │
│  │              │  │              │  │              │         │
│  │  - Pydantic  │  │  - security  │  │  - connection│         │
│  │    Models    │  │  - oauth     │  │  - queries/  │         │
│  │  - Validation│  │  - otp       │  │    *_queries │         │
│  │              │  │  - email     │  │    .py       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
OBEfinal/
├── obebackend/                          # Backend API Server
│   ├── src/
│   │   └── obebackend/                  # Main backend package
│   │       ├── __init__.py
│   │       ├── main.py                  # FastAPI app entry point
│   │       ├── config.py                # Configuration & environment
│   │       ├── controllers/             # Business logic layer
│   │       │   ├── auth_controller.py
│   │       │   ├── user_controller.py
│   │       │   ├── course_controller.py
│   │       │   ├── outcome_controller.py
│   │       │   ├── assessment_controller.py
│   │       │   ├── result_controller.py
│   │       │   ├── analytics_controller.py
│   │       │   └── mapping_controller.py
│   │       ├── routes/                  # API endpoint definitions
│   │       │   ├── auth.py
│   │       │   ├── users.py
│   │       │   ├── courses.py
│   │       │   ├── outcomes.py
│   │       │   ├── mappings.py
│   │       │   ├── assessments.py
│   │       │   ├── results.py
│   │       │   ├── analytics.py
│   │       │   └── teacher_courses.py
│   │       ├── schemas/                 # Pydantic models for validation
│   │       │   ├── auth_schemas.py
│   │       │   ├── user_schemas.py
│   │       │   ├── course_schemas.py
│   │       │   ├── outcome_schemas.py
│   │       │   ├── assessment_schemas.py
│   │       │   ├── result_schemas.py
│   │       │   ├── analytics_schemas.py
│   │       │   └── common_schemas.py
│   │       ├── database/                # Database layer
│   │       │   ├── connection.py        # PostgreSQL connection pool
│   │       │   └── queries/             # Raw SQL queries organized by module
│   │       │       ├── auth_queries.py
│   │       │       ├── user_queries.py
│   │       │       ├── course_queries.py
│   │       │       ├── outcome_queries.py
│   │       │       ├── assessment_queries.py
│   │       │       ├── result_queries.py
│   │       │       └── analytics_queries.py
│   │       ├── middleware/              # Request/response middleware
│   │       │   ├── auth_middleware.py   # JWT validation
│   │       │   ├── rbac_middleware.py   # Role-based access control
│   │       │   └── error_handler.py     # Global error handling
│   │       ├── utils/                   # Utility functions
│   │       │   ├── security.py          # Password hashing, JWT utils
│   │       │   ├── oauth.py             # Google OAuth handling
│   │       │   ├── otp.py               # OTP generation & validation
│   │       │   ├── email.py             # Email utilities
│   │       │   └── validators.py        # Input validation helpers
│   │       └── tests/                   # Test files
│   ├── schema.sql                       # PostgreSQL database schema
│   ├── requirements.txt                 # Python dependencies
│   ├── pyproject.toml                   # Project configuration (uv)
│   ├── README.md                        # Backend-specific README
│   └── scripts/                         # Utility scripts
│       ├── seed_data.py
│       ├── seed_outcomes.py
│       └── reset_admin_password.py
│
├── obefrontend/                         # Frontend React Application
│   ├── src/
│   │   ├── main.jsx                     # React app entry point
│   │   ├── App.jsx                      # Main app component
│   │   ├── App.css                      # App styles
│   │   ├── index.css                    # Global styles
│   │   ├── components/                  # Reusable React components
│   │   │   ├── common/                  # Common UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── auth/                    # Authentication components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── OTPForm.jsx
│   │   │   │   └── GoogleOAuthButton.jsx
│   │   │   └── dashboard/               # Dashboard components
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── TeacherDashboard.jsx
│   │   │       └── StudentDashboard.jsx
│   │   ├── pages/                       # Page components (routes)
│   │   │   ├── auth/                    # Authentication pages
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── GoogleOAuthCallback.jsx
│   │   │   ├── admin/                   # Admin pages
│   │   │   │   ├── Users.jsx
│   │   │   │   ├── Courses.jsx
│   │   │   │   ├── Outcomes.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   └── EditUser.jsx
│   │   │   ├── teacher/                 # Teacher pages
│   │   │   │   ├── Courses.jsx
│   │   │   │   ├── Assessments.jsx
│   │   │   │   ├── Students.jsx
│   │   │   │   └── Results.jsx
│   │   │   └── student/                 # Student pages
│   │   │       ├── Profile.jsx
│   │   │       ├── Courses.jsx
│   │   │       ├── Results.jsx
│   │   │       ├── Progress.jsx
│   │   │       └── CourseDetail.jsx
│   │   ├── contexts/                    # React Context for state
│   │   │   ├── AuthContext.jsx          # Authentication state
│   │   │   └── UserContext.jsx          # User profile state
│   │   ├── services/                    # API service layer
│   │   │   ├── api.js                   # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   └── userService.js
│   │   ├── hooks/                       # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useRole.js
│   │   │   └── useProtectedRoute.js
│   │   ├── utils/                       # Utility functions
│   │   │   ├── constants.js             # Constants & configuration
│   │   │   ├── validators.js            # Form validation
│   │   │   ├── formatters.js            # Data formatting
│   │   │   └── helpers.js               # Helper functions
│   │   └── styles/                      # CSS stylesheets
│   │       ├── variables.css            # CSS variables
│   │       ├── components.css           # Component styles
│   │       └── responsive.css           # Responsive design
│   ├── public/                          # Static assets
│   ├── package.json                     # NPM dependencies
│   ├── vite.config.js                   # Vite configuration
│   ├── eslint.config.js                 # ESLint configuration
│   └── README.md                        # Frontend-specific README
│
├── specs/                               # Project specifications
│   └── 1-obe-system/                    # Main specification
│       ├── spec.md                      # Complete specification
│       ├── data-model.md                # Database schema documentation
│       ├── plan.md                      # Implementation plan
│       ├── contracts/
│       │   └── openapi.yaml             # OpenAPI specification
│       └── checklists/
│           └── requirements.md          # Requirements checklist
│
├── GOOGLE_OAUTH_SETUP.md                # Google OAuth configuration
└── README.md                            # This file
```

---

## ⚡ Quick Start - Running Commands

### 🖥️ Backend Server (FastAPI)

**Navigate to backend directory:**
```bash
cd OBEfinal/obebackend
```

**Run Backend Server:**

**Option 1: Using uv (Recommended)**
```bash
uv run uvicorn obebackend.main:app --reload --host 0.0.0.0 --port 8000
```

**Option 2: Using traditional venv**
```bash
# Activate virtual environment first
source .venv/bin/activate  # Linux/Mac
# OR
.venv\Scripts\activate     # Windows

# Then run server
uvicorn obebackend.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:**
- 🌐 **API Server**: http://localhost:8000
- 📚 **Swagger UI**: http://localhost:8000/docs
- 📖 **ReDoc**: http://localhost:8000/redoc
- ❤️ **Health Check**: http://localhost:8000/health

---

### 🎨 Frontend Server (React + Vite)

**Navigate to frontend directory:**
```bash
cd OBEfinal/obefrontend
```

**Run Frontend Development Server:**
```bash
npm run dev
```

**Frontend will be available at:**
- 🌐 **Application**: http://localhost:5173
- (Port may vary if 5173 is already in use)

---

### 📝 Important Notes

1. **Backend must be running first** before starting frontend
2. **Database must be set up** before running backend (see Database Setup below)
3. **Environment variables** must be configured in both `.env` files
4. Keep both terminals open - one for backend, one for frontend

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.10 or higher
- **Node.js** 18+ and **npm**
- **PostgreSQL** 12 or higher
- **Git** for version control
- **[uv](https://github.com/astral-sh/uv)** (Python package manager) - recommended

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd OBEfinal
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd obebackend

# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies and create virtual environment
uv sync

# Copy environment variables template
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

**Required environment variables:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/obe_db
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
DEBUG=True
```

#### 3. Database Setup

```bash
# Create PostgreSQL database
createdb obe_db

# Or using psql
psql -U postgres -c "CREATE DATABASE obe_db;"

# Run database schema
psql -U your_user -d obe_db -f schema.sql

# (Optional) Seed initial data
psql -U your_user -d obe_db -f scripts/seed_data.py
```

#### 4. Run Backend Server

**📍 Make sure you're in the `obebackend` directory:**
```bash
cd OBEfinal/obebackend
```

**🚀 Run Backend (Choose one method):**

**Method 1: Using uv (Recommended - No activation needed)**
```bash
uv run uvicorn obebackend.main:app --reload --host 0.0.0.0 --port 8000
```

**Method 2: Using traditional venv**
```bash
# First activate virtual environment
source .venv/bin/activate  # Linux/Mac
# OR
.venv\Scripts\activate     # Windows

# Then run server
uvicorn obebackend.main:app --reload --host 0.0.0.0 --port 8000
```

**✅ Backend will be available at:**
- 🌐 **API Server**: http://localhost:8000
- 📚 **Swagger UI (API Docs)**: http://localhost:8000/docs
- 📖 **ReDoc**: http://localhost:8000/redoc
- ❤️ **Health Check**: http://localhost:8000/health

**💡 Tip:** Keep this terminal open. The server will auto-reload when you make code changes.

#### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd obefrontend

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env file
nano .env
```

**Required environment variables:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

#### 6. Run Frontend Development Server

**📍 Make sure you're in the `obefrontend` directory:**
```bash
cd OBEfinal/obefrontend
```

**🚀 Run Frontend:**
```bash
npm run dev
```

**✅ Frontend will be available at:**
- 🌐 **Application**: http://localhost:5173
- (Port may automatically change if 5173 is already in use - check terminal output)

**💡 Tip:** 
- Keep this terminal open. The app will auto-reload when you make code changes.
- Make sure backend is running first (http://localhost:8000)

### Quick Verification

1. **Check Backend Health:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"healthy"}
   ```

2. **Access API Documentation:**
   - Open http://localhost:8000/docs in your browser
   - You should see the Swagger UI with all available endpoints

3. **Access Frontend:**
   - Open http://localhost:5173 in your browser
   - You should see the login page

---

## 🗄 Database Schema

### Entity Relationship Overview

The OBE System uses PostgreSQL with the following main entities:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │───────│    Roles    │       │ Permissions │
│             │       │             │       │             │
│ - id        │       │ - id        │       │ - id        │
│ - email     │       │ - name      │       │ - name      │
│ - role_id   │       │ - desc      │       │ - desc      │
│ - ...       │       └─────────────┘       └─────────────┘
└─────────────┘              │                     │
      │                      │                     │
      │                      └──────────┬──────────┘
      │                                 │
      │                          ┌──────┴──────┐
      │                          │ Role_Perm   │
      │                          └─────────────┘
      │
      ├──────────────┐
      │              │
┌─────┴──────┐  ┌────┴──────────┐
│ Enrollments│  │Course_Teachers│
└─────┬──────┘  └────┬──────────┘
      │              │
      │       ┌──────┴──────┐
      │       │   Courses   │
      │       │             │
      │       │ - id        │
      │       │ - code      │
      │       │ - name      │
      │       └──────┬──────┘
      │              │
      │       ┌──────┴──────┐
      │       │    CLOs     │──────┐
      │       │             │      │
      │       │ - id        │      │
      │       │ - course_id │      │
      │       │ - code      │      │
      │       └──────┬──────┘      │
      │              │             │
      │       ┌──────┴──────┐      │
      │       │CO-PO Mapping│      │
      │       └──────┬──────┘      │
      │              │             │
      │       ┌──────┴─────────────┘
      │       │    PLOs     │
      │       │             │
      │       │ - id        │
      │       │ - code      │
      │       └─────────────┘
      │
┌─────┴──────┐
│ Assessments│
│            │
│ - id       │
│ - course_id│
│ - name     │
│ - weight   │
└─────┬──────┘
      │
      ├──────────────┐
      │              │
┌─────┴──────┐  ┌────┴─────────┐
│Assessment_ │  │   Results    │
│   CLOs     │  │              │
│            │  │ - id         │
│ - assmt_id │  │ - student_id │
│ - clo_id   │  │ - assmt_id   │
└────────────┘  │ - clo_id     │
                │ - score      │
                └──────┬───────┘
                       │
                ┌──────┴──────┐
                │   Feedback  │
                │             │
                │ - id        │
                │ - result_id │
                │ - comment   │
                └─────────────┘
```

### Core Tables

1. **users**: System users (admins, teachers, students)
2. **roles**: User roles (Admin, Teacher, Student)
3. **permissions**: System permissions
4. **role_permissions**: Role-permission mappings
5. **courses**: Academic courses
6. **course_teachers**: Course-teacher assignments
7. **enrollments**: Student course enrollments
8. **plos**: Program Learning Outcomes
9. **clos**: Course Learning Outcomes
10. **co_po_mappings**: CLO to PLO mappings
11. **assessments**: Course assessments (quizzes, exams, etc.)
12. **assessment_clos**: Assessment-CLO linkages
13. **results**: Student assessment results
14. **feedback**: Teacher feedback on results
15. **otps**: One-time passwords for authentication
16. **oauth_tokens**: OAuth tokens for Google authentication

For detailed schema information, see:
- `obebackend/schema.sql` - Complete SQL schema
- `specs/1-obe-system/data-model.md` - Detailed entity documentation

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:8000/api`
- **Production**: `https://api.obesystem.com/api`

### Interactive Documentation

Once the backend is running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Endpoints Overview

#### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Email/password login | No |
| POST | `/api/auth/google` | Google OAuth callback | No |
| POST | `/api/auth/otp/request` | Request OTP code | No |
| POST | `/api/auth/otp/verify` | Verify OTP and login | No |
| POST | `/api/auth/refresh` | Refresh JWT token | No |
| POST | `/api/auth/logout` | Logout user | Yes |

#### User Management (`/api/users`)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/{id}` | Get user details | Admin/Self |
| POST | `/api/users` | Create new user | Admin |
| PUT | `/api/users/{id}` | Update user | Admin/Self |
| DELETE | `/api/users/{id}` | Delete user | Admin |
| GET | `/api/users/{id}/profile` | Get own profile | Self |

#### Course Management (`/api/courses`)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | List courses | All (filtered) |
| GET | `/api/courses/{id}` | Get course details | All |
| POST | `/api/courses` | Create course | Admin |
| PUT | `/api/courses/{id}` | Update course | Admin |
| DELETE | `/api/courses/{id}` | Delete course | Admin |
| POST | `/api/courses/{id}/teachers` | Assign teacher | Admin |
| GET | `/api/courses/{id}/students` | List enrolled students | Teacher/Admin |

#### Outcome Management (`/api`)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/plos` | List PLOs | All |
| POST | `/api/plos` | Create PLO | Admin |
| PUT | `/api/plos/{id}` | Update PLO | Admin |
| DELETE | `/api/plos/{id}` | Delete PLO | Admin |
| GET | `/api/courses/{id}/clos` | Get CLOs for course | All |
| POST | `/api/courses/{id}/clos` | Create CLO | Admin/Teacher |
| PUT | `/api/clos/{id}` | Update CLO | Admin/Teacher |
| DELETE | `/api/clos/{id}` | Delete CLO | Admin |

#### Mapping Management (`/api/mappings`)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/mappings` | List CO-PO mappings | All |
| POST | `/api/mappings` | Create mapping | Admin |
| PUT | `/api/mappings/{id}` | Update mapping | Admin |
| DELETE | `/api/mappings/{id}` | Delete mapping | Admin |
| GET | `/api/courses/{id}/mappings` | Get mappings for course | All |

#### Assessment Management (`/api/courses/{id}/assessments`)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses/{id}/assessments` | List assessments | All |
| GET | `/api/assessments/{id}` | Get assessment details | All |
| POST | `/api/assessments` | Create assessment | Teacher |
| PUT | `/api/assessments/{id}` | Update assessment | Teacher |
| DELETE | `/api/assessments/{id}` | Delete assessment | Teacher |

#### Results Management (`/api/results`)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/assessments/{id}/results` | Get results for assessment | Teacher |
| GET | `/api/students/{id}/results` | Get student results | Teacher/Student |
| POST | `/api/results` | Create result entry | Teacher |
| POST | `/api/results/bulk` | Bulk result entry | Teacher |
| PUT | `/api/results/{id}` | Update result | Teacher |
| POST | `/api/results/{id}/feedback` | Add feedback | Teacher |

#### Analytics (`/api/analytics`)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/course/{id}` | Course analytics | Teacher/Admin |
| GET | `/api/analytics/program` | Program-level analytics | Admin |
| GET | `/api/analytics/student/{id}` | Student progress | Student/Teacher |
| GET | `/api/analytics/outcomes/{id}` | Outcome achievement | All |

For complete API documentation, see:
- `specs/1-obe-system/contracts/openapi.yaml` - OpenAPI specification

---

## 🔐 Authentication Methods

The OBE System supports three authentication methods:

### 1. JWT Email/Password Authentication

**Flow:**
```
User → Enter Email/Password → Backend validates → Returns JWT Token → Store token → Access protected routes
```

**Features:**
- Secure password hashing with bcrypt (12 rounds)
- JWT tokens with 15-minute access token expiry
- 7-day refresh token for extended sessions
- Automatic token refresh before expiry

### 2. Google OAuth2 Authentication

**Flow:**
```
User → Click "Login with Google" → Redirect to Google → User authorizes → Google callback → Backend creates/updates user → Returns JWT → Access system
```

**Features:**
- Google OAuth2 authorization code flow
- Automatic user creation on first login
- Token storage for future sessions
- Secure token encryption

### 3. Email OTP Authentication

**Flow:**
```
User → Request OTP → Backend sends email → User enters OTP → Backend validates → Returns JWT Token → Access system
```

**Features:**
- 6-digit numeric OTP codes
- 10-minute expiry time
- Single-use codes (invalidated after use)
- Rate limiting (3 requests per email per 15 minutes)
- Hashed OTP storage

### Security Features

- **Password Security**: bcrypt hashing with 12 salt rounds
- **Token Security**: JWT with HMAC-SHA256 algorithm
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Pydantic models for all inputs
- **SQL Injection Prevention**: Parameterized queries only
- **Rate Limiting**: On authentication endpoints
- **HTTPS Ready**: Supports secure connections in production

---

## 👥 User Roles & Permissions

### Role Hierarchy

```
┌─────────────────────────────────────────┐
│              ADMIN                      │
│  Full system access and management     │
│  - User management                     │
│  - Course configuration                │
│  - Outcome definitions                 │
│  - System-wide analytics               │
└─────────────────────────────────────────┘
              │
              ├─────────────────┐
              │                 │
┌─────────────┴─────┐  ┌────────┴──────────────┐
│     TEACHER       │  │       STUDENT         │
│  Course-specific  │  │    Self-access only   │
│  access           │  │                       │
│  - Assigned       │  │  - Enrolled courses   │
│    courses only   │  │  - Own results        │
│  - Assessments    │  │  - Own progress       │
│  - Results entry  │  │  - Own profile        │
│  - Course reports │  │                       │
└───────────────────┘  └───────────────────────┘
```

### Admin Role

**Capabilities:**
- ✅ Full user management (CRUD operations)
- ✅ Course creation and management
- ✅ Teacher assignment to courses
- ✅ PLO and CLO definition
- ✅ CO-PO mapping management
- ✅ System-wide analytics and reports
- ✅ Access to all courses and data
- ✅ User role assignment and modification

### Teacher Role

**Capabilities:**
- ✅ View assigned courses only
- ✅ Create and manage CLOs for assigned courses
- ✅ Create and manage assessments
- ✅ Enter and update student results
- ✅ Provide feedback on student results
- ✅ View course analytics and reports
- ✅ View enrolled students in assigned courses
- ❌ Cannot access other teachers' courses
- ❌ Cannot manage users or system settings

### Student Role

**Capabilities:**
- ✅ View enrolled courses
- ✅ View assessment details
- ✅ View own results and grades
- ✅ View teacher feedback
- ✅ Track progress against outcomes
- ✅ Update own profile information
- ❌ Cannot view other students' data
- ❌ Cannot create or modify courses/assessments
- ❌ Cannot enter results

---

## 📊 System Flowcharts

### Authentication Flow

```
┌─────────────┐
│   User      │
│  Arrives    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│      Choose Auth Method             │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │Email │  │Google│  │ OTP  │     │
│  │/Pass │  │ OAuth│  │      │     │
│  └──┬───┘  └──┬───┘  └──┬───┘     │
└─────┼─────────┼─────────┼──────────┘
      │         │         │
      │         │         │
   ┌──▼───┐  ┌──▼───┐  ┌─▼────┐
   │Enter │  │Redirect│ │Request│
   │Creds │  │to Google│ │ OTP  │
   └──┬───┘  └──┬─────┘ └──┬───┘
      │         │          │
      │    ┌────▼────┐     │
      │    │Authorize│     │
      │    └────┬────┘     │
      │         │          │
   ┌──▼─────────▼──────────▼──┐
   │   Backend Validates      │
   └───────────┬──────────────┘
               │
        ┌──────▼──────┐
        │ Generate    │
        │ JWT Token   │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │  Redirect   │
        │ to Dashboard│
        └──────┬──────┘
               │
        ┌──────▼──────────┐
        │ Role-based      │
        │ Dashboard       │
        └─────────────────┘
```

### Course Management Flow (Admin)

```
┌─────────────┐
│    Admin    │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  Create Course   │
│  - Code          │
│  - Name          │
│  - Description   │
│  - Credits       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Assign Teachers │
│  (Multiple)      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Define CLOs     │
│  for Course      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Map CLOs to     │
│  PLOs            │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Enroll Students │
│  (Optional)      │
└──────────────────┘
```

### Assessment & Results Flow (Teacher)

```
┌─────────────┐
│   Teacher   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  Select Course   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Create Assessment│
│  - Name          │
│  - Type          │
│  - Weight        │
│  - Link to CLOs  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Students Take   │
│  Assessment      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Enter Results   │
│  - Score         │
│  - Link to CLOs  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Provide Feedback│
│  (Optional)      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  System Calculates│
│  - Grade         │
│  - Outcome       │
│    Achievement   │
└──────────────────┘
```

### Student Progress Flow

```
┌─────────────┐
│   Student   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  View Enrolled   │
│  Courses         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Select Course   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  View:           │
│  - Assessments   │
│  - Results       │
│  - Feedback      │
│  - Progress      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Track Outcome   │
│  Achievement     │
│  - CLO Progress  │
│  - PLO Mapping   │
└──────────────────┘
```

---

## 💻 Development

### Backend Development

#### Using uv (Recommended)

```bash
cd obebackend

# Install dependencies
uv sync

# Add new dependency
uv add <package-name>

# Add dev dependency
uv add --group dev <package-name>

# Run server
uv run uvicorn obebackend.main:app --reload

# Run tests
uv run pytest

# Format code
uv run black .

# Lint code
uv run ruff check .
```

#### Using Traditional venv

```bash
cd obebackend

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn obebackend.main:app --reload
```

### Frontend Development

```bash
cd obefrontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database Development

```bash
# Connect to database
psql -U your_user -d obe_db

# Run migrations (if applicable)
psql -U your_user -d obe_db -f migrations/001_initial.sql

# Seed test data
python obebackend/scripts/seed_data.py

# Reset database (CAUTION: Deletes all data)
psql -U your_user -d obe_db -f obebackend/schema.sql
```

### Code Quality

**Backend:**
- **Black**: Code formatting (line length: 100)
- **Ruff**: Linting and code quality checks
- **pytest**: Unit and integration tests

**Frontend:**
- **ESLint**: JavaScript/React linting
- **React Hooks**: Enforced rules for hooks

---

## 🚢 Deployment

### Production Considerations

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use managed PostgreSQL service or dedicated server
3. **HTTPS**: Enable SSL/TLS certificates
4. **CORS**: Configure allowed origins for production domain
5. **Security**: Set `DEBUG=False` in production
6. **Logging**: Configure production logging
7. **Monitoring**: Set up application monitoring

### Deployment Options

#### Option 1: Docker Deployment

```dockerfile
# Backend Dockerfile example
FROM python:3.10-slim
WORKDIR /app
COPY obebackend/ .
RUN pip install uv && uv sync
CMD ["uvicorn", "obebackend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Option 2: Cloud Platform (Railway/Render)

- Deploy backend as FastAPI service
- Deploy frontend as static site
- Use managed PostgreSQL service
- Configure environment variables via platform

#### Option 3: Traditional VPS

- Nginx reverse proxy
- Gunicorn/Uvicorn for backend
- PM2 for process management
- Let's Encrypt for SSL

### Environment Configuration

**Backend Production `.env`:**
```env
DATABASE_URL=postgresql://user:pass@db-host:5432/obe_db
JWT_SECRET=<strong-secret-key>
JWT_ALGORITHM=HS256
GOOGLE_CLIENT_ID=<production-client-id>
GOOGLE_CLIENT_SECRET=<production-client-secret>
CORS_ORIGINS=https://yourdomain.com
DEBUG=False
```

**Frontend Production `.env`:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## 📚 Documentation

Additional documentation files:

- **[GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)**: Google OAuth configuration guide
- **[USER_MANAGEMENT.md](USER_MANAGEMENT.md)**: User management guide
- **[obebackend/README.md](obebackend/README.md)**: Backend-specific documentation
- **[obebackend/docs/SEED_OUTCOMES_GUIDE.md](obebackend/docs/SEED_OUTCOMES_GUIDE.md)**: Guide for seeding outcomes data
- **[specs/1-obe-system/spec.md](specs/1-obe-system/spec.md)**: Complete system specification
- **[specs/1-obe-system/data-model.md](specs/1-obe-system/data-model.md)**: Database schema documentation

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- **Backend**: Follow PEP 8, use Black for formatting
- **Frontend**: Follow ESLint rules, use consistent naming
- **Commits**: Use clear, descriptive commit messages

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Authors

- **Your Name** - *Initial work*

---

## 🙏 Acknowledgments

- FastAPI community for excellent documentation
- React team for the amazing framework
- PostgreSQL community for robust database solutions

---

## 📞 Support

For support, email support@obesystem.com or create an issue in the repository.

---

<div align="center">

**Made with ❤️ for Outcome-Based Education**

[⬆ Back to Top](#-obe-system---outcome-based-education-management-system)

</div>

## 🙏 Backend Running commands
```cd OBEfinal/obebackend
uv run uvicorn obebackend.main:app --reload --host 0.0.0.0 --port 8000
```



## 🙏 Frontend running commands
```cd OBEfinal/obefrontend
npm run dev
```



