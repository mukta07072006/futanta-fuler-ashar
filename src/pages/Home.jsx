import { useState, useEffect, useCallback } from 'react';
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
    nextEvent: { date: null, title: '' }
  });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

        const now = new Date();

        setData({
          mainHero: heroList?.find(h => h.is_active) || null,
          sliderImages: sliderList
            ?.filter(item => item.is_active)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
          notices: noticesList
            ?.map(it => ({ id: it._id || it.id, ...it }))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4),
          publications: pubList
            ?.map(it => ({ id: it._id || it.id, ...it }))
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 4),
          nextEvent: eventList
            .map(e => ({ ...e, _date: new Date(e.date?.toDate ? e.date.toDate() : e.date) }))
            .filter(e => e._date >= now)
            .sort((a, b) => a._date - b._date)[0] || { date: null, title: '' }
        });
      } catch (error) {
        console.error('Error fetching from DB:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Optimized Slider Navigation
  const handleNav = useCallback((direction) => {
    if (isTransitioning || data.sliderImages.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => 
      direction === 'next' 
        ? (prev + 1) % data.sliderImages.length 
        : (prev - 1 + data.sliderImages.length) % data.sliderImages.length
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, data.sliderImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 px-3 sm:px-4 md:px-6 max-w-7xl mx-auto pb-10">
      
      {/* 1. Main Hero Section */}
      <section className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 shadow-lg">
        {data.mainHero ? (
          <div className="absolute inset-0">
            <div className="absolute inset-0 z-10"></div>
            <img 
              src={data.mainHero.image} 
              className="w-full h-full object-cover" 
              alt="Hero" 
              fetchpriority="high"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-4">
               <div className="text-white">
                  <h1 className="text-2xl md:text-5xl font-bold mb-4">{data.mainHero.title}</h1>
                  <p className="text-sm md:text-xl mb-6 opacity-90">{data.mainHero.subtitle}</p>
                  {data.mainHero.cta_text && (
  <>
    {/* If it starts with http, use a standard anchor tag, otherwise use NavLink */}
    {data.mainHero.cta_link?.startsWith('http') ? (
      <a
        href={data.mainHero.cta_link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md text-sm sm:text-base md:text-lg"
      >
        {data.mainHero.cta_text}
        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    ) : (
      <NavLink
        to={data.mainHero.cta_link || "/membership"}
        className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md text-sm sm:text-base md:text-lg"
      >
        {data.mainHero.cta_text}
        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </NavLink>
    )}
  </>
)}
               </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* 2. Restored Hero Slider (Optimized) */}
      {data.sliderImages.length >= 3 && (
        <section className="relative">
          <div className="flex gap-[2%] items-center overflow-hidden h-[180px] md:h-[300px]">
            {data.sliderImages.map((item, index) => {
              const position = (index - currentIndex + data.sliderImages.length) % data.sliderImages.length;
              
              // Only render the first 3 to keep DOM light
              if (position > 2) return null;

              // Use style objects for better performance over complex class logic
              const isLarge = position === 0 || position === 1;
              const width = isLarge ? '40%' : '18%';

              return (
                <div
                  key={item.id}
                  style={{ order: position, width: width }}
                  className="flex-shrink-0 aspect-[18/9] rounded-lg overflow-hidden shadow-md border border-slate-200 transition-all duration-500 ease-in-out"
                >
                  <NavLink to={item.link || "#"} className="block w-full h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </NavLink>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <button onClick={() => handleNav('prev')} className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-xl hidden md:block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => handleNav('next')} className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-xl hidden md:block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </section>
      )}

      {/* 3. Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-6">
        <InfoCard title="আমাদের লক্ষ্য" text="সৃজনশীলতা ও নেতৃত্বের বিকাশ।" icon="🎯" />
        <InfoCard title="আমাদের দৃষ্টি" text="আদর্শ মানবিক সমাজ গঠন।" icon="👁️" />
      </section>

      {/* 4. Countdown & Stats */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border text-center">
          <h3 className="font-bold mb-4">{data.nextEvent.title || 'আসন্ন ইভেন্ট'}</h3>
          {data.nextEvent._date ? <CountdownTimer targetDate={data.nextEvent._date} /> : "ইভেন্ট নেই"}
        </div>
        <div className="grid grid-cols-2 gap-4">
           <StatBox val="৫০০+" label="সদস্য" />
           <StatBox val="১০০+" label="ইভেন্ট" />
           <StatBox val="25+" label="প্রকাশনা" />
           <StatBox val="৫+" label="বছর" />
        </div>
      </section>

      {/* 5. Notices & Publications */}
      <section className="grid md:grid-cols-2 gap-6">
        <ListSection title="সর্বশেষ নোটিশ" items={data.notices} type="notice" />
        <ListSection title="ফিচার্ড প্রকাশনা" items={data.publications} type="pub" />
      </section>
    </div>
  );
}

// Minimalist Sub-components
const InfoCard = ({ title, text, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <span className="text-2xl mb-2 block">{icon}</span>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-slate-600 text-sm">{text}</p>
  </div>
);

const StatBox = ({ val, label }) => (
  <div className="bg-slate-50 p-4 rounded-xl border text-center">
    <div className="text-xl font-bold text-green-600">{val}</div>
    <div className="text-xs text-slate-500 uppercase">{label}</div>
  </div>
);

const ListSection = ({ title, items, type }) => (
  <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
    <div className="bg-slate-800 p-3 text-white font-bold text-sm px-6">{title}</div>
    <div className="p-4 space-y-3">
      {items.length > 0 ? items.map(it => (
        <div key={it.id} className="p-3 bg-slate-50 rounded border flex justify-between text-sm">
          <span className="truncate">{it.title}</span>
          {type === 'notice' && <span className="text-[10px] bg-white px-2 py-1 rounded border ml-2">
            {new Date(it.date).toLocaleDateString('bn-BD')}
          </span>}
        </div>
      )) : <p className="text-center text-slate-400 py-4">তথ্য নেই</p>}
    </div>
  </div>
);