import { useState, useEffect, useRef } from 'react';
import { fetchComics, type Comic } from '../lib/supabase';
import { X, ZoomIn } from 'lucide-react';

export function Comics() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadComics();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedComic(null);
      }
    };

    if (selectedComic) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedComic]);

  async function loadComics() {
    setLoading(true);
    const data = await fetchComics();
    setComics(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            The Comics
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visual satire for the modern age. Click any comic to view it full-size.
          </p>
        </div>

        {/* Comics Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comics.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">No comics available yet.</p>
            <p className="text-muted-foreground text-sm mt-2">
              Check back soon for new additions.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {comics.map((comic, index) => (
              <ComicCard
                key={comic.id}
                comic={comic}
                index={index}
                onClick={() => setSelectedComic(comic)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedComic && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={(e) => {
            if (e.target === lightboxRef.current) {
              setSelectedComic(null);
            }
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

          {/* Close Button */}
          <button
            onClick={() => setSelectedComic(null)}
            className="absolute top-4 right-4 z-10 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image Container */}
          <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center">
            <img
              src={selectedComic.image_url}
              alt={selectedComic.caption || 'Comic'}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {selectedComic.caption && (
              <p className="mt-4 text-center text-muted-foreground max-w-2xl">
                {selectedComic.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ComicCardProps {
  comic: Comic;
  index: number;
  onClick: () => void;
}

function ComicCard({ comic, index, onClick }: ComicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${(index % 8) * 50}ms` }}
    >
      <button
        onClick={onClick}
        className="group relative w-full aspect-square bg-card/30 border border-border/50 overflow-hidden hover:border-accent/30 transition-all duration-300"
      >
        {/* Image */}
        <img
          src={comic.image_url}
          alt={comic.caption || 'Comic'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-accent" />
        </div>

        {/* Caption (if exists) */}
        {comic.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-foreground line-clamp-2">{comic.caption}</p>
          </div>
        )}
      </button>
    </div>
  );
}
