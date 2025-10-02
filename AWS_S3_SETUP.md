# AWS S3 Integration Setup Guide

## Overview
This application uses AWS S3 for secure, scalable image storage. All uploads are processed through a Supabase Edge Function to keep credentials secure.

## Architecture
```
Client (Browser) → Supabase Edge Function → AWS S3
                ↓
        PostgreSQL Database (stores URLs)
```

## AWS S3 Configuration

### 1. Create S3 Bucket

1. Log in to AWS Console
2. Navigate to S3 service
3. Click "Create bucket"
4. **Bucket name**: `brothersphotography` (must be globally unique)
5. **Region**: Choose closest region (e.g., `us-east-1`)
6. **Block Public Access settings**:
   - Uncheck "Block all public access"
   - Acknowledge the warning
7. Click "Create bucket"

### 2. Configure Bucket Policy

Add this policy to allow public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::brothersphotography/*"
        }
    ]
}
```

Steps:
1. Go to your bucket → Permissions tab
2. Scroll to "Bucket policy"
3. Click "Edit"
4. Paste the policy above
5. Click "Save changes"

### 3. Enable CORS

Add this CORS configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"]
    }
]
```

Steps:
1. Go to your bucket → Permissions tab
2. Scroll to "Cross-origin resource sharing (CORS)"
3. Click "Edit"
4. Paste the configuration above
5. Click "Save changes"

### 4. Create IAM User

1. Navigate to IAM service
2. Click "Users" → "Add users"
3. Username: `brothersphotography-uploader`
4. Select "Access key - Programmatic access"
5. Click "Next: Permissions"

### 5. Set IAM Permissions

Attach this policy to the user:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::brothersphotography/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::brothersphotography"
        }
    ]
}
```

Steps:
1. Click "Create policy"
2. Choose JSON tab
3. Paste the policy above
4. Name it: `BrothersPhotography-S3-Upload`
5. Create and attach to the user

### 6. Get Access Keys

1. After creating the user, download the CSV with credentials
2. Save these securely:
   - **Access Key ID**: `AKIA...`
   - **Secret Access Key**: `...`

**IMPORTANT**: Never commit these to version control!

## Environment Configuration

### Required Environment Variables

You need to configure these in your Supabase project:

1. Go to Supabase Dashboard
2. Select your project
3. Navigate to Project Settings → Edge Functions
4. Add the following secrets:

```bash
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
AWS_BUCKET_NAME=brothersphotography
```

### Local Development

For local testing, create a `.env.local` file (never commit this):

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
AWS_BUCKET_NAME=brothersphotography
```

## How It Works

### Upload Flow

1. **Client Side**:
   - User selects image file
   - File is validated (format, size)
   - File is read as base64
   - Sent to Edge Function

2. **Edge Function** (`upload-to-s3`):
   - Validates file type and size
   - Generates unique filename
   - Uploads to S3 with public-read ACL
   - Returns public URL

3. **Database**:
   - S3 URL is stored in PostgreSQL
   - Image metadata is saved

### File Organization

Files are organized in S3 with this structure:
```
brothersphotography/
├── landing-page/
│   ├── 1234567890-abc123.jpg
│   └── 1234567891-def456.png
├── home-page/
│   ├── 1234567892-ghi789.jpg
│   └── 1234567893-jkl012.png
├── blog/
│   └── 1234567894-mno345.jpg
└── logo/
    └── 1234567895-pqr678.png
```

### Unique Filename Generation

Each file gets a unique name:
- Timestamp: `1234567890`
- Random string: `abc123`
- Original extension: `.jpg`
- Result: `1234567890-abc123.jpg`

This prevents:
- Filename conflicts
- Overwriting existing files
- Predictable file URLs

## Security Best Practices

### ✅ DO
- Store AWS credentials as environment variables
- Use IAM policies with minimal required permissions
- Validate file types and sizes
- Generate unique filenames
- Use HTTPS for all requests
- Monitor S3 access logs

### ❌ DON'T
- Commit AWS credentials to Git
- Use root AWS account credentials
- Allow unlimited file uploads
- Trust client-side validation only
- Use predictable filenames
- Make bucket fully public

## File Validation

### Allowed Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Size Limits
- **Maximum**: 10MB per file
- **Recommended**: Compress images before upload
- **Optimal**: 1-2MB for web display

### Validation Points
1. **Client Side**: Immediate feedback
2. **Edge Function**: Server-side enforcement
3. **S3**: Final storage validation

## API Usage

### Upload Endpoint

**URL**: `{SUPABASE_URL}/functions/v1/upload-to-s3`

**Method**: `POST`

**Headers**:
```
Authorization: Bearer {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body**:
```json
{
  "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "fileName": "photo.jpg",
  "fileType": "image/jpeg",
  "folder": "landing-page"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "url": "https://brothersphotography.s3.us-east-1.amazonaws.com/landing-page/1234567890-abc123.jpg",
  "key": "landing-page/1234567890-abc123.jpg",
  "fileName": "1234567890-abc123.jpg",
  "originalFileName": "photo.jpg"
}
```

**Response (Error)**:
```json
{
  "error": "Upload failed",
  "message": "File size exceeds 10MB limit"
}
```

## Frontend Integration

### Using S3UploadService

```typescript
import { S3UploadService } from './services/s3Upload';

// Single file upload
const handleUpload = async (file: File) => {
  try {
    const result = await S3UploadService.uploadToS3(
      file,
      'landing-page', // folder
      (progress) => {
        console.log(`Upload progress: ${progress.percentage}%`);
      }
    );

    console.log('Uploaded to:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Multiple files
const handleMultipleUpload = async (files: File[]) => {
  const results = await S3UploadService.uploadMultipleToS3(
    files,
    'home-page'
  );

  results.forEach((result, index) => {
    if (result.success) {
      console.log(`File ${index + 1} uploaded:`, result.url);
    } else {
      console.error(`File ${index + 1} failed:`, result.error);
    }
  });
};
```

## Monitoring & Troubleshooting

### Check Upload Status

1. **Supabase Logs**:
   - Go to Supabase Dashboard
   - Navigate to Edge Functions → Logs
   - Check for errors in `upload-to-s3` function

2. **S3 Bucket**:
   - Go to AWS S3 Console
   - Open `brothersphotography` bucket
   - Verify files are being uploaded

3. **Database**:
   - Check `landing_page_images` table
   - Verify URLs are stored correctly

### Common Issues

**Issue**: "AWS credentials not configured"
- **Solution**: Set environment variables in Supabase

**Issue**: "Access Denied"
- **Solution**: Check IAM policy and bucket policy

**Issue**: "CORS error"
- **Solution**: Verify CORS configuration in S3

**Issue**: "File too large"
- **Solution**: Compress image or increase limit

**Issue**: "Invalid file type"
- **Solution**: Only JPG, PNG, GIF, WebP allowed

## Cost Estimation

### AWS S3 Pricing (us-east-1)
- **Storage**: $0.023 per GB/month
- **PUT requests**: $0.005 per 1,000 requests
- **GET requests**: $0.0004 per 1,000 requests
- **Data transfer out**: $0.09 per GB (first 10 TB)

### Example Monthly Cost
For a site with:
- 1,000 images (average 2MB each) = 2GB storage
- 10,000 page views = 10,000 GET requests
- 100 new uploads = 100 PUT requests

**Estimated cost**: ~$0.25/month

## Backup & Recovery

### Backup Strategy
1. Enable S3 versioning
2. Use S3 replication for critical data
3. Export database URLs regularly

### Disaster Recovery
1. S3 provides 99.999999999% durability
2. Cross-region replication recommended
3. Keep database backups with URL mappings

## Production Checklist

- [ ] S3 bucket created with correct name
- [ ] Bucket policy configured for public read
- [ ] CORS configured
- [ ] IAM user created with minimal permissions
- [ ] Environment variables set in Supabase
- [ ] Edge Function deployed successfully
- [ ] Test upload from admin panel
- [ ] Verify images display on frontend
- [ ] Enable CloudFront CDN (optional, for better performance)
- [ ] Set up S3 access logging
- [ ] Configure lifecycle rules for old files
- [ ] Test backup and restore procedures

## Support

For issues or questions:
1. Check Supabase Edge Function logs
2. Check AWS CloudWatch logs
3. Review S3 bucket metrics
4. Contact AWS Support or Supabase Support

---

**Last Updated**: 2025-10-02
**Version**: 1.0.0
