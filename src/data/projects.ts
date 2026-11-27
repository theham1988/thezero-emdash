/**
 * Content of the two project pages (/bang-tao and /silhouette-nai-yang).
 * Copy is taken word for word from the same pages on thezerophuket.com
 * (November 2026). Edit text, prices and images here.
 */
const U = "/wp-content/uploads";

export interface ProjectData {
	slug: string;
	formId: string;
	formProject: string;
	metaTitle: string;
	geo: { placename: string; position: string };
	hero: { image: string; badges: string[]; title: string; lead: string };
	heroStats: { value: string; label: string }[];
	heroNote: { title: string; text: string };
	cta: string;
	launch?: { eyebrow: string; title: string; lead: string; text: string; price: string; points: string[]; note: string; link: { label: string; href: string } };
	invest: {
		title: string;
		heading: string;
		lead: string;
		stats: { value: string; label: string }[];
		timeline: { when: string; what: string }[];
		paragraphs: string[];
		features: { title: string; kicker: string; text: string }[];
	};
	units: {
		eyebrow: string;
		heading: string;
		lead: string;
		cards: { name: string; size: string; price: string; kicker?: string; note?: string; popular?: boolean; tour?: string }[];
		payment: { title: string; sub: string; text?: string; steps?: { value: string; label: string }[]; cta?: string };
	};
	facilities: { eyebrow: string; heading: string; lead: string; cards: { badge?: string; title: string; text: string }[]; chips: string[] };
	concept?: { eyebrow: string; heading: string; text: string; stats: { value: string; label: string; text: string }[]; chips: string[] };
	gallery: { eyebrow: string; heading: string; note: string; images: { src: string; alt: string }[] };
	location: { eyebrow: string; heading: string; lead: string; image?: string; places: { name: string; distance: string }[]; highlights?: string[] };
	limousine: { title: string; text: string; cta: string; href: string };
	reviews?: { eyebrow: string; heading: string; items: { text: string; initial: string; name: string; source: string }[] };
	developer: { eyebrow: string; heading: string; lead: string; stats: { value: string; label: string; text: string }[] };
	flagship?: { heading: string; sub: string; text: string; stats: { value: string; label: string }[] };
	status?: { heading: string; text: string };
	faq: { eyebrow: string; heading: string; items: { q: string; a: string }[] };
	contact: { eyebrow: string; heading: string; text: string; formTitle: string; formSub: string; button: string; note: string };
	schema?: Record<string, unknown>[];
}

const INVEST_PARAGRAPHS = [
	"Our investment model combines off-plan pricing advantages with a proven, professionally managed rental programme. An experienced hospitality team handles all operations — from marketing and guest check-in to housekeeping and maintenance.",
	"Your property joins a fair 70/30 rental pool. Income — projected at circa 11% ROI annually — is distributed every six months. Our owner app gives real-time access to occupancy, performance, and personal-use booking.",
];
const featuresFor = (growth: string, management: string) => [
	{ title: "Capital Growth", kicker: growth, text: "Secure off-plan pricing with projected asset appreciation through to completion." },
	{ title: "70/30 Rental Pool", kicker: "Fair returns", text: "Equal opportunity among similar units. Income distributed every six months." },
	{ title: management, kicker: "Fully managed", text: "Full hospitality team handles marketing, guests, cleaning, and maintenance." },
	{ title: "Owner App", kicker: "Track anywhere", text: "Real-time occupancy, income tracking, and personal-use date booking." },
];
const DEVELOPER = {
	eyebrow: "The Developer",
	heading: "Proven Track Record",
	lead: "British-led development with over two decades of residential excellence across the UK and Thailand.",
	stats: [
		{ value: "124+", label: "UK Units Delivered", text: "Wokingham · Cobham · Surrey · London" },
		{ value: "A-Rated", label: "Energy Efficiency", text: "The Zero London — award-winning eco-residence" },
		{ value: "2002–Now", label: "Track Record", text: "Princegate → Hodge Dev → Zero Developments" },
	],
};
const LIMO_TEXT = "Complimentary luxury electric limousine pickup from anywhere on the island. Visit our showroom in comfort — carbon-conscious, professional, and seamless.";
const FORM = { formTitle: "Get Pricing & Brochure", formSub: "Full price list, floor plans, and investment guide — free.", button: "Get Free Brochure & Pricing", note: "No obligation · Response within 24 hours" };

export const bangTao: ProjectData = {
	slug: "bang-tao",
	formId: "website_bangtao",
	formProject: "The Zero Bang Tao",
	metaTitle: "The Zero Bang Tao",
	geo: { placename: "Bang Tao Beach, Phuket", position: "8.0030;98.2950" },
	hero: {
		image: `${U}/2026/05/heroBuilding.webp`,
		badges: ["Award Winner 2025", "85% Sold"],
		title: "New Condo for Sale in Bang Tao, Phuket",
		lead: "Phuket's first single-use plastic-free condominium. 85 exclusive units with rooftop pool, sky bar, and in-house managed rental programme — projecting ~11% annual returns. EIA approved. From 6M THB.",
	},
	heroStats: [
		{ value: "10%/yr", label: "Guarantee ROI on selected units." },
		{ value: "6M THB", label: "From" },
		{ value: "Up to 25%", label: "Capital Growth" },
		{ value: "Q1 2027", label: "Completion" },
	],
	heroNote: { title: "EIA Approved", text: "Environmental Impact Assessment Licensed" },
	cta: "Get Free Brochure & Pricing",
	invest: {
		title: "Investment Model",
		heading: "Off-Plan Pricing, Proven Returns",
		lead: "Secure below-market entry with off-plan pricing. Professionally managed rental programme with projected ~11% annual returns.",
		stats: [
			{ value: "25%", label: "Capital growth upon completion" },
			{ value: "70/30", label: "Rental pool distribution" },
			{ value: "85", label: "Exclusive units" },
			{ value: "10%", label: "Guarantee ROI on selected units." },
		],
		timeline: [
			{ when: "Q1 2025", what: "Construction Start" },
			{ when: "Q4 2025", what: "Superstructure" },
			{ when: "Q2 2026", what: "Roof Doors & Windows" },
			{ when: "Q1 2027", what: "Completion & Handover" },
		],
		paragraphs: [...INVEST_PARAGRAPHS, "With only 85 units and 80% already sold, early buyers benefit from the lowest entry price and maximum capital appreciation of up to 25%."],
		features: featuresFor("Up to 25%", "In-house Management"),
	},
	units: {
		eyebrow: "Units & Pricing",
		heading: "Choose Your Investment",
		lead: "85 units · 1-bed to 3-bed · 36–95 sqm · Freehold & Leasehold",
		cards: [
			{ name: "1 Bedroom", size: "From 36 sqm", price: "On request", tour: "https://720.3vjia.com/S155093908?lang=en-US-TP1317-G" },
			{ name: "2 Bedroom", size: "From 50 sqm", price: "7.3M THB", popular: true, tour: "https://720.3vjia.com/S155156160?lang=en-US-TP1317-F" },
			{ name: "3 Bedroom", size: "From 95 sqm", price: "11.4M THB", tour: "https://720.3vjia.com/S153823996?lang=en-US-TP1317-D" },
		],
		payment: {
			title: "Flexible Payment Available",
			sub: "From 6M THB",
			text: "Staged payments through construction — 35% upon contract signature, 25%, 10%, 10%, 10% and 10% at handover.",
			cta: "Request Payment Plan",
		},
	},
	facilities: {
		eyebrow: "Lifestyle & Amenities",
		heading: "World-Class Facilities",
		lead: "Premium amenities designed for wellness, recreation, and refined living — all within your development.",
		cards: [
			{ title: "25m Rooftop Pool", text: "Infinity-edge pool with panoramic views of the Andaman Sea" },
			{ title: "Sky Bar & Lounge", text: "Rooftop bar with sunset cocktails and social events" },
			{ title: "Restaurant & Café", text: "On-site dining with international and Thai cuisine" },
			{ title: "Fitness Centre", text: "Fully equipped modern gym with cardio and weights" },
			{ title: "Sauna & Steam Room", text: "Wellness facilities for relaxation and recovery" },
			{ title: "Entrance & Lobby", text: "Grand entrance with 24/7 concierge and security" },
			{ title: "Co-working Library", text: "Quiet workspace and reading lounge" },
			{ title: "Meeting Room", text: "Professional meeting space for business needs" },
			{ title: "Co-working Space", text: "Collaborative workspace with high-speed internet" },
		],
		chips: ["Kids Club", "EV Charging", "Solar Shuttle", "Underground Parking", "Landscaped Gardens"],
	},
	gallery: {
		eyebrow: "Gallery",
		heading: "Project Gallery",
		note: "Click any image to enlarge · Arrow keys to navigate",
		images: [
			{ src: `${U}/2026/06/thzhp_gal_1.webp`, alt: "Building Exterior" },
			{ src: `${U}/2026/06/villa-exterior-02.webp`, alt: "Exterior" },
			{ src: `${U}/2026/06/villa-exterior-05.webp`, alt: "Exterior Detail" },
			{ src: `${U}/2026/06/bedroom_suite.webp`, alt: "Bedroom Suite" },
			{ src: `${U}/2026/06/gallery_interior_living.webp`, alt: "Interior Living" },
			{ src: `${U}/2026/06/entrance.webp`, alt: "Entrance" },
			{ src: `${U}/2026/06/restaurant.webp`, alt: "Restaurant" },
			{ src: `${U}/2026/06/coworkLibrary.webp`, alt: "Co-working Library" },
			{ src: `${U}/2026/06/meetingRoom.webp`, alt: "Meeting Room" },
			{ src: `${U}/2026/06/coworking.webp`, alt: "Co-working Space" },
			{ src: `${U}/2026/06/gym.webp`, alt: "Gym" },
			{ src: `${U}/2026/06/sauna.webp`, alt: "Sauna" },
			{ src: `${U}/2026/06/kitchen_dining.webp`, alt: "Kitchen & Dining" },
			{ src: `${U}/2026/06/communal_area.webp`, alt: "Communal Area" },
			{ src: `${U}/2026/10/The-Zero-Bang-Tao-rooftop-bar.webp`, alt: "The Zero Bang Tao Rooftop Bar" },
			{ src: `${U}/2026/10/The-Zero-Bang-Tao-rooftop-pool-and-lounge.webp`, alt: "The Zero Bang Tao rooftop pool and lounge" },
		],
	},
	location: {
		eyebrow: "Prime Location",
		heading: "Bang Tao, Phuket",
		lead: "In the heart of Phuket's most sought-after lifestyle corridor — surrounded by world-class beach clubs, fine dining, and premium shopping. A proven, high-demand rental zone with year-round occupancy.",
		image: `${U}/2026/05/location_drone_right-1024x729.jpg`,
		places: [
			{ name: "MNT Tennis", distance: "100m" },
			{ name: "Shops", distance: "400m" },
			{ name: "CTL Hospital", distance: "450m" },
			{ name: "Oasis Community Mall", distance: "450m" },
			{ name: "Boat Avenue", distance: "1.3km" },
			{ name: "Porto De Phuket", distance: "1.4km" },
			{ name: "Bang Tao Beach", distance: "1.8km" },
			{ name: "Catch Beach Club", distance: "2.2km" },
			{ name: "Blue Tree", distance: "2.7km" },
			{ name: "Surin Beach", distance: "3.2km" },
			{ name: "Laguna Golf", distance: "3.8km" },
			{ name: "Airport", distance: "17km" },
		],
	},
	limousine: {
		title: "Arrive in Style — Zero-Emission Limousine",
		text: LIMO_TEXT,
		cta: "Book Free Pickup",
		href: "https://wa.me/66956516795?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20limousine%20pickup%20to%20visit%20The%20Zero%20Bang%20Tao%20showroom.",
	},
	reviews: {
		eyebrow: "Reviews",
		heading: "What Our Buyers Say",
		items: [
			{ text: "Purchased several units for rental income. The developer's transparency and the professional management team give me full confidence in the projected returns.", initial: "Б", name: "Борис Ф.", source: "Google Review" },
			{ text: "Went for the presentation — truly impressed by the build quality, eco-commitment, and the level of detail in the investment model. A standout Phuket project.", initial: "E", name: "Elite G.", source: "Google Review" },
			{ text: "Love the eco-friendly and modern concept! The single-use plastic-free approach is exactly what Phuket needs. Great investment for a greener future.", initial: "C", name: "Consult Attorney", source: "Google Review" },
			{ text: "Perfect presentation of a professional developer. The team answered every question, the construction progress is on schedule, and the location is unbeatable.", initial: "M", name: "Maria J.", source: "Google Review" },
		],
	},
	developer: DEVELOPER,
	status: { heading: "Now Under Construction", text: "85% Sold · Q1 2027 Completion" },
	faq: {
		eyebrow: "FAQ",
		heading: "Common Questions",
		items: [
			{ q: "Can foreigners buy freehold condos in Thailand?", a: "Yes. Up to 49% of a condominium's total area can be foreign-owned freehold. Funds must be transferred from abroad in foreign currency. Our legal team provides full guidance and support." },
			{ q: "What is the projected rental return?", a: "The professionally managed 70/30 rental pool targets approximately 11% annual ROI. Income is distributed every six months, with all operations — marketing, guest check-in, housekeeping, and maintenance — handled for you." },
			{ q: "Is The Zero Bang Tao EIA approved?", a: "Yes. The development holds an official Environmental Impact Assessment license, confirming full compliance with Thailand's environmental regulations." },
			{ q: "What are the payment terms?", a: "THB 100,000 reservation fee, then 35% upon contract signature, followed by staged payments of 25%, 10%, 10%, 10% and a final 10% at handover." },
			{ q: "When is completion?", a: "Completion and handover is targeted for Q1 2027. Construction is well underway on roof, doors & windows phase." },
			{ q: "Who is the developer?", a: "Zero Developments is British-led with 20+ years experience, 124+ UK residential units delivered, and the award-winning The Zero London — an A-rated energy efficiency residence in London. The Zero Bang Tao is their flagship Phuket project." },
		],
	},
	contact: { eyebrow: "85% Sold — Limited Availability", heading: "Limited Units Remaining", text: "Full floor plans, investment brochure & price list. Response within 24 hours.", ...FORM },
};

export const silhouette: ProjectData = {
	slug: "silhouette-nai-yang",
	formId: "website_naiyang",
	formProject: "Silhouette by The Zero",
	metaTitle: "Silhouette, Nai Yang",
	geo: { placename: "Nai Yang Beach, Phuket", position: "8.0806;98.2986" },
	hero: {
		image: `${U}/2026/11/Silhouette-by-The-Zero-Phuket-rooftop-pool.webp`,
		badges: ["By Award-Winning Developer", "Construction Started"],
		title: "New Condo for Sale in Nai Yang Beach",
		lead: "350m from Nai Yang Beach, steps from Sirinat National Park, 7 minutes from the airport. EIA-approved condominiums with hotel-style amenities, 70/30 rental pool, and projected ~11% annual returns. From 5.12M THB.",
	},
	heroStats: [
		{ value: "10%/yr", label: "Guarantee ROI on selected units." },
		{ value: "5.12M THB", label: "From" },
		{ value: "Up to 30%", label: "Capital Growth" },
		{ value: "Q2 2028", label: "Completion" },
	],
	heroNote: { title: "EIA Approved", text: "Environmental Impact Assessment Licensed" },
	cta: "Get Free Brochure & Pricing",
	launch: {
		eyebrow: "Pre-launch Access Open Now",
		title: "Earth Residences",
		lead: "Secure Launch Pricing Before The Next Release Phase",
		text: "A limited collection of residences within Silhouette by The Zero Phuket.",
		price: "Starting from THB 110,000 per sqm",
		points: [
			"10% Income Protection for 3 Years*",
			"Up to 30% Capital Growth Potential*",
			"Only 150 Residences Available",
			"300m from Nai Yang Beach",
			"Expected Completion Q2 2028",
			"Fully Managed Investment",
		],
		note: "Receive the current price list, floor plans, availability, and investor pack.",
		link: { label: "Know More", href: "/silhouette-nai-yang/earth-residences" },
	},
	invest: {
		title: "Investment Model",
		heading: "Off-Plan Pricing, Proven Returns",
		lead: "Secure below-market entry with off-plan pricing. Professionally managed rental programme with projected ~11% annual returns.",
		stats: [
			{ value: "30%", label: "Capital growth upon completion" },
			{ value: "70/30", label: "Rental pool distribution" },
			{ value: "150", label: "Boutique units across two buildings" },
		],
		timeline: [
			{ when: "Jun 2026", what: "Ground Breaking" },
			{ when: "Q4 2026", what: "Foundation" },
			{ when: "Q2 2027", what: "Superstructure" },
			{ when: "Jun 2028", what: "Completion & Handover" },
		],
		paragraphs: [...INVEST_PARAGRAPHS, "Early buyers benefit from the lowest entry price and maximum capital appreciation of up to 30%."],
		features: featuresFor("Up to 30%", "In-house Management"),
	},
	units: {
		eyebrow: "Units & Pricing",
		heading: "Choose Your Investment",
		lead: "150 units · Studios to 2-bed penthouses · 29.5–140 sqm · Freehold & Leasehold",
		cards: [
			{ name: "Studio", size: "From 29.5 sqm", price: "On request", kicker: "Highest rental demand", note: "The most liquid entry-level unit — designed for high occupancy, strong short-term rental demand, and fast resale potential.", tour: "https://720.3vjia.com/S149772386?lang=en-US-TP1317-ST4" },
			{ name: "1 Bedroom", size: "From 37.5 sqm", price: "5.2M THB", popular: true, kicker: "Strong rental liquidity", note: "High-demand unit offering efficient layouts and excellent short- and long-term yield potential.", tour: "https://720.3vjia.com/S151277110?lang=en-US-TP1317-1B-A" },
			{ name: "2 Bedroom", size: "From 60 sqm", price: "6.6M THB", kicker: "Family-friendly appeal", note: "A versatile layout with broader tenant appeal, longer stays, and stable, predictable rental performance.", tour: "https://720.3vjia.com/S150391738?lang=en-US-TP1317-2B-2" },
			{ name: "1 Bedroom+", size: "From 44.4 sqm", price: "5.7M THB", kicker: "Elevated one-bedroom living", note: "An enhanced one-bedroom layout with extra space for modern living, ideal for those seeking comfort, functionality, and a seamless daily flow.", tour: "https://720.3vjia.com/S151296498?lang=en-US-TP-1317-1B-C" },
			{ name: "Suite", size: "From 91 sqm", price: "11.7M THB", kicker: "Expansive open-plan living", note: "Designed with space in mind, this generously-sized suite creates a seamless flow between living, resting, and relaxing.", tour: "https://720.3vjia.com/S151614534?lang=en-US-TP1317-SU-5" },
		],
		payment: {
			title: "Flexible Payment Plans",
			sub: "THB 100,000 reservation · Mutually agreed terms over the construction period",
			steps: [
				{ value: "THB 100K", label: "Reserve" },
				{ value: "35%", label: "Deposit" },
				{ value: "Staged", label: "Over construction" },
				{ value: "Balance", label: "At handover" },
			],
		},
	},
	facilities: {
		eyebrow: "Lifestyle & Amenities",
		heading: "Where Active Living Meets Coastal Serenity",
		lead: "Premium amenities designed for wellness, recreation, and refined living — all within your development.",
		cards: [
			{ badge: "Exclusive", title: "Spa & Wellness", text: "Experience a complete hot-and-cold contrast circuit at our premier wellness facility. Recharge with our spa, traditional sauna, and steam room, then finish with an invigorating ice bath to boost recovery, reduce inflammation, and restore your energy." },
			{ badge: "Unique Feature", title: "Zero Golf", text: "State-of-the-art golf simulator to practice and play world-famous courses in a realistic virtual setting, rain or shine. Advanced simulation technology with a comfortable, stylish environment." },
			{ title: "Rooftop Pool", text: "Infinity-edge pool with panoramic views and sun loungers" },
			{ title: "Gym & Fitness", text: "Fully equipped with free weights, cardio, and yoga space" },
			{ title: "Spa & Wellness", text: "Sauna, steam room, ice bath for total relaxation" },
			{ title: "Kids Club", text: "Safe, supervised play area for families to enjoy" },
			{ title: "Underground Parking", text: "Secure parking with EV charging stations included" },
			{ title: "Electric Shuttle", text: "Complimentary zero-emission shuttle service to beach" },
		],
		chips: ["Outdoor Cinema", "Pickleball Courts", "Golf Simulator", "Landscaped Gardens", "24/7 Security", "Concierge Service"],
	},
	concept: {
		eyebrow: "The Zero Concept",
		heading: "Sustainable Living, Inspired by Nature",
		text: "Silhouette combines contemporary architecture with nature-inspired landscaping, organic materials, and energy-efficient construction — setting a new benchmark for sustainable coastal living.",
		stats: [
			{ value: "150", label: "Boutique Units", text: "83 Earth + 67 Sky interlinked buildings" },
			{ value: "5 storeys", label: "Low-Rise Design", text: "Harmonising with the natural landscape" },
			{ value: "13,476 sqm", label: "Total Area", text: "Construction area with premium amenities" },
			{ value: "7,224 sqm", label: "Saleable Area", text: "Efficient layouts maximising liveable space" },
		],
		chips: ["Solar-Powered Generation", "Rainwater Harvesting", "Energy-Efficient Windows", "Single-Use Plastic Free", "EV Charging Stations", "Underground Parking", "Pet-Friendly Community"],
	},
	gallery: {
		eyebrow: "Gallery",
		heading: "Project Gallery",
		note: "Click any image to enlarge · Arrow keys to navigate",
		images: [
			{ src: `${U}/2026/11/Silhouette-by-The-Zero-Phuket-rooftop-pool-and-bar.webp`, alt: "Rooftop pool & bar" },
			{ src: `${U}/2026/11/Silhouette-by-The-Zero-Phuket-rooftop-pool.webp`, alt: "Rooftop pool" },
			{ src: `${U}/2026/06/01-nai-yang-exterior-01.webp`, alt: "Exterior" },
			{ src: `${U}/2026/06/03-thzp_gal_4.webp`, alt: "Exterior detail" },
			{ src: `${U}/2026/06/04-tzhp_gal_view.webp`, alt: "Top view" },
			{ src: `${U}/2026/06/05-gal_exterior.webp`, alt: "Building exterior" },
			{ src: `${U}/2026/06/06-gal_aerial_beach.webp`, alt: "Nai Yang Beach" },
			{ src: `${U}/2026/06/07-nai-yang-lifestyle-01.webp`, alt: "Living space" },
			{ src: `${U}/2026/06/08-gal_1bed_living.webp`, alt: "1-Bedroom living" },
			{ src: `${U}/2026/06/09-gal_penthouse.webp`, alt: "Penthouse living" },
			{ src: `${U}/2026/06/10-gal_studio.webp`, alt: "Studio" },
			{ src: `${U}/2026/06/11-show_gallery_00001.webp`, alt: "Interior styling" },
			{ src: `${U}/2026/06/12-show_gallery_00002.webp`, alt: "Bathroom" },
			{ src: `${U}/2026/06/13-show_gallery_00003.webp`, alt: "Bedroom suite" },
			{ src: `${U}/2026/06/14-show_gallery_00004.webp`, alt: "Kitchen" },
			{ src: `${U}/2026/06/17-gal_lobby.webp`, alt: "Lobby" },
			{ src: `${U}/2026/06/18-gal_restaurant.webp`, alt: "Restaurant & bar" },
			{ src: `${U}/2026/06/19-ny_gallery_item-5.webp`, alt: "Steam room & Sauna" },
			{ src: `${U}/2026/06/20-gal_coworking.webp`, alt: "Co-working space" },
		],
	},
	location: {
		eyebrow: "Prime Location",
		heading: "Nai Yang Beach, Phuket",
		lead: "Phuket's tranquil northwestern shoreline — steps from Sirinat National Park, minutes from the international airport. A laid-back village atmosphere with growing rental demand, away from over-touristed areas.",
		places: [
			{ name: "Restaurants & Cafés", distance: "250m" },
			{ name: "Nai Yang Beach", distance: "350m" },
			{ name: "Shops & Supermarket", distance: "350m" },
			{ name: "Nowhere Pool Club & Grill", distance: "550m" },
			{ name: "Wellness & Spa", distance: "600m" },
			{ name: "Sirinat National Park", distance: "600m" },
			{ name: "Turquoise Community Mall", distance: "900m" },
			{ name: "Village Market", distance: "900m" },
			{ name: "Mingle Mall", distance: "1.2km" },
			{ name: "Phuket Int'l Airport", distance: "2.5km" },
			{ name: "Hospital", distance: "5km" },
			{ name: "Mai Khao Beach", distance: "6km" },
			{ name: "Blue Canyon Golf", distance: "7km" },
			{ name: "UWC Int'l School", distance: "10km" },
			{ name: "Yacht Haven Marina", distance: "13km" },
			{ name: "Bang Tao Beach", distance: "25km" },
		],
		highlights: ["7 min to airport", "Steps from National Park", "3 min walk to beach"],
	},
	limousine: {
		title: "Arrive in Style — Zero-Emission Limousine",
		text: LIMO_TEXT,
		cta: "Book Free Pickup",
		href: "https://wa.me/66956516795?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20limousine%20pickup%20to%20visit%20The%20Zero%20Nai%20Yang%20showroom.",
	},
	developer: DEVELOPER,
	flagship: {
		heading: "The Zero Bang Tao — 85% Sold",
		sub: "Our Flagship Phuket Project",
		text: "The Zero Bang Tao, our flagship 85-unit development, is 85% sold and under construction. Its success and award-winning design demonstrate our commitment to delivering world-class developments in Phuket.",
		stats: [
			{ value: "85", label: "Units" },
			{ value: "70%", label: "Sold" },
			{ value: "Q1 2027", label: "Completion" },
		],
	},
	faq: {
		eyebrow: "FAQ",
		heading: "Common Questions",
		items: [
			{ q: "Can foreigners buy freehold condominiums in Thailand?", a: "Yes. Up to 49% of a condominium's total area can be foreign-owned freehold. Funds must be transferred from abroad in foreign currency. Our legal team provides full guidance and support." },
			{ q: "What is the projected rental return?", a: "The professionally managed 70/30 rental pool targets approximately 11% annual ROI. Income is distributed every six months, with all operations — marketing, guest check-in, housekeeping, and maintenance — handled for you." },
			{ q: "Is Silhouette EIA approved?", a: "Yes. The development holds an official Environmental Impact Assessment license, confirming full compliance with Thailand's environmental regulations." },
			{ q: "When does construction begin and complete?", a: "Ground breaks in June 2026 with targeted completion in Q2 2028. Sales are open now, giving early buyers access to the lowest off-plan pricing and maximum capital appreciation." },
			{ q: "What are the payment terms?", a: "THB 100,000 reservation fee, with mutually agreed staged payments over the construction period. Flexible payment plans are available to suit your needs." },
			{ q: "What makes Nai Yang a strong investment location?", a: "Nai Yang is Phuket's fastest-growing rental zone — steps from Sirinat National Park and beach, with a village atmosphere away from over-touristed areas. It offers strong year-round occupancy and growing demand." },
			{ q: "Who is the developer?", a: "Zero Developments is British-led with 20+ years experience, 124+ UK residential units delivered, and the award-winning The Zero London — an A-rated energy efficiency residence in London. The Zero Bang Tao is their flagship Phuket project." },
			{ q: "What ownership types are available?", a: "Both freehold and leasehold options are available. Studios, 1-bedroom, 2-bedroom condominiums, and penthouse suites across two interconnected buildings — Zero Earth Residence (83 units) and Zero Sky Residence (67 units)." },
		],
	},
	contact: { eyebrow: "Off-Plan — Early Access Pricing", heading: "Secure Your Unit at Off-Plan Prices", text: "Full floor plans, investment brochure & price list. Response within 24 hours.", ...FORM, formTitle: "Get Exclusive Pricing" },
};
