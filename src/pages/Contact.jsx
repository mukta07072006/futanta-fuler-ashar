import { FiMail, FiPhone } from 'react-icons/fi'
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa'
import logo from '../assets/logo.png'

export default function Contact() {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3">
            <img src={logo} alt="ফুটন্ত ফুলের আসর লোগো" className="h-12 w-12 object-contain" />
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">যোগাযোগ</h1>
          </div>
          <p className="text-slate-700 text-base md:text-lg max-w-2xl mx-auto">
            আমাদের সাথে যেকোনো সময় যোগাযোগ করতে পারেন। পরামর্শ, প্রশ্ন বা সহযোগিতার জন্য নিচের মাধ্যমগুলোর যেকোনো একটি ব্যবহার করুন।
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-green-800">সরাসরি যোগাযোগ</h2>
            <p className="text-slate-700">
              ইমেইল বা ফোনের মাধ্যমে সরাসরি আমাদের সাথে কথা বলতে পারবেন।
            </p>
            <ul className="space-y-3 text-green-800">
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-green-600" />
                <span>futantafulerashor@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-green-600" />
                <span>+8801322558855</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 bg-white border border-green-200 rounded-xl p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-green-800">সোশ্যাল মিডিয়ায় যুক্ত থাকুন</h2>
            <p className="text-slate-700">
              আমাদের কার্যক্রম, ইভেন্ট ও নতুন আপডেট জানতে সোশ্যাল মিডিয়ায় ফলো করুন।
            </p>
            <div className="flex gap-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}

