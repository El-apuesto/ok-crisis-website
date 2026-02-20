import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles, submitOpinion, type Article } from '../lib/supabase';
import { Send, Clock, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const opinionTypes = [
  { id: 'all', label: 'All Opinion' },
  { id: 'dear_gabby', label: 'Dear Gabby' },
  { id: 'dear_guy', label: 'Dear Guy' },
  { id: 'guys_world', label: "Guy's World" },
];

const opinionTypeLabels: { [key: string]: string } = {
  dear_gabby: 'Dear Gabby',
  dear_guy: 'Dear Guy',
  guys_world: "Guy's World",
};

export function Opinion() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    body: '',
  });

  useEffect(() => {
    loadArticles();
  }, [selectedType]);

  async function loadArticles() {
    setLoading(true);
    const data = await fetchArticles({
      category: 'Opinion',
      opinionType: selectedType === 'all' ? undefined : selectedType,
      limit: 20,
    });
    setArticles(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.body.trim()) {
      toast.error('Please enter your submission');
      return;
    }

    setSubmitting(true);
    
    const result = await submitOpinion({
      name: formData.name || undefined,
      email: formData.email || undefined,
      body: formData.body,
    });

    if (result.success) {
      toast.success('Thank you for your submission!');
      setFormData({ name: '', email: '', body: '' });
    } else {
      toast.error(result.error || 'Failed to submit. Please try again.');
    }

    setSubmitting(false);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getExcerpt = (body: string, maxLength: number = 150) => {
    const text = body.replace(/\n/g, ' ');
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

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
            Opinion
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advice, perspectives, and confident declarations from our resident columnists.
            Submit your own questions or thoughts below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content - Articles */}
          <div className="lg:col-span-2">
            {/* Opinion Type Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {opinionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-200 border ${
                    selectedType === type.id
                      ? 'border-accent text-accent bg-accent/5'
                      : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Articles */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg">No opinion pieces found.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="group block"
                  >
                    <article className="bg-card/30 border border-border/50 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1">
                      {/* Type Badge */}
                      <div className="flex items-center gap-4 mb-4">
                        {article.opinion_type && (
                          <span className="px-3 py-1 text-xs tracking-[0.15em] uppercase bg-accent/10 text-accent border border-accent/30">
                            {opinionTypeLabels[article.opinion_type] || article.opinion_type}
                          </span>
                        )}
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(article.created_at)}
                        </span>
                      </div>

                      {/* Headline */}
                      <h3 className="text-xl font-serif font-semibold mb-3 group-hover:text-accent transition-colors">
                        {article.headline}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                        {getExcerpt(article.body, 200)}
                      </p>

                      {/* Read More */}
                      <span className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        Read Full Column
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Submission Form */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="bg-card/30 border border-border/50 p-6">
                <h3 className="text-lg font-serif font-semibold mb-2">
                  Submit Your Thoughts
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Have a question for Gabby or Guy? Want to share your perspective?
                  Submit it here and it might inspire a future column.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-2">
                      Name (optional)
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="bg-background/50 border-border/50 focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-2">
                      Email (optional)
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="bg-background/50 border-border/50 focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-2">
                      Your Submission *
                    </label>
                    <Textarea
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      placeholder="Write your question, perspective, or thoughts here..."
                      rows={6}
                      className="bg-background/50 border-border/50 focus:border-accent resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent text-background hover:bg-accent/90"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Submit
                      </span>
                    )}
                  </Button>
                </form>

                <p className="mt-4 text-xs text-muted-foreground text-center">
                  Submissions are anonymous unless you provide your name.
                </p>
              </div>

              {/* About Section */}
              <div className="mt-8 bg-card/30 border border-border/50 p-6">
                <h3 className="text-sm tracking-[0.15em] uppercase text-accent mb-4">
                  Our Columnists
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Dear Gabby</h4>
                    <p className="text-sm text-muted-foreground">
                      Relationship and life advice from a woman who cares deeply—and
                      bureaucratically.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Dear Guy</h4>
                    <p className="text-sm text-muted-foreground">
                      Masculine wisdom for the modern age. Specific, confident,
                      and questionably sourced.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Guy's World</h4>
                    <p className="text-sm text-muted-foreground">
                      One man's definitive guide to what women actually want.
                      He's done the research (in his mind).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
