# AWS S3 Image Upload - Usage Guide

## Quick Start

The application now uses AWS S3 for image storage instead of base64 in the database. This provides:
- ✅ Better performance
- ✅ Unlimited storage capacity
- ✅ CDN-ready URLs
- ✅ Faster page loads
- ✅ Professional image hosting

## For Administrators

### Uploading Images

#### 1. Landing Page Images
1. Login to admin panel (`/admin`)
2. Navigate to "Landing Page" tab
3. Click "Upload Image"
4. Select your image file (JPG, PNG, GIF, or WebP, max 10MB)
5. Fill in:
   - **Alt Text**: Describe the image for accessibility
   - **Section**: Choose where it appears (hero, gallery, features, testimonials)
   - **Display Order**: Set the position
   - **Active**: Toggle to show/hide on website
6. Click "Save"

The image will be:
- Uploaded to AWS S3
- Given a unique filename
- Made publicly accessible
- URL stored in database
- Immediately available on your website

#### 2. Home Page Images
1. Go to "Home Page" tab
2. Click "Upload Image"
3. Select image and configure:
   - **Category**: hero, gallery, testimonials, features, team, portfolio
   - **Caption**: Optional description
   - **Alt Text**: Accessibility description
   - **Display Order**: Position
4. Click "Save"

**Bulk Operations:**
- Select multiple images with checkboxes
- Use bulk actions to:
  - Activate/Deactivate multiple images
  - Delete multiple images at once

#### 3. Site Logo
1. Go to "Site Logo" tab
2. Click "Update Logo"
3. Upload your logo (JPG, PNG, WebP, or SVG, max 2MB)
4. **Recommended size**: 200x60px transparent PNG
5. Click "Update Logo"

To reset to default:
- Click "Reset Logo"

#### 4. Blog Post Images
1. Upload image to "Image Library" tab first
2. Click "Copy URL" on the uploaded image
3. When creating/editing a blog post, paste the URL in "Featured Image URL" field

### What Happens During Upload?

```
Your Computer → Upload File
              ↓
        Validation (format, size)
              ↓
      Convert to base64
              ↓
    Send to Supabase Edge Function
              ↓
        Generate unique filename
              ↓
        Upload to AWS S3
              ↓
      Get public URL (https://brothersphotography.s3.us-east-1.amazonaws.com/...)
              ↓
    Save URL to database
              ↓
      Display on website
```

### Upload Progress

While uploading, you'll see:
1. ⏳ **Reading file**: Converting your image
2. ⬆️ **Uploading**: Sending to S3
3. ✅ **Success**: Image is live!

### File Naming

Your files are automatically renamed to prevent conflicts:

**Original**: `my-photo.jpg`
**S3 Name**: `1704211200000-a1b2c3d4.jpg`

Format: `{timestamp}-{random}.{extension}`

This ensures:
- No duplicate filenames
- No overwriting existing files
- Unique URLs for each image

### Image Organization in S3

Your images are organized by folder:

```
brothersphotography/
├── landing-page/     # Landing page images
├── home-page/        # Home page images
├── blog/             # Blog images
├── logo/             # Site logo
└── library/          # General uploads
```

## For Developers

### S3UploadService API

The `S3UploadService` provides these methods:

#### validateFile(file: File)
Validates file type and size before upload.

```typescript
const validation = S3UploadService.validateFile(file);
if (!validation.valid) {
  alert(validation.error);
  return;
}
```

**Validation Rules:**
- Formats: JPEG, PNG, GIF, WebP only
- Size: Maximum 10MB
- Returns: `{ valid: boolean, error?: string }`

#### uploadToS3(file, folder?, onProgress?)
Uploads a single file to S3.

```typescript
try {
  const result = await S3UploadService.uploadToS3(
    file,
    'landing-page',  // Optional folder
    (progress) => {
      console.log(`Progress: ${progress.percentage}%`);
      // Update UI with progress
    }
  );

  console.log('Uploaded:', result.url);
  // Use result.url in your database
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

**Returns:**
```typescript
{
  success: true,
  url: "https://brothersphotography.s3.us-east-1.amazonaws.com/landing-page/1704211200000-abc123.jpg",
  key: "landing-page/1704211200000-abc123.jpg",
  fileName: "1704211200000-abc123.jpg",
  originalFileName: "my-photo.jpg"
}
```

#### uploadMultipleToS3(files, folder?, onProgress?)
Uploads multiple files at once.

```typescript
const results = await S3UploadService.uploadMultipleToS3(
  filesArray,
  'home-page',
  (fileIndex, progress) => {
    console.log(`File ${fileIndex + 1}: ${progress.percentage}%`);
  }
);

results.forEach((result, i) => {
  if (result.success) {
    console.log(`File ${i + 1} uploaded:`, result.url);
  } else {
    console.error(`File ${i + 1} failed:`, result.error);
  }
});
```

#### getFileInfo(file)
Get formatted file information.

```typescript
const info = S3UploadService.getFileInfo(file);
// {
//   name: "photo.jpg",
//   size: 2048576,
//   type: "image/jpeg",
//   sizeFormatted: "2000.00 KB",
//   sizeMB: "1.95"
// }
```

#### createImagePreview(file)
Create a data URL preview of the image.

```typescript
const preview = await S3UploadService.createImagePreview(file);
// "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
```

### Example: Custom Upload Component

```typescript
import { useState } from 'react';
import { S3UploadService } from './services/s3Upload';

function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validation = S3UploadService.validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploading(true);

    try {
      const result = await S3UploadService.uploadToS3(
        file,
        'custom-folder',
        (prog) => setProgress(prog.percentage)
      );

      setImageUrl(result.url);
      alert('Upload successful!');
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <div>Uploading: {progress}%</div>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

### Error Handling

Common errors and solutions:

```typescript
try {
  const result = await S3UploadService.uploadToS3(file, 'folder');
} catch (error) {
  if (error.message.includes('file type')) {
    // Invalid file format
    alert('Please upload JPG, PNG, GIF, or WebP images only');
  } else if (error.message.includes('size')) {
    // File too large
    alert('File must be under 10MB');
  } else if (error.message.includes('credentials')) {
    // AWS configuration issue
    console.error('Contact administrator: AWS not configured');
  } else {
    // Network or other error
    alert('Upload failed. Please try again.');
  }
}
```

## Testing Uploads

### Manual Test

1. Go to admin panel
2. Try uploading a test image
3. Check the URL format:
   - Should be: `https://brothersphotography.s3.{region}.amazonaws.com/...`
   - Should be publicly accessible
4. Verify image displays on website

### Test Checklist

- [ ] Small image (< 1MB) uploads successfully
- [ ] Large image (5-10MB) uploads successfully
- [ ] Invalid format (PDF, DOCX) is rejected
- [ ] Oversized file (> 10MB) is rejected
- [ ] Uploaded image is publicly accessible
- [ ] Image displays correctly on website
- [ ] Multiple uploads work
- [ ] Bulk operations work (home page images)
- [ ] Logo upload works
- [ ] Database stores correct URLs

## Performance Tips

### 1. Compress Images Before Upload
Use tools like:
- TinyPNG (https://tinypng.com/)
- Squoosh (https://squoosh.app/)
- ImageOptim (Mac)
- FileOptimizer (Windows)

### 2. Recommended Image Sizes
- **Logo**: 200x60px, transparent PNG
- **Hero Images**: 1920x1080px
- **Gallery Images**: 1200x800px
- **Thumbnails**: 600x400px
- **Blog Featured**: 1200x630px

### 3. File Size Guidelines
- **Hero/Featured**: 200-500KB
- **Gallery**: 100-300KB
- **Thumbnails**: 50-100KB
- **Logo**: 10-50KB

### 4. Format Selection
- **Photographs**: JPG (smaller file size)
- **Graphics/Logos**: PNG (transparency support)
- **Animations**: GIF (limited colors)
- **Modern browsers**: WebP (best compression)

## Troubleshooting

### "Upload failed" error
1. Check internet connection
2. Verify file is valid image
3. Check file size (< 10MB)
4. Try different browser
5. Clear browser cache

### Images not displaying
1. Check if URL is publicly accessible (copy URL, open in new tab)
2. Verify database has correct URL
3. Check browser console for errors
4. Verify S3 bucket policy allows public read

### Slow uploads
1. Compress images before upload
2. Check internet speed
3. Try uploading one at a time instead of bulk
4. Use smaller image files

### "AWS credentials not configured"
**Admin Only**: Contact system administrator
- AWS credentials need to be set in Supabase
- Check environment variables

## Best Practices

### ✅ DO
- Compress images before uploading
- Use descriptive alt text
- Test image accessibility
- Delete unused images
- Use appropriate image sizes
- Keep track of uploaded images

### ❌ DON'T
- Upload uncompressed RAW images
- Use extremely high resolution (> 4K)
- Upload without alt text
- Ignore file size warnings
- Upload copyrighted images without permission
- Store sensitive information in images

## FAQ

**Q: How many images can I upload?**
A: Unlimited, but each file must be under 10MB.

**Q: Can I delete images?**
A: Yes, but they remain in S3. Consider cleanup periodically.

**Q: Are my images backed up?**
A: Yes, S3 provides 99.999999999% durability.

**Q: Can I use my own domain for images?**
A: Yes, set up CloudFront CDN and custom domain.

**Q: How much does S3 storage cost?**
A: Very cheap - typically $0.023 per GB/month. 1000 images ≈ $0.25/month.

**Q: Can I upload from mobile?**
A: Yes, the admin panel works on mobile browsers.

**Q: What if I upload the same file twice?**
A: Each upload gets a unique filename, no conflicts.

**Q: Can I edit images after upload?**
A: You can replace them by uploading a new version.

**Q: Is there a way to organize images?**
A: Images are organized by folder (landing-page, home-page, etc.)

**Q: Can I see upload history?**
A: Check the database tables for all uploaded image records.

## Support

For technical issues:
1. Check browser console (F12)
2. Review Edge Function logs in Supabase
3. Verify AWS S3 bucket is accessible
4. Contact system administrator

---

**Need Help?** Check the AWS_S3_SETUP.md for configuration details.
