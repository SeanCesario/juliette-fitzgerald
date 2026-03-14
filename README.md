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

## Admin Panel

The admin panel allows you to manage paintings, about page content, and social links.

### Accessing the Admin Panel

1. **Navigate to the admin panel:**
   - Go to: `https://juliette-fitzgerald.netlify.app/admin`

2. **Login credentials:**
   - **Email:** `example@gmail.com`
   - **Password:** `password123`

### Using the Admin Panel

#### [Video Tutorial](https://drive.google.com/file/d/1o_rSRa2L0eJudTdA6EZZGnOVbp7Zo1tI/view?usp=sharing)

#### Navigation
- **Tabs:** Switch between Paintings, About, and Social Links using the tab navigation
- **Active tab:** Shows in bold with an underline

#### Managing Paintings
1. **Add painting:**
   - Click "Add Painting"
   - Fill in title, description, year, and upload image (all required)
   - Click "Add Painting"

2. **Edit painting:**
   - Click edit icon on painting
   - Update any field (all required)
   - Upload new image or keep existing
   - Click "Update"

3. **Delete painting:**
   - Click edit icon → "Delete" → confirm

#### Managing About Page
1. **Update about:**
   - Navigate to "About" tab
   - Edit text and upload image (both required)
   - Click "Update About"

#### Managing Social Links
1. **Add link:**
   - Click "Add Social Link"
   - Select platform and enter URL/email (both required)
   - Click "Add Link"

2. **Edit link:**
   - Click edit icon on link
   - Update platform or URL/email (both required)
   - Click "Update"

3. **Delete link:**
   - Click edit icon → "Delete" → confirm

### Notes

- **Can't login:** If you forget your password please reach out to the owner
- **Changes not visible:** Refresh the public website after making changes (may take a few minutes to propagate)
- **Image upload issues:** Ensure images are in supported formats (JPEG, PNG, GIF, WebP) and under 5MB

## Delpoyment

After initial setup, any push to the `main` branch automatically deploys:
```bash
git add .
git commit -m "Update content"
git push origin main
```

Netlify rebuilds and deploys automatically (takes 2-3 minutes).
