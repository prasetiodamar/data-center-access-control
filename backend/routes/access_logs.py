from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db
from models import AccessLog, User, Door
from schemas import AccessLogCreate, AccessLogResponse
from datetime import datetime, timedelta
from typing import List

router = APIRouter(
    prefix="/api/access-logs",
    tags=["access_logs"],
)

@router.post("/", response_model=AccessLogResponse, status_code=status.HTTP_201_CREATED)
def create_access_log(log: AccessLogCreate, db: Session = Depends(get_db)):
    door = db.query(Door).filter(Door.id == log.door_id).first()
    if not door:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Door not found"
        )
    
    if log.user_id:
        user = db.query(User).filter(User.id == log.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
    
    new_log = AccessLog(**log.dict())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.get("/", response_model=List[AccessLogResponse])
def get_access_logs(
    user_id: int = Query(None),
    door_id: int = Query(None),
    days: int = Query(7, description="Last N days"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(AccessLog)
    
    date_from = datetime.utcnow() - timedelta(days=days)
    query = query.filter(AccessLog.timestamp >= date_from)
    
    if user_id:
        query = query.filter(AccessLog.user_id == user_id)
    
    if door_id:
        query = query.filter(AccessLog.door_id == door_id)
    
    logs = query.order_by(desc(AccessLog.timestamp)).offset(skip).limit(limit).all()
    return logs


@router.get("/today", response_model=List[AccessLogResponse])
def get_today_logs(db: Session = Depends(get_db)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    logs = db.query(AccessLog).filter(
        AccessLog.timestamp >= today
    ).order_by(desc(AccessLog.timestamp)).all()
    return logs


@router.get("/{log_id}", response_model=AccessLogResponse)
def get_access_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(AccessLog).filter(AccessLog.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Access log not found"
        )
    return log
