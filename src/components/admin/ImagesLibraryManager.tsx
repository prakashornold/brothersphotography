import { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Loader } from 'lucide-react';
import { DatabaseService } from '../../services/database';

export default function ImagesLibraryManager() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const imagesData = await DatabaseService.getImages();
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const imageData = {
            name: file.name,
            url: reader.result as string,
            size: file.size
          };
          await DatabaseService.uploadImage(imageData);
          await loadData();
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await DatabaseService.deleteImage(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Error deleting image. Please try again.');
      }
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Image URL copied to clipboard!');
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Image Library ({images.length})
        </h2>
        <label className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 transition-colors font-semibold cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden group">
              <div className="aspect-video relative">
                <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={() => copyImageUrl(image.url)}
                    className="px-3 py-1 bg-amber-400 text-slate-900 rounded text-sm font-semibold hover:bg-amber-500"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-slate-900 dark:text-white truncate">{image.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{new Date(image.uploaded_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <div className="col-span-full text-center py-12">
              <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No images uploaded yet. Upload your first image!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
