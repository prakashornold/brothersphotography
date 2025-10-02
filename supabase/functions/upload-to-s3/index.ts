import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3@3.490.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface UploadRequest {
  file: string;
  fileName: string;
  fileType: string;
  folder?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const AWS_ACCESS_KEY = Deno.env.get('AWS_ACCESS_KEY_ID');
    const AWS_SECRET_KEY = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const AWS_REGION = Deno.env.get('AWS_REGION') || 'us-east-1';
    const AWS_BUCKET = Deno.env.get('AWS_BUCKET_NAME') || 'brothersphotography';

    if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'AWS credentials not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { file, fileName, fileType, folder }: UploadRequest = await req.json();

    if (!file || !fileName || !fileType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, fileName, fileType' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const base64Data = file.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const maxSize = 10 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 10MB limit' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;
    
    const folderPath = folder ? `${folder}/` : '';
    const s3Key = `${folderPath}${uniqueFileName}`;

    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: fileType,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    const publicUrl = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        key: s3Key,
        fileName: uniqueFileName,
        originalFileName: fileName,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});