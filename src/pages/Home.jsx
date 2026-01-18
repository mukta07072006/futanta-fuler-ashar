import React, { useState, useEffect, useMemo } from 'react';
import { getList } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import { NavLink } from 'react-router-dom';

const NOTICES_KEY = 'notices';
const PUBLICATIONS_KEY = 'library';

// Memoized StatBox to prevent re-renders
const StatBox = React.memo(({ val, label }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm">
    <div className="text-xl font-bold text-green-600">{val}</div>
    <div className="text-[10px] text-slate-500 uppercase font-medium">{label}</div>
  </div>
));

export default function Home() {
  const [data, setData] = useState({
    mainHero: null,
    sliderImages: [],
    notices: [],
    publications: [],
    nextEvent: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [heroList, sliderList, noticesList, pubList, eventList] = await Promise.all([
          getList('main_hero'),
          getList('hero_slider'),
          getList(NOTICES_KEY),
          getList(PUBLICATIONS_KEY),
          getList('events')
        ]);

        const now = new Date().getTime();

        setData({
          mainHero: heroList?.find(h => h.is_active) || null,
          sliderImages: (sliderList || []).filter(item => item.is_active).slice(0, 3),
          notices: (noticesList || []).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4),
          publications: (pubList || []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4),
          nextEvent: eventList?.map(e => ({
            ...e,
            _time: new Date(e.date?.toDate ? e.date.toDate() : e.date).getTime()
          })).filter(e => e._time >= now).sort((a, b) => a._time - b._time)[0] || null
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Helper to handle absolute vs relative links
  const renderLink = (url, content, className) => {
    if (!url) return <div className={className}>{content}</div>;
    const isExternal = url.startsWith('http') || url.startsWith('www');
    const finalUrl = url.startsWith('www') ? `https://${url}` : url;

    if (isExternal) {
      return (
        <a href={finalUrl} target="_blank" rel="noopener noreferrer" className={className}>
          {content}
        </a>
      );
    }
    return <NavLink to={url} className={className}>{content}</NavLink>;
  };

  // 1. Memoized Hero Section
  const HeroSection = useMemo(() => {
    if (!data.mainHero) return null;
    return (
      <section className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-200 shadow-lg">
        <img src={data.mainHero.image} className="w-full h-full object-cover" alt="" fetchpriority="high" />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-4">
          <div className="text-white">
            <h1 className="text-2xl md:text-5xl font-bold mb-2 drop-shadow-md">{data.mainHero.title}</h1>
            <p className="text-xs md:text-lg mb-4 opacity-90">{data.mainHero.subtitle}</p>
            {data.mainHero.cta_text && renderLink(
              data.mainHero.cta_link,
              data.mainHero.cta_text,
              "bg-green-600 px-6 py-2 rounded-lg font-bold inline-block hover:bg-green-700 transition-colors shadow-lg"
            )}
          </div>
        </div>
      </section>
    );
  }, [data.mainHero]);

  // 2. Memoized Static Grid (3 Columns on Mobile & PC)
  const ImageGrid = useMemo(() => (
    <section className="grid grid-cols-3 gap-2 md:gap-4">
      {data.sliderImages.map((item) => (
        <div key={item.id} className="aspect-video rounded-lg md:rounded-xl overflow-hidden border bg-slate-100 shadow-sm">
          {renderLink(
            item.link,
            <img src={item.image} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" alt="" />,
            "block w-full h-full"
          )}
        </div>
      ))}
    </section>
  ), [data.sliderImages]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 px-3 md:px-6 max-w-7xl mx-auto pb-10">
      {HeroSection}
      
      {ImageGrid}

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-xl border text-center shadow-sm flex flex-col justify-center">
          <h3 className="font-bold mb-2 text-slate-800">{data.nextEvent?.title || 'আসন্ন ইভেন্ট'}</h3>
          {data.nextEvent ? <CountdownTimer targetDate={new Date(data.nextEvent._time)} /> : "ইভেন্ট নেই"}
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <StatBox val="৫০০+" label="সদস্য" />
          <StatBox val="১০০+" label="ইভেন্ট" />
          <StatBox val="২৫+" label="প্রকাশনা" />
          <StatBox val="৫+" label="বছর" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <ListSection title="নোটিশ" items={data.notices} />
        <ListSection title="প্রকাশনা" items={data.publications} />
      </div>
    </div>
  );
}

const ListSection = React.memo(({ title, items }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="bg-slate-800 p-3 text-white font-bold text-sm px-6">{title}</div>
    <div className="p-4 space-y-2">
      {items.map(it => (
        <div key={it.id} className="p-3 bg-slate-50 rounded border flex justify-between text-sm items-center">
          <span className="truncate font-medium text-slate-700">{it.title}</span>
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      ))}
    </div>
  </div>
));