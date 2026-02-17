'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Plus } from 'lucide-react';

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
      {/* Logo */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <Image src="/clarivue-logo-v1.png" alt="Clarivue logo" width={160} height={40} priority />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 lg:pt-12 lg:pb-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start min-h-[calc(100vh-4rem)]">
          {/* Left: Form */}
          <div className="flex justify-center lg:justify-start pt-8 lg:pt-16">
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
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
                />

                {/* Company */}
                <input
                  type="text"
                  name="company"
                  placeholder="Company name"
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
          </div>

          {/* Right: Floating UI Cards - matching reference layout */}
          <div className="hidden lg:flex flex-col items-center pt-4">
            <div className="relative w-full h-[700px]">

              {/* === Signal Flow Connectors === */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ zIndex: 2 }}
              >
                <defs>
                  <filter id="glowNormal" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="0.6" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glowRisk" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="0.8" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <linearGradient id="flowNormal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="flowDown" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="flowRisk" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ff686c" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/*
                  Card positions as % of container:
                  Engine:  left=52%, top=0%, right=100%, bottom=22%, left-center=(52,11)
                  Profile: left=0%, top=21%, right=42%, bottom=57%, right-center=(42,39)
                  Actions: left=2%, top=69%, right=44%, bottom=87%, top-center=(23,69)
                  Board:   left=46%, top=37%, right=100%, bottom=77%, top-center=(73,37), left-center=(46,57)
                */}

                {/* Flow 1: Engine left-center → Profile right-center */}
                <path
                  d="M 52 11 C 47 11, 42 22, 42 39"
                  stroke="url(#flowNormal)"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#glowNormal)"
                  className="signal-line"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeWidth: '2px' }}
                />
                <circle cx="52" cy="11" r="0.6" fill="white" opacity="0.9" filter="url(#glowNormal)" />

                {/* Flow 2: Engine bottom-center → Board top-center */}
                <path
                  d="M 76 22 C 76 28, 73 32, 73 37"
                  stroke="url(#flowDown)"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#glowNormal)"
                  className="signal-line"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeWidth: '2px' }}
                />
                <circle cx="76" cy="22" r="0.6" fill="white" opacity="0.9" filter="url(#glowNormal)" />

                {/* Flow 3: Profile bottom-center → Actions top-center */}
                <path
                  d="M 21 57 C 21 62, 23 65, 23 69"
                  stroke="url(#flowDown)"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#glowNormal)"
                  className="signal-line"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeWidth: '2px' }}
                />
                <circle cx="21" cy="57" r="0.6" fill="white" opacity="0.9" filter="url(#glowNormal)" />

                {/* Flow 4: Board internal — cohort rows → risk metrics (dashed risk) */}
                <path
                  d="M 73 66 C 73 69, 73 71, 73 73"
                  stroke="url(#flowRisk)"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="0.8 0.5"
                  filter="url(#glowRisk)"
                  className="signal-line-risk"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeWidth: '1.5px' }}
                />

                {/* Animated signal pulses */}
                <circle r="0.5" fill="white" opacity="0.95" filter="url(#glowNormal)">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 52 11 C 47 11, 42 22, 42 39" />
                </circle>
                <circle r="0.5" fill="white" opacity="0.95" filter="url(#glowNormal)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 76 22 C 76 28, 73 32, 73 37" begin="0.8s" />
                </circle>
                <circle r="0.5" fill="white" opacity="0.95" filter="url(#glowNormal)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path="M 21 57 C 21 62, 23 65, 23 69" begin="1.5s" />
                </circle>
                <circle r="0.4" fill="#ff686c" opacity="0.8" filter="url(#glowRisk)">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 73 66 C 73 69, 73 71, 73 73" begin="2s" />
                </circle>
              </svg>

              {/* Card 1: Interview Readiness Engine - top right */}
              <div className="absolute top-0 right-0 bg-white rounded-xl shadow-lg p-5 w-[240px] z-10 animate-[fadeSlideDown_0.6s_ease-out_0.2s_both,breathe_4s_ease-in-out_1s_infinite]">
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

              {/* Card 2: Student Profile - left middle */}
              <div className="absolute top-[150px] left-0 bg-white rounded-xl shadow-lg p-4 w-[210px] z-10 animate-[fadeSlideRight_0.6s_ease-out_0.5s_both,breathe_4s_ease-in-out_1.5s_infinite]">
                <div className="flex flex-col items-center text-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#1a5276] rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">DT</span>
                  </div>
                  <p className="font-semibold text-[#003366] text-sm">Daniel Thompson</p>
                  <span className="px-2 py-0.5 bg-blue-50 text-[#003366] text-[10px] font-medium rounded-full mt-1">Software Engineering</span>
                </div>
                <div className="flex justify-center mb-3">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg">Interview Score: 72</span>
                </div>
                <div className="space-y-1.5 text-left">
                  <p className="text-[10px] text-gray-500">Role Target: <span className="text-[#003366] font-medium">Backend Developer</span></p>
                  <p className="text-[10px] text-gray-500">Last Simulation: <span className="text-[#003366] font-medium">System Design Round</span></p>
                  <p className="text-[10px] text-gray-500">Confidence Gap: <span className="text-[#ff686c] font-medium">Behavioral Storytelling</span></p>
                </div>
              </div>

              {/* Card 3: Readiness Actions - bottom left */}
              <div className="absolute top-[480px] left-[10px] bg-white rounded-xl shadow-lg p-4 w-[210px] z-10 animate-[fadeSlideUp_0.6s_ease-out_0.8s_both,breathe_4s_ease-in-out_2s_infinite]">
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

              {/* Card 4: Cohort Performance Board - right lower */}
              <div className="absolute top-[260px] right-0 bg-white rounded-xl shadow-lg p-5 w-[270px] z-10 animate-[fadeSlideLeft_0.6s_ease-out_1.1s_both,breathe_4s_ease-in-out_2.5s_infinite]">
                <h4 className="font-bold text-[#003366] text-sm mb-4">Cohort Performance Board</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-[10px] font-semibold text-green-700">VP</div>
                      <div>
                        <p className="text-xs text-gray-800 font-medium">Vikram Patel</p>
                        <p className="text-[10px] text-gray-400">Score: 84</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">Verified Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-[10px] font-semibold text-amber-700">ZW</div>
                      <div>
                        <p className="text-xs text-gray-800 font-medium">Zhang Wei</p>
                        <p className="text-[10px] text-gray-400">Score: 63</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full">At Risk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-[10px] font-semibold text-red-700">LC</div>
                      <div>
                        <p className="text-xs text-gray-800 font-medium">Luciana Correia</p>
                        <p className="text-[10px] text-gray-400">Score: 48</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded-full">High Risk</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
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

            {/* Signal tagline below cards */}
            <div className="w-full mt-12 text-center">
              <p className="text-xs text-[#003366]/60 font-medium">Signal before employer exposure. Performance, not activity.</p>
            </div>
          </div>
        </div>

        {/* Mobile: Signal tagline */}
        <div className="lg:hidden mt-8">
          <p className="text-center text-xs text-[#003366]/60 font-medium">Signal before employer exposure. Performance, not activity.</p>
        </div>
      </div>
    </div>
  );
}

