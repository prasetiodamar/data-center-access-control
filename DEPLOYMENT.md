# 🚀 Deployment Guide

Complete guide untuk deploy aplikasi ke production menggunakan Docker dan cloud services.

---

## 📋 Deployment Options

| Option | Difficulty | Cost | Speed | Best For |
|--------|-----------|------|-------|----------|
| **Docker Local** | Easy | Free | 5 min | Development |
| **Docker Compose** | Easy | Free | 10 min | Testing |
| **AWS EC2** | Medium | ~$5-20/mo | 30 min | Production |
| **Heroku** | Easy | Free-$7/mo | 20 min | Quick deploy |
| **DigitalOcean** | Medium | ~$5-20/mo | 30 min | Best value |

---

## 🐳 Option 1: Docker Compose (Local/Testing)

### Quick Start

```bash
# From project root
docker-compose up -d
```

Ini akan start:
- PostgreSQL (port 5432)
- Backend (port 8000)
- Face Service (port 8001)
- Frontend (port 3000)

### Check Status

```bash
docker-compose ps
```

### View Logs

```bash
docker-compose logs -f backend
```

### Stop Services

```bash
docker-compose down
```

---

## 🌐 Option 2: AWS EC2 (Production)

### Prerequisites
- AWS account
- Basic Linux knowledge
- SSH client (PuTTY or OpenSSH)

### Step 1: Launch EC2 Instance

1. Go to AWS EC2 Dashboard
2. Click "Launch Instance"
3. **AMI:** Select Ubuntu 20.04 LTS
4. **Instance Type:** t3.medium (minimum)
5. **Storage:** 30GB (General Purpose SSD)
6. **Security Group:**
   - Inbound: HTTP (80), HTTPS (443), SSH (22)
   - Outbound: All traffic

### Step 2: Connect via SSH

```bash
# Download .pem file from AWS
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 4: Clone Repository

```bash
git clone https://github.com/prasetiodamar/data-center-access-control.git
cd data-center-access-control
```

### Step 5: Setup Environment

```bash
# Create .env file
nano .env
```

Add:
```
DATABASE_URL=postgresql://postgres:your-strong-password@localhost:5432/access_control
FACE_RECOGNITION_URL=http://localhost:8001
SECRET_KEY=your-very-strong-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
```

### Step 6: Deploy with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Step 7: Setup SSL (HTTPS)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Configure Nginx (if using proxy)
```

### Step 8: Access Application

```
https://your-domain.com
```

---

## 💙 Option 3: DigitalOcean (Recommended Value)

### Step 1: Create Droplet

1. Go to DigitalOcean Dashboard
2. Create Droplet
3. **Image:** Ubuntu 20.04 LTS
4. **Size:** $5/month Basic (1GB RAM, 25GB SSD)
5. **Region:** Closest to you
6. **Add SSH key**

### Step 2: SSH Access

```bash
ssh root@your-droplet-ip
```

### Step 3: Install Docker

Same as AWS steps above

### Step 4: Deploy

```bash
git clone https://github.com/prasetiodamar/data-center-access-control.git
cd data-center-access-control
nano .env  # Setup environment
docker-compose -f docker-compose.prod.yml up -d
```

### Step 5: Setup Domain (Optional)

1. Point your domain DNS to DigitalOcean
2. Add domain in DigitalOcean dashboard
3. Setup SSL with Let's Encrypt

---

## 🟣 Option 4: Heroku (Fastest)

### Prerequisites
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli
```

### Step 1: Create Heroku Account & App

```bash
heroku login
heroku create your-app-name
```

### Step 2: Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### Step 3: Deploy

```bash
# Add Procfile in project root
echo "web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile

# Deploy
git push heroku main
```

### Step 4: Access

```
https://your-app-name.herokuapp.com
```

---

## 📊 Production Checklist

Before going live:

### Security
- [ ] SSL/HTTPS enabled
- [ ] Environment variables configured
- [ ] Database backups setup
- [ ] Secret keys changed
- [ ] CORS configured
- [ ] Rate limiting enabled

### Performance
- [ ] Database indexes created
- [ ] Caching configured
- [ ] CDN setup (optional)
- [ ] Load balancing (if needed)
- [ ] Monitoring enabled

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Log aggregation
- [ ] Uptime monitoring
- [ ] Alert notifications

### Backup & Recovery
- [ ] Database backups (daily)
- [ ] Code version control
- [ ] Recovery plan documented
- [ ] Disaster recovery tested

---

## 🔄 Continuous Deployment

### GitHub Actions (Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EC2
        env:
          SSH_KEY: ${{ secrets.SSH_KEY }}
          HOST: ${{ secrets.HOST }}
          USER: ${{ secrets.USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh -o StrictHostKeyChecking=no $USER@$HOST 'cd app && git pull && docker-compose restart'
```

---

## 📈 Scaling Considerations

### Horizontal Scaling (Multiple Servers)

```
Load Balancer (Nginx)
    ↓
┌─────────────────────────────┐
│   Backend Server 1          │
│   Backend Server 2          │
│   Backend Server 3          │
└─────────────────────────────┘
    ↓
Shared PostgreSQL Database
```

### Vertical Scaling (Bigger Server)

- Upgrade RAM: 2GB → 8GB → 32GB
- Upgrade CPU: 1 core → 4 cores → 16 cores
- Upgrade Storage: SSD upgrade

---

## 🔧 Production Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# Security
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Services
FACE_RECOGNITION_URL=http://face-service:8001
BACKEND_URL=https://api.yourdomain.com

# Optional
SENTRY_DSN=your-sentry-dsn
EMAIL_BACKEND=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

## 📊 Monitoring & Maintenance

### Log Aggregation

```bash
# View logs
docker-compose logs -f backend

# Export logs
docker-compose logs backend > backend.log
```

### Database Maintenance

```bash
# Backup
pg_dump -U postgres access_control > backup.sql

# Restore
psql -U postgres access_control < backup.sql
```

### Performance Monitoring

Tools to monitor:
- New Relic
- DataDog
- Prometheus + Grafana
- CloudWatch (AWS)

---

## 🆘 Production Troubleshooting

### Application Down

1. Check Docker status: `docker ps -a`
2. View logs: `docker-compose logs backend`
3. Restart: `docker-compose restart`
4. Check database: `docker-compose logs postgres`

### High Memory Usage

```bash
# View memory usage
docker stats

# Clear cache
docker system prune
```

### Database Connection Issues

```bash
# Test connection
docker-compose exec postgres psql -U postgres -d access_control

# Check connection
select version();
```

---

## 📞 Support

For deployment issues:

1. Check logs: `docker-compose logs`
2. Test connectivity: `curl http://localhost:8000/docs`
3. Verify environment: `cat .env`
4. Review documentation
5. Create GitHub issue with error details

---

**Last Updated:** November 22, 2025
