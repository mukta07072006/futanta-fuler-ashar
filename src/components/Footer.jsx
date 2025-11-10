import { FiMail, FiPhone } from 'react-icons/fi'
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-green-200">
      <div className="container py-10 grid gap-8 sm:grid-cols-3">
        {/* Brand Section */}
        <div className="space-y-4">
          <img src={logo} alt="ফুটন্ত ফুলের আসর লোগো" className="h-10 w-10 object-contain" />
          <h3 className="font-bold text-2xl text-green-800">ফুটন্ত ফুলের আসর</h3>
          <p className="text-green-700 leading-relaxed text-base">
            শিশু কিশোরদের আদর্শ নাগরিক হিসেবে গড়ে তোলায় আমাদের লক্ষ্য। 
            আমরা নতুন প্রজন্মকে সৃজনশীল ও মানবিক মূল্যবোধে সমৃদ্ধ করতে কাজ করছি।
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-green-800 border-l-4 border-green-500 pl-3">যোগাযোগ</h4>
          <ul className="text-green-700 space-y-3 text-base">
            <li className="flex items-center space-x-3">
              <FiMail className="w-5 h-5 text-green-600" />
              <span>futantafulerashor@gmail.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <FiPhone className="w-5 h-5 text-green-600" />
              <span>+88015660064956</span>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-green-800 border-l-4 border-green-500 pl-3">সোশ্যাল মিডিয়া</h4>
          <div className="flex gap-3">
            <a 
              href="http://facebook.com/futantafulerashorcmp" 
              className="inline-flex items-center justify-center w-10 h-10 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a 
              href="https://www.youtube.com/@FutantaFulerAshor" 
              className="inline-flex items-center justify-center w-10 h-10 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/futantafulerashorcmp/" 
              className="inline-flex items-center justify-center w-10 h-10 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>
          <div className="text-green-600 text-sm space-y-1">
            <p className="font-medium">আমাদের সাথে যুক্ত থাকুন</p>
            <p className="text-green-500">নতুন আপডেট পেতে ফলো করুন</p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-green-200 bg-white">
        <div className="container py-6 text-center">
          <div className="text-green-700 text-sm space-y-2">
            <p className="font-medium">
              © {new Date().getFullYear()} ফুটন্ত ফুলের আসর — সকল অধিকার সংরক্ষিত
            </p>
            <p className="text-green-700">
              Developed By <span className="text-green-800 font-semibold">Moshud Muktadir</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}