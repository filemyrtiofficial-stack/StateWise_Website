import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;
  featured?: boolean;
}

// Helper function to generate SEO-friendly slugs
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const pageTitle = "Blog - FileMyRTI | RTI Guides, Tips & Latest Updates";
  const pageDescription = "Read our blog for RTI guides, tips, latest updates, success stories, and expert insights on filing RTI applications. Stay informed about the Right to Information Act and transparency in governance.";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/blogs";
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // Sample blog posts - In production, these would come from a CMS or API
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'how-to-file-rti-online-complete-step-by-step-guide',
      title: 'How to File RTI Online: A Complete Step-by-Step Guide',
      excerpt: 'Learn how to file RTI applications online with our comprehensive guide. We cover everything from drafting your query to tracking your application.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2025-01-15',
      category: 'Guide',
      readTime: '5 min read',
      featured: true
    },
    {
      id: '2',
      slug: 'understanding-rti-act-2005-rights-and-responsibilities',
      title: 'Understanding the RTI Act 2005: Your Rights and Responsibilities',
      excerpt: 'Get a clear understanding of the Right to Information Act 2005, your rights as a citizen, and how to exercise them effectively.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2025-01-12',
      category: 'Legal',
      readTime: '7 min read',
      featured: true
    },
    {
      id: '3',
      slug: 'top-10-rti-success-stories-citizens-bring-transparency',
      title: 'Top 10 RTI Success Stories: How Citizens Used RTI to Bring Transparency',
      excerpt: 'Discover inspiring stories of citizens who used RTI to expose corruption, improve public services, and bring accountability to government.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2025-01-10',
      category: 'Success Stories',
      readTime: '8 min read'
    },
    {
      id: '4',
      slug: 'rti-fees-and-charges-everything-you-need-to-know',
      title: 'RTI Fees and Charges: Everything You Need to Know',
      excerpt: 'A detailed guide on RTI application fees, processing charges, and what to expect when filing RTI applications online.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2025-01-08',
      category: 'Guide',
      readTime: '4 min read'
    },
    {
      id: '5',
      slug: 'how-to-write-effective-rti-query-tips-and-examples',
      title: 'How to Write an Effective RTI Query: Tips and Examples',
      excerpt: 'Learn the art of framing RTI queries that get results. We share expert tips and real examples of effective RTI applications.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2025-01-05',
      category: 'Tips',
      readTime: '6 min read'
    },
    {
      id: '6',
      slug: 'first-appeal-vs-second-appeal-when-and-how-to-file',
      title: 'First Appeal vs Second Appeal: When and How to File',
      excerpt: 'Understand the difference between First Appeal and Second Appeal in RTI, and learn when to file each type of appeal.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2025-01-03',
      category: 'Legal',
      readTime: '5 min read'
    },
    {
      id: '7',
      slug: 'rti-for-students-how-to-use-rti-for-academic-information',
      title: 'RTI for Students: How to Use RTI for Academic Information',
      excerpt: 'Students can use RTI to access exam results, answer sheets, admission details, and more. Learn how to file RTI as a student.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2024-12-28',
      category: 'Guide',
      readTime: '5 min read'
    },
    {
      id: '8',
      slug: 'digital-india-and-rti-how-technology-transforming-transparency',
      title: 'Digital India and RTI: How Technology is Transforming Transparency',
      excerpt: 'Explore how digital platforms and online RTI filing are making government information more accessible to citizens across India.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2024-12-25',
      category: 'Technology',
      readTime: '6 min read'
    },
    {
      id: '9',
      slug: 'common-rti-rejection-reasons-and-how-to-avoid-them',
      title: 'Common RTI Rejection Reasons and How to Avoid Them',
      excerpt: 'Learn about the most common reasons RTI applications get rejected and how to ensure your application is accepted.',
      content: '',
      author: 'FileMyRTI Team',
      date: '2024-12-22',
      category: 'Tips',
      readTime: '4 min read'
    }
  ].map(post => ({
    ...post,
    slug: post.slug || generateSlug(post.title) // Ensure slug exists, generate if missing
  }));

  const categories = ['all', 'Guide', 'Legal', 'Tips', 'Success Stories', 'Technology'];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Structured Data (JSON-LD) - Blog Collection
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "FileMyRTI Blog",
    "description": pageDescription,
    "url": "https://filemyrti.com/blogs",
    "inLanguage": "en-IN",
    "publisher": {
      "@type": "Organization",
      "name": "FileMyRTI",
      "url": "https://filemyrti.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://filemyrti.com/src/assets/icons/logo.webp",
        "width": 120,
        "height": 48
      },
      "sameAs": [
        "https://www.linkedin.com/company/105639903/admin/dashboard/",
        "https://www.facebook.com/profile.php?id=61572512135057",
        "https://x.com/FileMyRTI",
        "https://www.instagram.com/filemyrtiofficial/",
        "https://www.youtube.com/@FileMyRTI"
      ]
    },
    "blogPost": blogPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Organization",
        "name": post.author
      },
      "datePublished": post.date,
      "dateModified": post.date,
      "articleSection": post.category,
      "timeRequired": post.readTime,
      "url": `https://filemyrti.com/blogs/${post.slug}`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://filemyrti.com/blogs/${post.slug}`
      }
    }))
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://filemyrti.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="RTI blog, RTI guides, Right to Information Act, RTI tips, RTI success stories, RTI online filing, government transparency, RTI Act 2005" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="FileMyRTI" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Article-specific meta for featured posts */}
        {featuredPosts.length > 0 && (
          <>
            <meta property="article:author" content={featuredPosts[0].author} />
            <meta property="article:published_time" content={featuredPosts[0].date} />
            <meta property="article:section" content={featuredPosts[0].category} />
          </>
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <main className="flex-grow bg-gray-50">
          {/* Hero Section */}
          <header className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-8 sm:py-12">
            <div className="container-responsive max-w-7xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                FileMyRTI Blog
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto">
                RTI Guides, Tips, Success Stories & Latest Updates
              </p>
              <p className="text-sm sm:text-base text-primary-200 mt-4 max-w-2xl mx-auto">
                Comprehensive guides, expert tips, and real success stories to help you file RTI applications effectively. Learn about the Right to Information Act 2005, understand your rights, and discover how citizens are using RTI to bring transparency and accountability to governance.
              </p>
            </div>
          </header>

          {/* Category Filter */}
          <section className="py-6 bg-white border-b border-gray-200">
            <div className="container-responsive max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${selectedCategory === category
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category === 'all' ? 'All Posts' : category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Blog Content */}
          <section className="py-12 md:py-16 lg:py-20">
            <div className="container-responsive max-w-7xl mx-auto">
              {/* Featured Posts */}
              {selectedCategory === 'all' && featuredPosts.length > 0 && (
                <section className="mb-12" aria-label="Featured blog posts">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Featured Posts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {featuredPosts.map((post) => (
                      <article
                        key={post.id}
                        itemScope
                        itemType="https://schema.org/BlogPosting"
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                      >
                        <div className="p-6 sm:p-8 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span
                              itemProp="articleSection"
                              className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full whitespace-nowrap"
                            >
                              {post.category}
                            </span>
                            <meta itemProp="timeRequired" content={post.readTime} />
                            <span className="text-gray-500 text-xs" aria-label="Reading time">{post.readTime}</span>
                          </div>
                          <h3
                            itemProp="headline"
                            className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]"
                          >
                            {post.title}
                          </h3>
                          <p
                            itemProp="description"
                            className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 flex-grow"
                          >
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                              <span itemProp="author" itemScope itemType="https://schema.org/Organization">
                                <meta itemProp="name" content={post.author} />
                                <span>{post.author}</span>
                              </span>
                              <span aria-hidden="true">•</span>
                              <time itemProp="datePublished" dateTime={post.date}>
                                {formatDate(post.date)}
                              </time>
                            </div>
                            <Link
                              itemProp="url"
                              to={`/blogs/${post.slug}`}
                              className="text-primary-600 hover:text-primary-700 font-semibold text-sm sm:text-base transition-colors whitespace-nowrap ml-4"
                              aria-label={`Read more about ${post.title}`}
                            >
                              Read More →
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Regular Posts */}
              <section aria-label="Blog posts">
                {selectedCategory === 'all' && regularPosts.length > 0 && (
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">All Posts</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {regularPosts.map((post) => (
                    <article
                      key={post.id}
                      itemScope
                      itemType="https://schema.org/BlogPosting"
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <span
                            itemProp="articleSection"
                            className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full whitespace-nowrap"
                          >
                            {post.category}
                          </span>
                          <meta itemProp="timeRequired" content={post.readTime} />
                          <span className="text-gray-500 text-xs" aria-label="Reading time">{post.readTime}</span>
                        </div>
                        <h3
                          itemProp="headline"
                          className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]"
                        >
                          {post.title}
                        </h3>
                        <p
                          itemProp="description"
                          className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow"
                        >
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                          <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                            <span itemProp="author" itemScope itemType="https://schema.org/Organization">
                              <meta itemProp="name" content={post.author} />
                              <span>{post.author}</span>
                            </span>
                            <span aria-hidden="true">•</span>
                            <time itemProp="datePublished" dateTime={post.date}>
                              {formatDate(post.date)}
                            </time>
                          </div>
                          <Link
                            itemProp="url"
                            to={`/blogs/${post.slug}`}
                            className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors whitespace-nowrap ml-4"
                            aria-label={`Read more about ${post.title}`}
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Empty State */}
              {regularPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No posts found in this category.</p>
                </div>
              )}

              {/* Newsletter CTA */}
              <aside className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 text-center" aria-label="Newsletter subscription">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Stay Updated
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Subscribe to our newsletter to get the latest RTI guides, tips, and updates delivered to your inbox. Stay informed about the Right to Information Act, learn from success stories, and get expert advice on filing effective RTI applications.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe Now
                </Link>
              </aside>
            </div>
          </section>
        </main>
        <Footer />
        <LazyChatbot />
      </div>
    </>
  );
};

