import { useState } from 'react'
import { createItem } from '../services/api'

export default function Membership() {
  const initialForm = {
    name: '',
    fatherName: '',
    motherName: '',
    institution: '',
    address: '',
    email: '',
    phone: ''
  }

  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [activeSection, setActiveSection] = useState('personal')

  const validate = (values) => {
    const errs = {}
    if (!values.name?.trim()) errs.name = 'নাম প্রয়োজন'
    if (!values.fatherName?.trim()) errs.fatherName = 'পিতার নাম প্রয়োজন'
    if (!values.motherName?.trim()) errs.motherName = 'মাতার নাম প্রয়োজন'
    if (!values.institution?.trim()) errs.institution = 'প্রতিষ্ঠানের নাম প্রয়োজন'
    if (!values.address?.trim()) errs.address = 'ঠিকানা প্রয়োজন'
    if (values.address?.length > 200) errs.address = 'ঠিকানা ২০০ অক্ষরের মধ্যে রাখুন'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!values.email?.trim() || !emailRegex.test(values.email)) errs.email = 'ইমেইল সঠিক নয়'
    const phoneDigits = (values.phone || '').replace(/\D/g, '')
    if (values.phone && (phoneDigits.length < 10 || phoneDigits.length > 14)) errs.phone = 'ফোন নম্বর সঠিক নয়'
    return errs
  }

  const onFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus('অনুগ্রহ করে ঘাটতি পূরণ করুন।')
      return
    }

    setSubmitting(true)
    setStatus('জমা হচ্ছে...')
    try {
      await createItem('memberships', {
        name: form.name,
        fatherName: form.fatherName,
        motherName: form.motherName,
        institution: form.institution,
        address: form.address,
        email: form.email,
        phone: form.phone || '',
      })

      const webhook = import.meta.env.VITE_SHEETS_WEBHOOK_URL
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      setStatus('সফলভাবে জমা হয়েছে!')
      setForm(initialForm)
      setErrors({})
    } catch (err) {
      console.error('Membership submit failed', err)
      setStatus('জমা ব্যর্থ হয়েছে। আবার চেষ্টা করুন।')
    } finally {
      setSubmitting(false)
    }
  }

  const statusColor = status.includes('সফল') ? 'text-green-600' : status.includes('ব্যর্থ') ? 'text-red-600' : 'text-slate-600'

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">সদস্য নিবন্ধন</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ফুতান্তা ফুলের আশর সংগঠনের সাথে যুক্ত হতে চান? নিচের ফর্সটি পূরণ করুন এবং আমাদের সদস্য হোন
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveSection('personal')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
                activeSection === 'personal'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:shadow-md'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>ব্যক্তিগত তথ্য</span>
            </button>
            
            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <button
              onClick={() => setActiveSection('contact')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
                activeSection === 'contact'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:shadow-md'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>যোগাযোগ তথ্য</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Personal Information Section */}
          <div className={`p-8 transition-all duration-300 ${activeSection === 'personal' ? 'block' : 'hidden'}`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">ব্যক্তিগত তথ্য</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">নাম *</label>
                <input
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="আপনার পূর্ণ নাম"
                  value={form.name}
                  onChange={(e) => onFieldChange('name', e.target.value)}
                  required
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">পিতার নাম *</label>
                <input
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.fatherName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="পিতার নাম"
                  value={form.fatherName}
                  onChange={(e) => onFieldChange('fatherName', e.target.value)}
                  required
                />
                {errors.fatherName && <p className="text-sm text-red-600">{errors.fatherName}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">মাতার নাম *</label>
                <input
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.motherName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="মাতার নাম"
                  value={form.motherName}
                  onChange={(e) => onFieldChange('motherName', e.target.value)}
                  required
                />
                {errors.motherName && <p className="text-sm text-red-600">{errors.motherName}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">প্রতিষ্ঠানের নাম *</label>
                <input
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.institution ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="স্কুল/কলেজ/প্রতিষ্ঠান"
                  value={form.institution}
                  onChange={(e) => onFieldChange('institution', e.target.value)}
                  required
                />
                {errors.institution && <p className="text-sm text-red-600">{errors.institution}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">ঠিকানা *</label>
                <textarea
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[120px] resize-none ${
                    errors.address ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="আপনার সম্পূর্ণ ঠিকানা"
                  value={form.address}
                  onChange={(e) => onFieldChange('address', e.target.value)}
                  required
                />
                <div className="flex justify-between items-center">
                  {errors.address ? (
                    <p className="text-sm text-red-600">{errors.address}</p>
                  ) : (
                    <p className="text-sm text-gray-500">অক্ষর: {form.address.length}/200</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={() => setActiveSection('contact')}
                className="px-8 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-all duration-200"
              >
                পরবর্তী
                <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className={`p-8 transition-all duration-300 ${activeSection === 'contact' ? 'block' : 'hidden'}`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">যোগাযোগ তথ্য</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">ইমেইল *</label>
                <input
                  type="email"
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => onFieldChange('email', e.target.value)}
                  required
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">ফোন নম্বর</label>
                <input
                  type="tel"
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  onChange={(e) => onFieldChange('phone', e.target.value)}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setActiveSection('personal')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                পূর্ববর্তী
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center ${
                  submitting ? 'bg-orange-400 text-white cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {submitting && (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                জমা দিন
              </button>
            </div>

            {status && (
              <p className={`mt-6 text-center ${statusColor}`}>{status}</p>
            )}
          </div>

        </form>

        <p className="text-xs text-gray-500 text-center mt-6">আপনার তথ্য আমাদের গোপনীয়তা নীতির আওতায় সুরক্ষিত থাকবে।</p>

      </div>
    </div>
  )
}