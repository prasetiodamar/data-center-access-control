from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database - using postgres superuser dengan password yang simple
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"
    
    # API
    API_TITLE: str = "Data Center Access Control API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Face Recognition Based Access Control System"
    
    # Face Recognition
    FACE_RECOGNITION_HOST: str = "http://localhost:8001"
    FACE_MATCH_THRESHOLD: float = 0.6
    
    # CORS
    ALLOWED_ORIGINS: list = ["*"]

settings = Settings()
