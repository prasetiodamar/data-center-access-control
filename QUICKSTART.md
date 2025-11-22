# 🚀 Quick Start Guide

Panduan cepat untuk setup dan menjalankan aplikasi dalam **5 menit**.

---

## ⚡ 5-Minute Quick Start

### Prerequisites (5 min setup)
- Python 3.9+
- Node.js 16+
- PostgreSQL 12+

### Step 1: Clone & Navigate (1 min)

```bash
git clone https://github.com/prasetiodamar/data-center-access-control.git
cd data-center-access-control
```

### Step 2: Backend Setup (2 min)

**Terminal 1:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate.bat  # Windows
pip install -r requirements.txt
python main.py
```

**Expected:** `Uvicorn running on http://0.0.0.0:8000`

### Step 3: Face Service (1 min)

**Terminal 2:**
```bash
cd backend/face_recognition_service
python main.py
```

**Expected:** `Uvicorn running on http://0.0.0.0:8001`

### Step 4: Frontend (1 min)

**Terminal 3:**
```bash
cd frontend
npm install
npm start
```

**Expected:** Browser opens `http://localhost:3000`

---

## ✅ Verify Everything Works

### Quick Test

**Terminal 4:**
```bash
cd backend
venv\Scripts\activate.bat
python quick_test.py
```

**Expected Output:**
```
✅ Backend Health: 200
✅ Face Service Health: 200
✅ Face Detection: 200
   Faces Found: 1
   Confidence: 92.1%
```

---

## 🌐 Access Points

| Service | URL |
|---------|-----|
| **Dashboard** | http://localhost:3000 |
| **API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |
| **Face Service** | http://localhost:8001 |

---

## 🚫 Common Issues & Fixes

### "ModuleNotFoundError"
```bash
cd backend
venv\Scripts\activate.bat
pip install -r requirements.txt
```

### "Connection refused on 8001"
Make sure Terminal 2 is running face service

### "CORS error"
Restart frontend:
```bash
npm start
```

---

## 📝 Next Steps

1. ✅ Read full **README.md**
2. ✅ Check **DEPLOYMENT.md** for cloud setup
3. ✅ Review **API.md** for endpoints
4. ✅ Prepare for CCTV integration (when ready)

---

**Need help?** Check troubleshooting in main README.md
