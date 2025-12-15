# Implementation Guide for Modern AI-Powered GRC Platform

This guide provides step-by-step instructions for implementing the Modern AI-Powered GRC Platform Phase 1.

## Prerequisites

### Required Software
- **Docker Desktop** (latest version)
- **Node.js** 18+ 
- **Git**
- **VS Code** (recommended) with extensions:
  - Docker
  - TypeScript
  - Tailwind CSS IntelliSense
  - Prettier
  - ESLint

### System Requirements
- **RAM**: 16GB minimum (32GB recommended)
- **Storage**: 50GB free space
- **CPU**: 4 cores minimum (8 cores recommended)

## Quick Start

### 1. Project Setup

```bash
# Clone the repository (when available)
git clone https://github.com/your-org/grc-platform.git
cd grc-platform

# Or create from scratch
mkdir grc-platform
cd grc-platform
git init
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Start Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Access Services

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **Keycloak Admin**: http://localhost:8080 (admin/admin)
- **Grafana**: http://localhost:3010 (admin/admin)
- **Kong Manager**: http://localhost:8002

## Detailed Implementation Steps

### Phase 1: Infrastructure Setup (Week 1)

#### Step 1.1: Create Project Structure

```bash
# Create directory structure
mkdir -p {frontend,backend,ai-service,infrastructure/{postgres,mongodb,redis,neo4j,elasticsearch,keycloak,kong},monitoring/{prometheus,grafana},scripts,docs}

# Create initial files
touch docker-compose.yml
touch docker-compose.dev.yml
touch docker-compose.prod.yml
touch .env.example
touch .gitignore
touch README.md
```

#### Step 1.2: Configure Docker Compose

Create the main `docker-compose.yml` file with all services as outlined in [`DOCKER_CONFIGURATION.md`](docs/DOCKER_CONFIGURATION.md).

#### Step 1.3: Set Up Environment Variables

Create `.env.example`:

```bash
# Application Secrets
NEXTAUTH_SECRET=your-nextauth-secret-here
JWT_SECRET=your-jwt-secret-here

# Database Credentials
POSTGRES_PASSWORD=password
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password
REDIS_PASSWORD=
ELASTIC_PASSWORD=

# Keycloak Configuration
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# API Configuration
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
```

#### Step 1.4: Initialize Database Scripts

Create database initialization scripts as shown in the Docker configuration document.

### Phase 2: Backend Services (Week 2-3)

#### Step 2.1: Set Up NestJS Backend

```bash
# Navigate to backend directory
cd backend

# Initialize NestJS project
npm install -g @nestjs/cli
nest new . --package-manager npm

# Install required dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install @nestjs/microservices @nestjs/swagger
npm install passport passport-jwt passport-keycloak
npm install class-validator class-transformer
npm install @nestjs/throttler @nestjs/cache-manager
npm install redis ioredis
npm install @elastic/elasticsearch
npm install neo4j-driver

# Install development dependencies
npm install -D @types/passport-jwt @types/node
npm install -D jest @types/jest supertest @types/supertest
```

#### Step 2.2: Create Basic NestJS Structure

```bash
# Generate modules
nest generate module auth
nest generate module users
nest generate module policy
nest generate module risk
nest generate module compliance
nest generate module common

# Generate controllers
nest generate controller auth
nest generate controller users
nest generate controller policy
nest generate controller risk
nest generate controller compliance

# Generate services
nest generate service auth
nest generate service users
nest generate service policy
nest generate service risk
nest generate service compliance
```

#### Step 2.3: Configure TypeORM

Create `src/config/database.ts`:

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'grc_platform',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};
```

#### Step 2.4: Create Basic Entities

Create `src/users/entities/user.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Step 2.5: Set Up Authentication

Create `src/auth/auth.controller.ts`:

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: any) {
    return this.authService.refresh(refreshDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }
}
```

### Phase 3: Frontend Setup (Week 3-4)

#### Step 3.1: Initialize Next.js Application

```bash
# Navigate to frontend directory
cd frontend

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install @radix-ui/react-slot
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-tabs
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
npm install lucide-react
npm install next-auth
npm install @tanstack/react-query
npm install zustand
npm install react-hook-form
npm install @hookform/resolvers
npm install zod
npm install next-i18next
npm install axios
npm install recharts
npm install @types/node

# Install development dependencies
npm install -D @types/react @types/react-dom
npm install -D prettier prettier-plugin-tailwindcss
npm install -D eslint-config-prettier
```

#### Step 3.2: Configure Tailwind CSS

Update `tailwind.config.js` as shown in the frontend architecture document.

#### Step 3.3: Set Up shadcn/ui

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Install required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
```

#### Step 3.4: Configure Internationalization

Create `next-i18next.config.js`:

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeDetection: true,
  },
  fallbackLng: {
    default: ['en'],
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  localePath: './public/locales',
  ns: ['common', 'dashboard', 'auth', 'policies', 'risks', 'compliance'],
};
```

#### Step 3.5: Create Basic Layout

Create `src/app/[locale]/(dashboard)/layout.tsx`:

```typescript
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <Providers>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
              {children}
            </main>
          </div>
        </div>
      </Providers>
    </div>
  );
}
```

### Phase 4: AI Service Setup (Week 4)

#### Step 4.1: Initialize FastAPI Service

```bash
# Navigate to ai-service directory
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn
pip install sqlalchemy psycopg2-binary
pip install redis pymongo
pip install neo4j
pip install elasticsearch
pip install transformers torch
pip install scikit-learn
pip install spacy
pip install python-multipart
pip install python-jose[cryptography]
pip install passlib[bcrypt]
pip install pytest pytest-asyncio httpx
```

#### Step 4.2: Create Basic FastAPI Structure

Create `main.py`:

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router
from app.core.config import settings

app = FastAPI(
    title="GRC Platform AI Service",
    description="AI-powered analysis and prediction service",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service"}
```

#### Step 4.3: Create AI Analysis Endpoints

Create `app/api/endpoints/analysis.py`:

```python
from fastapi import APIRouter, Depends, HTTPException
from app.services.ai_service import AIService
from app.schemas.analysis import AnalysisRequest, AnalysisResponse

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/document", response_model=AnalysisResponse)
async def analyze_document(
    request: AnalysisRequest,
    ai_service: AIService = Depends()
):
    try:
        result = await ai_service.analyze_document(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/risk-prediction", response_model=AnalysisResponse)
async def predict_risk(
    request: AnalysisRequest,
    ai_service: AIService = Depends()
):
    try:
        result = await ai_service.predict_risk(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Phase 5: API Gateway Configuration (Week 5)

#### Step 5.1: Configure Kong Gateway

Create `infrastructure/kong/kong.yml`:

```yaml
_format_version: "3.0"

services:
- name: backend-service
  url: http://backend:3001
  plugins:
  - name: rate-limiting
    config:
      minute: 100
      hour: 1000

- name: ai-service
  url: http://ai-service:8000
  plugins:
  - name: rate-limiting
    config:
      minute: 50
      hour: 500

routes:
- name: backend-route
  service: backend-service
  paths:
  - /api
  methods:
  - GET
  - POST
  - PUT
  - DELETE
  - PATCH

- name: ai-route
  service: ai-service
  paths:
  - /ai
  methods:
  - GET
  - POST

plugins:
- name: cors
  config:
    origins:
    - "http://localhost:3000"
    methods:
    - GET
    - POST
    - PUT
    - DELETE
    - OPTIONS
    headers:
    - Accept
    - Accept-Version
    - Content-Length
    - Content-MD5
    - Content-Type
    - Date
    - Authorization
    - Host
    - X-API-Version
    - X-Requested-With
    credentials: true
```

### Phase 6: Keycloak Configuration (Week 5)

#### Step 6.1: Create Realm Configuration

Create `infrastructure/keycloak/realm-export.json`:

```json
{
  "id": "grc-platform",
  "realm": "grc-platform",
  "displayName": "GRC Platform",
  "enabled": true,
  "registrationAllowed": true,
  "loginWithEmailAllowed": true,
  "duplicateEmailsAllowed": false,
  "resetPasswordAllowed": true,
  "editUsernameAllowed": true,
  "bruteForceProtected": true,
  "permanentLockout": false,
  "maxFailureWaitSeconds": 900,
  "minimumQuickLoginWaitSeconds": 60,
  "waitIncrementSeconds": 60,
  "quickLoginCheckMilliSeconds": 1000,
  "maxDeltaTimeSeconds": 43200,
  "failureFactor": 30,
  "roles": {
    "realm": [
      {
        "id": "admin",
        "name": "admin",
        "description": "Administrator role",
        "composite": false,
        "clientRole": false,
        "containerId": "grc-platform"
      },
      {
        "id": "compliance_officer",
        "name": "compliance_officer",
        "description": "Compliance Officer role",
        "composite": false,
        "clientRole": false,
        "containerId": "grc-platform"
      }
    ]
  },
  "clients": [
    {
      "clientId": "frontend",
      "name": "Frontend Application",
      "description": "GRC Platform Frontend",
      "enabled": true,
      "clientAuthenticatorType": "public",
      "redirectUris": ["http://localhost:3000/*"],
      "webOrigins": ["http://localhost:3000"],
      "standardFlowEnabled": true,
      "implicitFlowEnabled": false,
      "directAccessGrantsEnabled": true,
      "serviceAccountsEnabled": false,
      "publicClient": true,
      "fullScopeAllowed": false,
      "protocolMappers": [
        {
          "name": "roles",
          "protocol": "openid-connect",
          "protocolMapper": "oidc-usermodel-realm-role-mapper",
          "config": {
            "id.token.claim": "true",
            "access.token.claim": "true",
            "claim.name": "roles",
            "jsonType.label": "String",
            "multivalued": "true"
          }
        }
      ]
    }
  ]
}
```

### Phase 7: Monitoring Setup (Week 6)

#### Step 7.1: Configure Prometheus

Create `monitoring/prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'kong'
    static_configs:
      - targets: ['kong:8001']

  - job_name: 'backend'
    static_configs:
      - targets: ['backend:3001']

  - job_name: 'ai-service'
    static_configs:
      - targets: ['ai-service:8000']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
```

#### Step 7.2: Configure Grafana Dashboards

Create `monitoring/grafana/provisioning/datasources/prometheus.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
```

## Development Workflow

### Daily Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs for specific service
docker-compose logs -f backend

# Rebuild specific service
docker-compose up -d --build backend

# Access container shell
docker-compose exec backend sh

# Run database migrations
docker-compose exec backend npm run migrate

# Seed database with test data
docker-compose exec backend npm run seed

# Run tests
docker-compose exec backend npm test
docker-compose exec frontend npm test
```

### Code Quality Checks

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run all quality checks
npm run check
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/user-authentication

# Commit changes
git add .
git commit -m "feat: implement user authentication"

# Push to remote
git push origin feature/user-authentication

# Create pull request
# (through GitHub UI or CLI)
```

## Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Clean up Docker resources
docker system prune -a

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Check container logs
docker-compose logs [service-name]
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec postgres pg_isready -U postgres

# Connect to database
docker-compose exec postgres psql -U postgres -d grc_platform

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm run clean
```

### Performance Issues

#### Memory Usage
```bash
# Check container resource usage
docker stats

# Limit container memory
# Update docker-compose.yml with:
# deploy:
#   resources:
#     limits:
#       memory: 512M
```

#### Database Performance
```bash
# Check PostgreSQL connections
docker-compose exec postgres psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Optimize PostgreSQL configuration
# Edit infrastructure/postgres/postgresql.conf
```

## Testing Strategy

### Unit Testing
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# AI Service tests
cd ai-service
pytest
```

### Integration Testing
```bash
# API integration tests
cd backend
npm run test:e2e

# Frontend integration tests
cd frontend
npm run test:e2e
```

### Load Testing
```bash
# Install k6
brew install k6  # macOS
# Or download from https://k6.io/

# Run load test
k6 run scripts/load-test.js
```

## Deployment

### Staging Deployment
```bash
# Use production compose file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or use CI/CD pipeline
# (see CI_CD_SETUP.md)
```

### Production Checklist
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Security scanning completed
- [ ] Load testing performed
- [ ] Documentation updated

This implementation guide provides a comprehensive roadmap for building the Modern AI-Powered GRC Platform. Follow these steps systematically to ensure a successful implementation.