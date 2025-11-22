from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    name: str
    email: str
    employee_id: Optional[str] = None
    status: bool = True

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    status: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DoorBase(BaseModel):
    name: str
    location: Optional[str] = None
    device_id: str
    camera_url: Optional[str] = None
    status: bool = True

class DoorCreate(DoorBase):
    pass

class DoorUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    camera_url: Optional[str] = None
    status: Optional[bool] = None

class DoorResponse(DoorBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AccessLogBase(BaseModel):
    user_id: Optional[int] = None
    door_id: int
    status: str = "success"
    confidence_score: Optional[float] = None
    notes: Optional[str] = None

class AccessLogCreate(AccessLogBase):
    pass

class AccessLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    door_id: int
    timestamp: datetime
    status: str
    confidence_score: Optional[float] = None
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True
