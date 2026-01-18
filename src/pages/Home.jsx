import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getList } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';

const NOTICES_KEY = 'notices';
const PUBLICATIONS_KEY = 'library';

/* -------------------- Small Pure Components -------------------- */

const StatBox = React.memo(({ val, label }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm">
    <div className="text-xl font-bold text-green-600">{val}</div>
    <div className="text-[10px] text-slate-500 uppercase font-medium">{label}</div>
  </div>
));

StatBox.displayName = 'StatBox';

const ListItem = React.memo(({ item }) => (
  <div className="p-3 bg-slate-50 rounded border flex justify-between text-sm items-center">
    <span className="truncate font-medium text-slate-700">
      {item.title}
    </span>
    <svg
      className="w-3 h-3 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 5l7 7-7 7"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
));

ListItem.displayName = 'ListItem';

const ListSection = React.memo(({ title, items }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="bg-slate-800 p-3 text-white font-bold text-sm px-6">
      {title}
    </div>
    <div className="p-4 space-y-2">
      {items.map(it => (
        <ListItem key={it.id} item={it} />
      ))}
    </div>
  </div>
));

ListSection.displayName = 'ListSection';

/* -------------------- Optimized Hero Section -------------------- */

const HeroSection = React.memo(({ hero, renderLink }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!hero) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 shadow-lg" />
    );
  }

  // Check if link is external
  const isExternalLink = hero.cta_link && 
    (hero.cta_link.startsWith('http') || hero.cta_link.startsWith('www') || 
     hero.cta_link.startsWith('mailto:') || hero.cta_link.startsWith('tel:'));
  
  // Get the final URL (add https if starts with www)
  const finalUrl = hero.cta_link?.startsWith('www') ? 
    `https://${hero.cta_link}` : hero.cta_link;

  const HeroContent = (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-200 shadow-lg cursor-pointer group">
      {/* Optimized Hero Image */}
      <div className="absolute inset-0">
        {/* Background placeholder */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-blue-200 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Actual image */}
        <img
          src={hero.image}
          alt={hero.title || ""}
          width="1280"
          height="720"
          sizes="(max-width: 768px) 100vw, 1280px"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          className={`w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          style={{
            contentVisibility: 'auto',
            contain: 'paint',
          }}
        />
      </div>
      
      {/* Dark gradient overlay at bottom only */}
      <div className="absolute inset-0 " />
      
      {/* Content at the bottom */}
      <div className="absolute inset-0 z-10 flex items-end pb-6 md:pb-10 lg:pb-12 px-4 md:px-8">
        <div className="text-white max-w-2xl w-full">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p className="text-sm md:text-lg opacity-90 drop-shadow-md">
              {hero.subtitle}
            </p>
          )}
          
          {/* Hidden indicator for clickable area */}
          <div className="mt-4 text-xs text-white/60 flex items-center gap-1">
            <span>ক্লিক করুন</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // If there's a CTA link, wrap the entire hero with it
  if (hero.cta_link) {
    if (isExternalLink) {
      return (
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {HeroContent}
        </a>
      );
    } else {
      return (
        <NavLink to={finalUrl} className="block">
          {HeroContent}
        </NavLink>
      );
    }
  }

  // If no link, just return the content
  return HeroContent;
});

HeroSection.displayName = 'HeroSection';

/* -------------------- Event Countdown Section -------------------- */

const EventSection = React.memo(({ nextEvent }) => {
  if (!nextEvent) {
    return (
      <div className="bg-white p-6 rounded-xl border text-center shadow-sm flex flex-col justify-center">
        <h3 className="font-bold mb-2 text-slate-800">
          আসন্ন ইভেন্ট
        </h3>
        <div className="text-slate-500">কোনো ইভেন্ট নেই</div>
      </div>
    );
  }

  const eventDate = nextEvent.date?.toDate ? nextEvent.date.toDate() : nextEvent.date;
  
  return (
    <div className="bg-white p-6 rounded-xl border text-center shadow-sm flex flex-col justify-center">
      <h3 className="font-bold mb-4 text-slate-800">
        {nextEvent.title}
      </h3>
      <CountdownTimer targetDate={new Date(eventDate)} />
    </div>
  );
});

EventSection.displayName = 'EventSection';

/* -------------------- Stats Section -------------------- */

const StatsSection = React.memo(() => (
  <div className="grid grid-cols-2 gap-3 md:gap-4">
    <StatBox val="৫০০+" label="সদস্য" />
    <StatBox val="১০০+" label="ইভেন্ট" />
    <StatBox val="২৫+" label="প্রকাশনা" />
    <StatBox val="৫+" label="বছর" />
  </div>
));

StatsSection.displayName = 'StatsSection';

/* -------------------- Main Home Component -------------------- */

export default function Home() {
  const [hero, setHero] = useState(null);
  const [notices, setNotices] = useState([]);
  const [publications, setPublications] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);

 // In the Home component, update the renderLink function:
const renderLink = useCallback((url, content, className) => {
  if (!url) return <div className={className}>{content}</div>;

  const isExternal = url.startsWith('http') || url.startsWith('www') ||
                     url.startsWith('mailto:') || url.startsWith('tel:');
  const finalUrl = url.startsWith('www') ? `https://${url}` : url;

  return isExternal ? (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  ) : (
    <NavLink to={url} className={className}>
      {content}
    </NavLink>
  );
}, []);

  // Fetch initial data
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // REMOVED: hero_slider API call since we're removing ImageGrid
        const [heroList, noticesList, pubList, eventList] = await Promise.all([
          getList('main_hero'),
          getList(NOTICES_KEY),
          getList(PUBLICATIONS_KEY),
          getList('events')
        ]);

        if (!mounted) return;

        // Set hero
        const activeHero = heroList?.find(h => h.is_active) || null;
        setHero(activeHero);

        // Set notices (sorted by date, max 4)
        const sortedNotices = (noticesList || [])
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4);
        setNotices(sortedNotices);

        // Set publications (sorted by creation date, max 4)
        const sortedPublications = (pubList || [])
          .sort((a, b) => 
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          )
          .slice(0, 4);
        setPublications(sortedPublications);

        // Find next upcoming event
        const now = Date.now();
        const upcomingEvents = (eventList || [])
          .map(e => ({
            ...e,
            eventDate: e.date?.toDate ? e.date.toDate() : e.date
          }))
          .filter(e => {
            const eventTime = new Date(e.eventDate).getTime();
            return eventTime >= now;
          })
          .sort((a, b) => 
            new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
          );

        setNextEvent(upcomingEvents[0] || null);

      } catch (error) {
        console.error('Error fetching data:', error);
        if (mounted) {
          // Set fallback data
          setNotices([]);
          setPublications([]);
          setNextEvent(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // Memoize expensive calculations
  const memoizedNotices = useMemo(() => notices, [notices]);
  const memoizedPublications = useMemo(() => publications, [publications]);
  const memoizedNextEvent = useMemo(() => nextEvent, [nextEvent]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <div className="text-green-700 font-medium">লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 px-3 md:px-6 max-w-7xl mx-auto pb-10">
      {/* Hero Section - Now Optimized */}
      <HeroSection hero={hero} renderLink={renderLink} />

      {/* REMOVED: Image Grid Section */}

      {/* Countdown and Stats Grid */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Countdown Timer Section */}
        <EventSection nextEvent={memoizedNextEvent} />
        
        {/* Stats Section */}
        <StatsSection />
      </div>

      {/* Notices and Publications Grid */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <ListSection title="সর্বশেষ নোটিশ" items={memoizedNotices} />
        <ListSection title="সর্বশেষ প্রকাশনা" items={memoizedPublications} />
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 md:p-8 text-center text-white">
        <h2 className="text-xl md:text-2xl font-bold mb-3">
          আমাদের সদস্য হোন
        </h2>
        <p className="mb-6 opacity-90">
          ফুটন্ত ফুলের আসরের সাথে যুক্ত হয়ে নতুন কিছু শিখুন এবং গড়ে তুলুন
        </p>
        <NavLink
          to="/membership"
          className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-bold inline-block transition-colors shadow-lg"
        >
          Become a member
        </NavLink>
      </div>
    </div>
  );
}