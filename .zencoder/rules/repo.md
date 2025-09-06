---
description: Repository Information Overview
alwaysApply: true
---

# Cyberpunk Dashboard Information

## Summary
A dashboard design project called "SynergySphere" built with Next.js. This project features a modern UI with a dark cyberpunk aesthetic, providing project management functionality including dashboards, task management, team management, and system settings. The project is automatically synced with v0.app deployments and deployed on Vercel.

## Structure
- **app/**: Next.js application pages and routes
  - **agent-network/**: Agent network page components
  - **command-center/**: Command center dashboard components
  - **intelligence/**: Intelligence section components
  - **missions/**: Missions management components
  - **operations/**: Operations management components
  - **projects/**: Projects management components
  - **systems/**: System settings components
  - **tasks/**: Task management components
  - **team/**: Team management components
- **components/**: Reusable UI components
  - **ui/**: Shadcn UI components (buttons, cards, inputs, etc.)
- **lib/**: Utility functions and shared code
- **public/**: Static assets (images, icons)
- **styles/**: Global CSS styles

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.x
**Framework**: Next.js 14.2.16
**Build System**: Next.js build system
**Package Manager**: pnpm

## Dependencies
**Main Dependencies**:
- React 18.x and React DOM 18.x
- Next.js 14.2.16
- Radix UI components (various UI primitives)
- Tailwind CSS 3.4.17
- Lucide React 0.454.0 (icons)
- Next Themes 0.4.4 (theming)
- Recharts 2.15.0 (charting library)
- Zod 3.24.1 (schema validation)
- React Hook Form 7.54.1 (form handling)

**Development Dependencies**:
- TypeScript 5.x
- Node.js types (v22)
- React types (v18)
- PostCSS 8.5
- Tailwind CSS 3.4.17

## Build & Installation
```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Main Files & Resources
**Entry Points**:
- `app/layout.tsx`: Root layout component
- `app/page.tsx`: Main dashboard page with navigation
- `app/globals.css`: Global CSS styles

**Configuration Files**:
- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `components.json`: Shadcn UI components configuration
- `postcss.config.mjs`: PostCSS configuration

**Key Components**:
- Dashboard navigation with collapsible sidebar
- Project management views
- Task management interface
- Team member management
- System settings and configuration