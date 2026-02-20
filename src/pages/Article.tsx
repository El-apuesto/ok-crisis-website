import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticle, fetchRelatedArticles, type Article as ArticleType } from '../lib/supabase';
import { Calendar, ArrowLeft, User, Clock } from 'lucide-react';

export function Article() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  async function loadArticle(articleId: string) {
    setLoading(true);
    const data = await fetchArticle(articleId);
    setArticle(data);

    if (data) {
      const related = await fetchRelatedArticles(data.category, data.id, 5);
      setRelatedArticles(related);
    }

    setLoading(false);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-serif mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
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
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Back Link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            {/* Article Header */}
            <header className="mb-10">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 text-xs tracking-[0.15em] uppercase bg-accent text-background font-medium">
                  {article.category}
                </span>
                {article.opinion_type && (
                  <span className="px-3 py-1 text-xs tracking-[0.15em] uppercase border border-accent text-accent">
                    {article.opinion_type.replace('_', ' ')}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6">
                {article.headline}
              </h1>

              {/* Angle */}
              {article.angle && (
                <p className="text-sm text-accent tracking-wide uppercase mb-6">
                  Angle: {article.angle}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-6 border-t border-border">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.created_at)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatTime(article.created_at)}
                </span>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  The Breakdown Staff
                </span>
              </div>
            </header>

            {/* Hero Image */}
            {article.image_url && (
              <div className="mb-10">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Article Body */}
            <div className="prose prose-invert prose-lg max-w-none">
              {article.body.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-6 text-foreground/90 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                This article was generated by The Breakdown's satirical news engine.
                Any resemblance to actual persons, living or dead, is purely coincidental
                and probably hilarious.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              {/* More from Category */}
              <div className="bg-card/30 border border-border/50 p-6 mb-8">
                <h3 className="text-sm tracking-[0.15em] uppercase text-accent mb-6">
                  More from {article.category}
                </h3>

                {relatedArticles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No related articles found.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        to={`/article/${related.id}`}
                        className="group block"
                      >
                        <h4 className="text-sm font-medium leading-snug group-hover:text-accent transition-colors line-clamp-2 mb-2">
                          {related.headline}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(related.created_at)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="bg-card/30 border border-border/50 p-6">
                <h3 className="text-sm tracking-[0.15em] uppercase text-accent mb-6">
                  Categories
                </h3>

                <div className="flex flex-wrap gap-2">
                  {['World', 'National', 'Entertainment', 'Sports', 'Lifestyle', 'Opinion'].map(
                    (cat) => (
                      <Link
                        key={cat}
                        to={`/?category=${cat}`}
                        className="px-3 py-1 text-xs tracking-wide uppercase border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        {cat}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
