"""SQL queries for CO-PO Mapping entity."""

# Get mapping by ID
GET_MAPPING_BY_ID = """
    SELECT id, clo_id, plo_id, strength, created_at
    FROM co_po_mappings
    WHERE id = %s
"""

# Get all mappings
GET_ALL_MAPPINGS = """
    SELECT id, clo_id, plo_id, strength, created_at
    FROM co_po_mappings
    ORDER BY clo_id, plo_id
"""

# Get mappings by course
GET_MAPPINGS_BY_COURSE = """
    SELECT m.id, m.clo_id, m.plo_id, m.strength, m.created_at,
           c.code as clo_code, p.code as plo_code
    FROM co_po_mappings m
    INNER JOIN clos c ON m.clo_id = c.id
    INNER JOIN plos p ON m.plo_id = p.id
    WHERE c.course_id = %s
    ORDER BY c.code, p.code
"""

# Create mapping
CREATE_MAPPING = """
    INSERT INTO co_po_mappings (clo_id, plo_id, strength)
    VALUES (%s, %s, %s)
    RETURNING id, clo_id, plo_id, strength, created_at
"""

# Update mapping
UPDATE_MAPPING = """
    UPDATE co_po_mappings
    SET strength = %s
    WHERE id = %s
    RETURNING id, clo_id, plo_id, strength, created_at
"""

# Delete mapping
DELETE_MAPPING = """
    DELETE FROM co_po_mappings
    WHERE id = %s
"""

