# OBE System Backend

Outcome-Based Education Management System - Backend API built with FastAPI and PostgreSQL.

## Prerequisites

- Python 3.10+
- PostgreSQL 12+
- [uv](https://github.com/astral-sh/uv) package manager

## Setup with uv

### 1. Install uv (if not already installed)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Initialize the project

```bash
cd obebackend
uv sync
```

This will:
- Create a virtual environment automatically
- Install all dependencies from `pyproject.toml`
- Install development dependencies

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Set up database

```bash
# Create database
createdb obe_db

# Run schema
psql -U your_user -d obe_db -f schema.sql
```

### 5. Run the application

**From the `obebackend` directory (NOT from src/obebackend):**

```bash
# Using uv run (recommended - no activation needed)
uv run uvicorn obebackend.main:app --reload

# Or activate venv first
source .venv/bin/activate
uvicorn obebackend.main:app --reload
```

**Important:** 
- Run from `obebackend/` directory (project root)
- Use `uvicorn obebackend.main:app` (not `main:app`)
- The module path is `obebackend.main:app` because the package is in `src/obebackend/`

## Development Commands

### Install dependencies

```bash
uv sync                    # Install all dependencies
uv sync --group dev        # Include dev dependencies
uv add <package>           # Add a new dependency
uv add --group dev <package>  # Add a dev dependency
uv remove <package>        # Remove a dependency
```

### Run commands

```bash
uv run <command>          # Run any command in the virtual environment
uv run pytest             # Run tests
uv run black .            # Format code
uv run ruff check .       # Lint code
uv run uvicorn obebackend.main:app --reload  # Run server
```

### Update dependencies

```bash
uv sync --upgrade          # Update all dependencies
uv lock                    # Update lock file
```

## Project Structure

```
obebackend/
├── src/
│   └── obebackend/       # Main application code
│       ├── main.py       # FastAPI app entry point
│       ├── config.py     # Configuration
│       ├── database/     # Database connection and queries
│       ├── routes/       # API routes
│       ├── controllers/  # Business logic
│       ├── schemas/      # Pydantic models
│       ├── middleware/   # Middleware
│       └── utils/        # Utilities
├── schema.sql            # Database schema
├── pyproject.toml        # Project configuration (uv/pip)
├── requirements.txt      # Legacy requirements (for reference)
└── .env.example          # Environment variables template
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## Environment Variables

See `.env.example` for required environment variables.

## Troubleshooting

### "Module not found" errors
- Ensure you're running from `obebackend/` directory
- Run `uv sync` to install dependencies
- Use `uv run` prefix for commands

### "DATABASE_URL not set"
- Copy `.env.example` to `.env`
- Fill in your database connection string

### Port already in use
```bash
uv run uvicorn obebackend.main:app --reload --port 8001
```
