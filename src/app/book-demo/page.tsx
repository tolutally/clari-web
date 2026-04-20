'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Plus } from 'lucide-react';
import { ApolloScripts } from '@/components/ApolloScripts';

/* ── Blocked email domains (mirrors server-side list) ── */
const BLOCKED_DOMAINS = new Set([
  "gmail.com","googlemail.com","yahoo.com","yahoo.co.uk","yahoo.ca",
  "hotmail.com","hotmail.co.uk","outlook.com","outlook.co.uk",
  "live.com","live.co.uk","msn.com","aol.com","icloud.com","me.com",
  "mac.com","mail.com","email.com","usa.com","protonmail.com",
  "proton.me","zoho.com","yandex.com","gmx.com","gmx.net",
  "fastmail.com","tutanota.com","tuta.io","hushmail.com",
  "qq.com","163.com","126.com","sina.com","naver.com",
  "rediffmail.com","web.de","t-online.de","libero.it",
  "laposte.net","free.fr","wanadoo.fr","orange.fr",
  "mailinator.com","guerrillamail.com","tempmail.com","throwaway.email",
  "yopmail.com","sharklasers.com","guerrillamailblock.com",
  "grr.la","dispostable.com","trashmail.com","10minutemail.com",
  "temp-mail.org","fakeinbox.com","mailnesia.com","maildrop.cc",
  "getnada.com","emailondeck.com",
]);

function isInstitutionalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !BLOCKED_DOMAINS.has(domain);
}

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    comment: '',
  });
  const [showComment, setShowComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [emailError, setEmailError] = useState('');
  const formLoadedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setEmailError('');

    // Client-side institutional email check
    const trimmedEmail = formData.email.trim().toLowerCase();
    if (!isInstitutionalEmail(trimmedEmail)) {
      setEmailError('Please use your institutional or work email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _ts: formLoadedAt.current, // timestamp for bot detection
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      setSubmitted(true);
    } catch (err: any) {
      setFormError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0f2f1] via-[#b2dfdb] to-[#80cbc4] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#003366] mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-6">
            We've received your demo request. Our team will reach out to you within 24 hours.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#003366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#003366]/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #d4eaf7 0%, #b8d4ec 25%, #a8cce0 50%, #9ac5d8 75%, #8cbfcf 100%)' }}>
      <ApolloScripts />
      {/* Logo */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <Image src="/clarivue-logo-v1.png" alt="Clarivue logo" width={160} height={40} priority />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 lg:pt-12 lg:pb-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start min-h-[calc(100vh-4rem)]">
          {/* Left: Form */}
          <div className="flex flex-col items-center lg:items-start pt-8 lg:pt-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h1 className="text-3xl font-bold text-[#003366] mb-6">Get a demo</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name *"
                      required
                      maxLength={100}
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name *"
                      required
                      maxLength={100}
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Work email address *"
                    required
                    maxLength={254}
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      setEmailError('');
                      setFormError('');
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all ${
                      emailError ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-red-600 mt-1">{emailError}</p>
                  )}
                </div>

                {/* Phone */}
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  maxLength={30}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
                />

                {/* Company */}
                <input
                  type="text"
                  name="company"
                  placeholder="Company name"
                  maxLength={200}
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
                />

                {/* Add Comment Toggle */}
                <button
                  type="button"
                  onClick={() => setShowComment(!showComment)}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#003366] transition-colors"
                >
                  <Plus className={`w-4 h-4 transition-transform ${showComment ? 'rotate-45' : ''}`} />
                  <span className="text-sm">Add a comment</span>
                </button>

                {/* Comment Field */}
                {showComment && (
                  <textarea
                    name="comment"
                    placeholder="Tell us about your needs..."
                    value={formData.comment}
                    onChange={handleChange}
                    rows={3}
                    maxLength={2000}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all resize-none"
                  />
                )}

                {/* Honeypot — hidden from humans, bots fill it */}
                <input
                  type="text"
                  name="_hp"
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
                  value=""
                  onChange={() => {}}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#003366] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003366]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>

                {formError && (
                  <p className="text-xs text-red-600">{formError}</p>
                )}

                {/* Privacy Notice */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  We care about your privacy. By submitting this form, you will receive the requested 
                  information, as well as occasional related business insights from Clarivue. You can 
                  unsubscribe at any time. For details, view our{' '}
                  <Link href="/privacy" className="underline hover:text-[#003366]">
                    Privacy Policy
                  </Link>.
                </p>
              </form>
            </div>

            {/* Brand partner strip */}
            <div className="hidden lg:block w-full max-w-md mt-6">
              <p className="text-center text-[10px] uppercase tracking-widest text-[#003366]/40 font-semibold mb-4">Backed by</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <Image src="/partners/Volta-Logo.png" alt="Volta" width={80} height={32} className="object-contain h-8 w-auto" />
                <Image src="/partners/Invest-Nova-Scotia-Logo.png" alt="Invest Nova Scotia" width={100} height={32} className="object-contain h-8 w-auto" />
                <Image src="/partners/tribe_logo.png" alt="Tribe" width={80} height={32} className="object-contain h-8 w-auto" />
              </div>
            </div>
          </div>

          {/* Right: Photo frame with floating UI cards */}
          <div className="hidden lg:flex flex-col items-center pt-4">
            <div className="relative w-full h-[700px]">

              {/* Center photo frame */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[504px] h-[380px] z-[5]">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/60 ring-1 ring-[#003366]/10">
                  <Image
                    src="/hero-image-3.png"
                    alt="Career advisors using Clarivue"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Card 1: Interview Readiness Engine - top right */}
              <div className="absolute top-0 right-0 bg-white rounded-xl shadow-lg p-5 w-[220px] z-10 animate-[fadeSlideDown_0.6s_ease-out_0.2s_both,breathe_4s_ease-in-out_1s_infinite]">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-[#003366] text-sm">Interview Readiness Engine</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">Live Scoring</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Cohort Size</span>
                    <span className="text-sm text-[#003366] font-semibold">120</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Verified Ready</span>
                    <span className="text-sm text-green-600 font-semibold">68</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">At Risk</span>
                    <span className="text-sm text-amber-500 font-semibold">32</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Critical</span>
                    <span className="text-sm text-red-500 font-semibold">20</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Student Profile - left */}
              <div className="absolute top-[110px] left-[-10%] bg-white rounded-xl shadow-lg p-4 w-[200px] z-10 animate-[fadeSlideRight_0.6s_ease-out_0.5s_both,breathe_4s_ease-in-out_1.5s_infinite]">
                <div className="flex flex-col items-center text-center mb-2">
                  <Image src="/avatars/avatar-1.jpg" alt="Daniel Thompson" width={40} height={40} className="w-10 h-10 rounded-full object-cover mb-2" />
                  <p className="font-semibold text-[#003366] text-sm">Daniel Thompson</p>
                  <span className="px-2 py-0.5 bg-blue-50 text-[#003366] text-[10px] font-medium rounded-full mt-1">Software Engineering</span>
                </div>
                <div className="flex justify-center mb-2">
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-lg">Interview Score: 72</span>
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-[10px] text-gray-500">Role: <span className="text-[#003366] font-medium">Backend Developer</span></p>
                  <p className="text-[10px] text-gray-500">Gap: <span className="text-[#ff686c] font-medium">Behavioral Storytelling</span></p>
                </div>
              </div>

              {/* Card 3: Readiness Actions - bottom left */}
              <div className="absolute bottom-[40px] left-0 bg-white rounded-xl shadow-lg p-4 w-[200px] z-10 animate-[fadeSlideUp_0.6s_ease-out_0.8s_both,breathe_4s_ease-in-out_2s_infinite]">
                <p className="text-xs font-bold text-[#003366] mb-3">Readiness Actions</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-700">Run Role-Specific Mock</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-700">Identify Breakdown Pattern</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-700">Assign Targeted Remediation</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Cohort Performance Board - bottom right */}
              <div className="absolute bottom-[20px] right-0 bg-white rounded-xl shadow-lg p-4 w-[240px] z-10 animate-[fadeSlideLeft_0.6s_ease-out_1.1s_both,breathe_4s_ease-in-out_2.5s_infinite]">
                <h4 className="font-bold text-[#003366] text-sm mb-3">Cohort Performance Board</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/avatars/avatar-2.jpg" alt="Vikram Patel" width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs text-gray-800 font-medium">Vikram Patel</p>
                        <p className="text-[10px] text-gray-400">Score: 84</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-semibold rounded-full">Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/avatars/avatar-3.jpg" alt="Zhang Wei" width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs text-gray-800 font-medium">Zhang Wei</p>
                        <p className="text-[10px] text-gray-400">Score: 63</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-semibold rounded-full">At Risk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/avatars/avatar-4.jpg" alt="Luciana Correia" width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs text-gray-800 font-medium">Luciana Correia</p>
                        <p className="text-[10px] text-gray-400">Score: 48</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-semibold rounded-full">High Risk</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Conversion Risk</span>
                    <span className="text-xs text-red-500 font-bold">27%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Est. Outcome Leakage</span>
                    <span className="text-xs text-red-500 font-bold">$184,000</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile: Brand partner strip */}
        <div className="lg:hidden mt-8">
          <p className="text-center text-[10px] uppercase tracking-widest text-[#003366]/40 font-semibold mb-3">Backed by</p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <Image src="/partners/Volta-Logo.png" alt="Volta" width={64} height={24} className="object-contain h-6 w-auto" />
            <Image src="/partners/Invest-Nova-Scotia-Logo.png" alt="Invest Nova Scotia" width={80} height={24} className="object-contain h-6 w-auto" />
            <Image src="/partners/tribe_logo.png" alt="Tribe" width={64} height={24} className="object-contain h-6 w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

