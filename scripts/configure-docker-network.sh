#!/bin/bash
# Configure Docker daemon for optimal network binding performance

echo "Configuring Docker daemon networking..."

# Create or update Docker daemon config
cat > /tmp/docker-daemon.json << 'EOF'
{
  "debug": false,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "bridge": "none",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 65536,
      "Soft": 65536
    },
    "nproc": {
      "Name": "nproc",
      "Hard": 65535,
      "Soft": 65535
    }
  },
  "ip-forward": true,
  "ip-masq": true,
  "iptables": true,
  "userland-proxy": true,
  "live-restore": true
}
EOF

# Copy to Docker config directory
sudo mkdir -p /etc/docker
sudo cp /tmp/docker-daemon.json /etc/docker/daemon.json
sudo chown root:root /etc/docker/daemon.json
sudo chmod 644 /etc/docker/daemon.json

echo "Docker daemon config updated"

# Reload Docker daemon
echo "Reloading Docker daemon..."
sudo systemctl daemon-reload
sudo systemctl restart docker

# Wait for Docker to be ready
echo "Waiting for Docker to be ready..."
sleep 10

# Check Docker status
if docker ps > /dev/null 2>&1; then
  echo "✅ Docker is ready"
else
  echo "❌ Docker failed to start"
  exit 1
fi

# Cleanup old networks and containers
echo "Cleaning up stale containers and networks..."
docker container prune -f
docker network prune -f

echo "✅ Docker network configuration complete"
