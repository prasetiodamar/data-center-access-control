import requests

print("\n🚀 QUICK INTEGRATION TEST\n")

tests = {
    "Backend Health": ("GET", "http://localhost:8000/"),
    "Face Service Health": ("GET", "http://localhost:8001/health"),
}

for name, (method, url) in tests.items():
    try:
        if method == "GET":
            r = requests.get(url, timeout=5)
        print(f"✅ {name}: {r.status_code}")
    except Exception as e:
        print(f"❌ {name}: {str(e)[:50]}")

print("\n📸 Testing Face Detection...\n")

try:
    with open(r"C:\Users\srvr.damar\Downloads\face.jpeg", 'rb') as f:
        r = requests.post("http://localhost:8001/api/detect-faces", files={'file': f}, timeout=30)
    result = r.json()
    print(f"✅ Face Detection: {r.status_code}")
    print(f"   Faces Found: {result['total_faces']}")
    if result['faces']:
        print(f"   Confidence: {result['faces'][0]['confidence']*100:.1f}%")
except Exception as e:
    print(f"❌ Face Detection Failed: {e}")

print("\n✅ QUICK TEST COMPLETE!\n")
