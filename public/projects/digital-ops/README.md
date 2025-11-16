# Embedded Purdue Website

Next.js-based website for Purdue Embedded Systems Club with integrated content management.

## Architecture

The website consists of two main components:

1. **Next.js Frontend** - Public website and admin panel (this directory)
2. **FastAPI Backend** - Content and event management API (`embedded-purdue.api/`)

## Frontend Setup

### Prerequisites

- Node.js 18+ and npm
- Access to the FastAPI backend (local or deployed)

### Installation

```bash
npm install
```

### Environment Configuration

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

Leave `NEXT_PUBLIC_API_BASE` empty for production deployments using same-origin API.

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
app/                    # Next.js App Router pages
  page.tsx             # Homepage
  about/               # About page
  projects/            # Projects listing and detail pages
  workshops/           # Workshops listing and detail pages
  team/                # Team page
  sponsors/            # Sponsors page
  forms/               # Member forms admin
  api/                 # Admin panel and management pages
    page.tsx           # Admin hub, events, media upload
    project-applications/ # Project applications review

components/            # React components
  navigation.tsx       # Site navigation
  footer.tsx          # Site footer
  Markdown.tsx        # Markdown renderer with custom styling
  ui/                 # Shadcn UI components

content/              # Static content
  workshops/          # Workshop markdown files

lib/                  # Utility functions
  api.ts             # API client functions
  gcal.ts            # Google Calendar helpers
  markdown.ts        # Markdown processing
  media.ts           # Media fetching (API + local fallback)
  projects.ts        # Project data and utilities

public/              # Static assets
  projects/          # Project-specific media
  workshops/         # Workshop-specific media
  team/              # Team photos

styles/              # Global styles
```

## Content Management

### Projects

Projects are managed through the admin panel at `/api` (Media section).

**Structure:**
- Markdown file: `public/projects/{slug}/index.md` or `README.md`
- Images: `public/projects/{slug}/*.{png,jpg,webp}`
- Metadata in markdown frontmatter

**Creating a new project:**

1. Navigate to `/api` and sign in
2. Go to "Manage Media"
3. Select "Project" type
4. Click "Create new project"
5. Enter slug (URL-safe identifier)
6. Submit to create GitHub PR with folder structure

**Adding media to existing project:**

1. Select project from dropdown
2. Upload images or documentation
3. PR will be created for review

### Workshops

Workshops follow the same pattern but use:
- Markdown: `content/workshops/{slug}.md`
- Images: `public/workshops/{slug}/*.{png,jpg,webp}`

### Events

Events sync with Google Calendar via the API.

1. Navigate to `/api` → "Manage Events"
2. Fill in event details
3. Optionally configure recurrence
4. Event appears on homepage automatically

### Team Members

Team members are managed via the Forms page at `/forms`.

**CSV Import:**
- Required columns: `name`, `major`, `position`, `level`
- Optional columns: `email`, `linkedin`, `photoUrl`
- Level must be: `exec`, `pm`, or `admin`

**Manual Entry:**
- Fill in form fields
- Can add multiple members at once
- Click "Add another" for additional rows

## Admin Access

### Authentication

Admin functions require a token configured in the backend.

**Login:**
1. Navigate to `/api`
2. Username: `stm32fan`
3. Password: Your `ADMIN_TOKEN` from backend `.env`
4. API Base: `http://127.0.0.1:8000` (local) or production URL

### Available Admin Functions

**Events Management:**
- Create calendar events
- Configure recurring events
- Set locations and descriptions

**Media Management:**
- Upload images and files
- Create new projects/workshops
- Open GitHub PRs for content changes

**Forms Management:**
- Import member data via CSV
- Manual member entry
- Search and list members

**Project Applications:**
- Review submitted applications
- Download resumes
- Export to CSV

## Styling and Theming

The site uses Tailwind CSS with Shadcn UI components.

**Theme Configuration:**
- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - CSS variables for theming
- `components/theme-provider.tsx` - Dark mode support

**Custom Styling:**
- Markdown: `components/Markdown.tsx`
- Code blocks: Syntax highlighted with custom CSS
- Tables: Responsive with striped rows

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

**Environment Variables:**
- Set `NEXT_PUBLIC_API_BASE` to your production API URL
- Leave empty if API is same-origin

### Static Export

```bash
npm run build
```

Output in `out/` directory.

Note: Admin functions require server-side rendering and will not work in static export.

## Troubleshooting

### API Connection Issues

1. Verify API is running: `curl http://127.0.0.1:8000/api/health`
2. Check `NEXT_PUBLIC_API_BASE` in `.env.local`
3. Test connection in admin panel using "Test connection" button

### Workshop/Project Creation Fails

Common causes:
- Missing `GITHUB_TOKEN` in backend `.env`
- Invalid admin token
- Slug already exists (409 error)
- GitHub API rate limit

Check browser console for detailed error messages.

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

## Development Notes

### Adding New Pages

1. Create file in `app/` directory
2. Export default React component
3. Navigation updates automatically

### Modifying Data Models

Update types in:
- `lib/projects.ts` - Project types
- `lib/api.ts` - API response types
- Component props as needed

### Custom Components

Shadcn components in `components/ui/` can be regenerated:

```bash
npx shadcn-ui@latest add [component-name]
```

## License

MIT License - See repository for details.
