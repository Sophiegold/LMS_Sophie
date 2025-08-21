# EduPath Learning Management System

## Overview

EduPath is a modern Learning Management System (LMS) built as a full-stack web application. The platform enables users to enroll in courses organized by groups, track their learning progress, and manage their educational journey through an intuitive dashboard interface. The system features user authentication via Replit Auth, course management capabilities, enrollment tracking, and progress monitoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing, providing separate routes for landing, dashboard, and course detail pages
- **State Management**: TanStack Query (React Query) for server state management, caching, and data synchronization
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible interface components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Authentication**: Replit Auth with OpenID Connect (OIDC) for secure user authentication and session management
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple for persistent session management
- **API Design**: RESTful endpoints for course groups, courses, enrollments, and user management

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless configuration for scalability
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Core Tables**:
  - Users table for profile management (mandatory for Replit Auth)
  - Sessions table for authentication session persistence
  - Course groups for organizing related courses
  - Courses with metadata (title, description, duration, thumbnails)
  - Enrollments linking users to courses with progress tracking

### Authentication & Authorization
- **Provider**: Replit Auth integration with OIDC discovery for secure authentication
- **Session Management**: Express session middleware with PostgreSQL session store
- **Security**: HTTP-only cookies, CSRF protection, and secure session configuration
- **User Flow**: Automatic redirection to login for unauthenticated users, with seamless integration into the Replit ecosystem

### Development & Deployment
- **Development**: Hot module replacement with Vite, TypeScript checking, and development error overlay
- **Build Process**: Separate client and server builds - Vite for frontend static assets, esbuild for server bundle
- **Environment**: Designed for Replit deployment with specific Replit integrations and banner support
- **Code Quality**: TypeScript for type safety, ESM modules throughout, and structured path aliases for clean imports

## External Dependencies

### Database Services
- **Neon Serverless PostgreSQL**: Primary database with connection pooling and serverless scaling
- **Drizzle ORM**: Database toolkit with PostgreSQL adapter and Zod integration for schema validation

### Authentication Services
- **Replit Auth**: OpenID Connect provider for user authentication and profile management
- **OpenID Client**: Standards-compliant OIDC client implementation with Passport.js integration

### UI & Component Libraries
- **Radix UI**: Comprehensive set of accessible React components for complex UI interactions
- **Lucide React**: Icon library for consistent iconography throughout the application
- **React Hook Form**: Form state management with validation via @hookform/resolvers

### Development Tools
- **Vite**: Build tool with React plugin and development server capabilities
- **TypeScript**: Static type checking for both client and server code
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Date-fns**: Date manipulation and formatting utilities for course scheduling features