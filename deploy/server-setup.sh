#!/bin/bash

# Server setup script for Hetzner deployment
# Run this script on your Hetzner server as root

set -e

echo "🚀 Setting up Hetzner server for Personal Life Management System..."

# Update system
apt update && apt upgrade -y

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $SUDO_USER
    rm get-docker.sh
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Install Git
if ! command -v git &> /dev/null; then
    echo "Installing Git..."
    apt install -y git
fi

# Install useful tools
apt install -y curl wget htop ufw

# Setup firewall
echo "Configuring firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Create deployment directory
echo "Creating deployment directory..."
mkdir -p /opt/personal-life-management
cd /opt/personal-life-management

# Clone repository (you'll need to set this up)
echo "Repository clone will need to be done manually:"
echo "git clone YOUR_REPO_URL ."

# Create .env file
echo "Creating environment file..."
cat > .env << 'EOF'
# Production Environment Variables
DB_NAME=personal_life_management
DB_USER=postgres
DB_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
JWT_SECRET=CHANGE_THIS_TO_A_VERY_LONG_RANDOM_STRING
CORS_ORIGIN=https://YOUR_DOMAIN.com
EOF

# Set proper permissions
chmod 600 .env

# Create systemd service for auto-restart
cat > /etc/systemd/system/personal-life-mgmt.service << 'EOF'
[Unit]
Description=Personal Life Management System
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/personal-life-management
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl enable personal-life-mgmt.service

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your GitHub repository and add deployment keys"
echo "2. Configure GitHub Secrets:"
echo "   - HETZNER_HOST: Your server IP"
echo "   - HETZNER_USER: SSH user (usually root)"
echo "   - HETZNER_SSH_KEY: Your private SSH key"
echo "3. Edit /opt/personal-life-management/.env with your actual values"
echo "4. Clone your repository to /opt/personal-life-management"
echo "5. Run: systemctl start personal-life-mgmt"
echo ""
echo "🔧 Manual steps required - see deployment instructions!"