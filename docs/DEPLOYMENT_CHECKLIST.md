# Deployment Checklist & Best Practices

## Pre-Deployment Checklist
- [ ] Code tested locally (`npm test`, integration tests pass)
- [ ] Database migrations tested locally
- [ ] Environment variables updated in `.env`
- [ ] Dependencies updated (`npm audit`, security patches)
- [ ] Documentation updated for any API changes
- [ ] Backup created (`./scripts/export-database.sh`)

## Deployment Steps
- [ ] Run `./scripts/deploy-update.sh` (includes validation)
- [ ] Monitor deployment logs for errors
- [ ] Check validation results (automated)
- [ ] Test critical user flows in browser
- [ ] Verify monitoring dashboards (Grafana)

## Post-Deployment Validation
- [ ] Frontend loads: `https://grc-staging.newmehub.com`
- [ ] API health: `https://grc-staging.newmehub.com/api/health/ready`
- [ ] Authentication works (login/logout)
- [ ] Database connectivity confirmed
- [ ] All services running: `docker compose ps`
- [ ] No critical errors in logs

## Rollback Plan
- [ ] Database backup available
- [ ] Previous Docker images tagged
- [ ] Rollback script ready: `./scripts/deploy-rollback.sh`

## Monitoring & Alerts
- [ ] Set up alerts for:
  - Service downtime (>5 minutes)
  - High error rates (>5%)
  - Database connection issues
  - Disk space <10% available

## Common Issues & Fixes

### Database Schema Issues
**Symptoms:** Backend logs show column errors
**Fix:** `./scripts/fix-database-schema.sh && docker compose restart backend`

### Proxy Routing Issues
**Symptoms:** 404 errors on `/api/proxy/*` endpoints
**Fix:** Check Caddyfile has `/api/proxy/*` routing to frontend, reload Caddy

### Service Not Starting
**Symptoms:** Container exits immediately
**Fix:** Check logs `docker compose logs <service>`, fix environment variables

### Authentication Issues
**Symptoms:** 401 errors on protected endpoints
**Fix:** Check Keycloak configuration, JWT secrets, session handling

## Automated Solutions

### 1. Health Checks (Already Implemented)
- Run `./scripts/validate-deployment.sh` after every deployment
- Integrated into `deploy-update.sh`

### 2. Monitoring Setup
```bash
# Enable Prometheus metrics
docker compose -f docker-compose.prod.yml up -d prometheus grafana

# Check Grafana dashboards
open https://grc-staging.newmehub.com:3010
```

### 3. Automated Backups
```bash
# Daily backup cron job
0 2 * * * /opt/stratagem/scripts/backup-volumes.sh
```

### 4. Log Aggregation
```bash
# View all service logs
docker compose -f docker-compose.prod.yml logs -f

# Export logs for analysis
docker compose -f docker-compose.prod.yml logs > deployment-logs-$(date +%Y%m%d).txt
```

## Prevention Strategies

### 1. Infrastructure as Code
- All configurations in version control (Caddyfile, docker-compose.yml)
- Environment variables templated and validated
- Deployment scripts tested in CI/CD

### 2. Automated Testing
- Unit tests for all components
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance tests for scalability

### 3. Gradual Rollouts
- Blue/green deployments
- Feature flags for risky changes
- Canary releases for critical updates

### 4. Monitoring & Alerting
- Real-time health checks
- Error rate monitoring
- Performance metrics
- Automated incident response

## Emergency Contacts
- DevOps: [contact]
- Database Admin: [contact]
- Security Team: [contact]

## Runbook Links
- [Deployment Guide](./DEPLOYMENT_WORKFLOW.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Monitoring Setup](./MONITORING_SETUP.md)</content>
<parameter name="filePath">/Users/adelsayed/Documents/Code/Stratagem/docs/DEPLOYMENT_CHECKLIST.md