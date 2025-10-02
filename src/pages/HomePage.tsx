import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Loader } from 'lucide-react';
import { DatabaseService } from '../services/database';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [heroData, galleryData, postsData] = await Promise.all([
        DatabaseService.getHomePageImages('hero'),
        DatabaseService.getHomePageImages('gallery'),
        DatabaseService.getBlogPosts()
      ]);

      setHeroImages(heroData.filter((img: any) => img.is_active));
      setGalleryImages(galleryData.filter((img: any) => img.is_active));
      setRecentPosts(postsData.slice(0, 3));
    } catch (error) {
      console.error('Error loading home page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center pt-16">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-amber-400 mx-auto mb-4" />
          <p className="text-slate-900 dark:text-white text-lg">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative h-[600px] overflow-hidden">
        {heroImages.length > 0 ? (
          heroImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || 'Hero image'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/50 dark:via-slate-950/50 to-transparent" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <p className="text-white text-lg">No hero images available. Add from admin panel.</p>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-slate-900 dark:text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Welcome to Brothers Photography
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200">
              Professional Photography & Cinematography Services
            </p>
          </div>
        </div>

        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-amber-400 w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {galleryImages.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Gallery</h2>
              <p className="text-slate-700 dark:text-slate-300 text-lg">
                Explore our portfolio of stunning photography
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-lg aspect-video cursor-pointer"
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {image.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-semibold">{image.caption}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Latest from the Blog</h2>
            <Link
              to="/blog"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center space-x-2"
            >
              <span>View All Posts</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all duration-300"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-400 text-slate-900 text-xs font-semibold rounded-full uppercase">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">No blog posts yet. Create your first post from the admin panel.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
