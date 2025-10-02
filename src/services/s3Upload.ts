import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface S3UploadResult {
  success: boolean;
  url: string;
  key: string;
  fileName: string;
  originalFileName: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export const S3UploadService = {
  validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    return { valid: true };
  },

  async uploadToS3(
    file: File,
    folder?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<S3UploadResult> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          });
        }
      };

      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string;

          const apiUrl = `${SUPABASE_URL}/functions/v1/upload-to-s3`;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file: base64Data,
              fileName: file.name,
              fileType: file.type,
              folder: folder,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
          }

          const result = await response.json();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  },

  async uploadMultipleToS3(
    files: File[],
    folder?: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<S3UploadResult[]> {
    const results: S3UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadToS3(
          files[i],
          folder,
          onProgress ? (progress) => onProgress(i, progress) : undefined
        );
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          url: '',
          key: '',
          fileName: files[i].name,
          originalFileName: files[i].name,
          error: error instanceof Error ? error.message : 'Upload failed',
        });
      }
    }

    return results;
  },

  getFileInfo(file: File) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeFormatted: `${(file.size / 1024).toFixed(2)} KB`,
      sizeMB: (file.size / 1024 / 1024).toFixed(2),
    };
  },

  async createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};
