import { useState, useEffect, useMemo } from 'react';
import { getList } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import { NavLink } from 'react-router-dom';

const NOTICES_KEY = 'notices';
const PUBLICATIONS_KEY = 'library';

export default function Home() {
  const [data, setData] = useState({
    mainHero: null,
    sliderImages: [],
    notices: [],
    publications: [],
    nextEvent: null
  });
  const [loading, setLoading] = useState(true);

  // 1. Efficient Data Fetching
  useEffect(() => {
    let isMounted = true;

    const loadAllData = async () => {
      try {
        // Fetch everything in parallel
        const [heroList, sliderList, noticesList, pubList, eventList] = await Promise.all([
          getList('main_hero'),
          getList('hero_slider'),
          getList(NOTICES_KEY),
          getList(PUBLICATIONS_KEY),
          getList('events')
        ]);

        if (!isMounted) return;

        const now = new Date().getTime();

        // Process data ONCE and store it
        setData({
          mainHero: heroList?.find(h => h.is_active) || null,
          sliderImages: (sliderList || []).filter(item => item.is_active).slice(0, 3),
          notices: (noticesList || [])
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4),
          publications: (pubList || [])
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 4),
          nextEvent: (eventList || [])
            .map(e => ({ ...e, _time: new Date(e.date?.toDate ? e.date.toDate() : e.date).getTime() }))
            .filter(e => e._time >= now)
            .sort((a, b) => a._time - b._time)[0] || null
        });
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
    return () => { isMounted = false; };
  }, []);

  // 2. Memoize the UI components to prevent unnecessary re-renders when clicking header
  const memoizedHero = useMemo(() => {
    if (!data.mainHero) return null;
    const isExternal = data.mainHero.cta_link?.startsWith('http');
    
    return (
      <section className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-200 shadow-lg">
        <img src={data.mainHero.image} className="w-full h-full object-cover" alt="Hero" fetchpriority="high" />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-4">
          <div className="text-white">
            <h1 className="text-2xl md:text-5xl font-bold mb-4">{data.mainHero.title}</h1>
            {isExternal ? (
              <a href={data.mainHero.cta_link} target="_blank" rel="noopener" className="bg-green-600 px-6 py-2 rounded-lg font-bold inline-block">
                {data.mainHero.cta_text}
              </a>
            ) : (
              <NavLink to={data.mainHero.cta_link || "/membership"} className="bg-green-600 px-6 py-2 rounded-lg font-bold inline-block">
                {data.mainHero.cta_text}
              </NavLink>
            )}
          </div>
        </div>
      </section>
    );
  }, [data.mainHero]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 px-3 md:px-6 max-w-7xl mx-auto pb-10 content-visibility-auto">
      {memoizedHero}

      {/* Static Images Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.sliderImages.map((item) => (
          <div key={item.id} className="aspect-video rounded-xl overflow-hidden border bg-slate-100 shadow-sm">
            <img src={item.image} className="w-full h-full object-cover" loading="lazy" alt="" />
          </div>
        ))}
      </section>

      {/* Stats and Events */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border text-center shadow-sm">
          <h3 className="font-bold mb-4">{data.nextEvent?.title || 'ইভেন্ট'}</h3>
          {data.nextEvent ? <CountdownTimer targetDate={new Date(data.nextEvent._time)} /> : "কোনো ইভেন্ট নেই"}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatBox val="৫০০+" label="সদস্য" />
          <StatBox val="১০০+" label="ইভেন্ট" />
          <StatBox val="২৫+" label="প্রকাশনা" />
          <StatBox val="৫+" label="বছর" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ListSection title="নোটিশ" items={data.notices} type="notice" />
        <ListSection title="প্রকাশনা" items={data.publications} type="pub" />
      </div>
    </div>
  );
}

const StatBox = ({ val, label }) => (
  <div className="bg-slate-50 p-4 rounded-xl border text-center border-slate-100">
    <div className="text-xl font-bold text-green-600">{val}</div>
    <div className="text-[10px] text-slate-500 uppercase">{label}</div>
  </div>
);

const ListSection = ({ title, items, type }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="bg-slate-800 p-3 text-white font-bold text-sm px-6">{title}</div>
    <div className="p-4 space-y-3">
      {items.map(it => (
        <div key={it.id} className="p-3 bg-slate-50 rounded border flex justify-between text-sm">
          <span className="truncate">{it.title}</span>
        </div>
      ))}
    </div>
  </div>
);