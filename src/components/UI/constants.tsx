
import { TripCardData, ValuePropData, BlogCardData } from '../../../types';
import { Clock, Gem, Heart } from 'lucide-react';

// --- IMAGE CONFIGURATION ---

// 1. ONLINE IMAGES FOR FEATURED TRIP CARDS (High Res Unsplash)
// Optimized: Reduced width to 600px for cards, quality to 75
const CARD_IMG_CHONGQING = 'https://images.unsplash.com/photo-1535025639604-9a804c092faa?q=75&w=600&auto=format&fit=crop';
const CARD_IMG_CHANGSHA = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=75&w=600&auto=format&fit=crop';
const CARD_IMG_BALI = 'https://images.unsplash.com/photo-1573790387438-4da905039392?q=75&w=600&auto=format&fit=crop';

// 2. LOCAL IMAGES FOR HERO CAROUSEL BANNER
const BANNER_IMG_CHONGQING = '/images/chongqing-cyberpunk.jpg';
const BANNER_IMG_CHANGSHA = '/images/changsha-food.jpg'; 
const BANNER_IMG_BALI = '/images/bali-luxe.jpg';

// 3. BACKUP IMAGES
// Optimized: Limited max width for full screen banners to 1600px
const BACKUP_IMG_CHONGQING = 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1600&auto=format&fit=crop'; 
const BACKUP_IMG_CHANGSHA = 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=1600&auto=format&fit=crop'; 
const BACKUP_IMG_BALI = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600&auto=format&fit=crop';

// --- PACKAGES DATA ---

export const FEATURED_TRIPS: TripCardData[] = [
  {
    id: '1',
    title: 'CHONGQING CYBERPUNK',
    image: CARD_IMG_CHONGQING,
    location: 'China • Chongqing',
    tags: ['Adventure', 'Foodie', '3 nights'],
    description: 'Experience the 8D Magic City with stunning night views, legendary hotpot, and futuristic architecture.',
    highlights: ['Private MPV Airport Transfer', '5-Star Sky Hotel', 'VIP No-Queue Hotpot'],
    price: 'S$880',
    badge: 'Special Offer',
    offers: ['Free 5GB eSIM Card', 'Comp. River Cruise Ticket'],
    hashtags: ['#8DMagicCity', '#CyberpunkVibes', '#Hotpot4Lyfe', '#重庆火锅', '#NoQueueVIP', '#FutureCity']
  },
  {
    id: '2',
    title: 'CHANGSHA FOOD TRAIL',
    image: CARD_IMG_CHANGSHA,
    location: 'China • Changsha',
    tags: ['Foodie', 'Culture', '4 nights'],
    description: 'The ultimate eat-venture through Michelin hidden gems with a private local foodie guide.',
    highlights: ['Michelin Guide Hidden Gems', 'Private Local Foodie Guide', 'All Meals Included'],
    price: 'S$750',
    originalPrice: 'S$950',
    badge: '2 Offers',
    offers: ['10% Off Group Booking (4+)', 'Free High-Speed Rail Transfer'],
    hashtags: ['#SpicyFoodCheck', '#长沙美食', '#MichelinStar', '#HiddenGems', '#SooooShiok', '#FoodComa']
  },
  {
    id: '3',
    title: 'BALI & DESARU LUXE',
    image: CARD_IMG_BALI,
    location: 'Indonesia • Bali',
    tags: ['Luxury', 'Family', '3 nights'],
    description: 'Sun, sand & private villas. The perfect weekend villa escape with dedicated nanny service.',
    highlights: ['Private Pool Villa', 'Dedicated Nanny Service', 'Sunset Dinner Cruise'],
    price: 'S$450',
    hashtags: ['#VillaLife', '#BaliSunset', '#PrivatePool', '#OMGOPPA', '#RelaxMax', '#KidsSorted']
  },
];

export const ALL_PACKAGES: TripCardData[] = [
  ...FEATURED_TRIPS,
  {
    id: '4',
    title: 'BANGKOK SHOPPING SPREE',
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=75&w=600',
    location: 'Thailand • Bangkok',
    tags: ['Shopping', 'City', '3 nights'],
    description: 'Shop til you drop in Platinum & Chatuchak with a private van on standby.',
    highlights: ['Private Van (10hrs/day)', 'Massage Session Included', 'Luggage Assistance'],
    price: 'S$350',
    hashtags: ['#Shopaholic', '#BKK', '#ThaiTea', '#ChatuchakWeekend']
  },
  {
    id: '5',
    title: 'KYOTO ZEN RETREAT',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=75&w=600',
    location: 'Japan • Kyoto',
    tags: ['Culture', 'Nature', '5 nights'],
    description: 'Immerse in ancient temples, bamboo forests, and a traditional tea ceremony.',
    highlights: ['Ryokan Stay', 'Tea Ceremony Class', 'Private Geisha District Tour'],
    price: 'S$1,880',
    originalPrice: 'S$2,200',
    badge: 'Early Bird',
    offers: ['Free Kimono Rental'],
    hashtags: ['#ZenMode', '#KyotoVibes', '#MatchaLover', '#JapanTravel']
  },
  {
    id: '6',
    title: 'HOKKAIDO SNOW SAFARI',
    image: 'https://images.unsplash.com/photo-1542261777421-500271f65b40?q=75&w=600',
    location: 'Japan • Hokkaido',
    tags: ['Nature', 'Adventure', '6 nights'],
    description: 'Powder snow, fresh seafood, and relaxing onsens in Japan’s northern paradise.',
    highlights: ['Ski Pass Included', 'Crab Buffet Dinner', 'Private Onsen Access'],
    price: 'S$2,450',
    hashtags: ['#PowderSnow', '#HokkaidoCrab', '#OnsenLife', '#WinterWonderland']
  },
  {
    id: '7',
    title: 'SEOUL K-POP & STYLE',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=75&w=600',
    location: 'Korea • Seoul',
    tags: ['City', 'Shopping', '5 nights'],
    description: 'Walk the trendy streets of Gangnam and Hongdae. Style makeover included!',
    highlights: ['K-Style Hair Makeover', 'Dance Class Experience', 'Han River Picnic'],
    price: 'S$1,200',
    hashtags: ['#KPopStan', '#SeoulStyle', '#Gangnam', '#KoreanBBQ']
  },
  {
    id: '8',
    title: 'PHUKET ISLAND HOPPING',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=75&w=600',
    location: 'Thailand • Phuket',
    tags: ['Nature', 'Adventure', '4 nights'],
    description: 'Speedboat adventures to Phi Phi islands and hidden lagoons.',
    highlights: ['Private Speedboat Charter', 'Snorkeling Gear', 'Beachfront BBQ'],
    price: 'S$550',
    originalPrice: 'S$700',
    badge: 'Best Seller',
    hashtags: ['#IslandLife', '#Phuket', '#BeachBum', '#VitaminSea']
  },
  {
    id: '9',
    title: 'TOKYO NEON NIGHTS',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=75&w=600',
    location: 'Japan • Tokyo',
    tags: ['City', 'Foodie', '5 nights'],
    description: 'From Shibuya crossing to hidden Izakayas, experience the pulse of Tokyo.',
    highlights: ['Mario Kart Tour', 'Robot Restaurant Ticket', 'Sushi Omakase'],
    price: 'S$1,650',
    hashtags: ['#TokyoDrift', '#Shibuya', '#SushiTime', '#NeonCity']
  },
  {
    id: '10',
    title: 'HANOI & HA LONG BAY',
    image: 'https://images.unsplash.com/photo-1528127220161-736512f20065?q=75&w=600',
    location: 'Vietnam • Hanoi',
    tags: ['Culture', 'Nature', '4 nights'],
    description: 'Cruise through limestone karsts and explore the chaotic charm of Old Quarter.',
    highlights: ['Luxury Overnight Cruise', 'Street Food Tour', 'Egg Coffee Workshop'],
    price: 'S$680',
    hashtags: ['#HaLongBay', '#PhoReal', '#VietnamTravel', '#CoffeeAddict']
  },
  {
    id: '11',
    title: 'JEJU ROAD TRIP',
    image: 'https://images.unsplash.com/photo-1582453629470-49c065f49d3e?q=75&w=600',
    location: 'Korea • Jeju',
    tags: ['Nature', 'Family', '4 nights'],
    description: 'Self-drive adventure along the coastlines of Korea’s volcanic island.',
    highlights: ['Rental Car Included', 'Tangerine Picking', 'Sunrise Peak Hike'],
    price: 'S$920',
    hashtags: ['#JejuIsland', '#RoadTrip', '#NatureLovers', '#KoreaTrip']
  },
  {
    id: '12',
    title: 'SHANGHAI MODERN',
    image: 'https://images.unsplash.com/photo-1505164294036-61b5655099cd?q=75&w=600',
    location: 'China • Shanghai',
    tags: ['City', 'Luxury', '4 nights'],
    description: 'The Bund views, French Concession walks, and ultra-modern dining.',
    highlights: ['The Bund Rooftop Drink', 'Disneyland Ticket', 'Maglev Train Experience'],
    price: 'S$980',
    hashtags: ['#ShanghaiNights', '#TheBund', '#ModernChina', '#CityLights']
  },
  {
    id: '13',
    title: 'MALDIVES WATER VILLA',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=75&w=600',
    location: 'Maldives • Male',
    tags: ['Luxury', 'Nature', '4 nights'],
    description: 'Wake up to the ocean at your doorstep. The ultimate honeymoon escape.',
    highlights: ['All-Inclusive Meal Plan', 'Seaplane Transfer', 'Underwater Restaurant'],
    price: 'S$3,200',
    originalPrice: 'S$4,500',
    badge: 'Honeymoon',
    offers: ['Comp. Spa Treatment', 'Romantic Bed Decoration'],
    hashtags: ['#Maldives', '#Honeymoon', '#Paradise', '#LuxuryTravel']
  },
  {
    id: '14',
    title: 'SWISS ALPS ADVENTURE',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=75&w=600',
    location: 'Europe • Switzerland',
    tags: ['Nature', 'Adventure', '7 nights'],
    description: 'Scenic trains, mountain peaks, and chocolate factories.',
    highlights: ['Swiss Travel Pass', 'Jungfraujoch Ticket', 'Chocolate Train'],
    price: 'S$3,800',
    hashtags: ['#SwissAlps', '#TrainTravel', '#NaturePorn', '#EuropeTrip']
  },
  {
    id: '15',
    title: 'OSAKA FOOD FIGHT',
    image: 'https://images.unsplash.com/photo-1590559899731-a38283956c8c?q=75&w=600',
    location: 'Japan • Osaka',
    tags: ['Foodie', 'Fun', '4 nights'],
    description: 'Eat your way through Dotonbori and visit Universal Studios Japan.',
    highlights: ['USJ Express Pass', 'Takoyaki Making Class', 'Kuromon Market Tour'],
    price: 'S$1,450',
    hashtags: ['#OsakaFood', '#USJ', '#Dotonbori', '#EatTilYouDrop']
  },
  {
    id: '16',
    title: 'DUBAI DESERT LUXE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?q=75&w=600',
    location: 'Middle East • Dubai',
    tags: ['Luxury', 'Adventure', '5 nights'],
    description: 'Gold souks, skyscrapers, and a night under the stars in the desert.',
    highlights: ['Desert Glamping', 'Burj Khalifa Top View', 'Yacht Cruise'],
    price: 'S$2,100',
    hashtags: ['#DubaiBling', '#DesertSafari', '#LuxuryLife', '#MiddleEast']
  },
  {
    id: '17',
    title: 'SYDNEY HARBOUR',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=75&w=600',
    location: 'Australia • Sydney',
    tags: ['City', 'Nature', '5 nights'],
    description: 'Opera House views, Bondi Beach surfing, and Blue Mountains day trip.',
    highlights: ['Bridge Climb', 'Blue Mountains Tour', 'Taronga Zoo Ferry'],
    price: 'S$1,950',
    hashtags: ['#Sydney', '#DownUnder', '#BondiBeach', '#OperaHouse']
  },
  {
    id: '18',
    title: 'TAIPEI NIGHT MARKETS',
    image: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?q=75&w=600',
    location: 'Taiwan • Taipei',
    tags: ['Foodie', 'City', '4 nights'],
    description: 'Bubble tea, stinky tofu, and lantern releasing in Shifen.',
    highlights: ['Private Driver to Jiufen', 'Night Market Tour', 'Taipei 101 Ticket'],
    price: 'S$850',
    hashtags: ['#TaipeiEats', '#BubbleTea', '#Jiufen', '#TaiwanTravel']
  },
  {
    id: '19',
    title: 'SANTORINI SUNSETS',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=75&w=600',
    location: 'Europe • Greece',
    tags: ['Luxury', 'Culture', '5 nights'],
    description: 'White washed buildings, blue domes, and romantic sunsets.',
    highlights: ['Catamaran Sunset Cruise', 'Wine Tasting', 'Caldera View Hotel'],
    price: 'S$2,800',
    hashtags: ['#Santorini', '#Greece', '#SunsetLover', '#RomanticGetaway']
  },
  {
    id: '20',
    title: 'BINTAN WEEKEND',
    image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?q=75&w=600',
    location: 'Indonesia • Bintan',
    tags: ['Family', 'Nature', '2 nights'],
    description: 'Quick ferry getaway to resorts and seafood dinners.',
    highlights: ['Ferry Tickets Included', 'Seafood Dinner', 'Fireflies Tour'],
    price: 'S$380',
    badge: 'Quick Getaway',
    hashtags: ['#Bintan', '#WeekendTrip', '#ShortGetaway', '#FamilyFun']
  }
];

// --- CRUISE DATA ---

export const CRUISES = [
    {
        id: 'c1',
        title: 'Genting Dream Getaway',
        ship: 'Genting Dream',
        nights: 3,
        route: 'Singapore • Penang • Singapore',
        price: 'S$459',
        image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=75&w=600',
        tags: ['Weekend', 'Family Fun'],
        departure: 'Fri, 12 Oct',
        destination: 'Penang',
        type: 'cruise'
    },
    {
        id: 'c2',
        title: 'Spectrum of the Seas',
        ship: 'Royal Caribbean',
        nights: 4,
        route: 'Singapore • Phuket • Singapore',
        price: 'S$680',
        image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe79ba02?q=75&w=600',
        tags: ['Luxury', 'Entertainment'],
        departure: 'Mon, 15 Oct',
        destination: 'Phuket',
        type: 'cruise'
    },
    {
        id: 'c3',
        title: 'Disney Adventure Magic',
        ship: 'Disney Adventure',
        nights: 5,
        route: 'Singapore • High Seas • Singapore',
        price: 'S$980',
        image: 'https://images.unsplash.com/photo-1599640845513-2626ef274f81?q=75&w=600',
        tags: ['Kids', 'Disney Magic'],
        departure: 'Wed, 20 Nov',
        destination: 'High Seas',
        type: 'cruise'
    },
    {
        id: 'c4',
        title: 'Resorts World One',
        ship: 'Resorts World Cruises',
        nights: 5,
        route: 'Singapore • Ho Chi Minh • Singapore',
        price: 'S$550',
        image: 'https://images.unsplash.com/photo-1629814484089-63d1a01d6832?q=75&w=600',
        tags: ['Value', 'Foodie'],
        departure: 'Sun, 03 Dec',
        destination: 'Vietnam',
        type: 'cruise'
    }
];


export const VALUE_PROPS: ValuePropData[] = [
  {
    icon: Clock,
    title: 'Fast Planning',
    description: 'Get a full weekend proposal in 10-15 minutes. No endless browsing.',
  },
  {
    icon: Gem,
    title: 'Curated Routes',
    description: 'We test every hotel and driver. No tourist traps, just hidden gems.',
  },
  {
    icon: Heart,
    title: 'Family First',
    description: 'Kid-friendly logistics. Car seats, dietary needs, and pace—sorted.',
  },
];

export const BLOG_POSTS: BlogCardData[] = [
  {
    id: '1',
    title: 'Plan the Perfect Vacation',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=75&w=600',
    date: 'April 7, 2023',
    excerpt: 'Planning a vacation can be overwhelming, but this post offers a step-by-step guide to help readers create a comprehensive travel itinerary.',
    category: 'Guides',
    readTime: '6 min read',
    author: 'Sarah Jenkins',
    country: 'Global',
    city: 'General'
  },
  {
    id: '2',
    title: 'Discover the Hidden Gems',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=75&w=600',
    date: 'March 15, 2026',
    excerpt: 'Benefits of traveling alone, from the freedom to discover new places with new friends. Why solo travel is the new luxury.',
    category: 'Inspiration',
    readTime: '4 min read',
    author: 'Mike Chen',
    country: 'Global',
    city: 'General'
  },
  {
    id: '3',
    title: 'Must-See Landmarks',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=75&w=600',
    date: 'Feb 28, 2026',
    excerpt: 'Iconic landmarks that make Europe one of the world\'s most popular travel destinations. From the Eiffel Tower to the Colosseum.',
    category: 'Guides',
    readTime: '8 min read',
    author: 'Emma Wilson',
    country: 'France',
    city: 'Paris'
  },
  {
    id: '4',
    title: 'Traveling on a Budget',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=75&w=600',
    date: 'Jan 10, 2026',
    excerpt: 'Practical advice for travelers who want to see the world without breaking the bank. Tips on cheap flights and hostels.',
    category: 'Tips',
    readTime: '5 min read',
    author: 'Alex Tan',
    country: 'Global',
    city: 'General'
  },
  {
    id: '5',
    title: 'The Ultimate Foodie Guide to Osaka',
    image: 'https://images.unsplash.com/photo-1590559899731-a38283956c8c?q=75&w=600',
    date: 'Dec 12, 2025',
    excerpt: 'Where to find the best Takoyaki, Okonomiyaki, and fluffy cheesecakes in Japan\'s kitchen. Don\'t miss the Kuromon Market!',
    category: 'Food',
    readTime: '7 min read',
    author: 'Kenji Sato',
    country: 'Japan',
    city: 'Osaka'
  },
  {
    id: '6',
    title: 'Packing Light for Winter',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=75&w=600',
    date: 'Nov 05, 2025',
    excerpt: 'How to fit bulky winter coats and boots into a carry-on. The art of layering and choosing the right fabrics.',
    category: 'Tips',
    readTime: '4 min read',
    author: 'Lisa Wong',
    country: 'Global',
    city: 'General'
  },
  {
    id: '7',
    title: 'Digital Nomad Visas Explained',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=75&w=600',
    date: 'Oct 20, 2025',
    excerpt: 'Work from anywhere. A comprehensive list of countries offering digital nomad visas in 2026 and how to apply.',
    category: 'Guides',
    readTime: '10 min read',
    author: 'James Lee',
    country: 'Global',
    city: 'General'
  },
  {
    id: '8',
    title: 'Sustainable Travel: A Beginner\'s Guide',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=75&w=600',
    date: 'Sep 15, 2025',
    excerpt: 'Small changes you can make to reduce your carbon footprint while exploring the globe. Eco-friendly hotels and transport.',
    category: 'Inspiration',
    readTime: '5 min read',
    author: 'Chloe Lim',
    country: 'Global',
    city: 'General'
  },
  {
    id: '9',
    title: 'Hidden Cafes of Seoul',
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=75&w=600',
    date: 'Aug 22, 2025',
    excerpt: 'Beyond the mainstream spots in Hongdae. Discover quiet corners, aesthetic interiors, and the best artisan coffee in Seoul.',
    category: 'Food',
    readTime: '6 min read',
    author: 'Ji-won Kim',
    country: 'Korea',
    city: 'Seoul'
  },
  {
    id: '10',
    title: 'A Weekend in Bintan',
    image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?q=75&w=600',
    date: 'Aug 05, 2025',
    excerpt: 'How to maximize a 2-day getaway. Best resorts, seafood spots, and mangrove tours for a quick recharge.',
    category: 'Guides',
    readTime: '5 min read',
    author: 'David Tan',
    country: 'Indonesia',
    city: 'Bintan'
  },
  {
    id: '11',
    title: 'Luxury on a Budget in Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=75&w=600',
    date: 'Jul 18, 2025',
    excerpt: 'You don\'t need to spend thousands to live like a king. Affordable private villas and fine dining hacks in Seminyak.',
    category: 'Tips',
    readTime: '7 min read',
    author: 'Jessica Low',
    country: 'Indonesia',
    city: 'Bali'
  }
];

export const HERO_SLIDES = [
  {
    id: 1,
    image: BANNER_IMG_CHONGQING,
    backup: BACKUP_IMG_CHONGQING,
    headline: '',
    subtext: '',
  },
  {
    id: 2,
    image: BANNER_IMG_CHANGSHA,
    backup: BACKUP_IMG_CHANGSHA,
    headline: '',
    subtext: '',
  },
  {
    id: 3,
    image: BANNER_IMG_BALI,
    backup: BACKUP_IMG_BALI,
    headline: '',
    subtext: '',
  }
];
