# Artist Portfolio

A clean, minimal portfolio website for artists to showcase their work with an admin panel for easy content management.

## Tech Stack

- **React 18** with TypeScript
- **SCSS** for styling (no CSS frameworks)
- **React Router** for navigation
- **Supabase** (database, authentication, storage)
- **Vite** (build tool)
- **Netlify** (deployment platform)

## Features

- 🎨 **Responsive Gallery** - Paintings sorted by year with beautiful grid layout
- 📝 **About Page** - Artist bio and photo with excellent typography
- ⚙️ **Admin Panel** - Secure content management for paintings, about page, and social links
- 🔐 **Authentication** - Protected admin access with email/password login
- 📱 **Mobile-First Design** - Works perfectly on all devices
- ♿ **Accessibility** - WCAG AA compliant with semantic HTML and keyboard navigation
- 🚀 **Performance** - Optimized images, lazy loading, and fast load times

## Live Demo

Coming soon! The portfolio will be deployed to Netlify.

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier is sufficient)
- Git

### Installation Steps

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
   Then edit `.env` with your Supabase credentials (see Supabase Setup below).

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a database password and save it securely

### 2. Get Your Credentials

1. In your Supabase project, go to **Project Settings** → **API**
2. Copy the **Project URL** and **anon public key**
3. Add these to your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Run Database Migration

1. In Supabase, go to **SQL Editor**
2. Copy the contents of `supabase-migration.sql` from this repository
3. Paste and run the SQL to create tables and set up RLS policies

### 4. Create Storage Bucket

1. Go to **Storage** in Supabase
2. Click **Create bucket**
3. Name it: `paintings`
4. Set **Public** to **Yes**
5. This allows images to be publicly accessible

### 5. Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter the admin email and password you'll use to log in
4. This will be your admin login credentials

## Admin Panel Usage

1. Navigate to `/admin/login` on your site
2. Log in with the email/password you created in Supabase
3. **Paintings Tab**: Add, edit, or delete paintings with image uploads
4. **About Page Tab**: Update your bio and artist photo
5. **Social Links Tab**: Manage social media links in the footer

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components (Button, Modal, etc.)
│   ├── admin/           # Admin-specific components
│   ├── ErrorBoundary.tsx
│   └── Layout/          # Main layout components
├── context/            # React context (authentication)
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Home/
│   ├── About/
│   └── Login/
├── styles/             # Global SCSS files
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── main.scss
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
└── main.tsx           # App entry point
```

## Styling Architecture

The project uses a custom SCSS architecture:

- **Variables**: All colors, typography, spacing in `_variables.scss`
- **Mixins**: Reusable patterns in `_mixins.scss`
- **Component-scoped**: Each component has its own SCSS file
- **Mobile-first**: Responsive design starts with mobile, scales up
- **BEM naming**: CSS classes follow Block-Element-Modifier convention

## Deployment

### First-Time Deployment

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://app.netlify.com) and sign up
   - Click **Add new site** → **Import an existing project**
   - Choose GitHub, authorize, select your repository
   - Configure build:
     - Build command: `npm run build` 
     - Publish directory: `dist` 
   - **Environment variables:**
     - `VITE_SUPABASE_URL`: (your Supabase project URL)
     - `VITE_SUPABASE_ANON_KEY`: (your Supabase anon key)
   - Click **Deploy site**
   - Wait 2-3 minutes

3. **Verify deployment:**
   - Visit the Netlify URL
   - Check gallery loads (even if empty)
   - Check about page loads (even if empty)
   - Test admin login
   - Add a test painting through admin panel

4. **(Optional) Custom domain:**
   - In Netlify dashboard: Domain settings → Add custom domain
   - Follow DNS setup instructions
   - Wait for DNS propagation

### Continuous Deployment

After initial setup, any push to the `main` branch automatically deploys:
```bash
git add .
git commit -m "Update content"
git push origin main
```
Netlify rebuilds and deploys automatically (takes 2-3 minutes).

### Creating the Admin User

After deployment, create your admin user in Supabase:

1. Go to your Supabase project dashboard
2. Click **Authentication** → **Users**
3. Click **Add user** → **Create new user**
4. Enter:
   - Email: (artist's email)
   - Password: (create secure password)
   - Auto Confirm User: **ON**
5. Click **Create user**
6. Give these credentials to the artist
7. They can now login at `yoursite.com/admin/login` 

### First Login

1. Go to `yoursite.com/admin/login` 
2. Enter the email and password
3. You'll be redirected to the admin panel
4. Start adding paintings!

### Environment Variables

**For Local Development:**
- Copy `.env.example` to `.env`
- Fill in your actual Supabase credentials
- Restart development server: `npm run dev`

**For Production:**
- Add environment variables in Netlify dashboard
- Required: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_APP_ENV`, `VITE_APP_DEBUG`

### Troubleshooting

**Build fails on Netlify:**
- Check that all environment variables are set correctly
- Verify build command is `npm run build` 
- Check build logs for specific errors

**Images not loading:**
- Verify Supabase storage bucket `paintings` is public
- Check that image_url paths are correct
- Test image URLs directly in browser

**Admin login not working:**
- Verify admin user exists in Supabase Authentication
- Check Supabase credentials in environment variables
- Look for errors in browser console

**Changes not appearing:**
- Clear browser cache
- Check that changes were saved in admin panel
- Verify Supabase data in Table Editor

**Blank page with environment error:**
- Ensure `.env` file exists in project root
- Check that environment variables are correctly formatted
- Restart development server after changes to `.env`

### Post-Deployment Testing Checklist

After deploying, test these items to ensure everything works:

**Public Site (Logged Out):**
- [ ] Gallery page loads and displays any test paintings
- [ ] About page loads correctly (even if empty)
- [ ] Social links appear in footer (even if none added yet)
- [ ] Mobile responsive on real phone
- [ ] Tablet view works
- [ ] Desktop looks good on large screen

**Admin Panel (Logged In):**
- [ ] Admin login page loads
- [ ] Can login with created admin user
- [ ] Can access admin panel after login
- [ ] Can upload a new painting (image uploads to Supabase storage)
- [ ] New painting appears in gallery immediately
- [ ] Can edit existing painting
- [ ] Can delete painting (with confirmation)
- [ ] Can update about page text and image
- [ ] Can add/edit/delete social links
- [ ] Can logout successfully
- [ ] After logout, cannot access /admin (redirects to login)

**Security & Permissions:**
- [ ] Public read access works (visit site logged out, gallery should load)
- [ ] Write operations require authentication (try to edit without login, should fail)
- [ ] RLS policies are working correctly in Supabase dashboard

**Performance:**
- [ ] Site loads quickly (< 3 seconds)
- [ ] Images load with lazy loading
- [ ] No console errors or warnings in production build
- [ ] Mobile navigation works smoothly

## Image Optimization

- Images are automatically optimized with lazy loading
- Supabase storage handles compression
- Recommended: Compress images to under 2MB before upload
- Use JPEG for photos, PNG for graphics with transparency
- WebP format is supported for better compression

## Accessibility Features

- ✅ Semantic HTML5 markup
- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation for all modals
- ✅ Focus management and focus indicators
- ✅ Color contrast meets WCAG AA standards
- ✅ Screen reader friendly
- ✅ Touch-friendly tap targets (44px minimum)

## Performance

- ⚡ Lazy loading for all images
- 🗜️ Optimized build with Vite
- 📦 Code splitting with React Router
- 🖼️ Efficient CSS with SCSS
- 📱 Mobile-first responsive design
- 🚀 Fast load times and smooth interactions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you run into any issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Search existing [GitHub issues](https://github.com/your-username/artist-portfolio/issues)
3. Create a new issue with detailed information

### Common Issues

**Build fails with TypeScript errors**
- Make sure all dependencies are installed: `npm install`
- Check your `.env` file has the correct Supabase credentials

**Images not loading**
- Verify Supabase storage bucket exists and is public
- Check image URLs in the database
- Ensure CORS is properly configured in Supabase

**Admin login not working**
- Verify user exists in Supabase Authentication
- Check that RLS policies allow authentication
- Ensure email/password are correct

---

Built with ❤️ for artists to showcase their beautiful work.
