import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, User, Tag } from 'lucide-react';
import ZodiacWheelIcon from '@/components/icons/ZodiacWheelIcon';
import { format } from 'date-fns';
import SponsorBanner from '@/components/SponsorBanner';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image: string;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory]);

  const loadBlogPosts = async () => {
    try {
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // If no posts exist, create some sample posts
      if (!data || data.length === 0) {
        await createSamplePosts();
        ({ data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false }));
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSamplePosts = async () => {
    const samplePosts = [
      {
        title: "Understanding Your Birth Chart: A Beginner's Guide",
        content: "Your birth chart is a snapshot of the sky at the exact moment and location of your birth. It serves as a cosmic blueprint that reveals your personality traits, strengths, challenges, and life path. In this comprehensive guide, we'll explore the fundamental elements of a birth chart and how to interpret them. The birth chart consists of 12 houses, each representing different areas of life, and the positions of planets within these houses and zodiac signs. Understanding these elements can provide profound insights into your character and destiny.",
        excerpt: "Discover the secrets hidden in your birth chart and learn how to interpret this cosmic blueprint of your life.",
        category: "astrology",
        tags: ["birth chart", "beginner", "astrology basics"],
        published: true,
        featured_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
      },
      {
        title: "The Power of Numerology: Finding Your Life Path Number",
        content: "Numerology is the ancient practice of finding meaning in numbers and their influence on human life. Your Life Path Number is one of the most important numbers in numerology, calculated from your birth date. It reveals your life's purpose, natural talents, and the challenges you'll face. To calculate your Life Path Number, you add all the digits in your birth date until you get a single digit or master number (11, 22, or 33). Each number carries specific vibrations and meanings that can guide you toward fulfilling your highest potential.",
        excerpt: "Learn how to calculate and interpret your Life Path Number to unlock the secrets of your destiny.",
        category: "numerology",
        tags: ["life path", "numerology", "destiny"],
        published: true,
        featured_image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop"
      },
      {
        title: "Mercury Retrograde: Myths, Facts, and How to Navigate It",
        content: "Mercury retrograde is one of the most talked-about astrological phenomena, often blamed for communication mishaps, travel delays, and technology failures. But what does Mercury retrograde actually mean, and how can you work with its energy rather than against it? During Mercury retrograde, which occurs 3-4 times per year for about 3 weeks each time, the planet appears to move backward in its orbit from Earth's perspective. This is an optical illusion, but astrologically, it's believed to influence communication, technology, and decision-making.",
        excerpt: "Separate fact from fiction about Mercury retrograde and learn practical tips for navigating these periods.",
        category: "astrology",
        tags: ["mercury retrograde", "planets", "cosmic events"],
        published: true,
        featured_image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop"
      },
      {
        title: "The 12 Zodiac Signs: Personality Traits and Compatibility",
        content: "The zodiac is divided into 12 signs, each with unique characteristics, strengths, and challenges. Understanding your sun sign is just the beginning of your astrological journey. Each sign is associated with an element (fire, earth, air, or water) and a modality (cardinal, fixed, or mutable), which influences how that sign expresses its energy. Fire signs (Aries, Leo, Sagittarius) are passionate and dynamic, earth signs (Taurus, Virgo, Capricorn) are practical and grounded, air signs (Gemini, Libra, Aquarius) are intellectual and communicative, and water signs (Cancer, Scorpio, Pisces) are emotional and intuitive.",
        excerpt: "Explore the unique characteristics of each zodiac sign and discover which signs are most compatible with yours.",
        category: "zodiac",
        tags: ["zodiac signs", "compatibility", "personality"],
        published: true,
        featured_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
      },
      {
        title: "Moon Phases and Their Spiritual Significance",
        content: "The moon's cyclical journey through its phases has captivated humanity for millennia, influencing everything from ancient rituals to modern spiritual practices. Each phase of the moon carries its own energy and significance. The New Moon represents new beginnings and is perfect for setting intentions. The Waxing Moon is a time for growth and taking action. The Full Moon brings culmination and heightened emotions, making it ideal for manifestation and release work. The Waning Moon encourages letting go and reflection. Understanding these phases can help you align your activities and spiritual practices with lunar energy.",
        excerpt: "Discover how to harness the power of moon phases for manifestation, healing, and spiritual growth.",
        category: "general",
        tags: ["moon phases", "spirituality", "manifestation"],
        published: true,
        featured_image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=400&fit=crop"
      }
    ];

    try {
      await supabase.from('blog_posts').insert(samplePosts);
    } catch (error) {
      console.error('Error creating sample posts:', error);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const categories = ['all', 'astrology', 'numerology', 'zodiac', 'general'];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      astrology: 'bg-purple-100 text-purple-800',
      numerology: 'bg-blue-100 text-blue-800',
      zodiac: 'bg-green-100 text-green-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD BlogPosting schema for each published post */}
      {posts.map((post) => (
        <script
          key={`ld-${post.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              image: post.featured_image ? [post.featured_image] : undefined,
              datePublished: post.created_at,
              dateModified: post.created_at,
              articleSection: post.category,
              keywords: (post.tags || []).join(", "),
              author: { "@type": "Organization", name: "Astrovibe" },
              publisher: {
                "@type": "Organization",
                name: "Astrovibe",
                logo: {
                  "@type": "ImageObject",
                  url: "https://astro-europe-daily-guide.lovable.app/favicon.ico",
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://astro-europe-daily-guide.lovable.app/blog#${post.id}`,
              },
            }),
          }}
        />
      ))}

      {/* Sponsor Banner */}
      <SponsorBanner page="blog" />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Astrology Blog</h1>
        <p className="text-muted-foreground">Explore articles on astrology, numerology, and cosmic wisdom</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <ZodiacWheelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            {post.featured_image && (
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(post.category)}>
                  {post.category}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </div>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Blog;