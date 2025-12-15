# GRC Platform - Development Guide

This guide helps developers (and LLMs) understand how to continue development on the GRC Platform.

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Node.js 18+ (for local development)
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd Stratagem

# 2. Copy environment file
cp .env.example .env
# Edit .env with your configuration

# 3. Start all services
docker-compose up -d

# 4. Wait for services to be healthy
docker-compose ps

# 5. Access applications
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Keycloak: http://localhost:8080 (admin/admin)
```

## Development Workflow

### Starting Development

```bash
# Start all services in development mode
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Making Changes

#### Frontend Changes
1. Edit files in `frontend/src/`
2. Changes are hot-reloaded automatically
3. Check browser console for errors
4. Test in browser at `http://localhost:3000`

#### Backend Changes
1. Edit files in `backend/src/`
2. NestJS watch mode auto-recompiles
3. Check logs: `docker-compose logs -f backend`
4. Test API endpoints: `curl http://localhost:3001/api/v1/governance/influencers`

### Database Changes

#### Creating Migrations

```bash
# Generate migration
docker-compose exec backend npm run migration:generate -- -n MigrationName

# Run migrations
docker-compose exec backend npm run migrate

# Revert migration
docker-compose exec backend npm run migration:revert
```

#### Seeding Data

```bash
# Seed governance data
docker-compose exec backend npm run seed:governance

# Check seeded data
docker-compose exec backend npm run check:governance
```

## Module Development Patterns

### Adding a New Backend Module

1. **Generate Module Structure**
```bash
cd backend
nest generate module module-name
nest generate controller module-name
nest generate service module-name
```

2. **Create Entity**
```typescript
// src/module-name/entities/module-name.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('module_names')
export class ModuleName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Add other columns
}
```

3. **Create DTOs**
```typescript
// src/module-name/dto/create-module-name.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateModuleNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

4. **Implement Service**
```typescript
// src/module-name/module-name.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleName } from './entities/module-name.entity';

@Injectable()
export class ModuleNameService {
  constructor(
    @InjectRepository(ModuleName)
    private repository: Repository<ModuleName>,
  ) {}

  async create(dto: CreateModuleNameDto) {
    return this.repository.save(dto);
  }

  async findAll() {
    return this.repository.find();
  }
}
```

5. **Implement Controller**
```typescript
// src/module-name/module-name.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ModuleNameService } from './module-name.service';
import { CreateModuleNameDto } from './dto/create-module-name.dto';

@Controller('module-names')
export class ModuleNameController {
  constructor(private service: ModuleNameService) {}

  @Post()
  create(@Body() dto: CreateModuleNameDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
```

6. **Register in App Module**
```typescript
// src/app.module.ts
import { ModuleNameModule } from './module-name/module-name.module';

@Module({
  imports: [
    // ... other modules
    ModuleNameModule,
  ],
})
export class AppModule {}
```

### Adding a New Frontend Page

1. **Create Page Component**
```typescript
// frontend/src/app/[locale]/(dashboard)/dashboard/module-name/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function ModuleNamePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['module-names'],
    queryFn: () => api.get('/module-names'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Module Names</h1>
      {/* Render data */}
    </div>
  );
}
```

2. **Add API Client Method**
```typescript
// frontend/src/lib/api/module-name.ts
import { client } from './client';

export const moduleNameApi = {
  getAll: () => client.get('/module-names'),
  getById: (id: string) => client.get(`/module-names/${id}`),
  create: (data: any) => client.post('/module-names', data),
  update: (id: string, data: any) => client.patch(`/module-names/${id}`, data),
  delete: (id: string) => client.delete(`/module-names/${id}`),
};
```

3. **Add Navigation Link**
```typescript
// frontend/src/components/layout/sidebar.tsx
// Add to navigation items:
{
  title: 'Module Names',
  href: '/dashboard/module-name',
  icon: IconName,
}
```

## Common Development Tasks

### Adding a New Asset Type

1. **Backend**: Create new module in `backend/src/asset/`
2. **Entity**: Extend base asset entity or create new
3. **Service**: Implement CRUD operations
4. **Controller**: Add REST endpoints
5. **Frontend**: Create page in `frontend/src/app/[locale]/(dashboard)/dashboard/assets/`
6. **Import**: Add import support in `backend/src/asset/import/`

### Adding a New Governance Entity

1. **Backend**: Create module in `backend/src/governance/`
2. **Migration**: Create migration for new table
3. **Entity**: Define TypeORM entity
4. **DTOs**: Create DTOs for validation
5. **Service**: Implement business logic
6. **Controller**: Add API endpoints
7. **Frontend**: Create page and form components

### Integrating External System

1. **Config**: Add integration config entity
2. **Service**: Create integration service with sync logic
3. **Field Mapping**: Implement field mapping logic
4. **Scheduler**: Add scheduled sync job
5. **UI**: Create integration management page

## Testing

### Backend Testing

```bash
# Run all tests
docker-compose exec backend npm test

# Run specific test file
docker-compose exec backend npm test -- governance/influencers

# Run with coverage
docker-compose exec backend npm run test:cov

# Run E2E tests
docker-compose exec backend npm run test:e2e
```

### Frontend Testing

```bash
# Run unit tests
cd frontend
npm test

# Run E2E tests
npm run test:e2e

# Run E2E with UI
npm run test:e2e:ui
```

### API Testing

```bash
# Test governance endpoints
./scripts/test-all-governance-endpoints.sh

# Test CRUD operations
./scripts/test-governance-crud.sh
```

## Debugging

### Backend Debugging

```bash
# View logs
docker-compose logs -f backend

# Access database
docker-compose exec postgres psql -U postgres -d grc_platform

# Check Redis
docker-compose exec redis redis-cli

# Check Neo4j
# Access: http://localhost:7475 (neo4j/password)
```

### Frontend Debugging

```bash
# View logs
docker-compose logs -f frontend

# Check browser console
# Open DevTools in browser

# Check network requests
# Use browser DevTools Network tab
```

### Database Debugging

```sql
-- Check table structure
\d table_name

-- Check data
SELECT * FROM table_name LIMIT 10;

-- Check relationships
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'table_name';
```

## Code Quality

### Linting

```bash
# Backend
docker-compose exec backend npm run lint

# Frontend
cd frontend
npm run lint
```

### Formatting

```bash
# Backend
docker-compose exec backend npm run format

# Frontend
cd frontend
npm run format
```

### Type Checking

```bash
# Backend
docker-compose exec backend npx tsc --noEmit

# Frontend
cd frontend
npx tsc --noEmit
```

## Common Issues & Solutions

### Issue: Services won't start

**Solution:**
```bash
# Check Docker is running
docker ps

# Check ports are available
lsof -i :3000
lsof -i :3001

# Restart services
docker-compose down
docker-compose up -d
```

### Issue: Database connection errors

**Solution:**
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string in .env
# Verify DATABASE_URL is correct

# Restart backend
docker-compose restart backend
```

### Issue: Frontend build errors

**Solution:**
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

### Issue: Migration errors

**Solution:**
```bash
# Check migration status
docker-compose exec backend npm run migration:show

# Revert last migration
docker-compose exec backend npm run migration:revert

# Run migrations again
docker-compose exec backend npm run migrate
```

## Best Practices

### Backend

1. **Use DTOs for validation**: Always validate input with class-validator
2. **Handle errors properly**: Use exception filters
3. **Log important operations**: Use NestJS Logger
4. **Use transactions**: For multi-step operations
5. **Add indexes**: For frequently queried fields
6. **Document APIs**: Use Swagger decorators

### Frontend

1. **Use TypeScript**: Type everything
2. **Handle loading/error states**: Use TanStack Query states
3. **Validate forms**: Use React Hook Form + Zod
4. **Optimize renders**: Use React.memo, useMemo, useCallback
5. **Handle errors gracefully**: Show user-friendly error messages
6. **Accessibility**: Use semantic HTML, ARIA labels

### Database

1. **Use migrations**: Never modify schema directly
2. **Add indexes**: For foreign keys and search fields
3. **Use enums**: For fixed value sets
4. **Soft deletes**: Where appropriate
5. **Audit trails**: Log important changes

## Deployment

### Development Deployment

```bash
# Build and start
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

### Production Deployment

```bash
# Use deployment scripts
./scripts/deploy.sh

# Or manual deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Resources

### Documentation
- **Project Overview**: `docs/PROJECT_OVERVIEW.md`
- **Architecture**: `docs/ARCHITECTURE_SUMMARY.md`
- **API Spec**: `docs/GOVERNANCE_API_SPECIFICATION.md`
- **Database Schema**: `docs/DATABASE_SCHEMA.md`

### External Resources
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [TanStack Query](https://tanstack.com/query)

## Getting Help

1. **Check Documentation**: Start with `/docs` folder
2. **Check Logs**: `docker-compose logs -f [service]`
3. **Check Status**: `docker-compose ps`
4. **Review Code**: Look at similar implementations
5. **Test APIs**: Use curl or Postman

---

**Last Updated**: December 2025  
**For Questions**: Review documentation in `/docs` folder




