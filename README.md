# Juliette Fitzgerald - Art Portfolio

A clean, minimal portfolio website showcasing Juliette Fitzgerald's artwork with an admin panel for easy content management.

**Website:** https://juliette-fitzgerald.netlify.app/

## Tech Stack

- **React 18** with TypeScript
- **SCSS** for styling
- **Supabase** (database, authentication, storage)
- **Netlify** (deployment platform)

## Project Layout

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components (Button, Modal, etc.)
│   ├── admin/           # Admin-specific components
│   └── Layout/          # Main layout components
├── context/            # React context (authentication)
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Home/
│   ├── About/
│   └── Login/
├── styles/             # Global SCSS files
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
└── main.tsx           # App entry point
```

## How to Run Locally

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd artist-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Continuous Deployment

After initial setup, any push to the `main` branch automatically deploys:
```bash
git add .
git commit -m "Update content"
git push origin main
```

Netlify rebuilds and deploys automatically (takes 2-3 minutes).
