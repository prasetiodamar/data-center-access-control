import requests
import json
from pathlib import Path
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8000"
FACE_SERVICE_URL = "http://localhost:8001"
TEST_IMAGE = r"C:\Users\srvr.damar\Downloads\face.jpeg"

print("=" * 60)
print("INTEGRATION TEST: Backend ↔ Face Recognition Service")
print("=" * 60)

# Test 1: Check Backend Health
print("\n1️⃣  Testing Backend API Health...")
try:
    response = requests.get(f"{BACKEND_URL}/")
    print(f"✅ Backend Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"❌ Backend Error: {e}")

# Test 2: Check Face Recognition Service Health
print("\n2️⃣  Testing Face Recognition Service Health...")
try:
    response = requests.get(f"{FACE_SERVICE_URL}/health")
    print(f"✅ Face Service Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"❌ Face Service Error: {e}")

# Test 3: Detect Faces
print("\n3️⃣  Testing Face Detection...")
try:
    with open(TEST_IMAGE, 'rb') as f:
        response = requests.post(
            f"{FACE_SERVICE_URL}/api/detect-faces",
            files={'file': f},
            timeout=10
        )
    result = response.json()
    print(f"✅ Face Detection: {response.status_code}")
    print(f"   Faces Detected: {result['total_faces']}")
    print(f"   Confidence: {result['faces'][0]['confidence']*100:.1f}%" if result['faces'] else "   No faces")
except Exception as e:
    print(f"❌ Face Detection Error: {e}")

# Test 4: Get Users from Backend
print("\n4️⃣  Testing Backend User List...")
try:
    response = requests.get(f"{BACKEND_URL}/api/users")
    if response.status_code == 200:
        users = response.json()
        print(f"✅ Users Retrieved: {response.status_code}")
        print(f"   Total Users: {len(users)}")
        for user in users[:3]:  # Show first 3
            print(f"   - {user.get('username', 'N/A')}: {user.get('email', 'N/A')}")
    else:
        print(f"⚠️  Status: {response.status_code}")
except Exception as e:
    print(f"❌ User List Error: {e}")

# Test 5: Get Doors from Backend
print("\n5️⃣  Testing Backend Door List...")
try:
    response = requests.get(f"{BACKEND_URL}/api/doors")
    if response.status_code == 200:
        doors = response.json()
        print(f"✅ Doors Retrieved: {response.status_code}")
        print(f"   Total Doors: {len(doors)}")
        for door in doors[:3]:  # Show first 3
            print(f"   - Door {door.get('id')}: {door.get('location', 'N/A')}")
    else:
        print(f"⚠️  Status: {response.status_code}")
except Exception as e:
    print(f"❌ Door List Error: {e}")

# Test 6: Recognize Face with Door Integration
print("\n6️⃣  Testing Face Recognition with Door...")
try:
    with open(TEST_IMAGE, 'rb') as f:
        response = requests.post(
            f"{FACE_SERVICE_URL}/api/recognize?door_id=1",
            files={'file': f},
            timeout=10
        )
    result = response.json()
    print(f"✅ Face Recognition: {response.status_code}")
    print(f"   Status: {result.get('status')}")
    print(f"   Confidence: {result.get('confidence', 'N/A')}")
    print(f"   Message: {result.get('message')}")
except Exception as e:
    print(f"❌ Face Recognition Error: {e}")

# Test 7: Create Access Log
print("\n7️⃣  Testing Access Log Creation...")
try:
    log_data = {
        "user_id": None,
        "door_id": 1,
        "confidence_score": 0.92,
        "status": "success",
        "notes": "Face recognition test"
    }
    response = requests.post(
        f"{BACKEND_URL}/api/access-logs",
        json=log_data
    )
    print(f"✅ Access Log: {response.status_code}")
    if response.status_code in [200, 201]:
        print(f"   Log Created Successfully")
    else:
        print(f"   Response: {response.json()}")
except Exception as e:
    print(f"❌ Access Log Error: {e}")

# Test 8: Get Access Logs
print("\n8️⃣  Testing Access Log Retrieval...")
try:
    response = requests.get(f"{BACKEND_URL}/api/access-logs")
    if response.status_code == 200:
        logs = response.json()
        print(f"✅ Access Logs Retrieved: {response.status_code}")
        print(f"   Total Logs: {len(logs)}")
        if logs:
            latest = logs[-1]  # Last log
            print(f"   Latest: Door {latest.get('door_id')}, Status: {latest.get('status')}")
    else:
        print(f"⚠️  Status: {response.status_code}")
except Exception as e:
    print(f"❌ Access Log Retrieval Error: {e}")

print("\n" + "=" * 60)
print("✅ INTEGRATION TEST COMPLETE")
print("=" * 60)
