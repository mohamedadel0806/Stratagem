# Stratagem Deployment Plan

## Overview

This document outlines the complete deployment plan for the Stratagem GRC Platform to a remote server using Docker, Docker Compose, and Caddy web server.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Internet Users                         │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Caddy Web Server (Port 80/443)              │
│              - Automatic HTTPS                           │
│              - Reverse Proxy                             │
│              - Security Headers                          │
└─────┬──────────────┬──────────────┬─────────────────────┘
      │              │              │
      ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Frontend │   │   Kong   │   │ Keycloak │
│  :3000   │   │  :8000   │   │  :8080   │
└────┬─────┘   └────┬─────┘   └──────────┘
     │             │
     │             ├──► Backend API (:3001)
     │             └──► AI Service (:8000)
     │
     └──► All services on Docker network (grc-network)
```

## Deployment Components

### 1. Local Build & Package (`scripts/deploy.sh`)
- Builds production Docker images
- Saves images as compressed tar.gz files
- Packages configuration files
- Creates deployment manifest

### 2. Server Setup (`scripts/deploy-server.sh`)
- Loads Docker images
- Creates Docker volumes for data persistence
- Sets up configuration files
- Creates systemd service for auto-start

### 3. Caddy Configuration (`infrastructure/caddy/Caddyfile`)
- Reverse proxy configuration
- Automatic HTTPS/SSL
- Security headers
- Route management

### 4. Production Docker Compose (`docker-compose.prod.yml`)
- Production-optimized configuration
- Port restrictions (localhost only)
- Environment variable management
- Health checks

## Data Persistence Strategy

### Docker Volumes
All persistent data is stored in Docker volumes:
- `postgres_data_prod` - PostgreSQL database
- `mongodb_data_prod` - MongoDB documents
- `neo4j_data_prod` - Neo4j graph database
- `redis_data_prod` - Redis cache
- `elasticsearch_data_prod` - Elasticsearch indices
- `prometheus_data` - Prometheus metrics
- `grafana_data` - Grafana dashboards

### Backup Strategy
- Automated backup script: `scripts/backup-volumes.sh`
- Manual backup: Run script before updates
- Restore script: `scripts/restore-volumes.sh`
- Backup location: `/opt/stratagem/backups/`

## Security Considerations

### Network Security
- All services bind to `127.0.0.1` (localhost only)
- Caddy handles external access
- Firewall should only allow ports 22, 80, 443

### Authentication & Secrets
- Strong passwords required for all databases
- JWT and session secrets generated with OpenSSL
- Environment variables stored in `.env` (not in version control)
- Keycloak for user authentication

### Access Control
- Admin endpoints (Kong, Prometheus, Grafana) restricted to localhost
- Caddy can be configured for IP whitelisting
- Database ports not exposed externally

## Deployment Workflow

### Initial Deployment
1. **Local**: Build and package (`./scripts/deploy.sh`)
2. **Local**: Configure `.env` file
3. **Transfer**: SCP deployment package to server
4. **Server**: Run setup script (`./scripts/deploy-server.sh`)
5. **Server**: Configure Caddy
6. **Server**: Start services

### Updates
1. **Local**: Build new images
2. **Server**: Backup volumes
3. **Transfer**: New images to server
4. **Server**: Load new images
5. **Server**: Restart services

### Rollback
1. **Server**: Stop services
2. **Server**: Restore volumes from backup
3. **Server**: Load previous images
4. **Server**: Start services

## Monitoring & Maintenance

### Health Checks
- All services have Docker health checks
- Prometheus for metrics collection
- Grafana for visualization
- Log aggregation via Docker Compose

### Log Management
- Application logs: `docker-compose logs`
- Caddy logs: `/var/log/caddy/stratagem.log`
- System logs: `journalctl`

### Resource Monitoring
- `docker stats` for container resources
- Prometheus for application metrics
- System monitoring via server tools

## File Structure

```
/opt/stratagem/                    # Application root
├── docker-compose.yml            # Base configuration
├── docker-compose.prod.yml       # Production overrides
├── .env                          # Environment variables (not in git)
├── infrastructure/               # Infrastructure configs
│   ├── postgres/
│   ├── mongodb/
│   ├── neo4j/
│   ├── redis/
│   ├── elasticsearch/
│   ├── kong/
│   └── caddy/
├── scripts/                      # Deployment scripts
│   ├── deploy-server.sh
│   ├── load-images.sh
│   ├── backup-volumes.sh
│   └── restore-volumes.sh
├── data/                         # Application data (if needed)
├── logs/                         # Application logs
└── backups/                      # Volume backups
```

## Environment Variables

Key environment variables required:
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `JWT_SECRET` - JWT signing secret
- `POSTGRES_PASSWORD` - PostgreSQL password
- `MONGO_ROOT_PASSWORD` - MongoDB root password
- `NEO4J_PASSWORD` - Neo4j password
- `REDIS_PASSWORD` - Redis password
- `ELASTIC_PASSWORD` - Elasticsearch password
- `FRONTEND_URL` - Public frontend URL
- `NEXT_PUBLIC_API_URL` - Public API URL

## Performance Considerations

### Resource Requirements
- Minimum: 8GB RAM, 4 CPU cores
- Recommended: 16GB RAM, 8 CPU cores
- Disk: 50GB+ for data volumes

### Optimization
- Database connection pooling
- Redis caching
- Elasticsearch indexing
- CDN for static assets (optional)

## Disaster Recovery

### Backup Schedule
- Daily automated backups recommended
- Before any major update
- Weekly full system backup

### Recovery Procedures
1. Stop all services
2. Restore volumes from backup
3. Load Docker images
4. Start services
5. Verify functionality

## Support & Documentation

- **Full Deployment Guide**: `docs/DEPLOYMENT.md`
- **Quick Start**: `docs/DEPLOYMENT_QUICK_START.md`
- **Docker Configuration**: `docs/DOCKER_CONFIGURATION.md`

## Next Steps

1. Review and customize `.env` template
2. Test deployment on staging server
3. Set up monitoring and alerts
4. Configure automated backups
5. Document server-specific procedures
6. Train team on deployment process

## Checklist

### Pre-Deployment
- [ ] Server meets requirements
- [ ] Docker and Docker Compose installed
- [ ] Caddy installed and configured
- [ ] Domain DNS configured
- [ ] Firewall configured
- [ ] SSH access verified

### Deployment
- [ ] Images built and packaged
- [ ] Environment variables configured
- [ ] Files transferred to server
- [ ] Server setup script executed
- [ ] Caddy configured
- [ ] Services started
- [ ] Health checks passing

### Post-Deployment
- [ ] Application accessible via domain
- [ ] SSL certificate working
- [ ] All services running
- [ ] Logs reviewed
- [ ] Backup tested
- [ ] Monitoring configured
- [ ] Documentation updated











