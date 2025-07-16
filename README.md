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
- **Internationalization**: Lingui.js for i18n support
- **Environment**: T3 OSS env-core for type-safe environment variables
- **Deployment**: AWS Lambda (configurable)
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
   VITE_PUBLIC_URL="http://localhost:3000"
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

# Internationalization
bun lingui:extract   # Extract translatable strings
bun lingui:compile   # Compile translation catalogs
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
├── lib/                # Utility functions
├── locales/            # Translation catalogs
│   ├── en/             # English translations
│   └── fr/             # French translations
└── modules/            # Feature modules
    └── lingui/         # i18n configuration
```

## Key Features

- **Type Safety**: End-to-end type safety with tRPC and Zod validation
- **Modern UI**: Responsive design with Tailwind CSS v4 and Shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Form Handling**: React Hook Form with Zod validation
- **Dark Mode**: Built-in theme switching
- **Real-time**: Optimistic updates with TanStack Query
- **Internationalization**: Full-stack multi-language support with client and server-side translations

## Deployment

### AWS Lambda (Default)

The project is configured for AWS Lambda deployment with streaming support. The configuration is defined in two files:

- **`vite.config.ts`**: Sets the TanStack Start target to `aws-lambda`
- **`nitro.config.ts`**: Configures Nitro for AWS Lambda with streaming enabled

### SST (Ion) - Optional AWS Deployment

[SST](https://sst.dev/) is an optional Infrastructure as Code framework for deploying full-stack applications to AWS. The project includes an SST configuration for streamlined AWS deployment.

**Configuration (`sst.config.ts`):**

```typescript
export default $config({
  app(input) {
    return {
      name: "f7-template", // Application name
      removal: input?.stage === "production" ? "retain" : "remove", // Resource cleanup policy
      protect: ["production"].includes(input?.stage), // Protection from deletion
      home: "aws", // Default cloud provider
      providers: {
        aws: {
          region: "us-east-2", // AWS deployment region
          profile:
            input.stage === "production"
              ? "developer-production" // Production AWS profile
              : "developer-dev", // Development AWS profile
        },
      },
    };
  },
  async run() {
    new sst.aws.TanStackStart("MyWeb", {
      // Creates TanStack Start deployment
      environment: {
        // Environment variables for the app
        DATABASE_URL: process.env.DATABASE_URL,
        VITE_PUBLIC_URL: process.env.VITE_PUBLIC_URL,
      },
    });
  },
});
```

**Key SST Features:**

- **Multi-stage deployment**: Separate dev/production environments
- **Infrastructure as Code**: Versioned AWS resource management
- **Type-safe configuration**: Full TypeScript support for infrastructure
- **AWS native**: Optimized for AWS services and best practices
- **Environment management**: Secure handling of secrets and environment variables

**SST Deployment Commands:**

```bash
# Deploy to development stage
sst deploy

# Deploy to production stage
sst deploy --stage production

# Remove development resources
sst remove

# View deployed resources
sst console
```

**Note**: SST deployment is optional. You can use either the direct AWS Lambda configuration or SST based on your infrastructure preferences.

### Other Platforms

You can change the deployment target by modifying both configuration files:

**In `vite.config.ts`:**

```typescript
tanstackStart({
  target: "aws-lambda", // Change to: "vercel", "node", "static", "cloudflare", etc.
});
```

**In `nitro.config.ts`:**

```typescript
export default defineNitroConfig({
  inlineDynamicImports: true,
  preset: "aws-lambda", // Change to match your deployment target
  awsLambda: {
    streaming: false, // Currently not working as exptected, normally set to true
  },
});
```

Supported targets include:

- `aws-lambda` - AWS Lambda (current configuration)
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
VITE_PUBLIC_URL="https://your-app-domain.com"
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
       VITE_PUBLIC_URL: z.url(),
       VITE_NEW_CLIENT_VAR: z.string(), // Add your new variable here
     },
     runtimeEnv: import.meta.env,
     emptyStringAsUndefined: true,
   });
   ```

### Usage in Code

```typescript
import { serverEnv } from "@/env/server"; // Server-side only
import { clientEnv } from "@/env/client"; // Client-side only

// Access with full type safety
const dbUrl = serverEnv.DATABASE_URL;
const publicUrl = clientEnv.VITE_PUBLIC_URL;
```

## Internationalization (i18n)

This project uses [Lingui.js](https://lingui.dev/) for internationalization with full TypeScript support.

### Supported Languages

- English (en) - Default
- French (fr)

### Using Translations

There are two ways to add translations in your components:

#### 1. Using `<Trans>` Component (Recommended for JSX)

```tsx
import { Trans } from "@lingui/react/macro";

// Simple text
<Trans>Hello World</Trans>

// With variables
<Trans>Welcome {name}!</Trans>

// Inside components
<Button>
  <Trans>Submit</Trans>
</Button>
```

#### 2. Using `useLingui` Hook (For dynamic text)

```tsx
import { useLingui } from "@lingui/react/macro";

function MyComponent() {
  const { t } = useLingui();

  // For attributes, alerts, or non-JSX contexts
  const placeholder = t`Enter your name`;
  const message = t`Task "${taskName}" completed`;

  return <input placeholder={placeholder} />;
}
```

### Key Differences

- **`<Trans>`**: Use for static text in JSX. Provides better extraction and compile-time optimizations.
- **`useLingui().t`**: Use for dynamic text, attributes, or when you need the translated string as a value.

### Adding New Languages

1. Update `src/modules/lingui/i18n.ts`:

   ```typescript
   export const locales = {
     en: "English",
     fr: "French",
     es: "Spanish", // Add new language
   };
   ```

2. Create locale directory:

   ```bash
   mkdir -p src/locales/es
   ```

3. Extract and compile translations:

   ```bash
   bun lingui:extract
   bun lingui:compile
   ```

4. Translate the extracted messages in `src/locales/es/messages.po`

#### Server-Side Error Translation (tRPC)

The application includes full server-side translation support for tRPC error messages:

```tsx
// Server-side errors are automatically translated based on user's locale
// Error messages respect the same language selection as the UI

// In tRPC routers, errors are thrown with translated messages:
const errors = createErrors(ctx.i18n);
throw errors.todoNotFound(); // "Todo not found" or "Tâche introuvable"
```

**Key Server-Side Features:**

- **Automatic locale detection**: Server errors use the same locale as client UI
- **Type-safe error handling**: Consistent error codes with localized messages
- **Cookie-based persistence**: Language preference maintained across requests
- **Complete coverage**: All tRPC error messages are translated

### Development Workflow

1. Write code with `<Trans>` or `t` tagged templates
2. Run `bun lingui:extract` to extract new strings
3. Translate strings in `.po` files (including server error messages)
4. Run `bun lingui:compile` to generate catalogs
5. Commit both `.po` and compiled `.po.ts` files

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
