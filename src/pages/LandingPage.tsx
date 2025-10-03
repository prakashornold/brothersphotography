import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Instagram, Facebook, Youtube, Twitter, Linkedin, Loader } from 'lucide-react';
import { DatabaseService } from '../services/database';

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, images.length]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getLandingPageImages('hero');
      setImages(data.filter((img: any) => img.is_active));
    } catch (error) {
      console.error('Error loading landing page images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (loading) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-amber-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Brothers Photography</h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-300">Capturing Stories Through the Lens</p>
          <p className="text-slate-400">No images uploaded yet. Add images from the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={image.image_url}
            alt={image.alt_text || 'Gallery image'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </div>
      ))}

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center animate-fade-in">
          Brothers Photography
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-center text-slate-200">
          Capturing Stories Through the Lens
        </p>

    


        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-amber-400 w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Next image"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      <div className="absolute bottom-8 right-8 z-30 text-white text-sm">
        <p className="opacity-70">
          {currentIndex + 1} / {landingImages.length}
        </p>

          <a
  href="/home"
  className="px-6 py-3 bg-amber-400 text-black font-semibold rounded-full shadow-lg 
             hover:bg-amber-500 transition duration-300 mt-6"
>
  Go to Home
</a>
      </div>
    </div>
  );
}
