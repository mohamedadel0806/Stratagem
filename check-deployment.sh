#!/bin/bash

# Deployment Diagnostic Script for Stratagem GRC Platform
# Run this on the server to check deployment status

set -e

echo "🔍 Stratagem Deployment Diagnostic"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found. Are you in /opt/stratagem?"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo ""

# Check Docker and Docker Compose
echo "🐳 Docker Status:"
docker --version
docker compose version
echo ""

# Check service status
echo "📊 Service Status:"
docker compose -f docker-compose.prod.yml ps
echo ""

# Check container health
echo "🏥 Container Health:"
docker compose -f docker-compose.prod.yml exec -T backend curl -f http://localhost:3001/health/ready 2>/dev/null && echo "✅ Backend health check passed" || echo "❌ Backend health check failed"

# Check if services are listening on expected ports
echo ""
echo "🔌 Port Listening Status:"
netstat -tlnp | grep -E ":(3001|3002|8001|8081)" || echo "No services listening on expected ports"
echo ""

# Check Caddy status
echo "🌐 Caddy Status:"
sudo systemctl status caddy --no-pager -l | head -20
echo ""

# Check Caddy configuration
echo "⚙️  Caddy Configuration Test:"
sudo caddy validate --config /etc/caddy/Caddyfile && echo "✅ Caddy configuration is valid" || echo "❌ Caddy configuration is invalid"
echo ""

# Check recent logs for errors
echo "📝 Recent Backend Logs (last 20 lines):"
docker compose -f docker-compose.prod.yml logs --tail 20 backend
echo ""

echo "📝 Recent Frontend Logs (last 20 lines):"
docker compose -f docker-compose.prod.yml logs --tail 20 frontend
echo ""

# Test API endpoints
echo "🔗 API Endpoint Tests:"
echo "Testing https://grc-staging.newmehub.com/api/health/ready"
curl -k -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://grc-staging.newmehub.com/api/health/ready || echo "❌ API health check failed"
echo ""

echo "Testing https://grc-staging.newmehub.com/api/dashboard/overview"
curl -k -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://grc-staging.newmehub.com/api/dashboard/overview || echo "❌ Dashboard API failed"
echo ""

# Check environment variables
echo "🔧 Environment Variables Check:"
if [ -f .env ]; then
    echo "✅ .env file exists"
    grep -E "^(NEXT_PUBLIC_API_URL|FRONTEND_URL|DATABASE_URL)" .env | sed 's/=.*/=***hidden***/' || echo "Some required env vars may be missing"
else
    echo "❌ .env file not found"
fi
echo ""

# Check disk space
echo "💾 Disk Space:"
df -h /opt/stratagem
echo ""

# Check Docker disk usage
echo "🐳 Docker Disk Usage:"
docker system df
echo ""

echo "🎯 Quick Diagnosis:"
echo "=================="

# Check if backend is running
if docker compose -f docker-compose.prod.yml ps backend | grep -q "Up"; then
    echo "✅ Backend service is running"
else
    echo "❌ Backend service is NOT running"
fi

# Check if frontend is running
if docker compose -f docker-compose.prod.yml ps frontend | grep -q "Up"; then
    echo "✅ Frontend service is running"
else
    echo "❌ Frontend service is NOT running"
fi

# Check Caddy
if sudo systemctl is-active --quiet caddy; then
    echo "✅ Caddy service is running"
else
    echo "❌ Caddy service is NOT running"
fi

echo ""
echo "💡 Next Steps:"
echo "=============="
echo "If services are not running:"
echo "  docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "If Caddy is not running:"
echo "  sudo systemctl start caddy"
echo ""
echo "Check full logs:"
echo "  docker compose -f docker-compose.prod.yml logs -f backend"
echo ""
echo "Restart all services:"
echo "  docker compose -f docker-compose.prod.yml restart"</content>
<parameter name="filePath">/Users/adelsayed/Documents/Code/Stratagem/check-deployment.sh