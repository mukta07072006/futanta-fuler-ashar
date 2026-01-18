import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function Contact() {
  const email = "futantafulerashor@gmail.com";
  const phone = "+8801322558855";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-green-100">
              <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
            যোগাযোগ <span className="text-green-600">করুন</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            আমাদের কার্যক্রম সম্পর্কে জানতে বা যেকোনো পরামর্শ দিতে সরাসরি যোগাযোগ করুন। আমরা আপনার মতামতকে গুরুত্ব দিই।
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Email Card */}
          <a 
            href={`mailto:${email}`}
            className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-green-500 hover:shadow-md transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <FiMail className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">ইমেইল করুন</h3>
            <p className="text-slate-500 text-sm break-all">{email}</p>
          </a>

          {/* Phone Card */}
          <a 
            href={`tel:${phone}`}
            className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-green-500 hover:shadow-md transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FiPhone className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">কল করুন</h3>
            <p className="text-slate-500 text-sm">{phone}</p>
          </a>

          {/* Location/Office Card (Placeholder) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-green-500 transition-all">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 text-orange-600 mb-6">
              <FiMapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">কার্যালয়</h3>
            <p className="text-slate-500 text-sm">চট্টগ্রাম, বাংলাদেশ</p>
          </div>

        </div>

        {/* Social Connect Section */}
        <div className="mt-12 bg-green-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
          {/* Decorative circles */}
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-green-400/20 rounded-full blur-3xl"></div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6 relative z-10">সোশ্যাল মিডিয়ায় আমাদের সাথে থাকুন</h2>
          
          <div className="flex justify-center gap-6 relative z-10">
            <SocialLink href="https://facebook.com/futantafulerashorcmp" icon={<FaFacebookF />} label="Facebook" />
            <SocialLink href="https://www.youtube.com/@FutantaFulerAshor" icon={<FaYoutube />} label="YouTube" />
            <SocialLink href="https://www.instagram.com/futantafulerashorcmp/" icon={<FaInstagram />} label="Instagram" />
          </div>
          
          <p className="mt-8 text-green-100 opacity-80 text-sm md:text-base">
            প্রতিদিনের আপডেট এবং কার্যক্রমের ছবি দেখতে আমাদের ফলো করুন
          </p>
        </div>
      </div>
    </div>
  );
}

// Internal Component for Social Links
function SocialLink({ href, icon, label }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white text-xl md:text-2xl hover:bg-white hover:text-green-700 transition-all duration-300 shadow-lg"
      aria-label={label}
    >
      {icon}
    </a>
  );
}