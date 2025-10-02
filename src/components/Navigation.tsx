import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { DatabaseService } from '../services/database';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState<string>('');
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const setting = await DatabaseService.getSiteSetting('site_logo');
      if (setting && setting.setting_value) {
        setLogo(setting.setting_value);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Landing' },
    { path: '/home', label: 'Home' },
    { path: '/blog', label: 'Blog' },
    { path: '/story', label: 'My Story' },
    { path: '/search', label: 'Search' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
              {logo ? (
                <img src={logo} alt="Brothers Photography" className="h-10 w-auto" />
              ) : (
                <>
                  <Camera className="w-8 h-8" />
                  <span className="text-xl font-bold">Brothers Photography</span>
                </>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-amber-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-amber-400 hover:text-slate-900 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-slate-900 dark:text-white hover:text-amber-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

        <div className="relative w-64 h-full bg-white dark:bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
              {logo ? (
                <img src={logo} alt="Logo" className="h-8 w-auto" />
              ) : (
                <>
                  <Camera className="w-6 h-6" />
                  <span className="font-bold">Menu</span>
                </>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-amber-400 text-slate-900'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-amber-400 flex items-center space-x-2"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
