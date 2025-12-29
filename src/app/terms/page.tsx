import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing and using Clarivue, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
    ],
  },
  {
    title: "2. Description of Service",
    body: [
      "Clarivue is an AI-powered interview analytics platform that helps organizations measure and improve employability outcomes through structured interview assessment and coaching tools.",
    ],
  },
  {
    title: "3. User Accounts",
    body: [
      "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.",
      "You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
    ],
  },
  {
    title: "4. Acceptable Use",
    body: [
      "You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:",
    ],
    list: [
      "In any way that violates any applicable federal, state, local, or international law or regulation",
      "To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service",
      "To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity",
      "To engage in any other conduct that we deem harmful to users of the Service or to us",
    ],
  },
  {
    title: "5. User Content",
    body: [
      'Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.',
      "By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.",
    ],
  },
  {
    title: "6. Privacy Policy",
    body: [
      "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.",
    ],
  },
  {
    title: "7. Intellectual Property Rights",
    body: [
      "The Service and its original content, features, and functionality are and will remain the exclusive property of SkillConnect Technologies Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.",
    ],
  },
  {
    title: "8. Termination",
    body: [
      "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
      "Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.",
    ],
  },
  {
    title: "9. Disclaimer",
    body: ["The information on this Service is provided on an \"as is\" basis."],
    listTitle: "To the fullest extent permitted by law, this Company:",
    list: [
      "Excludes all representations and warranties relating to this Service and its contents",
      "Does not warrant that the Service will be constantly available, or available at all",
      "Makes no warranties about the accuracy or completeness of this Service's content",
    ],
  },
  {
    title: "10. Limitation of Liability",
    body: [
      "In no event shall SkillConnect Technologies Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.",
    ],
  },
  {
    title: "11. Governing Law",
    body: [
      "These Terms shall be interpreted and governed by the laws of Nova Scotia, Canada, without regard to its conflict of law provisions.",
    ],
  },
  {
    title: "12. Changes to Terms",
    body: [
      "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.",
    ],
  },
  {
    title: "13. Contact Information",
    body: [
      "If you have any questions about these Terms of Service, please contact us at:",
      "SkillConnect Technologies Inc.",
      "1717 Barrington St Floors 3-4, Halifax, NS B3J 2A4, Canada",
      "Email: legal@clarivue.io (legal matters)",
      "General inquiries: hello@clarivue.io",
    ],
  },
  {
    title: "14. Severability",
    body: [
      "If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.",
    ],
  },
  {
    title: "15. Waiver",
    body: [
      "Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Terms shall not effect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.",
    ],
  },
  {
    title: "16. Acknowledgment",
    body: [
      "By using this Service, you acknowledge that you have read these Terms of Service and agree to be bound by them.",
    ],
  },
  {
    title: "17. Entire Agreement",
    body: [
      "These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="bg-white/80 backdrop-blur-md">
        <Header />
      </div>

      <main className="flex-grow max-w-5xl mx-auto px-6 py-16">
        <div className="rounded-3xl border border-[#003366]/10 bg-white/85 shadow-xl shadow-blue-900/5 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -left-16 -top-16 h-48 w-48 bg-[#b8ccf4]/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-56 w-56 bg-[#ff686c]/20 blur-3xl" />
          <div className="relative space-y-6">
            <div className="space-y-4 pb-6 border-b border-[#003366]/10">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#ff686c] uppercase">Terms of Service</p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#003366]">Clarivue Terms of Service</h1>
              <div className="text-sm text-[#003366]/70 space-y-2">
                <p>Please read these terms carefully before using our platform and services.</p>
                <p>Last updated: September 24, 2025</p>
                <p>Clarivue Intelligence is developed and published by SkillConnect Technologies Inc.</p>
              </div>
              <div className="text-sm text-[#003366]/80 space-y-2">
                <p>
                  Welcome to Clarivue. These Terms of Service ("Terms") govern your use of the Clarivue platform, website, applications, and
                  services (collectively, the "Service") operated by SkillConnect Technologies Inc. ("SkillConnect", "we", "us", "our").
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then
                  you may not access the Service.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#003366]/10">
              {sections.map((section) => (
                <section key={section.title} className="py-6 first:pt-0 last:pb-0 space-y-3">
                  <h2 className="text-xl font-semibold text-[#003366]">{section.title}</h2>
                  {section.body && (
                    <div className="space-y-2">
                      {section.body.map((p, idx) => (
                        <p key={idx} className="text-sm text-[#003366]/75 leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  )}
                  {section.listTitle && (
                    <p className="text-sm font-semibold text-[#003366]">{section.listTitle}</p>
                  )}
                  {section.list && (
                    <ul className="list-disc list-inside text-sm text-[#003366]/75 space-y-1">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
