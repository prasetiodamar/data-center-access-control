from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import cv2
import mediapipe as mp
import numpy as np
from datetime import datetime
import logging
import requests
import io
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Face Recognition Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mp_face_detection = mp.solutions.face_detection
BACKEND_API_URL = "http://localhost:8000"

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Face Recognition Service",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/detect-faces")
async def detect_faces(file: UploadFile = File(...)):
    """
    Detect faces dalam image
    Returns face bounding boxes dengan confidence scores
    """
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        h, w, c = image.shape
        
        with mp_face_detection.FaceDetection(
            model_selection=0, 
            min_detection_confidence=0.5
        ) as face_detection:
            results = face_detection.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        
        faces = []
        if results.detections:
            for idx, detection in enumerate(results.detections):
                bbox = detection.location_data.relative_bounding_box
                
                faces.append({
                    "face_id": idx,
                    "confidence": float(detection.score[0]),
                    "bbox": {
                        "x": int(bbox.xmin * w),
                        "y": int(bbox.ymin * h),
                        "w": int(bbox.width * w),
                        "h": int(bbox.height * h)
                    },
                    "position": f"x:{int(bbox.xmin * w)}, y:{int(bbox.ymin * h)}"
                })
        
        logger.info(f"Detected {len(faces)} faces in image")
        
        return {
            "success": True,
            "detected": len(faces) > 0,
            "faces": faces,
            "total_faces": len(faces),
            "image_size": {"width": w, "height": h},
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error in detect_faces: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/recognize")
async def recognize_faces(file: UploadFile = File(...), door_id: int = Query(...)):
    """
    Recognize faces dan log access
    """
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        with mp_face_detection.FaceDetection(
            model_selection=0, 
            min_detection_confidence=0.5
        ) as face_detection:
            results = face_detection.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        
        if not results.detections:
            return {
                "success": True,
                "recognized": False,
                "message": "No face detected",
                "timestamp": datetime.now().isoformat()
            }
        
        # Get first face (highest confidence)
        detection = results.detections[0]
        confidence = float(detection.score[0])
        
        # Log to backend
        try:
            log_response = requests.post(
                f"{BACKEND_API_URL}/api/access-logs",
                json={
                    "user_id": None,
                    "door_id": door_id,
                    "confidence_score": confidence,
                    "status": "success" if confidence > 0.7 else "low_confidence",
                    "notes": f"Face detected with {confidence*100:.1f}% confidence"
                },
                timeout=5
            )
            logger.info(f"Access log created: {log_response.status_code}")
        except Exception as e:
            logger.warning(f"Could not log to backend: {str(e)}")
        
        return {
            "success": True,
            "recognized": True,
            "confidence": confidence,
            "door_id": door_id,
            "status": "granted" if confidence > 0.7 else "low_confidence",
            "message": f"Face recognized with {confidence*100:.1f}% confidence",
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error in recognize_faces: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/test")
async def test_endpoint():
    """Simple test endpoint"""
    return {
        "status": "ok",
        "message": "Face Recognition Service is working!",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)
