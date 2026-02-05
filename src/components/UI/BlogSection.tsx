'use client'
import React, { useMemo } from 'react';
import { BLOG_POSTS } from './constants';
import { ArrowRight, Calendar } from 'lucide-react';

interface BlogSectionProps {
  onBlogClick?: (id: string) => void;
  onViewGuides?: () => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ onBlogClick, onViewGuides }) => {
  // Logic: Get latest 4 articles, place earliest of those 4 on the left
  const { featuredPost, sidePosts } = useMemo(() => {
    // 1. Sort all posts by Date Descending (Newest first)
    const sorted = [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // 2. Take Top 4
    const latestFour = sorted.slice(0, 4);

    if (latestFour.length === 0) return { featuredPost: null, sidePosts: [] };

    // 3. Find Earliest of the Top 4 (which is the last one in the descending list)
    const earliest = latestFour[latestFour.length - 1];
    
    // 4. The rest are the side posts (Newer ones)
    // We keep them in descending order (Newest on top)
    const rest = latestFour.slice(0, latestFour.length - 1);

    return { featuredPost: earliest, sidePosts: rest };
  }, []);

  if (!featuredPost) return null;

  return (
    <section id="blog" className="py-20 px-4 md:px-8 bg-transparent">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">Travel Inspiration</h2>
            <p className="text-brand-green/80 text-lg">Guides and stories from our team.</p>
          </div>
          <button 
            onClick={onViewGuides}
            className="hidden md:flex items-center gap-2 text-white font-bold bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-all"
          >
            View More Guides <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Featured Post (Left) - Earliest of the latest 4 */}
          <div 
            onClick={() => onBlogClick?.(featuredPost.id)}
            className="group cursor-pointer flex flex-col h-full bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors duration-300 shadow-2xl"
          >
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-inner">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                loading="lazy"
                decoding="async" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            
            <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-4">
                     <span className="inline-flex items-center gap-1.5 bg-brand-green text-brand-navy px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Calendar size={12} /> {featuredPost.date}
                     </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-brand-green transition-colors">
                  {featuredPost.title}
                </h3>
                
                <p className="text-gray-300 mb-8 leading-relaxed max-w-xl flex-grow">
                  {featuredPost.excerpt}
                </p>

                <div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onBlogClick?.(featuredPost.id); }}
                        className="bg-brand-green hover:bg-[#8cc72b] text-brand-navy font-bold rounded-full px-8 py-3 transition-colors inline-flex items-center gap-2"
                    >
                        Read Article <ArrowRight size={18} />
                    </button>
                </div>
            </div>
          </div>

          {/* Side Posts (Right) - The other 3 (Newer) */}
          <div className="flex flex-col gap-4">
            {sidePosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => onBlogClick?.(post.id)}
                className="flex flex-col md:flex-row gap-5 group cursor-pointer items-center bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-3xl transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-48 aspect-video md:aspect-[4/3] shrink-0 rounded-2xl overflow-hidden relative shadow-lg">
                    <img 
                        src={post.image} 
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                
                {/* Content */}
                <div className="flex flex-col w-full pr-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-brand-green text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar size={12} /> {post.date}
                        </span>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug group-hover:text-brand-green transition-colors line-clamp-2">
                        {post.title}
                    </h4>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                        {post.excerpt}
                    </p>
                </div>
              </div>
            ))}
          </div>

        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
            <button 
                onClick={onViewGuides}
                className="inline-flex items-center gap-2 text-brand-navy font-bold bg-brand-green px-8 py-4 rounded-full shadow-lg hover:bg-[#8cc72b] transition-colors"
            >
                View More Guides <ArrowRight size={18} />
            </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
