import { FiInfo, FiTarget, FiCheckCircle, FiHeart } from 'react-icons/fi'

export default function About() {
  return (
    <div className="min-h-screen bg-white py-8 px-4" style={{ fontFamily: 'ui-sans-serif, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="inline-flex items-center gap-2 text-4xl md:text-5xl font-bold text-green-700">
            <FiInfo className="text-green-600" /> ফুটন্ত ফুলের আসর
          </h1>
          <p className="mt-3 text-slate-700 text-base md:text-lg max-w-2xl mx-auto">
            শিশু-কিশোরদের আদর্শ নাগরিক হিসেবে গড়ে তোলার এক অনন্য প্রতিষ্ঠান
          </p>
        </div>

        {/* Mission */}
        <section className="bg-white border border-green-200 rounded-xl p-6 md:p-8 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FiTarget className="text-green-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">আমাদের লক্ষ্য</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            শিশু কিশোরদের আদর্শ নাগরিক হিসেবে গড়ে তোলাই আমাদের লক্ষ্য। শিক্ষা, সংস্কৃতি, নৈতিকতা ও নেতৃত্বের সমন্বয়ে তাদের সক্ষমতাকে বিকশিত করা আমাদের কাজ।
          </p>
        </section>

        {/* Objectives */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">আমাদের উদ্দেশ্য</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="bg-white rounded-xl border border-green-200 p-6 hover:border-green-300 transition-colors">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">সাহিত্য ও মেধা বিকাশ</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> সাপ্তাহিক সাহিত্য আসর, আবৃত্তি, ছড়া, গল্প, কুইজ ও বিতর্ক</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> হাতের লেখা প্রতিযোগিতা</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> বার্ষিক বা ত্রৈমাসিক দেয়ালিকা প্রকাশ</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> নির্বাচিত বইয়ের পাঠচক্র</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl border border-green-200 p-6 hover:border-green-300 transition-colors">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">পাঠাগার ও শিক্ষা সহায়তা</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> শিশুতোষ বইয়ের সংগ্রহশালা</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> দরিদ্র ও মেধাবী শিক্ষার্থীদের বই বিতরণ</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> ঐতিহাসিক ও শিক্ষামূলক ভ্রমণ</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl border border-green-200 p-6 hover:border-green-300 transition-colors">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">সংস্কৃতি ও চারিত্রিক মান উন্নয়ন</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> হামদ-না'ত, গজল, কাওয়ালী, লোকনৃত্য প্রশিক্ষণ</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> বিশেষ দিবস উদযাপন ও প্রতিযোগিতা</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> চিত্রাঙ্কন ও চারুকলার ক্লাস</li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl border border-green-200 p-6 hover:border-green-300 transition-colors">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">নৈতিকতা ও মূল্যবোধ শিক্ষা</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> মাসিক 'আদর্শ নাগরিক' সভা</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> নৈতিকতা ও পরিবেশ সচেতনতা বিষয়ক আলোচনা</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> শিষ্টাচার প্রশিক্ষণ</li>
              </ul>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-xl border border-green-200 p-6 hover:border-green-300 transition-colors">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">সামাজিক দায়িত্ব ও নেতৃত্ব তৈরি</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> পরিচ্ছন্নতা অভিযান</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> বৃক্ষরোপণ কর্মসূচি</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> মানবতার দেওয়াল</li>
              </ul>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-xl border border-green-200 p-6 hover:border-green-300 transition-colors">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">নেতৃত্ব বিকাশ কর্মশালা</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> ছোটদের কমিটি গঠন</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> সিনিয়র-জুনিয়র মেন্টরশিপ</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> দলনেতা নির্বাচন</li>
              </ul>
            </div>

            {/* Card 7 */}
            <div className="bg-white rounded-xl border border-green-200 p-6 hover:border-green-300 transition-colors md:col-span-2 lg:col-span-3">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">শারীরিক ও মানসিক স্বাস্থ্য</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 text-lg">ক্রীড়া কার্যক্রম</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> বার্ষিক ক্রীড়া প্রতিযোগিতা</li>
                    <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> দৌড়, ক্রিকেট, ফুটবল ও দেশীয় খেলা</li>
                    <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> আউটডোর গেমস ও দলগত খেলাধুলা</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 text-lg">স্বাস্থ্য সেবা</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> স্বাস্থ্য সচেতনতা ক্যাম্প</li>
                    <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> প্রাথমিক চিকিৎসার প্রশিক্ষণ</li>
                    <li className="flex items-start gap-2"><FiCheckCircle className="text-green-600 mt-0.5" /> স্থানীয় ডাক্তারের সহায়তায় পরামর্শ</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment */}
        <section className="bg-white border border-green-200 rounded-xl p-6 md:p-8">
          <div className="text-center mb-4">
            <h2 className="inline-flex items-center gap-2 text-2xl md:text-3xl font-bold text-slate-900">
              <FiHeart className="text-green-600" /> আমাদের প্রতিশ্রুতি
            </h2>
          </div>
          <div className="space-y-3 text-slate-700 text-center">
            <p>ফুটন্ত ফুলের আসর বিশ্বাস করে—প্রতিটি শিশুর মধ্যেই রয়েছে এক অমূল্য সম্ভাবনা।</p>
            <p>আমরা সেই সম্ভাবনাকে বিকশিত করার জন্য কাজ করছি ভালোবাসা, অনুপ্রেরণা ও সৃজনশীলতার মাধ্যমে।</p>
            <p className="font-medium text-slate-800">আমাদের লক্ষ্য এমন এক প্রজন্ম গড়ে তোলা, যারা হবে জ্ঞান ও নৈতিকতায় সমৃদ্ধ, নিজেকে জানবে, সমাজকে ভালোবাসবে, এবং দেশের উন্নয়ন ও মানবকল্যাণে নিবেদিত থাকবে।</p>
          </div>
        </section>
      </div>
    </div>
  )
}