# Abramovich Media LLC - Cinematic Media Production Website

A modern, cinematic website for Abramovich Media LLC built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## 🎬 Features

- **Cinematic Design**: Dark theme with high contrast, bold typography, and gradient overlays
- **Video Portfolio**: Interactive grid with modal video playback (YouTube/Vimeo/MP4)
- **Pricing Plans**: 3 tiers with detailed modals and upsells
- **Contact Forms**: Modal-based contact forms throughout the site
- **Responsive**: Mobile-first design that works on all devices
- **Performance**: Optimized images, lazy loading, fast loading times

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── portfolio/         # Portfolio page
│   ├── pricing/           # Pricing page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── site/             # Navbar, Footer
│   └── pricing/          # Pricing components
├── data/                 # Content data
│   ├── portfolio.ts      # Video portfolio data
│   └── pricing.ts        # Pricing plans data
└── lib/                  # Utilities
    └── utils.ts          # Tailwind utilities
```

## 📝 Content Management

### Adding Videos
Edit `src/data/portfolio.ts`:
```typescript
{
  id: "video-slug",
  title: "Video Title",
  client: "Client Name",
  thumbnail: "https://picsum.photos/1920/1080?random=1",
  embedType: "youtube" | "vimeo" | "mp4",
  embedIdOrUrl: "video-id-or-url",
  tags: ["cinematic", "brand"],
  duration: "1:30"
}
```

### Updating Pricing
Edit `src/data/pricing.ts`:
```typescript
{
  id: "starter",
  name: "Starter",
  pricePerMonth: 1000,
  description: "Editing only",
  includes: ["8 edited clips / mo", "Brand kit"],
  // ...
}
```

## 🎨 Styling

- **Dark Theme**: High contrast, cinematic feel
- **Typography**: Inter font, bold headings
- **Colors**: CSS custom properties in `globals.css`
- **Components**: shadcn/ui with custom styling

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Options
- Netlify
- AWS Amplify
- Self-hosted

## 📱 Pages

- **Home** (`/`) - Hero with featured work
- **Portfolio** (`/portfolio`) - Filterable video gallery
- **Pricing** (`/pricing`) - 3 pricing tiers with modals
- **Contact** - Modal forms throughout site

## 🔧 Development

```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
npm run lint   # Lint code
```

## 📞 Contact

- Email: hello@abramovichmedia.com
- Website: [abramovichmedia.com](https://abramovichmedia.com)

---

Built with ❤️ by Abramovich Media LLC