import requests
from pathlib import Path

# Path ke image
image_path = r"C:\Users\srvr.damar\Downloads\face.jpeg"

# Verify file exists
if not Path(image_path).exists():
    print(f"❌ File not found: {image_path}")
    exit(1)

print(f"✅ Found image: {image_path}")
print(f"   Size: {Path(image_path).stat().st_size} bytes")

# Test detect faces
print("\n🔍 Testing detect-faces endpoint...")
try:
    with open(image_path, 'rb') as f:
        response = requests.post(
            'http://localhost:8001/api/detect-faces',
            files={'file': f}
        )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test recognize
print("\n👤 Testing recognize endpoint...")
try:
    with open(image_path, 'rb') as f:
        response = requests.post(
            'http://localhost:8001/api/recognize?door_id=1',
            files={'file': f}
        )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"❌ Error: {e}")
