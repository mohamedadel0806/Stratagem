# GRC Platform - Project Structure

## Repository Organization

```
Stratagem/
├── frontend/                    # Next.js frontend application
├── backend/                     # NestJS backend services
├── ai-service/                  # FastAPI AI service
├── infrastructure/              # Infrastructure configurations
├── monitoring/                  # Monitoring stack configs
├── scripts/                     # Utility and deployment scripts
├── docs/                        # Comprehensive documentation
├── deploy/                      # Deployment configurations
├── database-export/             # Database backup exports
├── docker-compose.yml           # Main Docker Compose file
├── docker-compose.dev.yml       # Development overrides
├── docker-compose.prod.yml      # Production configuration
└── .env.example                 # Environment variables template
```

## Frontend Structure

```
frontend/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/           # Internationalized routes
│   │   │   ├── (auth)/         # Authentication routes
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/   # Protected dashboard routes
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── governance/
│   │   │   │   │   │   ├── influencers/
│   │   │   │   │   │   ├── policies/
│   │   │   │   │   │   ├── controls/
│   │   │   │   │   │   ├── assessments/
│   │   │   │   │   │   ├── evidence/
│   │   │   │   │   │   └── findings/
│   │   │   │   │   ├── assets/
│   │   │   │   │   │   ├── physical/
│   │   │   │   │   │   ├── information/
│   │   │   │   │   │   ├── applications/
│   │   │   │   │   │   ├── software/
│   │   │   │   │   │   └── suppliers/
│   │   │   │   │   ├── risks/
│   │   │   │   │   ├── compliance/
│   │   │   │   │   └── settings/
│   │   │   │   └── layout.tsx
│   │   │   ├── api/            # Next.js API routes
│   │   │   │   └── auth/       # NextAuth endpoints
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── globals.css     # Global styles
│   │   └── sitemap.xml
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components (Header, Sidebar)
│   │   ├── governance/         # Governance-specific components
│   │   ├── assets/             # Asset management components
│   │   ├── dashboard/          # Dashboard widgets
│   │   └── common/             # Shared components
│   ├── lib/                    # Utility libraries
│   │   ├── api/                # API client
│   │   │   ├── client.ts       # Axios instance
│   │   │   ├── governance.ts   # Governance API endpoints
│   │   │   └── assets.ts       # Asset API endpoints
│   │   ├── auth/               # Authentication utilities
│   │   ├── utils/              # General utilities
│   │   └── hooks/              # Custom React hooks
│   └── types/                  # TypeScript type definitions
├── public/                      # Static assets
│   ├── locales/                # Translation files
│   └── images/
├── e2e/                        # End-to-end tests (Playwright)
├── test-results/               # Test output
├── playwright-report/          # Test reports
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── Dockerfile                  # Docker configuration
```

## Backend Structure

```
backend/
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts                 # Application entry point
│   ├── data-source.ts          # TypeORM data source
│   ├── config/                 # Configuration files
│   │   ├── database.ts        # Database configuration
│   │   └── redis.config.ts    # Redis/Bull configuration
│   ├── common/                 # Shared modules
│   │   ├── guards/            # Authentication guards
│   │   ├── interceptors/       # Request/response interceptors
│   │   ├── filters/           # Exception filters
│   │   ├── decorators/        # Custom decorators
│   │   └── pipes/             # Validation pipes
│   ├── auth/                   # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/        # Passport strategies
│   │   └── guards/
│   ├── users/                  # User management
│   ├── governance/             # Governance module
│   │   ├── governance.module.ts
│   │   ├── influencers/
│   │   │   ├── influencers.module.ts
│   │   │   ├── influencers.controller.ts
│   │   │   ├── influencers.service.ts
│   │   │   ├── entities/
│   │   │   │   └── influencer.entity.ts
│   │   │   └── dto/
│   │   ├── policies/
│   │   ├── control-objectives/
│   │   ├── unified-controls/
│   │   ├── assessments/
│   │   ├── evidence/
│   │   └── findings/
│   ├── asset/                  # Asset management module
│   │   ├── asset.module.ts
│   │   ├── physical-assets/
│   │   ├── information-assets/
│   │   ├── business-applications/
│   │   ├── software-assets/
│   │   ├── suppliers/
│   │   ├── import/             # Import service
│   │   │   ├── import.service.ts
│   │   │   └── import.controller.ts
│   │   └── integration/        # External integrations
│   ├── risk/                   # Risk management
│   ├── compliance/             # Compliance module
│   ├── workflow/               # Workflow module
│   │   ├── workflow.module.ts
│   │   ├── workflow.controller.ts
│   │   ├── workflow.service.ts
│   │   └── processors/        # Bull queue processors
│   ├── dashboard/              # Dashboard module
│   ├── health/                 # Health check module
│   ├── migrations/             # Database migrations
│   │   ├── 1701000000001-CreateGovernanceEnums.ts
│   │   ├── 1701000000002-CreateInfluencersTable.ts
│   │   └── ...
│   └── scripts/                # Utility scripts
│       ├── seed.ts             # Seed database
│       ├── seed-governance.ts   # Seed governance data
│       └── check-governance-data.ts
├── test/                       # Test files
│   ├── jest.setup.ts
│   └── governance/
├── dist/                       # Compiled JavaScript
├── uploads/                    # File uploads directory
│   ├── evidence/
│   ├── imports/
│   ├── influencers/
│   └── policies/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── jest.config.js
└── Dockerfile
```

## AI Service Structure

```
ai-service/
├── main.py                     # FastAPI application entry
├── app/
│   ├── api/
│   │   └── endpoints/         # API endpoints
│   ├── core/
│   │   ├── config.py          # Configuration
│   │   └── security.py         # Security utilities
│   ├── services/
│   │   └── ai_service.py       # AI analysis service
│   └── schemas/                # Pydantic schemas
├── requirements.txt            # Python dependencies
└── Dockerfile
```

## Infrastructure Structure

```
infrastructure/
├── postgres/
│   ├── init.sql                # Database initialization
│   └── create-multiple-postgresql-databases.sh
├── mongodb/
│   └── init-mongo.js           # MongoDB initialization
├── neo4j/
│   └── init.cypher             # Neo4j initialization
├── redis/
│   └── redis.conf              # Redis configuration
├── elasticsearch/
│   └── init-elastic.sh         # Elasticsearch initialization
├── keycloak/
│   └── realm-export.json       # Keycloak realm configuration
├── kong/
│   └── kong.yml                # Kong API Gateway configuration
└── caddy/
    └── Caddyfile               # Caddy reverse proxy config
```

## Monitoring Structure

```
monitoring/
├── prometheus/
│   └── prometheus.yml          # Prometheus configuration
└── grafana/
    ├── provisioning/
    │   ├── datasources/        # Data source configs
    │   └── dashboards/         # Dashboard configs
    └── dashboards/             # Dashboard JSON files
```

## Scripts Structure

```
scripts/
├── deploy.sh                   # Main deployment script
├── deploy-to-server.sh         # Server deployment
├── deploy-quick.sh             # Quick deployment
├── export-database.sh          # Database export
├── import-database.sh          # Database import
├── seed-database.sh            # Seed database
├── test-all-governance-endpoints.sh
├── test-governance-crud.sh
└── setup-server-env.sh          # Server environment setup
```

## Documentation Structure

```
docs/
├── PROJECT_OVERVIEW.md         # This file - High-level overview
├── ARCHITECTURE_SUMMARY.md     # System architecture
├── PROJECT_STRUCTURE.md        # This file - Directory structure
├── DEVELOPMENT_GUIDE.md        # How to continue development
├── Requirments-US-PRD-DB Schema Governance Management Module Integrated with Assets managment.md
├── PRODUCT_REQUIREMENTS_PRD.md
├── ASSET_MANAGEMENT_ARCHITECTURE.md
├── GOVERNANCE_IMPLEMENTATION_COMPLETE.md
├── GOVERNANCE_CURRENT_STATUS.md
├── GOVERNANCE_API_SPECIFICATION.md
├── DATABASE_SCHEMA.md
├── FRONTEND_ARCHITECTURE.md
├── IMPLEMENTATION_GUIDE.md
└── [Many other implementation and status documents]
```

## Key Configuration Files

### Root Level
- **docker-compose.yml**: Main service definitions
- **docker-compose.dev.yml**: Development overrides
- **docker-compose.prod.yml**: Production configuration
- **.env.example**: Environment variables template

### Frontend
- **next.config.js**: Next.js configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependencies and scripts

### Backend
- **tsconfig.json**: TypeScript configuration
- **nest-cli.json**: NestJS CLI configuration
- **jest.config.js**: Jest test configuration
- **package.json**: Dependencies and scripts

## Module Organization Pattern

Each major module follows this structure:

```
module-name/
├── module-name.module.ts       # Module definition
├── module-name.controller.ts   # REST API endpoints
├── module-name.service.ts      # Business logic
├── entities/                   # TypeORM entities
│   └── module-name.entity.ts
├── dto/                        # Data Transfer Objects
│   ├── create-module-name.dto.ts
│   ├── update-module-name.dto.ts
│   └── filter-module-name.dto.ts
└── interfaces/                 # TypeScript interfaces
    └── module-name.interface.ts
```

## File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `influencer-form.tsx`)
- **Services**: `kebab-case.service.ts` (e.g., `influencer.service.ts`)
- **Controllers**: `kebab-case.controller.ts` (e.g., `influencer.controller.ts`)
- **Entities**: `kebab-case.entity.ts` (e.g., `influencer.entity.ts`)
- **DTOs**: `kebab-case.dto.ts` (e.g., `create-influencer.dto.ts`)
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx`

## Import Paths

### Frontend
- `@/components/*` - Components
- `@/lib/*` - Utilities
- `@/types/*` - Type definitions
- `@/hooks/*` - Custom hooks

### Backend
- Relative imports within modules
- Absolute imports from `src/` root

## Database Files

### Migrations
Located in `backend/src/migrations/`
- Named with timestamp prefix: `1701000000001-Description.ts`
- Run with: `npm run migrate`

### Seeds
Located in `backend/src/scripts/`
- `seed.ts`: General seed data
- `seed-governance.ts`: Governance module seed data

## Test Files

### Frontend
- **Unit Tests**: `*.test.tsx` or `*.spec.tsx`
- **E2E Tests**: `frontend/e2e/**/*.ts`
- **Test Setup**: `jest.setup.js`

### Backend
- **Unit Tests**: `*.spec.ts`
- **E2E Tests**: `test/**/*.e2e-spec.ts`
- **Test Setup**: `test/jest.setup.ts`

## Environment Files

- **.env**: Local development (gitignored)
- **.env.example**: Template with all required variables
- **docker-compose.yml**: Default values for Docker services

## Build Artifacts

### Frontend
- **.next/**: Next.js build output (gitignored)
- **dist/**: Production build (if using standalone output)

### Backend
- **dist/**: Compiled TypeScript to JavaScript
- **node_modules/**: Dependencies (gitignored)

## Upload Directories

Located in `backend/uploads/`:
- **evidence/**: Evidence file uploads
- **imports/**: Import file uploads
- **influencers/**: Influencer attachments
- **policies/**: Policy document uploads

---

**Last Updated**: December 2025





