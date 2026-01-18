import React, { useState, useEffect, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { getList } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';

const NOTICES_KEY = 'notices';
const PUBLICATIONS_KEY = 'library';

/* --- Small Pure Components (Memoized for Speed) --- */
const StatBox = memo(({ val, label }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm">
    <div className="text-xl sm:text-2xl font-bold text-green-600">{val}</div>
    <div className="text-[10px] text-slate-500 uppercase font-medium tracking-wide mt-1">{label}</div>
  </div>
));

const ListItem = memo(({ item }) => (
  <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between text-sm items-center hover:bg-slate-100 transition-colors cursor-pointer">
    <span className="truncate font-medium text-slate-700 pr-2">{item?.title || 'No Title'}</span>
    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
));

const ListSection = memo(({ title, items }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full">
    <div className="bg-slate-800 p-3 text-white font-bold text-sm px-6">{title}</div>
    <div className="p-4 space-y-2">
      {items && items.length > 0 ? (
        items.map(it => <ListItem key={it.id || Math.random()} item={it} />)
      ) : (
        <div className="text-center text-slate-400 text-sm py-4">কোনো আইটেম নেই</div>
      )}
    </div>
  </div>
));

/* --- Optimized Hero Section --- */
const HeroSection = memo(({ heroes = [] }) => {
  const [index, setIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [heroes.length]);

  useEffect(() => {
    setIsLoaded(false);
  }, [index]);

  useEffect(() => {
    if (!heroes.length) return;
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % heroes.length);
    }, 5000);
    return () => clearInterval(id);
  }, [heroes.length]);

  if (!heroes.length) {
    return <div className="aspect-[16/10] sm:aspect-video bg-slate-200 rounded-xl animate-pulse" />;
  }

  const hero = heroes[index] || null;
  const isExternal = hero?.cta_link?.match(/^(http|www|mailto|tel)/);
  const url = hero?.cta_link?.startsWith('www') ? `https://${hero.cta_link}` : hero?.cta_link;

  const Inner = (
    <div className="relative w-full aspect-[16/10] sm:aspect-video rounded-xl overflow-hidden bg-slate-200 shadow-lg group">
      <img
        src={hero?.image}
        alt={hero?.title || ""}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="eager"
      />
      <div className="absolute inset-0" />
      <div className="absolute bottom-0 p-4 sm:p-8 text-white w-full">
        <h1 className="text-xl sm:text-4xl font-bold mb-2 drop-shadow-md">{hero?.title}</h1>
        <p className="text-xs sm:text-lg opacity-90 line-clamp-2">{hero?.subtitle}</p>
      </div>
      {heroes.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-2">
          {heroes.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full border border-white/60 transition-all ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return isExternal ? <a href={url} target="_blank" rel="noopener noreferrer" className="block">{Inner}</a> : <NavLink to={url || '#'} className="block">{Inner}</NavLink>;
});

/* --- Main Home Component --- */
export default function Home() {
  const [state, setState] = useState({
    heroes: [],
    notices: [],
    publications: [],
    nextEvent: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [heroRes, noticeRes, pubRes, eventRes] = await Promise.allSettled([
          getList('main_hero'),
          getList(NOTICES_KEY),
          getList(PUBLICATIONS_KEY),
          getList('events')
        ]);

        if (!mounted) return;

        // Safely extract values from Settled Promises
        const hRaw = heroRes.status === 'fulfilled' ? heroRes.value : [];
        const nRaw = noticeRes.status === 'fulfilled' ? noticeRes.value : [];
        const pRaw = pubRes.status === 'fulfilled' ? pubRes.value : [];
        const eRaw = eventRes.status === 'fulfilled' ? eventRes.value : [];

        const processedHeroes = Array.isArray(hRaw)
          ? [...hRaw]
              .sort((a, b) => {
                const aDate = new Date(a.created_at || a.createdAt || a.id || 0).getTime();
                const bDate = new Date(b.created_at || b.createdAt || b.id || 0).getTime();
                return bDate - aDate;
              })
              .slice(0, 3)
          : [];

        // 2. Process Notices
        const sortedNotices = Array.isArray(nRaw) 
          ? [...nRaw].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 4)
          : [];

        // 3. Process Publications
        const sortedPubs = Array.isArray(pRaw)
          ? [...pRaw].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4)
          : [];

        // 4. Process Next Event
        let upcoming = null;
        if (Array.isArray(eRaw)) {
          const now = Date.now();
          const validEvents = eRaw
            .map(ev => ({ 
              ...ev, 
              formattedDate: ev.date?.toDate ? ev.date.toDate() : ev.date 
            }))
            .filter(ev => ev.formattedDate && new Date(ev.formattedDate).getTime() >= now)
            .sort((a, b) => new Date(a.formattedDate) - new Date(b.formattedDate));
          
          upcoming = validEvents[0] || null;
        }

        setState({
          heroes: processedHeroes,
          notices: sortedNotices,
          publications: sortedPubs,
          nextEvent: upcoming,
          loading: false
        });

      } catch (err) {
        console.error("Critical Fetch Error:", err);
        if (mounted) setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  if (state.loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="w-full aspect-[16/10] sm:aspect-video bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 gap-2">
             <div className="h-14 bg-slate-100 rounded-lg animate-pulse" />
             <div className="h-14 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-10 px-4 max-w-7xl mx-auto pb-10">
      <HeroSection heroes={state.heroes} />

      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm flex flex-col justify-center min-h-[160px]">
          <h3 className="font-bold mb-4 text-slate-800">
            {state.nextEvent?.title || 'আসন্ন ইভেন্ট'}
          </h3>
          {state.nextEvent ? (
            <CountdownTimer targetDate={new Date(state.nextEvent.formattedDate)} />
          ) : (
            <p className="text-slate-400">কোনো ইভেন্ট নেই</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <StatBox val="৫০০+" label="সদস্য" />
          <StatBox val="১০০+" label="ইভেন্ট" />
          <StatBox val="২৫+" label="প্রকাশনা" />
          <StatBox val="৫+" label="বছর" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        <ListSection title="সর্বশেষ নোটিশ" items={state.notices} />
        <ListSection title="সর্বশেষ প্রকাশনা" items={state.publications} />
      </div>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center text-white shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-3">আমাদের সদস্য হোন</h2>
        <p className="mb-6 opacity-90 text-sm sm:text-base">ফুটন্ত ফুলের আসরের সাথে যুক্ত হয়ে নতুন কিছু শিখুন এবং গড়ে তুলুন</p>
        <NavLink to="/membership" className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold inline-block transition-transform hover:scale-105 active:scale-95 shadow-md">
          Become a member
        </NavLink>
      </div>
    </div>
  );
}
