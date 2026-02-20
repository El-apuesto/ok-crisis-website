import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles, type Article } from '../lib/supabase';
import { Search, Calendar, ArrowRight, Clock } from 'lucide-react';
import { Input } from '../components/ui/input';

const categories = ['All', 'World', 'National', 'Entertainment', 'Sports', 'Lifestyle', 'Opinion'];

export function Archives() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  useEffect(() => {
    loadArticles(true);
  }, [selectedCategory, searchQuery]);

  async function loadArticles(reset = false) {
    if (reset) {
      setOffset(0);
      setLoading(true);
    }

    const newOffset = reset ? 0 : offset;
    
    const data = await fetchArticles({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      search: searchQuery || undefined,
      limit,
      offset: newOffset,
    });

    if (reset) {
      setArticles(data);
    } else {
      setArticles((prev) => [...prev, ...data]);
    }

    setHasMore(data.length === limit);
    setOffset(newOffset + limit);
    setLoading(false);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const groupByDate = (articles: Article[]) => {
    const groups: { [key: string]: Article[] } = {};
    
    articles.forEach((article) => {
      const date = new Date(article.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(article);
    });
    
    return groups;
  };

  const groupedArticles = groupByDate(articles);

  return (
    <div className="min-h-screen pt-32 pb-16">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            The Archives
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of satirical journalism. Every absurd angle,
            every deadpan headline, every fictional quote—preserved for posterity.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-card/30 border-border/50 focus:border-accent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
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
        </div>

        {/* Results */}
        {loading && articles.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedArticles).map(([date, dateArticles]) => (
              <section key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-4 mb-8">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-serif font-semibold">{date}</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">
                    {dateArticles.length} article{dateArticles.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Articles List */}
                <div className="space-y-4">
                  {dateArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group block"
                    >
                      <article className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-card/20 border border-border/30 hover:border-accent/30 transition-all duration-300">
                        {/* Category & Time */}
                        <div className="flex items-center gap-4 md:w-48 shrink-0">
                          <span className="px-2 py-1 text-[10px] tracking-[0.15em] uppercase border border-accent/30 text-accent">
                            {article.category}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(article.created_at)}
                          </span>
                        </div>

                        {/* Headline */}
                        <h3 className="flex-1 text-lg font-medium group-hover:text-accent transition-colors line-clamp-2">
                          {article.headline}
                        </h3>

                        {/* Arrow */}
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 hidden md:block" />
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="text-center pt-8">
                <button
                  onClick={() => loadArticles(false)}
                  disabled={loading}
                  className="px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    'Load More Articles'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
