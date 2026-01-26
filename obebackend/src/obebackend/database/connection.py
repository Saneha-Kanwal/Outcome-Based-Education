"""PostgreSQL database connection pool for OBE System."""

import psycopg2
from psycopg2 import pool
from contextlib import contextmanager
from typing import Generator
import logging

from obebackend.config import settings

logger = logging.getLogger(__name__)

# Connection pool (initialized on first use)
_connection_pool: pool.ThreadedConnectionPool = None


def init_connection_pool():
    """Initialize the database connection pool."""
    global _connection_pool
    
    if _connection_pool is not None:
        return
    
    try:
        _connection_pool = psycopg2.pool.ThreadedConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=settings.DATABASE_URL
        )
        logger.info("Database connection pool initialized successfully")
    except psycopg2.OperationalError as e:
        logger.error(f"Failed to connect to database: {e}")
        logger.error("Please check:")
        logger.error("  1. PostgreSQL is running: sudo systemctl start postgresql")
        logger.error("  2. Database exists: createdb obe_db")
        logger.error("  3. User and password in DATABASE_URL are correct")
        logger.error("  4. Run schema: psql -U your_user -d obe_db -f schema.sql")
        # Don't raise - allow app to start but database operations will fail
        _connection_pool = None
    except Exception as e:
        logger.error(f"Failed to initialize database connection pool: {e}")
        _connection_pool = None


def get_connection_pool() -> pool.ThreadedConnectionPool:
    """Get the database connection pool, initializing if necessary."""
    if _connection_pool is None:
        init_connection_pool()
    if _connection_pool is None:
        raise RuntimeError(
            "Database connection pool not initialized. "
            "Please check your DATABASE_URL in .env file and ensure: "
            "1. PostgreSQL is running, "
            "2. Database exists, "
            "3. User and password are correct"
        )
    return _connection_pool


@contextmanager
def get_db_connection() -> Generator[psycopg2.extensions.connection, None, None]:
    """
    Context manager for database connections.
    
    Usage:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users")
            results = cursor.fetchall()
    """
    pool = get_connection_pool()
    if pool is None:
        raise RuntimeError("Database connection pool is not available")
    conn = pool.getconn()
    
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Database transaction error: {e}")
        raise
    finally:
        pool.putconn(conn)


def close_connection_pool():
    """Close all connections in the pool."""
    global _connection_pool
    
    if _connection_pool is not None:
        _connection_pool.closeall()
        _connection_pool = None
        logger.info("Database connection pool closed")

