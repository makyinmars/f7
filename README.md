# F7 - Full-Stack Todo Application

A modern, type-safe Todo application built with TanStack Start, featuring end-to-end type safety and a polished user experience.

## Tech Stack

- **Runtime**: Bun
- **Framework**: TanStack Start v1.121.16 (file-based routing)
- **Frontend**: React 19, TanStack Query, React Hook Form
- **Styling**: Tailwind CSS v4 + Shadcn/ui components
- **Backend**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas
- **Environment**: T3 OSS env-core for type-safe environment variables
- **Deployment**: Vercel (configurable)
- **Code Quality**: Biome for linting & formatting

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) installed
- [Docker](https://docker.com) for PostgreSQL

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd f7
   bun install
   ```

2. **Start PostgreSQL database**
   ```bash
   docker compose up -d
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DATABASE_URL="postgresql://postgres:example@localhost:5432/f7"
   ```

4. **Run database migrations**
   ```bash
   bun db:migrate
   ```

5. **Seed the database (optional)**
   ```bash
   bun db:seed
   ```

6. **Start development server**
   ```bash
   bun dev
   ```

The application will be available at `http://localhost:3000`

## Development Commands

```bash
# Development
bun dev              # Start development server
bun build            # Build for production
bun start            # Start production server
bun typecheck        # Type check the codebase

# Database
bun db:migrate       # Run database migrations
bun db:push          # Push schema changes to database
bun db:studio        # Open Drizzle Studio GUI
bun db:seed          # Seed the database with sample data
bun db:generate      # Generate new migration files

# Code Quality
bun lint             # Lint code with Biome
bun format           # Format code with Biome
bun check            # Run both linting and formatting checks
```

## Project Structure

```
src/
├── routes/              # File-based routing pages
│   ├── api/trpc/       # tRPC API endpoints
│   └── index.tsx       # Home page
├── trpc/               # tRPC configuration and routers
│   └── routers/        # API route handlers
├── db/                 # Database configuration
│   ├── schema/         # Drizzle ORM schemas
│   └── seed/           # Database seeding scripts
├── components/         # React components
│   ├── ui/             # Shadcn/ui components
│   └── todo/           # Todo-specific components
├── services/           # Business logic services
└── lib/                # Utility functions
```

## Key Features

- **Type Safety**: End-to-end type safety with tRPC and Zod validation
- **Modern UI**: Responsive design with Tailwind CSS v4 and Shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Form Handling**: React Hook Form with Zod validation
- **Dark Mode**: Built-in theme switching
- **Real-time**: Optimistic updates with TanStack Query

## Deployment

### Vercel (Default)
The project is configured for Vercel deployment out of the box. Simply connect your repository to Vercel.

### Other Platforms
You can change the deployment target in `vite.config.ts`:

```typescript
tanstackStart({
  target: "vercel" // Change to: "node", "static", "cloudflare", etc.
})
```

Supported targets include:
- `vercel` - Vercel platform
- `node` - Node.js servers
- `static` - Static site generation
- `cloudflare` - Cloudflare Workers
- `netlify` - Netlify platform

## Environment Variables

This project uses [T3 OSS env-core](https://env.t3.gg) for type-safe environment variable validation.

### Server Environment Variables
Defined in `src/env/server.ts` - these are validated at runtime and only accessible on the server:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Client Environment Variables
Defined in `src/env/client.ts` - these must have the `VITE_` prefix and are accessible in the browser:

```env
# Example client variables (currently none are required)
# VITE_PUBLIC_API_URL="https://api.example.com"
```

### Adding New Environment Variables

**For server-side variables** (database connections, API keys, etc.):
1. Add to your `.env` file
2. Add validation to `src/env/server.ts`:
   ```typescript
   export const serverEnv = createEnv({
     server: {
       DATABASE_URL: z.string(),
       NEW_SERVER_VAR: z.string(), // Add your new variable here
     },
     runtimeEnv: process.env,
     emptyStringAsUndefined: true,
   });
   ```

**For client-side variables** (public API URLs, feature flags, etc.):
1. Add to your `.env` file with `VITE_` prefix
2. Add validation to `src/env/client.ts`:
   ```typescript
   export const clientEnv = createEnv({
     clientPrefix: "VITE_",
     client: {
       VITE_NEW_CLIENT_VAR: z.string(), // Add your new variable here
     },
     runtimeEnv: import.meta.env,
     emptyStringAsUndefined: true,
   });
   ```

### Usage in Code
```typescript
import { serverEnv } from "@/env/server"; // Server-side only
import { clientEnv } from "@/env/client";  // Client-side only

// Access with full type safety
const dbUrl = serverEnv.DATABASE_URL;
const apiUrl = clientEnv.VITE_PUBLIC_API_URL;
```

## Architecture Patterns

1. **File-based Routing**: Pages are automatically routed based on file structure in `src/routes/`
2. **Type-safe APIs**: All API communication uses tRPC for end-to-end type safety
3. **Database First**: Schema-driven development with Drizzle ORM
4. **Component Library**: Consistent UI with Shadcn/ui components
5. **Path Aliases**: Use `@/*` imports for clean relative imports

## Development Notes

- Always run `bun typecheck` after making changes
- Database migrations must be run manually after schema changes
- Use Drizzle Studio (`bun db:studio`) for database exploration
- Follow the existing code conventions and patterns
- Prefer composition over inheritance for component design

## Contributing

1. Ensure all tests pass and types check: `bun typecheck`
2. Format code: `bun format`
3. Lint code: `bun lint`
4. Test database changes with `bun db:studio`
