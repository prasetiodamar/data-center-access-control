from database import Base
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    employee_id = Column(String(50), unique=True, nullable=True)
    status = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    face_embeddings = relationship("FaceEmbedding", back_populates="user")
    access_logs = relationship("AccessLog", back_populates="user")


class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    embedding = Column(Text, nullable=False)
    photo_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="face_embeddings")


class Door(Base):
    __tablename__ = "doors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(255), nullable=True)
    device_id = Column(String(50), unique=True, nullable=False)
    camera_url = Column(String(255), nullable=True)
    status = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    access_logs = relationship("AccessLog", back_populates="door")


class AccessLog(Base):
    __tablename__ = "access_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    door_id = Column(Integer, ForeignKey("doors.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="success")
    confidence_score = Column(Float, nullable=True)
    photo_filename = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="access_logs")
    door = relationship("Door", back_populates="access_logs")
