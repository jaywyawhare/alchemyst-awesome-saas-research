# Alchemyst Frontend - AI Research Assistant Suite

A modern, sleek frontend for the Alchemyst AI Research Assistant Suite, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🎨 Modern Design
- **Dark Theme**: Elegant dark mode with purple gradient accents
- **Glass Morphism**: Backdrop blur effects and translucent cards
- **Responsive Design**: Fully responsive across all device sizes
- **Smooth Animations**: Hover effects and transitions for better UX

### 🤖 AI Agent Interfaces

#### 1. Citation Agent
- Generate citations in multiple formats (APA, MLA, Chicago, Harvard, IEEE)
- Support for DOI and URL inputs
- One-click copy functionality
- Real-time citation generation

#### 2. Literature Review Agent
- Search academic papers by topic
- Configurable result limits
- Detailed paper information display
- Paper categorization and metadata

#### 3. Collaboration Agent
- Real-time comment system
- User avatars and timestamps
- Thread-based discussions
- Paper-specific collaboration

#### 4. Data Extraction Agent
- Extract tables, figures, and statistics from papers
- Multiple extraction types
- Structured data display
- Export functionality

#### 5. Research Proposal Agent
- Generate research proposals from inputs
- Multi-field form with validation
- Proposal improvement with feedback
- Export and copy options

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Custom API service with TypeScript interfaces

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and Tailwind config
│   │   ├── layout.tsx           # Root layout with metadata
│   │   └── page.tsx             # Main dashboard page
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       ├── api.ts               # API service and interfaces
│       └── utils.ts             # Utility functions
├── public/                      # Static assets
└── package.json
```

## API Integration

The frontend connects to the FastAPI backend through a custom API service (`src/lib/api.ts`) that provides:

- Type-safe API calls with TypeScript interfaces
- Error handling and response validation
- Centralized API configuration
- Support for all agent endpoints

### Available Endpoints

- **Citation**: `/api/citation/generate`, `/api/citation/styles`
- **Literature**: `/api/literature/search`, `/api/literature/categorize`
- **Collaboration**: `/api/collaboration/comment`, `/api/collaboration/comments/{paper_id}`
- **Data Extraction**: `/api/data/extract`, `/api/data/analyze`
- **Proposal**: `/api/proposal/generate`, `/api/proposal/improve`

## Design System

### Color Palette
- **Primary**: Purple gradients (`from-purple-500 to-pink-500`)
- **Background**: Dark slate with purple accents
- **Cards**: Translucent white with backdrop blur
- **Text**: White with varying opacity levels

### Typography
- **Font**: Geist Sans (system font fallback)
- **Mono**: Geist Mono for code and citations

### Components
- **Cards**: Glass morphism effect with hover animations
- **Buttons**: Gradient backgrounds with hover states
- **Inputs**: Translucent backgrounds with white borders
- **Badges**: Outlined style with custom colors

## Development

### Adding New Features

1. **New Agent Interface**:
   - Add agent data to the `agents` array
   - Create new tab content in the main component
   - Add corresponding API methods in `api.ts`

2. **New Components**:
   - Create in `src/components/`
   - Follow shadcn/ui patterns
   - Add to `components.json` if needed

3. **Styling**:
   - Use Tailwind CSS classes
   - Follow the established design system
   - Maintain dark theme compatibility

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for Next.js and React
- **Prettier**: Code formatting
- **Components**: Reusable and composable

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name (optional)

## Contributing

1. Follow the established code style
2. Add TypeScript types for new features
3. Test on multiple screen sizes
4. Maintain dark theme compatibility
5. Update documentation for new features

## License

This project is part of the Alchemyst Research Assistant Suite. 