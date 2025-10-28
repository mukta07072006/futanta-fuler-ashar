import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import CountdownTimer from '../components/CountdownTimer';
import { NavLink } from 'react-router-dom';

// Firebase collection names
const SLIDER_COLLECTION = 'sliders';
const NOTICES_COLLECTION = 'notices';
const PUBLICATIONS_COLLECTION = 'publications';

export default function Home() {
  const [sliderData, setSliderData] = useState([]);
  const [notices, setNotices] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const nextEvent = new Date();
  nextEvent.setMonth(nextEvent.getMonth() + 1);

  // Fetch slider data from Firebase
  const fetchSliderData = async () => {
    try {
      const q = query(
        collection(db, SLIDER_COLLECTION),
        orderBy('order', 'asc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const sliders = [];
      querySnapshot.forEach((doc) => {
        sliders.push({ id: doc.id, ...doc.data() });
      });
      setSliderData(sliders);
    } catch (error) {
      console.error('Error fetching slider data:', error);
    }
  };

  // Fetch notices from Firebase
  const fetchNotices = async () => {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        orderBy('date', 'desc'),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const noticesData = [];
      querySnapshot.forEach((doc) => {
        noticesData.push({ id: doc.id, ...doc.data() });
      });
      setNotices(noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  // Fetch publications from Firebase
  const fetchPublications = async () => {
    try {
      const q = query(
        collection(db, PUBLICATIONS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const publicationsData = [];
      querySnapshot.forEach((doc) => {
        publicationsData.push({ id: doc.id, ...doc.data() });
      });
      setPublications(publicationsData);
    } catch (error) {
      console.error('Error fetching publications:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSliderData(),
        fetchNotices(),
        fetchPublications()
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Auto slide functionality
  useEffect(() => {
    if (sliderData.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderData.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sliderData.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 px-3 sm:px-4 md:px-6">
      {/* Hero Slider Section - Mobile Optimized */}
      <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] rounded-lg md:rounded-xl overflow-hidden bg-slate-100">
        {sliderData.length > 0 ? (
          <>
            {/* Slides */}
            <div 
              className="relative h-full w-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {sliderData.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  {slide.image && (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  )}
                  <div className="absolute inset-0 z-20 flex items-center">
                    <div className="container mx-auto px-4 sm:px-6">
                      <div className="max-w-2xl text-white text-center md:text-left">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                          {slide.title}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 text-slate-100 px-2 sm:px-0">
                          {slide.subtitle}
                        </p>
                        <NavLink
                          to={slide.ctaLink || "/membership"}
                          className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md text-sm sm:text-base"
                        >
                          {slide.cta || "এখনই যোগ দিন"}
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls - Hidden on mobile, visible on tablet+ */}
            {sliderData.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="hidden sm:flex absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-slate-800 p-1.5 md:p-2 rounded-full transition-all duration-300 shadow-lg"
                  aria-label="Previous slide"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="hidden sm:flex absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-slate-800 p-1.5 md:p-2 rounded-full transition-all duration-300 shadow-lg"
                  aria-label="Next slide"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Slider Indicators - Mobile optimized */}
            {sliderData.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-1.5 sm:space-x-2">
                {sliderData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-6 sm:w-8 bg-white' 
                        : 'w-2 sm:w-3 bg-white/50'
                    } h-2 rounded-full`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Mobile Swipe Instruction */}
            {sliderData.length > 1 && (
              <div className="sm:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30">
                <span className="text-white/70 text-xs">সোয়াইপ করুন ← →</span>
              </div>
            )}
          </>
        ) : (
          // Fallback when no slider data
          <div className="h-full flex items-center justify-center bg-green-600">
            <div className="text-center text-white px-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">ফুটন্ত ফুলের আসর</h1>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8">শিশু কিশোরদের আদর্শ নাগরিক হিসেবে গড়ে তোলায় আমাদের লক্ষ্য</p>
              <NavLink
                to="/membership"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-slate-100 transition-all duration-300 text-sm sm:text-base"
              >
                এখনই যোগ দিন
              </NavLink>
            </div>
          </div>
        )}
      </section>

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
            তাদেরকে সামাজিকভাবে দায়িত্বশীল নাগরিক হিসেবে গড়ে তোলা।
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
            সম্পন্ন হিসেবে বেড়ে উঠবে এবং দেশ ও জাতির উন্নয়নে ভূমিকা রাখবে।
          </p>
        </div>
      </section>

      {/* Countdown and Stats Section */}
      <section className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 text-center">আগামী বড় ইভেন্টের কাউন্টডাউন</h3>
          <CountdownTimer targetDate={nextEvent} />
        </div>

        <div className="bg-slate-50 rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 text-center">আমাদের অর্জন</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200">
              <div className="text-xl sm:text-2xl font-bold text-green-600">৫০০+</div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">সক্রিয় সদস্য</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">১০০+</div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">সফল ইভেন্ট</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">২৫+</div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">প্রকাশনা</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200">
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