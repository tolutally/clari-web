import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clarivue · AI Engine for Training-to-Employment Outcomes",
  description:
    "Run the work between training and a job - automatically. Resumes, mock interviews, advisor follow-ups, funder reports. More placements per cohort, no extra hiring.",
  icons: {
    icon: [
      { url: "/clarivue-favicon/favicon.ico", sizes: "any" },
      { url: "/clarivue-favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/clarivue-favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/clarivue-favicon/apple-touch-icon.png",
  },
  manifest: "/clarivue-favicon/site.webmanifest",
  openGraph: {
    title: "Clarivue · AI Engine for Training-to-Employment Outcomes",
    description:
      "Run the work between training and a job - automatically. Resumes, mock interviews, advisor follow-ups, funder reports. More placements per cohort, no extra hiring.",
    type: "website",
    siteName: "Clarivue",
    url: "https://clarivue.io",
    images: [
      {
        url: "https://clarivue.io/og-hero.png",
        width: 1200,
        height: 630,
        alt: "Clarivue dashboard — AI Engine for Training-to-Employment Outcomes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clarivue · AI Engine for Training-to-Employment Outcomes",
    description:
      "Run the work between training and a job - automatically. Resumes, mock interviews, advisor follow-ups, funder reports. More placements per cohort, no extra hiring.",
    images: ["https://clarivue.io/og-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-H1Z0Q4C2HG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-H1Z0Q4C2HG');
          `}
        </Script>
      </head>
      <body className={`${jakarta.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
