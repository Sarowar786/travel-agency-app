
import React, { useEffect, useState } from 'react';
import { BLOG_POSTS } from '../../components/UI/constants';
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Facebook, Linkedin, User, ChevronRight, Tag } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface BlogDetailsProps {
    blogId: string | null;
    onNavigateBack: () => void;
    onBlogClick: (id: string) => void;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ blogId, onNavigateBack, onBlogClick }) => {

    
    // Determine which blog to show. If ID matches the Osaka one, we show the full implemented UI.
    // If not, we show a generic layout but populating header info from the ID.
    const blogData = BLOG_POSTS.find(b => b.id === blogId) || BLOG_POSTS[0];
    
    // We are hardcoding the content for ID '5' (Osaka) as the "Sample Implementation".
    // For any other ID, we will just use the same layout but maybe generic lorem ipsum or specific logic if needed.
    // For the purpose of this prototype, we'll assume the user clicks "Osaka" or we treat "Osaka" as the gold standard.
    const isOsaka = blogData.id === '5' || blogData.title.includes('Osaka');
    
    // Scroll Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [blogId]);

    // Related Posts (Random selection excluding current)
    const relatedPosts = BLOG_POSTS.filter(p => p.id !== blogData.id).slice(0, 2);

    return (
        <div className="bg-white min-h-screen relative">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-brand-green origin-left z-60"
                style={{ scaleX }}
            />

            {/* HERO SECTION */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img 
                        src={blogData.image} 
                        alt={blogData.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/50 to-transparent"></div>
                </motion.div>

                <div className="absolute top-24 left-0 right-0 px-6 md:px-8 z-20">
                    <button 
                        onClick={onNavigateBack}
                        className="group flex items-center gap-2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full font-bold transition-all"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                        Back to Journal
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
                    <div className="container mx-auto max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90 font-medium text-sm md:text-base">
                                <span className="bg-brand-green text-brand-navy px-3 py-1 rounded-full font-bold uppercase text-xs tracking-wider">
                                    {blogData.category}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} className="text-brand-green"/> {blogData.date}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock size={16} className="text-brand-green"/> {blogData.readTime}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
                                {blogData.title}
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                    <User size={24} className="text-brand-green" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">{blogData.author}</p>
                                    <p className="text-gray-300 text-xs uppercase tracking-wider">Travel Editor</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="container mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Main Article Column */}
                    <div className="lg:col-span-8 lg:col-start-3">
                        
                        {/* Intro / Excerpt */}
                        <div className="text-xl md:text-2xl text-brand-navy font-medium leading-relaxed mb-12 border-l-4 border-brand-green pl-6 font-serif italic">
                            "{blogData.excerpt}"
                        </div>

                        {/* Rich Text Body */}
                        <div className="prose prose-lg prose-headings:text-brand-navy prose-p:text-gray-600 prose-a:text-brand-teal hover:prose-a:text-brand-navy prose-img:rounded-3xl prose-img:shadow-xl max-w-none">
                            {isOsaka ? (
                                <>
                                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-brand-green first-letter:mr-3 first-letter:float-left">
                                        Osaka is loud, brash, and unapologetically delicious. While Kyoto has the temples and Tokyo has the neon, Osaka has the soul (and the stomach) of Japan. Known locally as <em>Tenka no Daidokoro</em> (the Nation's Kitchen), this city doesn't just eat to live—it lives to eat.
                                    </p>
                                    <p>
                                        Forget the white tablecloths. In Osaka, the best meals are found standing up in a crowded stall, yelling your order over the din of sizzling hotplates, and burning your tongue on a molten ball of octopus batter. Here is your ultimate guide to eating your way through Japan's grittiest, tastiest city.
                                    </p>

                                    <h2 className="text-3xl font-bold mt-12 mb-6 text-brand-navy flex items-center gap-3">
                                        <span className="text-brand-green">01.</span> Dotonbori: The Neon Feast
                                    </h2>
                                    <p>
                                        You haven't been to Osaka until you've been blinded by the Glico Man sign and deafened by the sensory overload of Dotonbori. It’s touristy? Yes. Essential? Absolutely.
                                    </p>
                                    <img src="https://images.unsplash.com/photo-1590559899731-a38283956c8c?q=80&w=1000" alt="Dotonbori Street" className="w-full h-96 object-cover" />
                                    <ul className="list-disc pl-5 space-y-2 mt-6">
                                        <li><strong>Takoyaki (Octopus Balls):</strong> Head to <em>Kukuru</em> for the gooiest insides and biggest octopus chunks. Watch the masters flick the batter with lightning speed.</li>
                                        <li><strong>Okonomiyaki (Savory Pancake):</strong> <em>Mizuno</em> always has a line, but their yam-flour pancake is lighter than air. Worth the wait.</li>
                                        <li><strong>Kushikatsu (Deep Fried Skewers):</strong> Remember the golden rule: <strong>No double dipping!</strong> The sauce is communal, so dip once and commit.</li>
                                    </ul>

                                    <h2 className="text-3xl font-bold mt-12 mb-6 text-brand-navy flex items-center gap-3">
                                        <span className="text-brand-green">02.</span> Kuromon Ichiba: Seafood Heaven
                                    </h2>
                                    <p>
                                        If Dotonbori is for the night owls, Kuromon is for the early risers. This 600-meter long covered market has been serving chefs and housewives for 190 years.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 my-8">
                                        <img src="https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=600" alt="Sashimi" className="rounded-2xl shadow-md w-full h-48 object-cover" />
                                        <img src="https://images.unsplash.com/photo-1621855663673-c6ec46a782b6?q=80&w=600" alt="Uni" className="rounded-2xl shadow-md w-full h-48 object-cover" />
                                    </div>
                                    <p>
                                        Look for the grilled scallops with butter and soy sauce, or splurge on a tray of Uni (sea urchin) that tastes like the ocean turned into custard. Don't miss the <em>Maguro</em> (tuna) butchers who slice giant fish right in front of you.
                                    </p>

                                    <h2 className="text-3xl font-bold mt-12 mb-6 text-brand-navy flex items-center gap-3">
                                        <span className="text-brand-green">03.</span> The Fluffy Cheesecake Phenomenon
                                    </h2>
                                    <p>
                                        Is it cake? Is it a cloud? It's <strong>Rikuro Ojisan</strong>. When you hear the bell ring, a fresh batch is ready. The cheesecake is jiggly, airy, and has raisins at the bottom (a controversial choice, but trust the process).
                                    </p>
                                    <blockquote>
                                        "To eat in Osaka is to ruin yourself for food anywhere else." — Anthony Bourdain
                                    </blockquote>
                                    
                                    <h2 className="text-3xl font-bold mt-12 mb-6 text-brand-navy flex items-center gap-3">
                                        <span className="text-brand-green">04.</span> Hidden Izakayas in Ura-Namba
                                    </h2>
                                    <p>
                                        Escape the crowds and head to the backstreets of Namba (Ura-Namba). This is where the locals drink. Find <em>Torime</em> for yakitori that will change your life. The chicken skin is crispy, salty perfection, best washed down with a frozen lemon sour.
                                    </p>
                                    
                                    <div className="bg-brand-sand/30 p-8 rounded-3xl mt-12 border border-brand-green/20">
                                        <h3 className="text-xl font-bold text-brand-navy mb-4">💡 Pro Tips for Osaka</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 shrink-0" />
                                                <span>Stand on the <strong>right</strong> side of the escalator. In Tokyo it's left, but Osaka likes to be different.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 shrink-0" />
                                                <span>Learn the phrase <em>"Kuidaore"</em>. It means "to eat until you drop" (or go bankrupt). It's the city motto.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 shrink-0" />
                                                <span>Cash is king in the markets. Keep those 1000 yen notes handy.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-brand-green first-letter:mr-3 first-letter:float-left">
                                        Planning a trip can be daunting, but it doesn't have to be. Whether you are looking for a relaxing beach getaway or an action-packed city adventure, the principles of a great vacation remain the same.
                                    </p>
                                    <p>
                                        In this guide, we will walk you through the essential steps to curating your perfect itinerary, packing smart, and ensuring you get the most out of your hard-earned time off.
                                    </p>
                                    <h2 className="text-3xl font-bold mt-12 mb-6 text-brand-navy">1. Choosing the Right Destination</h2>
                                    <p>
                                        Consider what you need right now. Do you need rest? Adventure? Culture? Be honest with yourself about your energy levels.
                                    </p>
                                    <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000" alt="Travel Planning" className="w-full h-80 object-cover mt-6" />
                                    <p className="mt-6">
                                        More content coming soon for this article. Stay tuned for updates!
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Tags & Share */}
                        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-gray-400 font-bold text-sm mr-2 flex items-center gap-1"><Tag size={16}/> Tags:</span>
                                {isOsaka ? (
                                    <>
                                        {['Japan', 'Foodie', 'Osaka', 'Travel Guide'].map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-brand-green/20 hover:text-brand-navy transition-colors cursor-pointer">{tag}</span>
                                        ))}
                                    </>
                                ) : (
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{blogData.category}</span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-brand-navy font-bold text-sm flex items-center gap-2">
                                    <Share2 size={16} /> Share:
                                </span>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#1DA1F2] hover:text-white transition-colors">
                                        <Twitter size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#4267B2] hover:text-white transition-colors">
                                        <Facebook size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#0077b5] hover:text-white transition-colors">
                                        <Linkedin size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div className="bg-brand-navy rounded-3xl p-8 mt-12 text-white flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green rounded-full blur-[60px] opacity-20"></div>
                            
                            <div className="w-20 h-20 rounded-full border-2 border-brand-green p-1 shrink-0">
                                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                                     {/* Placeholder Avatar */}
                                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blogData.author}`} alt="Author" />
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left relative z-10">
                                <h3 className="text-xl font-bold mb-2">Written by {blogData.author}</h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    Travel Editor at Long Vacation. Obsessed with finding the perfect bowl of ramen and maximizing weekend layovers. When not writing, I'm probably lost in a fish market somewhere.
                                </p>
                                <button className="text-brand-green font-bold text-sm hover:underline">View All Posts</button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* RELATED POSTS */}
            <div className="bg-gray-50 py-20 border-t border-gray-200">
                <div className="container mx-auto px-4 md:px-8">
                    <h3 className="text-2xl font-bold text-brand-navy mb-8">You might also like</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {relatedPosts.map(post => (
                            <div 
                                key={post.id} 
                                onClick={() => onBlogClick(post.id)}
                                className="group bg-white rounded-3xl p-4 flex gap-6 border border-gray-100 hover:shadow-xl hover:border-brand-teal/30 transition-all cursor-pointer items-center"
                            >
                                <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-brand-teal uppercase mb-2">{post.category}</div>
                                    <h4 className="font-bold text-brand-navy text-lg mb-2 leading-tight group-hover:text-brand-green transition-colors">{post.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                                <div className="ml-auto pr-4 text-gray-300 group-hover:text-brand-teal transition-colors">
                                    <ChevronRight size={24} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
