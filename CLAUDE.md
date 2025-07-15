# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Todo application built with TanStack Start, a type-safe, client-first React framework. It uses tRPC for end-to-end type safety between frontend and backend.

## Tech Stack

- **Runtime**: Bun
- **Framework**: TanStack Start (v1.121.16) with file-based routing
- **Frontend**: React 19, TanStack Query, React Hook Form, Zod validation
- **Styling**: Tailwind CSS v4 with Shadcn/ui components
- **Backend**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Drizzle ORM
- **Internationalization**: Lingui.js for i18n support
- **Deployment**: Configured for AWS Lambda

## Common Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start

# Type check the codebase
bun typecheck

# Database commands
bun db:migrate      # Run migrations
bun db:push         # Push schema changes to database
bun db:studio       # Open Drizzle Studio GUI
bun db:seed         # Seed the database
bun db:generate     # Generate migration files

# Development mode database commands (using custom env file)
bun --env-file=.env.franklin db:migrate
bun --env-file=.env.franklin db:push
bun --env-file=.env.franklin db:studio
bun --env-file=.env.franklin db:seed
bun --env-file=.env.franklin db:generate

# Internationalization commands
bun lingui:extract  # Extract translatable strings
bun lingui:compile  # Compile translation catalogs
```

## Local Database Setup

The project uses PostgreSQL via Docker Compose:

```bash
docker compose up -d  # Start PostgreSQL container
```

Database connection string: `postgresql://postgres:example@localhost:5432/f7`

## Architecture

### File Structure

- `/src/routes/` - TanStack Router pages with file-based routing
- `/src/routes/api/trpc/` - tRPC API endpoint
- `/src/trpc/routers/` - tRPC route handlers (business logic)
- `/src/db/schema/` - Drizzle ORM schema definitions
- `/src/components/ui/` - Shadcn/ui components
- `/src/components/todo/` - Todo-specific components
- `/src/services/` - Business logic services
- `/src/locales/` - Translation catalogs for each language
- `/src/modules/lingui/` - i18n configuration and setup

### Key Patterns

1. **Type-Safe API Calls**: All API communication goes through tRPC, ensuring end-to-end type safety
2. **Database Access**: Use Drizzle ORM for all database operations with the schema defined in `/src/db/schema/`
3. **Form Handling**: React Hook Form with Zod validation for type-safe forms
4. **Component Library**: Shadcn/ui components are in `/src/components/ui/` - use these for consistent UI
5. **Internationalization**: Use `<Trans>` from `@lingui/react/macro` for JSX text and `useLingui().t` for dynamic text

### Path Aliases

- `@/*` maps to `./src/*` - always use this for imports

## Important Notes

- Try to keep things in one function unless composable or reusablte
- DO NOT do unnecessary destructuring of variables
- DO NOT use else statements unless necessary
- DO NOT use try catch if it can be avoided
- AVOID try catch where possible
- AVOID else statements
- AVOID using `any` type
- AVOID let statements
- PREFER single word variable names where possible
- Use as many bun apis as possible like Bun.file()
- No test or lint scripts are currently configured
- The project uses Bun as the JavaScript runtime (not Node.js or npm)
- Database migrations must be run manually after schema changes
- AWS Lambda deployment is configured in `vite.config.ts`
- ALWAYS run `bun typecheck` after editing files to ensure type safety
- When adding translations, use `<Trans>` for JSX and `useLingui().t` for dynamic text
- Run `bun lingui:extract` to extract new strings and `bun lingui:compile` after translating
