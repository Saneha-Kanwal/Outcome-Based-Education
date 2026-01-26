"""Course management routes for OBE System."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional, List

from obebackend.schemas.course_schemas import (
    CourseResponse,
    CourseListResponse,
    CreateCourseRequest,
    UpdateCourseRequest,
    AssignTeacherRequest,
    TeacherResponse,
    StudentResponse
)
from obebackend.controllers.course_controller import (
    get_course_by_id,
    get_courses,
    create_course,
    update_course,
    delete_course,
    assign_teacher,
    get_course_students,
    get_active_courses,
    get_courses_for_student,
    enroll_student_in_course,
    remove_student_enrollment,
)
from obebackend.middleware.auth_middleware import require_auth
from obebackend.middleware.rbac_middleware import require_admin, require_admin_or_teacher, require_student
from obebackend.middleware.error_handler import AppException
from obebackend.database.connection import get_db_connection
from obebackend.database.queries import teacher_course_queries

router = APIRouter()


@router.get("", response_model=CourseListResponse)
async def list_courses(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_auth)
):
    """List courses (role-based filtering)."""
    try:
        result = get_courses(search=search, page=page, per_page=per_page)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/available", response_model=List[CourseResponse])
async def list_available_courses(
    current_user: dict = Depends(require_auth)
):
    """List active courses students can enroll in."""
    try:
        role = current_user.get("role", {}).get("name")
        if role != "Student":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        courses = get_active_courses()
        return courses
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/students/{student_id}", response_model=List[CourseResponse])
async def list_student_courses(
    student_id: int,
    current_user: dict = Depends(require_auth)
):
    """List courses a student is enrolled in."""
    role = current_user.get("role", {}).get("name")
    if role == "Student" and current_user["id"] != student_id:
        raise HTTPException(status_code=403, detail="Access denied")
    try:
        return get_courses_for_student(student_id)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{course_id}/enroll", response_model=dict, status_code=status.HTTP_201_CREATED)
async def enroll_in_course(
    course_id: int,
    current_user: dict = Depends(require_auth)
):
    """Enroll the current student in a course."""
    try:
        role = current_user.get("role", {}).get("name")
        if role != "Student":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        enrollment = enroll_student_in_course(current_user["id"], course_id)
        return enrollment
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{course_id}/enroll", status_code=status.HTTP_204_NO_CONTENT)
async def unenroll_from_course(
    course_id: int,
    current_user: dict = Depends(require_auth)
):
    """Remove the current student's enrollment from a course."""
    role = current_user.get("role", {}).get("name")
    if role != "Student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    try:
        remove_student_enrollment(current_user["id"], course_id)
        return None
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: int,
    current_user: dict = Depends(require_auth)
):
    """Get course details."""
    try:
        course = get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    except HTTPException:
        raise
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_new_course(
    request: CreateCourseRequest,
    current_user: dict = Depends(require_admin)
):
    """Create course (Admin only)."""
    try:
        result = create_course(
            code=request.code,
            name=request.name,
            description=request.description,
            credits=request.credits
        )
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{course_id}", response_model=CourseResponse)
async def update_existing_course(
    course_id: int,
    request: UpdateCourseRequest,
    current_user: dict = Depends(require_admin)
):
    """Update course (Admin only)."""
    try:
        result = update_course(
            course_id=course_id,
            code=request.code,
            name=request.name,
            description=request.description,
            credits=request.credits
        )
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_course(
    course_id: int,
    current_user: dict = Depends(require_admin)
):
    """Delete course (Admin only)."""
    try:
        delete_course(course_id)
        return None
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{course_id}/teachers", response_model=dict)
async def assign_teacher_to_course(
    course_id: int,
    request: AssignTeacherRequest,
    current_user: dict = Depends(require_admin)
):
    """Assign teacher to course (Admin only)."""
    try:
        result = assign_teacher(course_id, request.teacher_id)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{course_id}/students", response_model=list[StudentResponse])
async def list_course_students(
    course_id: int,
    current_user: dict = Depends(require_admin_or_teacher)
):
    """List enrolled students."""
    try:
        if current_user.get("role", {}).get("name") == "Teacher":
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    teacher_course_queries.CHECK_TEACHER_ASSIGNED_TO_COURSE,
                    (course_id, current_user["id"])
                )
                if not cursor.fetchone():
                    raise HTTPException(status_code=403, detail="Access denied")

        students = get_course_students(course_id)
        return students
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

