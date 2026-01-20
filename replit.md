# Grupo Rugido Lead Capture Form

## Overview

This is a multi-step lead capture form application for Grupo Rugido, a business consulting company focused on helping companies structure their revenue and sales processes. The application collects information from potential clients through a 9-step questionnaire, stores submissions in a PostgreSQL database, and provides an admin dashboard for viewing submissions and funnel analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Utility functions and API client in `client/src/lib/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api/` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Serverless PostgreSQL

The server uses a clean separation of concerns:
- `server/index.ts`: Express app setup and middleware
- `server/routes.ts`: API route definitions
- `server/storage.ts`: Data access layer with database operations
- `server/db.ts`: Database connection configuration

### Data Storage
- **Database**: PostgreSQL via Neon Serverless
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Schema Validation**: Drizzle-Zod for runtime validation

Key database tables:
- `users`: Basic user authentication (id, username, password)
- `form_submissions`: Lead capture data with fields for role, bottleneck, revenue, team size, segment, urgency, partner status, social media, and contact info
- `step_events`: Funnel tracking with session-based step progression analytics

### API Structure
- `POST /api/submissions` - Create new form submission
- `GET /api/submissions` - Retrieve all submissions
- `GET /api/submissions/export` - Export submissions as CSV
- `POST /api/step-events` - Track funnel step progression
- `GET /api/analytics/funnel` - Get funnel analytics data

### Development Workflow
- Development server runs with Vite middleware for HMR
- Production build bundles frontend to `dist/public` and backend to `dist/index.js`
- Database migrations managed via `drizzle-kit push`

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Cloud-hosted PostgreSQL database
- Connection via `DATABASE_URL` environment variable
- Uses `@neondatabase/serverless` driver for serverless-compatible connections

### Third-Party UI Libraries
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library
- **react-input-mask**: Phone number input formatting
- **date-fns**: Date manipulation utilities
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Calendar/date picker
- **vaul**: Drawer component
- **recharts**: Charting library for analytics dashboard

### Build and Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Backend bundling
- **Drizzle Kit**: Database schema management and migrations
- **TypeScript**: Type checking across the entire codebase