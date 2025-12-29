import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const sections = [
  {
    title: "Purpose",
    body: [
      "To inform users of: what personal data we collect, how we use it, who can access it, your rights, and our cookie policy.",
      "This policy applies in addition to our site terms and conditions.",
    ],
  },
  {
    title: "Consent",
    body: [
      "By using https://www.clarivue.io/ you agree to this Privacy Policy and to our collection, use, and retention of the data listed here.",
    ],
  },
  {
    title: "Personal Data We Collect",
    body: [
      "We only collect data that helps us achieve the purpose set out in this Privacy Policy. We will not collect additional data without notifying you first.",
    ],
    listTitle: "Data collected automatically",
    list: ["IP address", "Location", "Hardware and software details", "Clicked links", "Content viewed"],
    listTitle2: "Data collected in a non-automatic way",
    list2: [
      "First and last name",
      "Age / Date of birth / Sex",
      "Email address / Phone number / Address",
      "Payment information",
      "Auto fill data",
    ],
    note: "Collected via actions such as creating an account.",
  },
  {
    title: "How We Use Personal Data",
    listTitle: "Automatically collected",
    list: ["Statistics"],
    listTitle2: "Collected through user actions",
    list2: ["Communication"],
  },
  {
    title: "Who We Share Personal Data With",
    listTitle: "Employees",
    list: ["Shared only with team members who reasonably need access to achieve the purposes set out here."],
    listTitle2: "Other disclosures",
    list2: [
      "If the law requires it",
      "If required for legal proceedings",
      "To prove or protect our legal rights",
      "To buyers or potential buyers of this company",
    ],
    note: "If you follow hyperlinks to another site, we are not responsible for their privacy policies or practices.",
  },
  {
    title: "How Long We Store Personal Data",
    body: ["Data is stored until the purpose it was collected for has been achieved. You will be notified if data is kept longer."],
  },
  {
    title: "How We Protect Your Personal Data",
    body: [
      "We use strong browser encryption and secure facilities. Access is limited to employees under strict confidentiality agreements.",
      "No system is perfectly secure; reasonable precautions are taken but absolute security cannot be guaranteed.",
    ],
  },
  {
    title: "Children",
    body: [
      "We do not knowingly collect personal data from children under 13. If we learn we have, it will be deleted as soon as possible.",
      "Parents/guardians may contact our privacy officer if a child under 13 has provided personal data.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "Contact us to access, modify, delete, or challenge the data collected, learn how it is used, or who it has been disclosed to.",
    ],
  },
  {
    title: "Cookie Policy",
    body: [
      "A cookie is a small file stored on a user’s hard drive to collect browsing data.",
      "We do not use cookies on our Site. You may disable cookies in your browser, which may affect your experience.",
    ],
  },
  {
    title: "Modifications",
    body: [
      "We may amend this Privacy Policy to remain compliant with the law or reflect changes in our data collection process.",
      'When amended, we will update the "Effective Date" and, if necessary, notify users by email. Please review periodically.',
    ],
  },
  {
    title: "Contact Information",
    body: [
      "Privacy officer: Ornella Zambo",
      "Email: privacy@clarivue.io",
      "SkillConnect Technologies Inc., 1717 Barrington St Floors 3-4, Halifax, NS B3J 2A4, Canada",
    ],
  },
];

export default function PrivacyPage() {
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
              <p className="text-xs font-semibold tracking-[0.18em] text-[#ff686c] uppercase">Privacy Policy</p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#003366]">Clarivue Privacy Policy</h1>
              <p className="text-sm text-[#003366]/70">Effective date: 1 September 2025</p>
              <div className="text-sm text-[#003366]/80 space-y-1">
                <p>Site: https://www.clarivue.io/</p>
                <p>Owner/operator: SkillConnect Technologies Inc.</p>
                <p>Contact: legal@clarivue.io</p>
                <p>Address: 1717 Barrington St Floors 3-4, Halifax, NS B3J 2A4, Canada</p>
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
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[#003366]">{section.listTitle}</p>
                      <ul className="list-disc list-inside text-sm text-[#003366]/75 space-y-1">
                        {section.list?.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {section.listTitle2 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[#003366]">{section.listTitle2}</p>
                      <ul className="list-disc list-inside text-sm text-[#003366]/75 space-y-1">
                        {section.list2?.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {section.note && <p className="text-xs text-[#003366]/60">{section.note}</p>}
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
