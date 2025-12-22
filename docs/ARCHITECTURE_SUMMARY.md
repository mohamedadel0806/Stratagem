# GRC Platform - Architecture Summary

## System Architecture Overview

The GRC Platform follows a **microservices-oriented architecture** with clear separation between frontend, backend services, and data layers. The system is containerized using Docker Compose for easy development and deployment.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (Port 3000)                        │  │
│  │  - React 19 + TypeScript                             │  │
│  │  - App Router (Next.js 16)                          │  │
│  │  - shadcn/ui + Tailwind CSS                          │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Kong API Gateway (Port 8000)                         │  │
│  │  - Rate limiting                                       │  │
│  │  - Request routing                                    │  │
│  │  - CORS handling                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────────┐         ┌───────────────────┐
│  Backend Services │         │  Authentication   │
│  NestJS (3001)    │         │  Keycloak (8080)  │
│  - REST APIs      │         │  - SSO            │
│  - Business Logic │         │  - User Management│
│  - Data Access    │         └───────────────────┘
└─────────┬─────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │PostgreSQL│  │ MongoDB  │  │  Neo4j   │  │  Redis   │     │
│  │(5432)    │  │(27017)   │  │(7474/    │  │(6379)    │     │
│  │          │  │          │  │ 7687)    │  │          │     │
│  │Relational│  │Documents │  │Graph    │  │Cache/    │     │
│  │Data      │  │Storage   │  │Relations│  │Queue     │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                               │
│  ┌──────────┐                                                │
│  │Elastic-  │                                                │
│  │search     │                                                │
│  │(9200)     │                                                │
│  │Full-text  │                                                │
│  │Search     │                                                │
│  └──────────┘                                                │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

**Next.js App Router Structure:**
```
frontend/src/app/
├── [locale]/                    # Internationalized routes
│   ├── (auth)/                 # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   ├── governance/     # Governance module pages
│   │   │   ├── assets/         # Asset management pages
│   │   │   ├── risks/          # Risk management pages
│   │   │   └── compliance/    # Compliance pages
│   │   └── settings/
│   └── api/                    # Next.js API routes
│       └── auth/               # NextAuth endpoints
```

**State Management:**
- **TanStack Query**: Server state (API data, caching)
- **Zustand**: Global client state (UI preferences, user context)
- **React Hook Form**: Form state management
- **URL State**: Search params for filters/pagination

**Component Hierarchy:**
```
Page Component
  ├── Layout (Sidebar, Header)
  ├── Data Fetching (TanStack Query)
  ├── Business Components (List, Form, Detail)
  │   ├── UI Components (Button, Input, Table)
  │   └── Feature Components (Search, Filter, Pagination)
  └── Providers (QueryClient, Auth, i18n)
```

### Backend Architecture

**NestJS Module Structure:**
```
backend/src/
├── app.module.ts               # Root module
├── main.ts                     # Application entry
├── config/                     # Configuration
│   ├── database.ts            # TypeORM config
│   └── redis.config.ts        # Redis/Bull config
├── common/                     # Shared modules
│   ├── guards/                # Auth guards
│   ├── interceptors/          # Request/response interceptors
│   ├── filters/               # Exception filters
│   └── decorators/            # Custom decorators
├── governance/                 # Governance module
│   ├── influencers/
│   ├── policies/
│   ├── control-objectives/
│   ├── unified-controls/
│   ├── assessments/
│   ├── evidence/
│   └── findings/
├── asset/                      # Asset management module
│   ├── physical-assets/
│   ├── information-assets/
│   ├── business-applications/
│   ├── software-assets/
│   ├── suppliers/
│   ├── import/                # Import service
│   └── integration/           # External integrations
├── workflow/                   # Workflow module
├── auth/                       # Authentication
├── users/                      # User management
└── migrations/                 # Database migrations
```

**Module Pattern:**
Each module follows NestJS best practices:
```
module-name/
├── module-name.module.ts      # Module definition
├── module-name.controller.ts  # REST endpoints
├── module-name.service.ts     # Business logic
├── entities/                   # TypeORM entities
│   └── module-name.entity.ts
├── dto/                        # Data Transfer Objects
│   ├── create-module-name.dto.ts
│   └── update-module-name.dto.ts
└── interfaces/                 # TypeScript interfaces
```

## Data Architecture

### Database Responsibilities

**PostgreSQL (Primary Database):**
- User accounts and authentication
- Organizations and multi-tenancy
- Governance entities (influencers, policies, controls, assessments, findings)
- Asset metadata and relationships
- Risk records
- Compliance requirements and mappings
- Audit logs
- Tasks and workflows

**MongoDB (Document Store):**
- Policy document content (rich text, versions)
- Compliance reports (generated PDFs, Excel files)
- Evidence files metadata
- Large text content that doesn't fit relational model

**Neo4j (Graph Database):**
- Asset relationships (depends_on, uses, hosts, contains)
- Control-to-requirement mappings
- Risk-to-control relationships
- User influence networks
- Dependency chains and impact analysis

**Redis (Cache & Queue):**
- Session storage
- API response caching
- User permissions cache
- Rate limiting counters
- Bull queue for background jobs
- Real-time notifications

**Elasticsearch (Search):**
- Full-text search across policies
- Compliance requirements search
- Risk search
- Asset search
- Multi-language search (English/Arabic)

## API Architecture

### RESTful API Design

**Base URL**: `http://localhost:3001/api/v1`

**Endpoint Structure:**
```
/api/v1/
├── auth/                       # Authentication
│   ├── login
│   ├── logout
│   └── refresh
├── governance/
│   ├── influencers
│   ├── policies
│   ├── control-objectives
│   ├── unified-controls
│   ├── assessments
│   ├── evidence
│   └── findings
├── assets/
│   ├── physical
│   ├── information
│   ├── applications
│   ├── software
│   ├── suppliers
│   ├── import
│   └── integrations
├── risks/
├── compliance/
└── workflow/
```

**Request/Response Pattern:**
- **GET**: List (with pagination, filters) or Get by ID
- **POST**: Create new resource
- **PATCH**: Partial update
- **DELETE**: Soft delete (where applicable)

**Standard Response Format:**
```typescript
{
  data: T | T[],
  meta?: {
    total: number,
    page: number,
    limit: number
  },
  message?: string
}
```

## Authentication & Authorization

### Authentication Flow

1. **User Login**: Frontend → NextAuth → Keycloak
2. **Token Generation**: Keycloak issues JWT
3. **Token Storage**: NextAuth session (HTTP-only cookie)
4. **API Requests**: JWT in Authorization header
5. **Backend Validation**: NestJS JWT guard validates token

### Authorization

- **Role-Based Access Control (RBAC)**: User roles (admin, compliance_officer, risk_manager, auditor, user)
- **Resource-Level Permissions**: Organization-scoped data
- **Guards**: `@UseGuards(JwtAuthGuard)` on protected routes

## Integration Architecture

### External System Integration

**CMDB Integration:**
```
External CMDB (ServiceNow, BMC)
    ↓ HTTP/REST
Integration Service
    ↓ Field Mapping
Asset Service
    ↓
PostgreSQL (Asset Tables)
```

**Asset Management System Integration:**
```
External AMS (Lansweeper, ManageEngine)
    ↓ HTTP/REST + Auth
Integration Service
    ↓ Sync Engine
    ↓ Conflict Resolution
Asset Service
    ↓
PostgreSQL + Neo4j (Assets + Relationships)
```

**Integration Components:**
- **Integration Config**: Endpoint, auth type, field mapping
- **Sync Engine**: Fetch, transform, deduplicate
- **Scheduler**: Interval-based or manual sync
- **Conflict Resolver**: Handle duplicates and updates

## Background Processing

### Bull Queue Architecture

**Queue System:**
- **Redis**: Queue storage and job state
- **Bull**: Job processing library
- **Workers**: Background job processors

**Job Types:**
- Asset import processing
- Integration sync jobs
- Report generation
- Email notifications
- AI analysis tasks

**Queue Configuration:**
```typescript
BullModule.forRootAsync({
  redis: {
    host: 'redis',
    port: 6379
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 1000
  }
})
```

## Security Architecture

### Security Layers

1. **API Gateway**: Rate limiting, CORS, request validation
2. **Authentication**: Keycloak SSO, JWT tokens
3. **Authorization**: Role-based guards, resource-level checks
4. **Data Encryption**: TLS in transit, encryption at rest
5. **Input Validation**: DTOs with class-validator
6. **SQL Injection Prevention**: TypeORM parameterized queries
7. **XSS Prevention**: React automatic escaping, CSP headers

### Audit Trail

- **Audit Logs**: All CRUD operations logged to `audit_logs` table
- **Change Tracking**: Old/new values stored
- **User Attribution**: User ID, IP address, timestamp
- **Entity Tracking**: Entity type and ID for traceability

## Deployment Architecture

### Development Environment

**Docker Compose Services:**
- All services in single compose file
- Volume mounts for hot reload
- Development configurations
- Local database instances

### Production Architecture

```
Internet
    ↓
Caddy (Reverse Proxy + SSL)
    ↓
Kong API Gateway
    ↓
┌─────────────┬─────────────┐
│  Frontend   │  Backend    │
│  (Next.js)  │  (NestJS)   │
└─────────────┴─────────────┘
    ↓              ↓
┌─────────────────────────────┐
│      Database Cluster       │
│  PostgreSQL (Primary)       │
│  MongoDB (Replica Set)      │
│  Neo4j (Cluster)            │
│  Redis (Sentinel)          │
│  Elasticsearch (Cluster)    │
└─────────────────────────────┘
```

## Monitoring & Observability

### Monitoring Stack

- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **Health Checks**: Service health endpoints
- **Logging**: Structured logging (Winston/Pino)

### Key Metrics

- API response times
- Database query performance
- Queue job processing times
- Error rates
- User activity
- Resource utilization

## Scalability Considerations

### Horizontal Scaling

- **Stateless Services**: Frontend and backend are stateless
- **Database Scaling**: Read replicas, sharding strategies
- **Queue Workers**: Multiple workers for job processing
- **Load Balancing**: Kong gateway handles load distribution

### Performance Optimization

- **Caching**: Redis for frequently accessed data
- **Database Indexing**: Strategic indexes on foreign keys and search fields
- **Query Optimization**: Eager loading, pagination
- **CDN**: Static assets served via CDN (production)

## Technology Decisions

### Why NestJS?
- TypeScript-first framework
- Modular architecture
- Built-in dependency injection
- Excellent for enterprise applications

### Why Next.js?
- Server-side rendering for SEO
- App Router for modern React patterns
- Built-in API routes
- Excellent developer experience

### Why Multi-Database?
- **PostgreSQL**: ACID transactions, relational integrity
- **MongoDB**: Flexible document storage for policies
- **Neo4j**: Graph queries for relationships
- **Redis**: Fast caching and queues
- **Elasticsearch**: Advanced search capabilities

---

**Last Updated**: December 2025  
**Architecture Version**: 1.0







