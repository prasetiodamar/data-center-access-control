from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Door
from schemas import DoorCreate, DoorUpdate, DoorResponse
from typing import List

router = APIRouter(
    prefix="/api/doors",
    tags=["doors"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=DoorResponse, status_code=status.HTTP_201_CREATED)
def create_door(door: DoorCreate, db: Session = Depends(get_db)):
    existing = db.query(Door).filter(Door.device_id == door.device_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device ID already registered"
        )
    
    new_door = Door(**door.dict())
    db.add(new_door)
    db.commit()
    db.refresh(new_door)
    return new_door


@router.get("/", response_model=List[DoorResponse])
def get_all_doors(db: Session = Depends(get_db)):
    return db.query(Door).all()


@router.get("/{door_id}", response_model=DoorResponse)
def get_door(door_id: int, db: Session = Depends(get_db)):
    door = db.query(Door).filter(Door.id == door_id).first()
    if not door:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Door not found"
        )
    return door


@router.put("/{door_id}", response_model=DoorResponse)
def update_door(door_id: int, door_data: DoorUpdate, db: Session = Depends(get_db)):
    door = db.query(Door).filter(Door.id == door_id).first()
    if not door:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Door not found"
        )
    
    for key, value in door_data.dict(exclude_unset=True).items():
        setattr(door, key, value)
    
    db.commit()
    db.refresh(door)
    return door


@router.delete("/{door_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_door(door_id: int, db: Session = Depends(get_db)):
    door = db.query(Door).filter(Door.id == door_id).first()
    if not door:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Door not found"
        )
    
    door.status = False
    db.commit()
    return {"message": "Door deactivated"}
