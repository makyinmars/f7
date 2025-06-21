# AGENTS.md - TanStack Start Full-Stack Project

## Build/Test/Lint Commands
- `bun dev` - Start development server
- `bun build` - Production build with type checking
- `bun typecheck` - Run TypeScript type checking
- `bun check` - Run Biome linting and formatting
- `bun lint:fix` - Auto-fix linting issues
- `bun format` - Format code with Biome
- `bun lingui:extract` - Extract translatable strings
- `bun lingui:compile` - Compile translation catalogs
- No test framework configured - verify changes manually

## Code Style Guidelines
- **Formatting**: 2-space indentation, double quotes, Biome formatter
- **Imports**: Use `@/` path aliases, organize imports automatically, prefer type imports with `import type`
- **Types**: Strict TypeScript, avoid `any`, use Zod for validation, prefer `const` over `let`
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Error Handling**: Use tRPC error handling, avoid try/catch where possible
- **React**: Functional components, React Hook Form + Zod validation, optimistic updates
- **Database**: Drizzle ORM with PostgreSQL, schema-first approach
- **Styling**: Tailwind CSS v4, Shadcn/ui components, `cn()` utility for class merging
- **i18n**: Use `<Trans>` for JSX text, `useLingui().t` for dynamic text, extract/compile translations regularly

## Project Rules (from .cursor/rules/project-guide.mdc)
- Keep functions single-purpose unless composable/reusable
- Avoid unnecessary destructuring and else statements
- Prefer single-word variable names where possible
- Use Bun APIs (e.g., `Bun.file()`) over Node.js equivalents
- Always run `bun typecheck` after editing files

## Additional Context
See CLAUDE.md for comprehensive project overview, architecture patterns, and development workflow details.
