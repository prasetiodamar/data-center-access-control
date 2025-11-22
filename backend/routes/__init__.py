from fastapi import APIRouter
from . import users, doors, access_logs

router = APIRouter()

router.include_router(users.router)
router.include_router(doors.router)
router.include_router(access_logs.router)
