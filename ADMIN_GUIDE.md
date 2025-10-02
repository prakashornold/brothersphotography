# Admin Guide - Brothers Photography

## Complete Admin Panel Documentation

### Access the Admin Panel

1. Navigate to: `/admin`
2. Enter password: `Cash789@@`
3. Click "Login"

You'll be redirected to the admin dashboard.

---

## Dashboard Overview

The admin dashboard has 5 main sections:

1. **Blog Posts** - Manage blog content
2. **Image Library** - General image uploads
3. **Landing Page** - Landing page hero images
4. **Home Page** - Home page images (hero, gallery)
5. **Site Logo** - Website logo management

---

## ✅ COMPLETE - Application is Fully Dynamic

**All pages now load content from the database:**
- ✅ Landing Page (`/`) - Hero slider from database
- ✅ Home Page (`/home`) - Hero carousel and gallery from database
- ✅ Blog Page (`/blog`) - All posts from database
- ✅ Blog Post Page (`/blog/:slug`) - Individual posts from database
- ✅ Search Page (`/search`) - Searches database posts
- ✅ Navigation - Logo from database
- ✅ All static mock data removed

---

## Quick Start

### Your First Steps

1. **Upload a Logo**
   - Go to "Site Logo" tab
   - Click "Update Logo"
   - Select your logo (PNG recommended, 200x60px)
   - Save

2. **Add Landing Page Images**
   - Go to "Landing Page" tab
   - Upload 3-5 hero images
   - Set as "Active"
   - Images appear on `/` immediately

3. **Add Home Page Content**
   - Go to "Home Page" tab
   - Upload hero images (Category: "hero")
   - Upload gallery images (Category: "gallery")
   - Mark as active

4. **Create Your First Blog Post**
   - Upload featured image to "Image Library"
   - Go to "Blog Posts" tab
   - Click "New Post"
   - Fill in details
   - Save

---

## 1. Blog Posts Management

### Create a New Post

1. Click "New Post" button
2. Fill in the form:
   - **Title*** (required)
   - **Slug**: Auto-generated or custom
   - **Category*** (required)
   - **Featured Image URL**: Upload to Image Library first
   - **Excerpt*** (required)
   - **Content*** (required)
   - **Tags**: Comma-separated
3. Click "Save Post"

### Tips
- Slugs are auto-generated from titles
- Upload featured images (1200x630px)
- Write 150-200 character excerpts
- Add 3-5 tags per post

---

## 2. Image Library

Upload and manage general-purpose images.

1. Click "Upload Image"
2. Select file (max 10MB)
3. Click "Copy URL" to use in posts
4. Click "Delete" to remove

---

## 3. Landing Page Images

Manage the hero slider on landing page (`/`).

### Upload Process

1. Click "Upload Image"
2. Configure:
   - **Alt Text**: Accessibility description
   - **Section**: "hero" (for slider)
   - **Display Order**: 0, 1, 2... (sequence)
   - **Active**: Check to display
3. Save

**Result**: Images appear in landing page slider immediately

### Tips
- Upload 3-5 images for best effect
- Use 1920x1080px or larger
- Compress images (< 500KB)
- Lower display order = appears first

---

## 4. Home Page Images

Manage images on home page (`/home`).

### Categories
- **hero**: Carousel at top of page
- **gallery**: Photo gallery section
- **testimonials**: Customer photos
- **features**: Feature highlights
- **team**: Team member photos
- **portfolio**: Portfolio showcase

### Upload Process

1. Click "Upload Image"
2. Configure:
   - **Category**: Choose from above
   - **Alt Text**: Description
   - **Caption**: Optional hover text
   - **Display Order**: Position
   - **Active**: Toggle visibility
3. Save

### Bulk Operations

1. **Select images**: Check boxes
2. **Actions available**:
   - Activate selected
   - Deactivate selected
   - Delete selected

**Result**: Images appear in their category sections immediately

---

## 5. Site Logo

Manage the navigation logo.

### Update Logo

1. Click "Update Logo"
2. Upload file:
   - Formats: PNG, JPG, WebP, SVG
   - Max 2MB
   - Recommended: 200x60px transparent PNG
3. Save

### Reset Logo
Click "Reset Logo" to restore default

**Result**: Logo updates across all pages immediately (navigation bar, mobile menu)

---

## How It Works - Database Integration

### Content Flow

```
Admin Panel → Database → Website Pages
```

Everything is real-time and dynamic:

1. **You upload/edit in admin**
2. **Saves to PostgreSQL database**
3. **Pages load from database instantly**
4. **No manual refresh needed**

### What's Dynamic

| Page | What Loads from Database |
|------|-------------------------|
| Landing (`/`) | Hero slider images |
| Home (`/home`) | Hero carousel, gallery images, recent blog posts |
| Blog (`/blog`) | All blog posts with pagination |
| Post (`/blog/:slug`) | Individual post content |
| Search (`/search`) | All posts for searching |
| Navigation | Site logo |

**No more static mock data!** Everything you see comes from what you upload.

---

## Complete Workflow Examples

### Publishing a Blog Post

1. **Upload Image**:
   - Image Library → Upload → Copy URL

2. **Create Post**:
   - Blog Posts → New Post → Fill form → Paste image URL → Save

3. **Verify**:
   - Visit `/blog` → See your post
   - Search page works automatically
   - Home page shows as recent post

### Setting Up Landing Page

1. **Upload Images**:
   - Landing Page → Upload 3-5 images
   - Section: "hero"
   - Display order: 0, 1, 2, 3, 4
   - Mark all as Active

2. **Verify**:
   - Visit `/` → See slider working
   - Images transition every 5 seconds

### Setting Up Home Page

1. **Hero Images**:
   - Home Page → Upload → Category: "hero"
   - Add 3-5 images → Active

2. **Gallery Images**:
   - Home Page → Upload → Category: "gallery"
   - Add multiple images → Active
   - Add captions for context

3. **Verify**:
   - Visit `/home`
   - See hero carousel
   - Scroll to gallery section

---

## Image Guidelines

### Optimal Sizes

| Purpose | Size | Max File |
|---------|------|----------|
| Blog Featured | 1200x630px | 500KB |
| Hero/Slider | 1920x1080px | 800KB |
| Gallery | 1200x800px | 400KB |
| Logo | 200x60px | 50KB |

### Compression Tools
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/

---

## Troubleshooting

### Images Not Showing
- ✓ Check "Active" is enabled
- ✓ Verify correct category/section
- ✓ Hard refresh: Ctrl+F5 (Win) or Cmd+Shift+R (Mac)
- ✓ Check display order is set

### Upload Failed
- ✓ File size < 10MB
- ✓ Format: JPG, PNG, GIF, WebP
- ✓ Check internet connection
- ✓ Try different browser

### Can't Login
- ✓ Password: `Cash789@@` (case-sensitive)
- ✓ Clear browser cache
- ✓ Try incognito mode

---

## Best Practices

### Content
✅ Use descriptive titles
✅ Write compelling excerpts
✅ Add alt text to ALL images
✅ Use relevant tags
✅ Proofread before saving

### Images
✅ Compress before upload
✅ Use appropriate dimensions
✅ Add alt text
✅ Organize with display order
✅ Remove unused images

### Workflow
✅ Upload images to library first
✅ Copy URLs for blog posts
✅ Mark items active when ready
✅ Test on mobile devices
✅ Check dark mode

---

## Keyboard Shortcuts

- `Esc` - Close dialog
- `Ctrl/Cmd + R` - Refresh
- `Ctrl/Cmd + Shift + R` - Hard refresh
- `Tab` - Next field
- `Shift + Tab` - Previous field

---

## FAQs

**Q: How many images can I upload?**
A: Unlimited (each under 10MB)

**Q: Can I upload videos?**
A: No, images only

**Q: Can I delete multiple images?**
A: Yes, on Home Page tab use bulk delete

**Q: How do I unpublish a post?**
A: Delete it (draft feature coming soon)

**Q: Where are images stored?**
A: AWS S3 cloud storage

**Q: Can I edit uploaded images?**
A: No, edit before uploading

**Q: How do I change password?**
A: Contact system administrator

**Q: Multiple admin sessions?**
A: Yes, supported

---

## Summary

### What You Can Do

✅ **Blog**: Create, edit, delete posts
✅ **Images**: Upload, copy URLs, delete
✅ **Landing Page**: Manage hero slider
✅ **Home Page**: Manage hero carousel and gallery
✅ **Logo**: Upload and update site logo
✅ **Search**: Automatically indexes all posts
✅ **Bulk Operations**: Manage multiple images at once

### What's Automatic

✅ All pages load from database
✅ Real-time updates
✅ SEO-friendly URLs
✅ Pagination (10 posts/page)
✅ Image optimization ready
✅ Mobile responsive
✅ Dark mode support

### Status

✅ **Complete**: All features working
✅ **Dynamic**: No static content
✅ **Production Ready**: Deploy anytime
✅ **Secure**: Password protected
✅ **Fast**: Optimized database queries

---

**Last Updated**: 2025-10-02
**Version**: 2.0.0
**Status**: ✅ Fully Dynamic & Production Ready

---

Need more help? Check:
- AWS_S3_SETUP.md (AWS configuration)
- S3_USAGE_GUIDE.md (Upload details)
- IMPLEMENTATION_SUMMARY.md (Technical overview)
