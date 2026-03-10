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

After initial setup, any push to the `main` branch automatically deploys:
```bash
git add .
git commit -m "Update content"
git push origin main
```

Netlify rebuilds and deploys automatically (takes 2-3 minutes).
