# Quick Deployment Setup Guide

## Required GitHub Secrets

Add these to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `HETZNER_HOST` | Your Hetzner server IP | `123.456.789.012` |
| `HETZNER_USER` | SSH username | `root` |
| `HETZNER_SSH_KEY` | Private SSH key content | Copy your private key |

## Required Server Environment Variables

Copy `.env.production` to `.env` on your server and update these values:

```bash
# On your server: /opt/personal-life-management/.env
DB_NAME=personal_life_management
DB_USER=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_MAKE_IT_VERY_LONG_AND_RANDOM
CORS_ORIGIN=https://yourdomain.com
```

## Quick Server Setup Commands

1. **Run setup script on your Hetzner server:**
   ```bash
   # Run as root
   curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy/server-setup.sh | bash
   ```

2. **Clone repository:**
   ```bash
   cd /opt/personal-life-management
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
   ```

3. **Configure environment:**
   ```bash
   cp .env.production .env
   nano .env  # Edit with your values
   ```

4. **Test deployment:**
   ```bash
   docker-compose up -d
   ```

## Deployment Triggers

- **Automatic**: Push to `main` branch triggers deployment
- **Manual**: Go to Actions tab → "Deploy to Hetzner" → "Run workflow"

## Health Check URLs

- Backend: `http://YOUR_SERVER_IP:3001/health`
- Frontend: `http://YOUR_SERVER_IP/`

## Next Steps After Setup

1. Configure domain and SSL (see full deployment guide)
2. Set up monitoring and backups
3. Configure firewall rules
4. Test the complete deployment pipeline