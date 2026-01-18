import { useState, useEffect } from 'react';
import { getList } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import { NavLink } from 'react-router-dom';

const NOTICES_KEY = 'notices';
const PUBLICATIONS_KEY = 'library';

export default function Home() {
  const [mainHero, setMainHero] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [notices, setNotices] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextEventDate, setNextEventDate] = useState(null);
  const [nextEventTitle, setNextEventTitle] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [heroList, sliderList, noticesList, pubList, eventList] = await Promise.all([
          getList('main_hero'),
          getList('hero_slider'),
          getList(NOTICES_KEY),
          getList(PUBLICATIONS_KEY),
          getList('events')
        ]);

        // Main hero
        const activeHero = heroList
          .filter(h => h.is_active)
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0];
        setMainHero(activeHero || null);

        // Slider images
        const activeSlider = sliderList
          .filter(item => item.is_active)
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map(item => ({
            id: item.id,
            image: item.image,
            title: item.title,
            link: item.link
          }));
        setSliderImages(activeSlider);

        // Notices
        const sortedNotices = noticesList
          .map(it => ({ id: it._id || it.id, ...it }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4);
        setNotices(sortedNotices);

        // Publications
        const sortedPubs = pubList
          .map(it => ({ id: it._id || it.id, ...it }))
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 4);
        setPublications(sortedPubs);

        // Next event
        const events = eventList.map(it => ({ id: it._id || it.id, ...it }));
        const now = new Date();
        const futureEvents = events
          .map(e => {
            let date = null;
            try {
              if (e.date?.toDate) date = e.date.toDate();
              else if (typeof e.date === 'string') date = new Date(e.date);
              else if (typeof e.date === 'number') date = new Date(e.date);
              return { ...e, _date: date };
            } catch {
              return { ...e, _date: null };
            }
          })
          .filter(e => e._date instanceof Date && !isNaN(e._date) && e._date >= now)
          .sort((a, b) => a._date - b._date);

        if (futureEvents.length > 0) {
          setNextEventDate(futureEvents[0]._date);
          setNextEventTitle(futureEvents[0].title || 'আসন্ন ইভেন্ট');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 px-3 sm:px-4 md:px-6">
      {/* Main Hero Image Section */}
      <section className="relative w-full aspect-video rounded-lg md:rounded-xl overflow-hidden bg-slate-100">
        {mainHero ? (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              src={mainHero.image}
              alt={mainHero.title || 'নজরুল অলিম্পিয়াড'}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            {(mainHero.title || mainHero.subtitle || mainHero.cta_text) && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                  <div className="max-w-3xl mx-auto text-white">
                    {mainHero.title && (
                      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
                        {mainHero.title}
                      </h1>
                    )}
                    {mainHero.subtitle && (
                      <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 text-slate-100">
                        {mainHero.subtitle}
                      </p>
                    )}
                    {mainHero.cta_text && (
                      <NavLink
                        to={mainHero.cta_link || "/membership"}
                        className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md text-sm sm:text-base md:text-lg"
                      >
                        {mainHero.cta_text}
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </NavLink>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400">
            <p>No hero image available</p>
          </div>
        )}
      </section>

      {/* Hero Slider Section */}
      {sliderImages.length >= 3 && (
        <section className="relative">
          <div
            className="overflow-hidden"
            onTouchStart={(e) => {
              setTouchEnd(null);
              setTouchStart(e.targetTouches[0].clientX);
            }}
            onTouchMove={(e) => {
              setTouchEnd(e.targetTouches[0].clientX);
            }}
            onTouchEnd={() => {
              if (!touchStart || !touchEnd || isTransitioning) return;
              const distance = touchStart - touchEnd;
              if (distance > 50) {
                setIsTransitioning(true);
                setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
                setTimeout(() => setIsTransitioning(false), 500);
              } else if (distance < -50) {
                setIsTransitioning(true);
                setCurrentIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
          >
            <div className="flex gap-[2%]">
              {sliderImages.map((item, index) => {
                const position = (index - currentIndex + sliderImages.length) % sliderImages.length;
                let widthClass = 'w-[0%]';
                if (position === 0 || position === 1) widthClass = 'w-[40%]';
                else if (position === 2) widthClass = 'w-[18%]';

                if (position > 2) return null;

                return (
                  <div
                    key={item.id}
                    style={{ order: position }}
                    className={`${widthClass} flex-shrink-0 aspect-[18/9] rounded-lg overflow-hidden bg-slate-200 shadow-md border border-slate-200 transition-all duration-500 ease-in-out`}
                  >
                    {item.link ? (
                      <NavLink to={item.link} className="block w-full h-full">
                        <img
                          src={item.image}
                          alt={item.title || ''}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </NavLink>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title || ''}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => {
              if (!isTransitioning && sliderImages.length > 0) {
                setIsTransitioning(true);
                setCurrentIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            disabled={isTransitioning}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (!isTransitioning && sliderImages.length > 0) {
                setIsTransitioning(true);
                setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            disabled={isTransitioning}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="text-center mt-3">
            <span className="text-slate-400 text-xs">← সোয়াইপ করুন →</span>
          </div>
        </section>
      )}

      {/* Mission & Vision Section */}
      <section className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">আমাদের লক্ষ্য</h3>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            শিশু-কিশোরদের ভিতরে সৃজনশীলতা, নৈতিকতা ও নেতৃত্ব গুণের বিকাশ ঘটানো এবং 
            তাদেরকে সামাজিকভাবে দায়িত্বশীল নাগরিক হিসেবে গড়ে তোলা।
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">আমাদের দৃষ্টি</h3>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            একটি আদর্শ সমাজ যেখানে প্রতিটি শিশু আত্মবিশ্বাসী, সৃজনশীল ও মানবিক গুণাবলী 
            সম্পন্ন হিসেবে বেড়ে উঠবে এবং দেশ ও জাতির উন্নয়নে ভূমিকা রাখবে।
          </p>
        </div>
      </section>

      {/* Countdown and Stats Section */}
      <section className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 text-center">
            {nextEventTitle || 'আসন্ন ইভেন্ট'}
          </h3>
          <div className="flex justify-center">
            {nextEventDate ? (
              <CountdownTimer targetDate={nextEventDate} />
            ) : (
              <div className="text-slate-600 text-sm">কোনো আসন্ন ইভেন্ট নেই</div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 text-center">আমাদের অর্জন</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">৫০০+</div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">সক্রিয় সদস্য</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">১০০+</div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">সফল ইভেন্ট</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">২৫+</div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">প্রকাশনা</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">৫+</div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">বছরের যাত্রা</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Notices */}
      <section className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              সর্বশেষ নোটিশ
            </h3>
            <NavLink to="/admin" className="text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-colors">
              ম্যানেজ করুন
            </NavLink>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {notices.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg bg-slate-50 hover:bg-blue-50 transition-all duration-200 border border-slate-200 gap-2 sm:gap-0"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {notice.urgent && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200 whitespace-nowrap">
                        জরুরি
                      </span>
                    )}
                    <span className="text-slate-800 font-medium text-sm sm:text-base break-words">{notice.title}</span>
                  </div>
                  <span className="text-slate-500 text-xs sm:text-sm bg-white px-2 py-1 rounded border border-slate-200 sm:self-start">
                    {new Date(notice.date).toLocaleDateString('bn-BD')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4 sm:py-6 text-sm sm:text-base">কোন নোটিশ পাওয়া যায়নি</p>
          )}
        </div>
      </section>

      {/* Featured Publications */}
      <section className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ফিচার্ড প্রকাশনা
            </h3>
            <NavLink to="/library" className="text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-colors">
              সব দেখুন
            </NavLink>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {publications.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              {publications.map((publication) => (
                <div
                  key={publication.id}
                  className="p-3 sm:p-4 rounded-lg bg-slate-50 hover:bg-green-50 transition-all duration-200 border border-slate-200 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-800 font-medium text-sm sm:text-base group-hover:text-green-700 transition-colors break-words">
                      {publication.title}
                    </span>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {publication.description && (
                    <p className="text-slate-600 text-xs sm:text-sm mt-2">{publication.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4 sm:py-6 text-sm sm:text-base">কোন প্রকাশনা পাওয়া যায়নি</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-600 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">আমাদের সাথে যুক্ত হোন</h2>
        <p className="text-green-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
          শিশু-কিশোরদের উন্নয়নে আমাদের এই যাত্রায় অংশ নিন এবং একটি সুন্দর ভবিষ্যৎ গড়তে সাহায্য করুন।
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <NavLink
            to="/membership"
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-slate-100 transition-all duration-300 shadow-md text-sm sm:text-base"
          >
            সদস্য হোন
          </NavLink>
          <NavLink
            to="/about"
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 border border-white text-sm sm:text-base"
          >
            আমাদের সম্পর্কে
          </NavLink>
        </div>
      </section>
    </div>
  );
}