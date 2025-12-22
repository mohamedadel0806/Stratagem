# AGENTS.md - Development Guidelines

## Build, Lint & Test Commands

### Frontend (Next.js)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm test`
- **Test (watch mode)**: `npm run test:watch`
- **Test (coverage)**: `npm run test:coverage`
- **Test (single file)**: `npm test -- --testPathPattern=path/to/file.test.tsx`
- **Test (single test)**: `npm test -- --testNamePattern="test name"`
- **E2E Tests**: `npm run test:e2e`

### Backend (NestJS)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm run test`
- **Test (watch mode)**: `npm run test:watch`
- **Test (coverage)**: `npm run test:cov`
- **Test (single file)**: `npm run test -- --testPathPattern=path/to/file.spec.ts`
- **Test (single test)**: `npm run test -- --testNamePattern="test name"`
- **E2E Tests**: `npm run test:e2e`

## Code Style Guidelines

### TypeScript Configuration
- **Frontend**: Strict mode disabled, ES2017 target, JSX with React
- **Backend**: Strict null checks disabled, decorators enabled, ES2017 target

### Naming Conventions
- **Variables/Functions**: camelCase (`userName`, `getUserData`)
- **Components/Types/Interfaces**: PascalCase (`UserProfile`, `ApiResponse`)
- **Files**: kebab-case (`user-profile.tsx`, `risk-service.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### Import Organization
```typescript
// External libraries first
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Internal imports with path aliases
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';

// Relative imports (avoid when possible)
import { utils } from '../utils';
```

### Error Handling
- **Frontend**: Use try-catch blocks with toast notifications for user feedback
- **Backend**: Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`)
- Always handle async operations properly

### Testing Patterns
- **Frontend**: React Testing Library with Jest, mock external dependencies
- **Backend**: Jest with NestJS testing utilities, use test modules
- Test file naming: `.spec.ts` for backend, `.test.tsx` for frontend
- Place test files in `__tests__/` directories or alongside implementation files

### Component Structure (Frontend)
- Use functional components with hooks
- Prefer custom hooks for reusable logic
- Use TypeScript interfaces for props
- Follow component composition patterns

### Service Structure (Backend)
- Use dependency injection with NestJS decorators
- Implement interfaces for better testability
- Use DTOs for request/response validation
- Follow repository pattern for data access

### Formatting
- Use Prettier for consistent code formatting
- Both frontend and backend use Prettier configuration
- Run `npm run format` to format code automatically</content>
<parameter name="filePath">/Users/adelsayed/Documents/Code/Stratagem/AGENTS.md