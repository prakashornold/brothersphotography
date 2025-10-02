# Quick Start Guide - Brothers Photography

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js installed
- AWS account (for S3 storage)
- Supabase account (already configured)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: AWS S3 Setup (Required for Image Uploads)

1. **Create S3 Bucket**
   - Name: `brothersphotography` (or your choice)
   - Region: `us-east-1` (or your choice)
   - Uncheck "Block all public access"

2. **Add Bucket Policy** (in S3 Console → Permissions)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::brothersphotography/*"
     }]
   }
   ```

3. **Enable CORS** (in S3 Console → Permissions → CORS)
   ```json
   [{
     "AllowedHeaders": ["*"],
     "AllowedMethods": ["GET", "PUT", "POST"],
     "AllowedOrigins": ["*"]
   }]
   ```

4. **Create IAM User**
   - Name: `brothersphotography-uploader`
   - Permission: S3 PutObject, GetObject
   - Save Access Key ID and Secret Access Key

5. **Add to Supabase Secrets**
   - Go to Supabase Dashboard → Your Project → Edge Functions
   - Add these environment variables:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=brothersphotography
   ```

### Step 3: Run Application
```bash
npm run dev
```

Visit: `http://localhost:5173`

### Step 4: Access Admin Panel
1. Go to: `http://localhost:5173/admin`
2. Password: `Cash789@@`
3. Start uploading images!

## 📋 What You Can Do

### Admin Panel Features:
- ✅ **Blog Posts** - Create and manage blog content
- ✅ **Image Library** - Upload and manage general images
- ✅ **Landing Page** - Manage landing page images (hero, gallery, features)
- ✅ **Home Page** - Manage home page images (gallery, testimonials, portfolio)
- ✅ **Site Logo** - Upload and update your site logo

### Image Upload:
- Formats: JPG, PNG, GIF, WebP
- Max Size: 10MB per file
- Automatic unique filenames
- Stored in AWS S3
- Public URLs generated automatically

### Blog Management:
- Rich content editing
- Categories and tags
- Featured images
- SEO-friendly URLs
- Pagination (10 posts/page)

## 🎯 Quick Tasks

### Upload Your First Image
1. Admin → Landing Page tab
2. Click "Upload Image"
3. Select file
4. Add alt text
5. Choose section
6. Save

### Create Your First Blog Post
1. Admin → Blog Posts tab
2. Click "New Post"
3. Fill in title, category, excerpt, content
4. Add featured image URL
5. Save

### Change Site Logo
1. Admin → Site Logo tab
2. Click "Update Logo"
3. Select logo file (PNG recommended)
4. Save

## 📖 Documentation

- **AWS_S3_SETUP.md** - Detailed AWS setup
- **S3_USAGE_GUIDE.md** - How to use uploads
- **ADMIN_GUIDE.md** - Admin panel guide
- **IMPLEMENTATION_SUMMARY.md** - Complete overview

## ⚙️ Configuration

### Environment Variables (Already Set)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Database
- Already configured ✅
- Tables created ✅
- Migrations applied ✅
- RLS policies active ✅

### Edge Functions
- `upload-to-s3` deployed ✅

## 🔧 Common Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Images Not Uploading?
- Check AWS credentials in Supabase
- Verify S3 bucket policy
- Check file size (< 10MB)
- Check file format (JPG/PNG/GIF/WebP)

### Build Errors?
```bash
npm run build
```
Check console for specific errors.

### Database Issues?
- Check Supabase dashboard
- Verify table structure
- Check RLS policies

## 📱 Access URLs

- **Homepage**: `/`
- **Blog**: `/blog`
- **Admin**: `/admin` (Password: `Cash789@@`)
- **Admin Dashboard**: `/admin/dashboard`

## 💡 Pro Tips

1. **Compress images** before uploading (use TinyPNG.com)
2. **Use descriptive alt text** for accessibility
3. **Organize by folders** (landing-page, home-page, blog)
4. **Test on mobile** - admin panel is responsive
5. **Regular backups** - export URLs from database
6. **Monitor costs** - AWS S3 is very cheap (< $1/month typically)

## 🎨 Customization

### Change Admin Password
Edit `src/context/AdminContext.tsx`:
```typescript
const ADMIN_PASSWORD = 'YourNewPassword';
```

### Change Colors
Edit `tailwind.config.js` for global color scheme.

### Add More Sections
Update `SECTIONS` array in image managers.

## 📊 Current Status

✅ Database configured
✅ Admin panel built
✅ Blog system functional
✅ Image CRUD operations ready
✅ S3 integration ready (pending AWS setup)
✅ Build successful
✅ Documentation complete

## 🆘 Need Help?

1. Check documentation files
2. Review browser console (F12)
3. Check Supabase logs
4. Review AWS S3 console
5. Check Edge Function logs

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

Files will be in `dist/` folder.

### Deploy Options
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting

### Pre-Deploy Checklist
- [ ] AWS S3 configured
- [ ] Environment variables set
- [ ] Test all features
- [ ] Check mobile responsiveness
- [ ] Verify image uploads
- [ ] Test blog posts
- [ ] Change admin password

## 📈 Next Steps

1. Configure AWS S3 (if not done)
2. Upload your first images
3. Create blog content
4. Customize landing/home pages
5. Add your logo
6. Deploy to production

---

**Ready to Go!** 🎉

Start with: `npm run dev`
Then visit: `http://localhost:5173/admin`

For detailed setup: See `AWS_S3_SETUP.md`
