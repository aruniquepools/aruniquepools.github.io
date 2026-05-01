# Testing AR Unique Pools Static Website

## Overview
This is a static HTML/CSS/JS website hosted on GitHub Pages. No backend, no build step, no package manager.

## How to Serve Locally
```bash
cd /home/ubuntu/repos/aruniquepools.github.io
python3 -m http.server 8080 &
```
Then open `http://localhost:8080/index.html` in Chrome.

## Key Pages to Test
| Page | URL | Key Features |
|------|-----|--------------|
| Home | `/index.html` | Hero image, pool cards, video playback |
| Our Team | `/team.html` | 350x250 photo cards |
| Services | `/services.html` | 10 service sections with anchor links (`#readymade`, `#jacuzzi`, etc.) |
| Image Gallery | `/gallery.html` | Lightbox modal (click image to enlarge, X to close) |
| Video Gallery | `/video-gallery.html` | HTML5 `<video>` elements with controls |
| Contact | `/contact.html` | Form fields, WhatsApp button, social icons |
| Blog | `/blog.html` | Article cards with images |
| Exhibition | `/exhibition.html` | Gallery + upcoming events |
| Seller Dashboard | `/seller-dashboard.html` | Login form → dashboard with tabs |

## Interactive Features to Test

### Dropdown Menus
- Hover over **About** → should show Company Detail, Our Team, Certification
- Hover over **Services** → should show all 10 service types
- Hover over **Gallery** → should show Image Gallery, Video Gallery
- Clicking a dropdown item should navigate to the correct page/section

### Image Gallery Lightbox
- Click any image in `/gallery.html` → dark overlay with enlarged image appears
- Click X or outside image → lightbox closes
- JavaScript functions: `openLightbox(src)` and `closeLightbox()`

### Video Playback
- Videos use HTML5 `<video controls>` element
- Video file: `assets/videos/pool-video.mp4`
- Click play button → video should play with progress bar advancing

### Seller Dashboard
- Enter any email/password in login form → click "Login to Dashboard"
- Dashboard shows: Welcome message (extracted from email), 4 stat cards, sidebar
- Sidebar tabs: Overview, My Products, Orders, Inquiries, Profile, Logout
- Click each tab → content area switches
- Click Logout → returns to login form
- This is **client-side only** (no backend) — any credentials work

### Social Media Links
- Header top bar: 6 icons (Facebook, Instagram, YouTube, WhatsApp, LinkedIn, Twitter)
- Footer: 4 social icons + quick links + contact info
- Links should open in new tab (`target="_blank"`)

## Assets Structure
```
assets/
  images/    # All pool/product images (renamed to URL-friendly names)
  videos/    # pool-video.mp4
css/
  style.css  # Shared stylesheet for all pages
```

## Common Issues
- If images don't load, check that `assets/images/` contains the expected files (original files had Windows paths with spaces)
- Video might not autoplay due to browser policies — manual click on play button is expected
- Dropdown menus use CSS `:hover` — they won't work on touch devices without additional JS; mobile menu toggle button handles this
- Seller dashboard is demo-only; there is no real authentication

## Devin Secrets Needed
None — this is a fully static site with no API keys or authentication required.
