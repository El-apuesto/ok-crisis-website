import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchArticles, type Article } from '../lib/supabase';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

const categories = ['All', 'World', 'National', 'Entertainment', 'Sports', 'Lifestyle', 'Opinion'];

export function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  async function loadArticles() {
    setLoading(true);
    const data = await fetchArticles({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      limit: 20,
    });
    setArticles(data);
    setLoading(false);
  }

  // Parallax effect for hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const topStory = articles[0];
  // const otherStories = articles.slice(1);

  return (
    <div className="min-h-screen">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative pt-48 md:pt-56 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  if (category === 'All') {
                    setSearchParams({});
                  } else {
                    setSearchParams({ category });
                  }
                }}
                className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-200 border ${
                  selectedCategory === category
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No articles found.</p>
            </div>
          ) : (
            <>
              {/* Top Story Hero */}
              <div className="relative mb-16 overflow-hidden">
                <div className="relative">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Placeholder Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                      <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                        <span className="text-6xl font-serif text-accent/30">TB</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 text-xs tracking-[0.15em] uppercase bg-accent text-background font-medium">
                          BREAKING
                        </span>
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight group-hover:text-accent transition-colors duration-300">
                        Local News Satire Platform Successfully Deployed
                      </h2>

                      <p className="text-muted-foreground leading-relaxed">
                        The Breakdown is now running with a sleek black background. Article generation is working with deepseek cloud AI model. Database setup pending.
                      </p>

                      <span className="inline-flex items-center gap-2 text-sm text-accent group-hover:gap-3 transition-all duration-300">
                        View Status
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
              </div>

              {/* Article Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="h-full bg-card/30 border border-border/50 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 text-[10px] tracking-[0.15em] uppercase border border-accent/30 text-accent">
                        {['World', 'National', 'Sports', 'Entertainment', 'Lifestyle', 'Opinion'][index - 1]}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-xl font-serif font-semibold mb-3 leading-snug hover:text-accent transition-colors duration-300">
                      Sample Satirical Article {index}: Local News Takes Unexpected Turn
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      In a shocking development that surprised absolutely no one, local officials announced something completely predictable today...
                    </p>

                    {/* Read more */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <span className="text-xs text-accent flex items-center gap-1 hover:gap-2 transition-all duration-300">
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
            </span>
          </div>

          {/* Headline */}
          <h3 className="text-xl font-serif font-semibold mb-3 leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-3">
            {article.headline}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {getExcerpt(article.body, 120)}
          </p>

          {/* Read more */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <span className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
              Read More
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}
