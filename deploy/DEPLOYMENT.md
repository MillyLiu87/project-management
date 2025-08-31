# Deployment Guide for Hetzner Server

This guide will help you deploy the Personal Life Management System to a Hetzner server using CI/CD.

## Prerequisites

- Hetzner Cloud server (Ubuntu 20.04+ recommended)
- GitHub repository
- Domain name (optional but recommended)

## 1. Server Setup

### Initial Server Setup

1. **Create a Hetzner server**:
   - Choose Ubuntu 20.04+
   - At least 2GB RAM, 1 CPU
   - Add your SSH key during creation

2. **Run the setup script on your server**:
   ```bash
   wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy/server-setup.sh
   chmod +x server-setup.sh
   sudo ./server-setup.sh
   ```

3. **Clone your repository**:
   ```bash
   cd /opt/personal-life-management
   sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
   ```

4. **Configure environment variables**:
   ```bash
   sudo nano /opt/personal-life-management/.env
   ```
   
   Update with your values:
   ```env
   DB_NAME=personal_life_management
   DB_USER=postgres
   DB_PASSWORD=your_secure_password_here
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
   CORS_ORIGIN=https://yourdomain.com
   ```

## 2. GitHub Repository Setup

### Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

- `HETZNER_HOST`: Your server's IP address
- `HETZNER_USER`: SSH username (usually `root`)
- `HETZNER_SSH_KEY`: Your private SSH key content

### Generate SSH Key (if needed)

On your local machine:
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Add the public key to your server:
```bash
ssh-copy-id root@YOUR_SERVER_IP
```

Copy the private key content to the `HETZNER_SSH_KEY` secret.

## 3. Domain Setup (Optional)

### Configure DNS
Point your domain to your server's IP:
- A record: `@` → `YOUR_SERVER_IP`
- A record: `www` → `YOUR_SERVER_IP`

### SSL Certificate (Recommended)
Install Certbot for free SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Update Nginx Configuration
Create `/etc/nginx/sites-available/personal-life-mgmt`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/personal-life-mgmt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Deploy

### First Deployment
1. Push your code to the main branch
2. GitHub Actions will automatically build and deploy
3. Monitor the deployment in the Actions tab

### Manual Deployment (if needed)
On your server:
```bash
cd /opt/personal-life-management
sudo docker-compose down
sudo docker-compose pull
sudo docker-compose up -d
```

## 5. Monitoring & Maintenance

### Check Service Status
```bash
sudo docker-compose ps
sudo docker-compose logs -f
```

### Database Backup
```bash
sudo docker-compose exec postgres pg_dump -U postgres personal_life_management > backup.sql
```

### Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo docker system prune -f
```

## Troubleshooting

### Common Issues

1. **Port 80/443 already in use**:
   ```bash
   sudo systemctl stop nginx
   sudo systemctl stop apache2
   ```

2. **Permission denied**:
   ```bash
   sudo chown -R $USER:$USER /opt/personal-life-management
   ```

3. **Database connection issues**:
   - Check if PostgreSQL container is running
   - Verify environment variables
   - Check container logs

4. **GitHub Actions failing**:
   - Verify all secrets are set correctly
   - Check if SSH key has proper permissions
   - Ensure server has enough disk space

### Health Checks

The application includes health check endpoints:
- Backend: `http://localhost:3001/api/health`
- Frontend: `http://localhost:80`

### Logs

View logs for debugging:
```bash
sudo docker-compose logs backend
sudo docker-compose logs frontend
sudo docker-compose logs postgres
```

## Security Considerations

1. **Firewall**: Only expose necessary ports (80, 443, 22)
2. **SSH**: Use key-based authentication, disable password auth
3. **Updates**: Keep system and Docker images updated
4. **Secrets**: Use strong passwords and rotate them regularly
5. **SSL**: Always use HTTPS in production

## Performance Optimization

1. **Docker**: Use multi-stage builds to reduce image size
2. **Database**: Configure PostgreSQL for production use
3. **Nginx**: Enable gzip compression and caching
4. **Monitoring**: Set up monitoring with tools like Grafana/Prometheus