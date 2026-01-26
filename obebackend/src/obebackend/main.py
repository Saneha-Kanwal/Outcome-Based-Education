"""
FastAPI Application Entry Point for OBE System

This is the main entry point of the OBE (Outcome-Based Education) System backend API.
This file initializes the FastAPI application, configures middleware, sets up error handlers,
and registers all API routes.

The application follows a modular structure:
- Routes: Define API endpoints
- Controllers: Handle business logic
- Schemas: Validate request/response data
- Database: Handle data persistence
- Middleware: Handle authentication, authorization, and errors

Author: OBE System Development Team
"""

# Import FastAPI framework and its components
# FastAPI is a modern, fast web framework for building APIs with Python
from fastapi import FastAPI

# Import CORS middleware to handle Cross-Origin Resource Sharing
# This allows the frontend (running on different port) to communicate with backend
from fastapi.middleware.cors import CORSMiddleware

# Import exception handlers for request validation errors
# These help us return proper error messages when users send invalid data
from fastapi.exceptions import RequestValidationError

# Import HTTP exception from Starlette (FastAPI is built on Starlette)
# This is used for handling HTTP-related errors (404, 403, etc.)
from starlette.exceptions import HTTPException as StarletteHTTPException

# Import Python's built-in logging module
# This helps us log information, warnings, and errors for debugging
import logging

# Import application settings from config module
# Settings contain environment variables like database URL, JWT secret, etc.
from obebackend.config import settings

# Import custom exception handlers from our middleware module
# These handle different types of errors gracefully and return user-friendly messages
from obebackend.middleware.error_handler import (
    validation_exception_handler,      # Handles validation errors (wrong data format)
    http_exception_handler,            # Handles HTTP errors (404, 500, etc.)
    general_exception_handler,         # Handles any unexpected errors
    AppException,                      # Custom exception class for our application
    app_exception_handler              # Handler for our custom exceptions
)

# Import database connection functions
# These manage the connection pool to PostgreSQL database
from obebackend.database.connection import init_connection_pool, close_connection_pool

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

# Configure the logging system for the entire application
# This sets up how log messages are formatted and where they are displayed
logging.basicConfig(
    # Set log level: DEBUG shows everything, INFO shows important messages only
    # We use DEBUG in development, INFO in production
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    
    # Define the format of log messages:
    # - %(asctime)s: Timestamp (when the log was created)
    # - %(name)s: Name of the logger (which module logged this)
    # - %(levelname)s: Log level (DEBUG, INFO, WARNING, ERROR)
    # - %(message)s: The actual log message
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Create a logger instance for this module
# This allows us to log messages from this file with logger.info(), logger.error(), etc.
logger = logging.getLogger(__name__)

# ============================================================================
# FASTAPI APPLICATION INITIALIZATION
# ============================================================================

# Create the main FastAPI application instance
# This is the core object that handles all HTTP requests and responses
app = FastAPI(
    # Title of the API - appears in the API documentation
    title="OBE System API",
    
    # Description of what this API does - shown in documentation
    description="Outcome-Based Education Management System API",
    
    # Current version of the API - useful for tracking changes
    version="1.0.0",
    
    # Swagger UI documentation URL - only available in development mode
    # Swagger UI is an interactive API documentation interface
    # In production (DEBUG=False), we hide this for security
    docs_url="/docs" if settings.DEBUG else None,
    
    # ReDoc documentation URL - alternative to Swagger UI
    # ReDoc provides a different style of API documentation
    # Also hidden in production for security
    redoc_url="/redoc" if settings.DEBUG else None
)

# ============================================================================
# CORS (Cross-Origin Resource Sharing) CONFIGURATION
# ============================================================================

# CORS allows our frontend (running on http://localhost:5173) to make requests
# to our backend (running on http://localhost:8000)
# Without CORS, browsers block these cross-origin requests for security

# Parse CORS origins from environment variable
# Split by comma and remove whitespace, filter out empty strings
# Example: "http://localhost:5173, http://localhost:5174" -> ["http://localhost:5173", "http://localhost:5174"]
raw_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

# Default development origins - common ports for Vite development server
# These are the ports where our React frontend typically runs during development
default_dev_origins = {
    "http://localhost:5173",   # Default Vite port
    "http://localhost:5174",   # Alternative Vite port if 5173 is busy
    "http://localhost:5175",   # Another alternative port
    "http://127.0.0.1:5173",   # Same as localhost:5173 (127.0.0.1 is localhost)
    "http://127.0.0.1:5174",   # Same as localhost:5174
    "http://127.0.0.1:5175",   # Same as localhost:5175
}

# If no origins are configured in environment variables, use default development origins
# This makes development easier - developers don't need to configure CORS manually
if not raw_origins:
    # Convert set to list for easier manipulation
    raw_origins = list(default_dev_origins)
else:
    # If origins are configured, merge with defaults to ensure dev ports work
    # This way developers can add custom origins while still supporting common dev ports
    raw_origin_set = set(raw_origins)  # Convert to set for fast lookup
    
    # Add any default dev origins that aren't already in the list
    for origin in default_dev_origins:
        if origin not in raw_origin_set:
            raw_origins.append(origin)      # Add to list
            raw_origin_set.add(origin)      # Add to set to track what we have

# Check if we should allow all origins (wildcard "*")
# This is useful in development but should NEVER be used in production
# We allow all origins if:
# 1. User explicitly set "*" in CORS_ORIGINS
# 2. DEBUG mode is enabled (development mode)
allow_all_origins = "*" in raw_origins or settings.DEBUG

# Set the final list of allowed origins
# If allowing all origins, use ["*"], otherwise use the configured list
allow_origins = ["*"] if allow_all_origins else raw_origins

# Log the configured CORS origins for debugging
# This helps developers see which origins are allowed
logger.info("Configured CORS origins: %s", allow_origins)

# Add CORS middleware to the FastAPI application
# Middleware runs before and after each request
app.add_middleware(
    CORSMiddleware,
    # List of origins (domains) allowed to make requests
    allow_origins=allow_origins,
    # Allow cookies and authentication headers to be sent
    # We disable this if allowing all origins (security risk)
    allow_credentials=not allow_all_origins,
    # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_methods=["*"],
    # Allow all headers in requests
    allow_headers=["*"],
)

# ============================================================================
# EXCEPTION HANDLERS REGISTRATION
# ============================================================================

# Register custom exception handlers
# These catch errors and return proper JSON responses instead of crashing

# Handle validation errors - when request data doesn't match expected format
# Example: User sends string instead of number, or missing required field
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Handle HTTP errors - standard HTTP status codes (404, 403, 500, etc.)
# Example: Resource not found (404), Forbidden access (403)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)

# Handle our custom application exceptions
# These are business logic errors we define ourselves
app.add_exception_handler(AppException, app_exception_handler)

# Handle any other unexpected exceptions
# This is a safety net - catches errors we didn't anticipate
app.add_exception_handler(Exception, general_exception_handler)

# ============================================================================
# APPLICATION LIFECYCLE EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Initialize services when the application starts.
    
    This function runs once when the server starts up.
    We use it to:
    - Initialize database connection pool (reuse connections for performance)
    - Set up any required services
    - Log startup information
    
    This runs asynchronously (async) to avoid blocking the server startup.
    """
    # Log that we're starting the API
    logger.info("Starting OBE System API...")
    
    # Initialize database connection pool
    # Connection pooling allows us to reuse database connections instead of
    # creating new ones for each request, which is much faster
    init_connection_pool()
    
    # Log successful startup
    logger.info("OBE System API started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Clean up resources when the application shuts down.
    
    This function runs once when the server shuts down.
    We use it to:
    - Close database connections properly
    - Clean up any resources
    - Log shutdown information
    
    Proper cleanup ensures no resources are leaked.
    """
    # Log that we're shutting down
    logger.info("Shutting down OBE System API...")
    
    # Close all database connections in the pool
    # This ensures connections are properly closed and not left hanging
    close_connection_pool()
    
    # Log successful shutdown
    logger.info("OBE System API shut down successfully")

# ============================================================================
# ROOT ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """
    Root endpoint - returns basic API information.
    
    This is the simplest endpoint, accessed at http://localhost:8000/
    It's useful for:
    - Quick health check
    - API identification
    - Version information
    
    Returns a JSON object with API name, version, and status.
    """
    return {
        "message": "OBE System API",      # Name of the API
        "version": "1.0.0",                # Current version
        "status": "running"                # Status indicator
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring.
    
    This endpoint is used by:
    - Load balancers (to check if server is alive)
    - Monitoring tools (to track server health)
    - Deployment scripts (to verify successful deployment)
    
    Returns a simple JSON object indicating the server is healthy.
    A healthy server responds quickly with {"status": "healthy"}
    """
    return {"status": "healthy"}

# ============================================================================
# ROUTE REGISTRATION
# ============================================================================

# Import all route modules
# Each module contains routes for a specific feature area
from obebackend.routes import (
    auth,              # Authentication routes (login, register, OAuth, OTP)
    users,             # User management routes (CRUD operations)
    courses,           # Course management routes
    outcomes,          # Outcome management routes (PLOs, CLOs)
    mappings,          # CO-PO mapping routes
    assessments,       # Assessment management routes
    results,           # Result entry and feedback routes
    analytics,         # Analytics and reporting routes
    teacher_courses,   # Teacher-specific course routes
)

# Register authentication routes
# Prefix "/api/auth" means all routes in auth.py will be under /api/auth/*
# Tags help organize routes in API documentation
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Register user management routes
# All routes will be under /api/users/*
app.include_router(users.router, prefix="/api/users", tags=["Users"])

# Register course management routes
# All routes will be under /api/courses/*
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])

# Register outcome routes (PLOs and CLOs)
# Routes are under /api/plos and /api/courses/{id}/clos
app.include_router(outcomes.router, prefix="/api", tags=["Outcomes"])

# Register CO-PO mapping routes
# Routes are under /api/mappings/*
app.include_router(mappings.router, prefix="/api/mappings", tags=["Mappings"])

# Register course-specific mapping routes
# Routes are under /api/courses/{id}/mappings/*
app.include_router(mappings.course_mappings_router, prefix="/api/courses", tags=["Mappings"])

# Register assessment routes
# Routes are under /api/courses/{id}/assessments/*
# Assessments belong to courses, so we nest them under courses
app.include_router(assessments.router, prefix="/api/courses", tags=["Assessments"])

# Register assessment detail routes
# Routes are under /api/assessments/{id}/*
# This allows direct access to assessments by ID
app.include_router(assessments.assessment_detail_router, prefix="/api/assessments", tags=["Assessments"])

# Register result routes
# Routes are under /api/results/*
# Results are student assessment scores
app.include_router(results.router, prefix="/api/results", tags=["Results"])

# Register analytics routes
# Routes are under /api/analytics/*
# Analytics provide reports and statistics
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

# Register teacher course routes
# Routes are under /api/teacher/courses/*
# These are teacher-specific course operations
app.include_router(teacher_courses.router, prefix="/api", tags=["Teacher Courses"])
