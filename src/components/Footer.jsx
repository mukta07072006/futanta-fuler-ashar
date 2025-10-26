export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container py-8 grid gap-4 sm:grid-cols-3">
        <div>
          <h3 className="font-semibold text-slate-800">ফুটন্ত ফুলের আসর</h3>
          <p className="text-slate-600 mt-2 text-sm">
            শিশু কিশোরদের আদর্শ নাগরিক হিসেবে গড়ে তোলায় আমাদের লক্ষ্য
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">যোগাযোগ</h4>
          <ul className="text-slate-600 text-sm mt-2">
            <li>Email: info@example.com</li>
            <li>Phone: +8801XXXXXXXXX</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">সোশ্যাল</h4>
          <div className="flex gap-3 mt-2">
            <a className="text-slate-600 hover:text-primary" href="#">Facebook</a>
            <a className="text-slate-600 hover:text-primary" href="#">YouTube</a>
            <a className="text-slate-600 hover:text-primary" href="#">Instagram</a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="container py-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ফুটন্ত ফুলের আসর — All rights reserved. Developed By Moshud Muktadir
        </div>
      </div>
    </footer>
  )
}