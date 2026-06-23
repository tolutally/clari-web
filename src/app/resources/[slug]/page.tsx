import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import WorkbookForm from "./WorkbookForm";
import DownloadButton from "./DownloadButton";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

// ── Report data ──────────────────────────────────────────────────────────────
type ReportSlug = "hiring-managers-report";

const reports: Record<ReportSlug, {
  title: string;
  subtitle: string;
  metaDescription: string;
  eyebrow: string;
  date: string;
  readTime: string;
  pdfPath: string;
  pdfFilename: string;
  workbookCoverPath: string;
  heroCoverPath: string;
  whatIsInside: string[];
  previewImages: { src: string; alt: string }[];
}> = {
  "hiring-managers-report": {
    title: "What Hiring Managers Notice First",
    subtitle: "104 interviewers on the signals that decide interviews before resumes do.",
    metaDescription:
      "New Clarivue research reveals the six signals hiring managers screen for in the first few minutes — and how career advisors can coach them systematically.",
    eyebrow: "Free research report",
    date: "June 2026",
    readTime: "12 min read",
    pdfPath: "/reports/clarivue-report.pdf",
    pdfFilename: "Clarivue-What-Hiring-Managers-Notice-First.pdf",
    workbookCoverPath: "/reports/previews/workbook-img.jpg",
    heroCoverPath: "/reports/previews/report-cover.jpg",
    whatIsInside: [
      "The six signals hiring managers screen for in the first few minutes — and why they decide interviews before resumes do.",
      "How to coach each signal — ownership, listening, composure, preparation, communication, and presence — without adding advisor headcount.",
      "Observable, repeatable readiness cues your team can put to work in mock interviews and prep sessions today.",
    ],
    previewImages: [
      {
        src: "/reports/previews/foreword-cropd.png",
        alt: "Foreword by Tolu Towoju, Founder of Clarivue",
      },
      {
        src: "/reports/previews/pattern-cropd.png",
        alt: "The Pattern — we expected 104 answers, we got six",
      },
      {
        src: "/reports/previews/signal-cropd.png",
        alt: "What 104 hiring managers are actually screening for",
      },
    ],
  },
};

function isKnownSlug(slug: string): slug is ReportSlug {
  return slug in reports;
}

// ── Metadata ─────────────────────────────────────────────────────────────────
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (Object.keys(reports) as ReportSlug[]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isKnownSlug(slug)) return {};
  const r = reports[slug];
  return {
    title: `${r.title} · Clarivue`,
    description: r.metaDescription,
    alternates: { canonical: `https://clarivue.io/resources/${slug}` },
    openGraph: {
      title: r.title,
      description: r.metaDescription,
      type: "article",
      siteName: "Clarivue",
      url: `https://clarivue.io/resources/${slug}`,
    },
    twitter: { card: "summary_large_image", title: r.title, description: r.metaDescription },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  if (!isKnownSlug(slug)) notFound();
  const r = reports[slug];

  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const linkedinPartnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

  return (
    <div
      className={`${lora.variable} ${dmSans.variable}`}
      style={{
        fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
        color: "#1F2D5C",
        fontSize: 18,
        lineHeight: 1.7,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── Tracking: Meta Pixel ── */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'ViewContent', { content_name: '${r.title}' });
          `}
        </Script>
      )}

      {/* ── Tracking: LinkedIn Insight Tag ── */}
      {linkedinPartnerId && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "${linkedinPartnerId}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];
            var b=document.createElement("script");b.type="text/javascript";b.async=true;
            b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b,s)})(window.lintrk);
          `}
        </Script>
      )}

      {/* ── Faint grid overlay (matches rest of site) ── */}
      <div
        className="bg-grid"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.4,
          backgroundImage:
            "linear-gradient(rgba(0,51,102,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,51,102,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Header ── */}
      <Header />

      {/* ── Main content ── */}
      <main style={{ paddingTop: 56, position: "relative", zIndex: 1 }}>
        {/* ── Breadcrumb ── */}
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>
          <nav
            aria-label="Breadcrumb"
            style={{
              fontSize: 13,
              color: "#5B7393",
              letterSpacing: "0.01em",
              marginBottom: 36,
            }}
          >
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <Link href="/resources" style={{ textDecoration: "none", color: "inherit" }}>
              Resources
            </Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <span style={{ color: "#1F2D5C" }}>{r.title}</span>
          </nav>
        </div>

        {/* ── Report hero (cover left, download CTA right) ── */}
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "65fr 35fr",
              gap: 52,
              alignItems: "center",
              margin: "8px 0 80px",
            }}
            className="report-hero-grid"
          >
            {/* Left: eyebrow + cover card */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#ff686c",
                }}
              >
                {r.eyebrow}
              </div>
              <div style={{ position: "relative", aspectRatio: "620 / 563", borderRadius: 10, overflow: "hidden" }}>
                <Image
                  src={r.heroCoverPath}
                  alt={r.title}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  priority
                />
              </div>
            </div>

            {/* Right: free download */}
            <div>
              <section aria-label="Download the report">
                <h2
                  style={{
                    fontFamily: "var(--font-lora, serif)",
                    fontWeight: 600,
                    fontSize: "1.45rem",
                    margin: "0 0 18px",
                    color: "#1F2D5C",
                  }}
                >
                  Read the full report
                </h2>
                <DownloadButton href={r.pdfPath} filename={r.pdfFilename} />
                <p
                  style={{
                    marginTop: 16,
                    fontSize: 14,
                    color: "#5B7393",
                  }}
                >
                  No email required. No sign-up. Just the report.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* ── What's inside ── */}
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>
          <section
            aria-label="What's inside"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
              padding: "24px 0 8px",
            }}
            className="whats-inside-grid"
          >
            {/* Left: bullets */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-lora, serif)",
                  fontWeight: 600,
                  fontSize: "clamp(2.1rem, 4.4vw, 3rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.05,
                  margin: 0,
                  color: "#1F2D5C",
                }}
              >
                What&apos;s inside
              </h2>
              <ul
                style={{
                  listStyle: "none",
                  margin: "30px 0 0",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {r.whatIsInside.map((item, i) => (
                  <li
                    key={i}
                    style={{ display: "flex", gap: 14, fontSize: "1.0625rem", lineHeight: 1.5 }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff686c"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, width: 22, height: 22, marginTop: 2 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: landscape card composition */}
            <div style={{ position: "relative", aspectRatio: "1 / 0.94" }}>

              {/* p-back — top-right: signals page */}
              <div
                style={{
                  position: "absolute",
                  width: "74%",
                  aspectRatio: "3 / 2",
                  top: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "-6px 8px 24px -16px rgba(31,45,92,0.4)",
                }}
              >
                <Image
                  src={r.previewImages[2].src}
                  alt={r.previewImages[2].alt}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
              </div>

              {/* p-mid — centre: pattern page */}
              <div
                style={{
                  position: "absolute",
                  width: "74%",
                  aspectRatio: "3 / 2",
                  top: "26%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "-6px 8px 24px -16px rgba(31,45,92,0.4)",
                }}
              >
                <Image
                  src={r.previewImages[1].src}
                  alt={r.previewImages[1].alt}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
              </div>

              {/* front — bottom-left: foreword page */}
              <div
                style={{
                  position: "absolute",
                  width: "74%",
                  aspectRatio: "3 / 2",
                  bottom: 0,
                  left: 0,
                  zIndex: 3,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 8px 32px rgba(31,45,92,0.25)",
                }}
              >
                <Image
                  src={r.previewImages[0].src}
                  alt={r.previewImages[0].alt}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                  priority
                />
              </div>

            </div>{/* /grid item */}
          </section>
        </div>

        {/* ── Gated workbook card ── */}
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <section
              aria-labelledby="wb-title"
              style={{
                margin: "56px auto 64px",
                background: "#ece4f7",
                border: "1px solid rgba(31,45,92,0.10)",
                borderRadius: 18,
                padding: 40,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "168px 1fr",
                  gap: 32,
                  alignItems: "start",
                }}
                className="workbook-grid"
              >
                {/* Workbook cover */}
                <Image
                  src={r.workbookCoverPath}
                  alt="Companion workbook cover — What Hiring Managers Notice First"
                  width={168}
                  height={218}
                  style={{
                    width: 168,
                    height: "auto",
                    borderRadius: 8,
                    border: "1px solid rgba(31,45,92,0.14)",
                    display: "block",
                  }}
                />

                {/* Form side */}
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      color: "#5B7393",
                      marginBottom: 12,
                    }}
                  >
                    Optional · Email required
                  </div>
                  <h2
                    id="wb-title"
                    style={{
                      fontFamily: "var(--font-lora, serif)",
                      fontWeight: 600,
                      fontSize: "1.7rem",
                      lineHeight: 1.15,
                      margin: "0 0 12px",
                      color: "#1F2D5C",
                    }}
                  >
                    Want the companion workbook?
                  </h2>
                  <p
                    style={{
                      fontSize: "1.05rem",
                      lineHeight: 1.6,
                      color: "#1F2D5C",
                      margin: "0 0 24px",
                      maxWidth: "56ch",
                    }}
                  >
                    The advisor&apos;s question bank — questions for all six themes — a printable
                    readiness scorecard, and the complete 104-quote dataset. Enter your email and
                    we&apos;ll send it over.
                  </p>
                  <WorkbookForm />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Responsive overrides ── */}
      <style>{`
        @media (max-width: 760px) {
          .report-hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .whats-inside-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 600px) {
          .workbook-grid { grid-template-columns: 1fr !important; gap: 22px !important; justify-items: center; }
        }
      `}</style>
    </div>
  );
}
