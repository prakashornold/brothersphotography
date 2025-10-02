import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, Image as ImageIcon, Home, Camera, LayoutGrid as Layout } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import BlogPostsManager from '../components/admin/BlogPostsManager';
import LandingPageImagesManager from '../components/admin/LandingPageImagesManager';
import HomePageImagesManager from '../components/admin/HomePageImagesManager';
import LogoManager from '../components/admin/LogoManager';
import ImagesLibraryManager from '../components/admin/ImagesLibraryManager';

type TabType = 'posts' | 'library' | 'landing' | 'home' | 'logo';

export default function AdminDashboardPage() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
          <nav className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'posts'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'library'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-5 h-5 inline mr-2" />
              Image Library
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'landing'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layout className="w-5 h-5 inline mr-2" />
              Landing Page
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'home'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-5 h-5 inline mr-2" />
              Home Page
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'logo'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-5 h-5 inline mr-2" />
              Site Logo
            </button>
          </nav>
        </div>

        {activeTab === 'posts' && <BlogPostsManager />}
        {activeTab === 'library' && <ImagesLibraryManager />}
        {activeTab === 'landing' && <LandingPageImagesManager />}
        {activeTab === 'home' && <HomePageImagesManager />}
        {activeTab === 'logo' && <LogoManager />}
      </div>
    </div>
  );
}
