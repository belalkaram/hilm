# Dream Analyzer Application

## Overview

This is a full-stack Arabic dream analysis application that uses Google's Gemini AI to interpret dreams. The system is built with a React frontend and Node.js/Express backend, featuring a modern dark theme optimized for Arabic content (RTL layout).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Language**: Arabic (RTL) with Google Fonts (Cairo)

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini AI for dream analysis
- **Authentication**: Express sessions with bcrypt password hashing
- **Session Storage**: Memory-based session storage (extendable to database)

### Build System
- **Development**: tsx for server development
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for production bundling
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend

## Key Components

### Database Schema
```typescript
- users: id, email, password, name, createdAt
- dreamAnalyses: id, userId, dreamText, analysis, createdAt
- sessions: id, userId, guestUsageCount, userUsageCount, createdAt
```

### API Endpoints
- **Authentication**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/user`
- **Dream Analysis**: `/api/dreams/analyze`, `/api/dreams/usage`
- **Session Management**: Automatic session tracking for usage limits

### Usage Limits
- **Guest Users**: 2 analyses per session
- **Registered Users**: 10 analyses per day
- **Session Tracking**: Persistent across browser sessions

## Data Flow

1. **User Registration/Login**: Users can register or use as guests
2. **Dream Input**: Users write their dreams in Arabic text
3. **AI Processing**: Dreams are sent to Google Gemini AI with Arabic prompts
4. **Analysis Return**: Structured Arabic interpretation with symbols, psychological meanings, and recommendations
5. **Storage**: Analyses are saved for registered users
6. **Usage Tracking**: Session-based limits enforced

## External Dependencies

### AI Service
- **Google Gemini AI**: Primary AI service for dream interpretation
- **API Configuration**: Supports multiple environment variable names for API keys
- **Language**: Configured for Arabic responses with cultural context

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: WebSocket-based connection pooling
- **Migrations**: Drizzle Kit for schema management

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Font Awesome**: Additional icons for Arabic context

## Deployment Strategy

### Development Environment
- **Port**: 5000 (configurable)
- **Database**: Requires DATABASE_URL environment variable
- **AI Service**: Requires GEMINI_API_KEY or similar environment variable
- **Session Secret**: Uses SESSION_SECRET environment variable

### Production Build
- **Frontend**: Built to `dist/public` directory
- **Backend**: Bundled to `dist/index.js`
- **Static Assets**: Served from build directory
- **Environment**: NODE_ENV=production

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment**: Autoscale deployment target
- **Port Mapping**: Internal 5000 to external 80
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## User Preferences

Preferred communication style: Simple, everyday language.

## New Features Added

### Dream History System
- **User Dream History**: Added `/history` page for registered users to view their previous dream analyses
- **Chronological Display**: Dreams are sorted from newest to oldest with timestamps
- **Rich Content Display**: Each dream shows original text and formatted AI analysis with markdown support
- **Access Control**: History page requires user authentication, redirects to login if not authenticated

### AdSense Integration
- **Strategic Ad Placement**: Added designated AdSense ad spaces across all pages
- **Multiple Ad Formats**: 
  - Top/Bottom Banners (728x90)
  - Medium Rectangle (300x250) 
  - Square (250x250)
  - Small Rectangle (250x250)
- **Responsive Design**: Ad spaces designed to work across different screen sizes
- **Visual Placeholders**: Clear placeholders showing where real AdSense ads will be placed

### Enhanced Navigation
- **History Link**: Added "سجل الأحلام" link in header for authenticated users
- **Mobile Menu**: Updated mobile navigation to include history page access
- **User Context**: Navigation dynamically shows/hides based on authentication status

### API Enhancements
- **Dream History Endpoint**: Added `/api/dreams/history` to retrieve user's previous analyses
- **Proper Error Handling**: Unauthorized access returns appropriate error messages
- **Data Sorting**: Server-side sorting of dreams by creation date

## Changelog

Changelog:
- June 26, 2025. Initial setup
- June 26, 2025. Added dream history system and AdSense ad spaces integration