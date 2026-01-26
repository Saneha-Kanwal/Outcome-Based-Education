"""
Seed script to populate sample Program Learning Outcomes (PLOs) and
Course Learning Outcomes (CLOs) for demonstration purposes.

Adds:
  - Three sample PLOs (PLO1–PLO3).
  - Three CLOs for each of the existing courses:
        * Programming Fundamentals
        * Information Security

The script is idempotent:
  * If a PLO/CLO already exists, its description is updated.
  * Missing items are inserted.

Usage:
    uv run python scripts/seed_outcomes.py

Ensure the backend virtualenv is active (or use `uv run`) and that the
DATABASE_URL is configured in `obebackend/.env`.
"""

from __future__ import annotations

import logging
from typing import Dict, List, Tuple

from obebackend.database.connection import get_db_connection

logger = logging.getLogger(__name__)


PLOS: List[Dict[str, str]] = [
    {
        "code": "PLO1",
        "description": "Apply foundational computing knowledge and problem-solving skills to develop efficient software solutions.",
    },
    {
        "code": "PLO2",
        "description": "Design, analyze, and evaluate computing systems with consideration of security, scalability, and usability.",
    },
    {
        "code": "PLO3",
        "description": "Communicate technical concepts effectively while working collaboratively in multidisciplinary teams.",
    },
    {
        "code": "PLO-1",
        "description": "Apply knowledge of computing and mathematics appropriate to the discipline of Information Technology.",
    },
    {
        "code": "PLO-2",
        "description": "Identify and analyze complex computing problems and apply IT principles to solve them effectively.",
    },
    {
        "code": "PLO-3",
        "description": "Use appropriate IT tools, techniques, and modern technologies to design and manage computing systems.",
    },
]


COURSE_CLOS: Dict[str, List[Dict[str, str]]] = {
    "Programming Fundamentals": [
        {
            "code": "CLO1",
            "description": "Explain core programming constructs including variables, data types, control flow, and functions.",
        },
        {
            "code": "CLO2",
            "description": "Implement small programs using structured problem-solving techniques and pseudocode-to-code translation.",
        },
        {
            "code": "CLO3",
            "description": "Debug and test code to identify logical errors and ensure correctness against requirements.",
        },
    ],
    "Information Security": [
        {
            "code": "CLO1",
            "description": "Describe fundamental security concepts such as confidentiality, integrity, availability, and risk management.",
        },
        {
            "code": "CLO2",
            "description": "Analyze common threats and vulnerabilities, proposing mitigation strategies aligned with best practices.",
        },
        {
            "code": "CLO3",
            "description": "Apply security controls (authentication, authorization, encryption) to safeguard information assets in practical scenarios.",
        },
    ],
    "Information Technology": [
        {
            "code": "CLO-1",
            "description": "Explain the basic concepts, components, and applications of Information Technology in various fields.",
        },
        {
            "code": "CLO-2",
            "description": "Demonstrate the ability to use software tools and technologies to solve real-world problems.",
        },
        {
            "code": "CLO-3",
            "description": "Analyze the impact of IT solutions on organizations, individuals, and society.",
        },
    ],
}


def upsert_plo(cursor, code: str, description: str) -> Tuple[int, bool]:
    """Insert or update a PLO. Returns (id, created?)."""
    cursor.execute("SELECT id FROM plos WHERE code = %s", (code,))
    row = cursor.fetchone()
    if row:
        plo_id = row[0]
        cursor.execute(
            """
            UPDATE plos
            SET description = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (description, plo_id),
        )
        return plo_id, False

    cursor.execute(
        """
        INSERT INTO plos (code, description)
        VALUES (%s, %s)
        RETURNING id
        """,
        (code, description),
    )
    plo_id = cursor.fetchone()[0]
    return plo_id, True


def find_course_id(cursor, course_name: str) -> int | None:
    """Return the course id for the given name (case-insensitive)."""
    cursor.execute(
        """
        SELECT id
        FROM courses
        WHERE LOWER(name) = LOWER(%s)
        ORDER BY id
        LIMIT 1
        """,
        (course_name,),
    )
    row = cursor.fetchone()
    return row[0] if row else None


def upsert_clo(cursor, course_id: int, code: str, description: str) -> Tuple[int, bool]:
    """Insert or update a CLO for a course. Returns (id, created?)."""
    cursor.execute(
        """
        SELECT id
        FROM clos
        WHERE course_id = %s
          AND code = %s
        """,
        (course_id, code),
    )
    row = cursor.fetchone()
    if row:
        clo_id = row[0]
        cursor.execute(
            """
            UPDATE clos
            SET description = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (description, clo_id),
        )
        return clo_id, False

    cursor.execute(
        """
        INSERT INTO clos (course_id, code, description)
        VALUES (%s, %s, %s)
        RETURNING id
        """,
        (course_id, code, description),
    )
    clo_id = cursor.fetchone()[0]
    return clo_id, True


def seed_outcomes() -> None:
    with get_db_connection() as conn:
        cursor = conn.cursor()

        logger.info("Seeding Program Learning Outcomes (PLOs)...")
        for plo in PLOS:
            plo_id, created = upsert_plo(cursor, plo["code"], plo["description"])
            action = "created" if created else "updated"
            logger.info("PLO %s (%s) %s.", plo["code"], plo_id, action)

        logger.info("Seeding Course Learning Outcomes (CLOs)...")
        for course_name, clos in COURSE_CLOS.items():
            course_id = find_course_id(cursor, course_name)
            if not course_id:
                logger.warning(
                    "Skipping course '%s' because it was not found. Create the course first in the system.",
                    course_name,
                )
                continue

            logger.info("Processing course '%s' (id=%s)...", course_name, course_id)
            for clo in clos:
                clo_id, created = upsert_clo(cursor, course_id, clo["code"], clo["description"])
                action = "created" if created else "updated"
                logger.info("  CLO %s (%s) %s.", clo["code"], clo_id, action)

        conn.commit()
        logger.info("Outcome seeding complete.")


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    try:
        seed_outcomes()
    except Exception as exc:  # pragma: no cover - safety net
        logger.exception("Failed to seed outcomes: %s", exc)
        raise


if __name__ == "__main__":
    main()

