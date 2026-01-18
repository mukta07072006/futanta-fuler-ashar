import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getList } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';

const NOTICES_KEY = 'notices';
const PUBLICATIONS_KEY = 'library';

/* -------------------- Small Pure Components -------------------- */

const StatBox = React.memo(({ val, label }) => (
  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-100 text-center shadow-sm hover:shadow-md transition-shadow">
    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{val}</div>
    <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-medium tracking-wide mt-1">{label}</div>
  </div>
));

StatBox.displayName = 'StatBox';

const ListItem = React.memo(({ item }) => (
  <div className="p-2.5 sm:p-3 bg-slate-50 rounded border border-slate-200 flex justify-between text-xs sm:text-sm items-center hover:bg-slate-100 transition-colors">
    <span className="truncate font-medium text-slate-700 pr-2">
      {item.title}
    </span>
    <svg
      className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0"
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
  <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-slate-800 p-2.5 sm:p-3 text-white font-bold text-xs sm:text-sm px-4 sm:px-6">
      {title}
    </div>
    <div className="p-3 sm:p-4 space-y-2">
      {items.length > 0 ? (
        items.map(it => (
          <ListItem key={it.id} item={it} />
        ))
      ) : (
        <div className="text-center text-slate-400 text-sm py-4">
          কোনো আইটেম নেই
        </div>
      )}
    </div>
  </div>
));

ListSection.displayName = 'ListSection';

/* -------------------- Optimized Hero Section -------------------- */

const HeroSection = React.memo(({ hero, renderLink }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!hero) {
    return (
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 shadow-lg" />
    );
  }

  const isExternalLink = hero.cta_link && 
    (hero.cta_link.startsWith('http') || hero.cta_link.startsWith('www') || 
     hero.cta_link.startsWith('mailto:') || hero.cta_link.startsWith('tel:'));
  
  const finalUrl = hero.cta_link?.startsWith('www') ? 
    `https://${hero.cta_link}` : hero.cta_link;

  const HeroContent = (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-slate-200 shadow-lg cursor-pointer group">
      <div className="absolute inset-0">
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-blue-200 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        <img
          src={hero.image}
          alt={hero.title || ""}
          width="1280"
          height="720"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          style={{
            contentVisibility: 'auto',
            contain: 'paint',
          }}
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      <div className="absolute inset-0 z-10 flex items-end pb-4 sm:pb-6 md:pb-10 lg:pb-12 px-3 sm:px-4 md:px-8">
        <div className="text-white max-w-2xl w-full">
          <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 drop-shadow-lg leading-tight">
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p className="text-xs sm:text-sm md:text-lg opacity-90 drop-shadow-md line-clamp-2">
              {hero.subtitle}
            </p>
          )}
          
          <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs text-white/70 flex items-center gap-1">
            <span>ক্লিক করুন</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 sm:w-3 sm:h-3">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

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

  return HeroContent;
});

HeroSection.displayName = 'HeroSection';

/* -------------------- Event Countdown Section -------------------- */

const EventSection = React.memo(({ nextEvent }) => {
  if (!nextEvent) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-200 text-center shadow-sm flex flex-col justify-center min-h-[140px] sm:min-h-[160px]">
        <h3 className="font-bold mb-2 text-slate-800 text-sm sm:text-base">
          আসন্ন ইভেন্ট
        </h3>
        <div className="text-slate-500 text-xs sm:text-sm">কোনো ইভেন্ট নেই</div>
      </div>
    );
  }

  const eventDate = nextEvent.date?.toDate ? nextEvent.date.toDate() : nextEvent.date;
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-200 text-center shadow-sm flex flex-col justify-center">
      <h3 className="font-bold mb-3 sm:mb-4 text-slate-800 text-sm sm:text-base">
        {nextEvent.title}
      </h3>
      <CountdownTimer targetDate={new Date(eventDate)} />
    </div>
  );
});

EventSection.displayName = 'EventSection';

/* -------------------- Stats Section -------------------- */

const StatsSection = React.memo(() => (
  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
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

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [heroList, noticesList, pubList, eventList] = await Promise.all([
          getList('main_hero'),
          getList(NOTICES_KEY),
          getList(PUBLICATIONS_KEY),
          getList('events')
        ]);

        if (!mounted) return;

        const activeHero = heroList?.find(h => h.is_active) || null;
        setHero(activeHero);

        const sortedNotices = (noticesList || [])
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4);
        setNotices(sortedNotices);

        const sortedPublications = (pubList || [])
          .sort((a, b) => 
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          )
          .slice(0, 4);
        setPublications(sortedPublications);

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

  const memoizedNotices = useMemo(() => notices, [notices]);
  const memoizedPublications = useMemo(() => publications, [publications]);
  const memoizedNextEvent = useMemo(() => nextEvent, [nextEvent]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-3 sm:mb-4" />
          <div className="text-green-700 font-medium text-sm sm:text-base">লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-10 px-3 sm:px-4 md:px-6 max-w-7xl mx-auto pb-8 sm:pb-10">
      <HeroSection hero={hero} renderLink={renderLink} />

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <EventSection nextEvent={memoizedNextEvent} />
        <StatsSection />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <ListSection title="সর্বশেষ নোটিশ" items={memoizedNotices} />
        <ListSection title="সর্বশেষ প্রকাশনা" items={memoizedPublications} />
      </div>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg sm:rounded-xl p-5 sm:p-6 md:p-8 text-center text-white shadow-lg">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
          আমাদের সদস্য হোন
        </h2>
        <p className="mb-4 sm:mb-6 opacity-90 text-xs sm:text-sm md:text-base px-2">
          ফুটন্ত ফুলের আসরের সাথে যুক্ত হয়ে নতুন কিছু শিখুন এবং গড়ে তুলুন
        </p>
        <NavLink
          to="/membership"
          className="bg-white text-green-700 hover:bg-green-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold inline-block transition-all shadow-lg hover:shadow-xl text-sm sm:text-base active:scale-95"
        >
          Become a member
        </NavLink>
      </div>
    </div>
  );
}