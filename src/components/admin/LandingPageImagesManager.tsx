import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Upload, X, Save, Image as ImageIcon, Loader, Check, AlertCircle } from 'lucide-react';
import { DatabaseService } from '../../services/database';

const SECTIONS = ['hero', 'gallery', 'features', 'testimonials'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export default function LandingPageImagesManager() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [filterSection, setFilterSection] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    image_name: '',
    alt_text: '',
    file_size: 0,
    display_order: 0,
    section: 'hero',
    is_active: true
  });

  useEffect(() => {
    loadImages();
  }, [filterSection]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getLandingPageImages(filterSection || undefined);
      setImages(data);
    } catch (error) {
      showNotification('error', 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      image_name: '',
      alt_text: '',
      file_size: 0,
      display_order: 0,
      section: 'hero',
      is_active: true
    });
    setEditingImage(null);
    setShowForm(false);
  };

  const handleEditImage = (image: any) => {
    setEditingImage(image);
    setFormData({
      image_url: image.image_url,
      image_name: image.image_name,
      alt_text: image.alt_text || '',
      file_size: image.file_size,
      display_order: image.display_order,
      section: image.section,
      is_active: image.is_active
    });
    setShowForm(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FORMATS.includes(file.type)) {
      showNotification('error', 'Only JPG, PNG, and WebP formats are allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showNotification('error', 'File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image_url: reader.result as string,
        image_name: file.name,
        file_size: file.size
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.image_url || !formData.image_name) {
      showNotification('error', 'Please upload an image');
      return;
    }

    setSaving(true);
    try {
      if (editingImage) {
        await DatabaseService.updateLandingPageImage(editingImage.id, formData);
        showNotification('success', 'Image updated successfully');
      } else {
        await DatabaseService.createLandingPageImage(formData);
        showNotification('success', 'Image uploaded successfully');
      }
      await loadImages();
      resetForm();
    } catch (error) {
      showNotification('error', 'Failed to save image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await DatabaseService.deleteLandingPageImage(id);
      showNotification('success', 'Image deleted successfully');
      await loadImages();
    } catch (error) {
      showNotification('error', 'Failed to delete image');
    }
  };

  return (
    <div>
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Landing Page Images ({images.length})
          </h2>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">All Sections</option>
            {SECTIONS.map(section => (
              <option key={section} value={section}>{section.charAt(0).toUpperCase() + section.slice(1)}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Image</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editingImage ? 'Edit Image' : 'Upload New Image'}
              </h3>
              <button onClick={resetForm} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Upload Image * (Max 5MB, JPG/PNG/WebP)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
                      {formData.image_url ? (
                        <div>
                          <img src={formData.image_url} alt="Preview" className="max-h-48 mx-auto rounded" />
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{formData.image_name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">{(formData.file_size / 1024).toFixed(2)} KB</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
                          <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload or drag and drop</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {SECTIONS.map(section => (
                      <option key={section} value={section}>{section.charAt(0).toUpperCase() + section.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  placeholder="Describe the image for accessibility"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-amber-400 border-slate-300 rounded focus:ring-amber-400"
                />
                <label htmlFor="is_active" className="text-sm text-slate-900 dark:text-white">Active (visible on website)</label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={resetForm}
                disabled={saving}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 transition-colors font-semibold disabled:opacity-50"
              >
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden group">
              <div className="relative aspect-video">
                <img src={image.image_url} alt={image.alt_text} className="w-full h-full object-cover" />
                {!image.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{image.image_name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{(image.file_size / 1024).toFixed(2)} KB</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-400 text-slate-900 text-xs font-semibold rounded ml-2">
                    {image.section}
                  </span>
                </div>
                {image.alt_text && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 truncate" title={image.alt_text}>
                    Alt: {image.alt_text}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 mb-3">
                  <span>Order: {image.display_order}</span>
                  <span>{new Date(image.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditImage(image)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <div className="col-span-full text-center py-12">
              <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No images yet. Upload your first image!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
