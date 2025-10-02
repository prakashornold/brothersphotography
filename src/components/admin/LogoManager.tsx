import { useState, useEffect } from 'react';
import { Upload, X, Save, Loader, Check, AlertCircle, Camera } from 'lucide-react';
import { DatabaseService } from '../../services/database';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export default function LogoManager() {
  const [currentLogo, setCurrentLogo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [newLogo, setNewLogo] = useState<string>('');
  const [logoName, setLogoName] = useState<string>('');

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    setLoading(true);
    try {
      const setting = await DatabaseService.getSiteSetting('site_logo');
      if (setting) {
        setCurrentLogo(setting.setting_value);
      }
    } catch (error) {
      showNotification('error', 'Failed to load logo');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FORMATS.includes(file.type)) {
      showNotification('error', 'Only JPG, PNG, WebP, and SVG formats are allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showNotification('error', 'File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewLogo(reader.result as string);
      setLogoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!newLogo) {
      showNotification('error', 'Please upload a logo');
      return;
    }

    setSaving(true);
    try {
      await DatabaseService.updateSiteSetting('site_logo', newLogo, 'image');
      setCurrentLogo(newLogo);
      showNotification('success', 'Logo updated successfully');
      setShowForm(false);
      setNewLogo('');
      setLogoName('');
    } catch (error) {
      showNotification('error', 'Failed to update logo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the logo?')) return;

    setSaving(true);
    try {
      const defaultLogo = 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg';
      await DatabaseService.updateSiteSetting('site_logo', defaultLogo, 'image');
      setCurrentLogo(defaultLogo);
      showNotification('success', 'Logo reset to default');
      setShowForm(false);
      setNewLogo('');
      setLogoName('');
    } catch (error) {
      showNotification('error', 'Failed to delete logo');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setNewLogo('');
    setLogoName('');
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

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Site Logo</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Upload and manage your website logo. Recommended size: 200x60px, Max 2MB
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Current Logo</h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 inline-block">
                {currentLogo ? (
                  <img src={currentLogo} alt="Site Logo" className="max-h-16 max-w-xs" />
                ) : (
                  <div className="flex items-center justify-center w-48 h-16 text-slate-400 dark:text-slate-600">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 transition-colors font-semibold"
              >
                <Upload className="w-5 h-5" />
                <span>Update Logo</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                <span>Reset Logo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Update Logo</h3>
              <button onClick={resetForm} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Upload Logo * (Max 2MB, JPG/PNG/WebP/SVG)
                </label>
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
                    {newLogo ? (
                      <div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 inline-block mb-3">
                          <img src={newLogo} alt="New Logo Preview" className="max-h-24 max-w-full" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{logoName}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload logo</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Recommended: 200x60px transparent PNG</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Tip:</strong> Use a transparent PNG for best results. The logo will be displayed in the navigation bar.
                </p>
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
                disabled={saving || !newLogo}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 transition-colors font-semibold disabled:opacity-50"
              >
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Updating...' : 'Update Logo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
