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
  title: "Interview Readiness Platform for Career Centers | Clarivue",
  description:
    "Stop guessing interview readiness. Clarivue helps institutions track performance, reduce remediation, and strengthen employer confidence.",
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
    title: "Interview Readiness Platform for Career Centers | Clarivue",
    description:
      "Stop guessing interview readiness. Clarivue helps institutions track performance, reduce remediation, and strengthen employer confidence.",
    type: "website",
    siteName: "Clarivue",
    url: "https://clarivue.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Readiness Platform for Career Centers | Clarivue",
    description:
      "Stop guessing interview readiness. Clarivue helps institutions track performance, reduce remediation, and strengthen employer confidence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} antialiased`}>
        {children}
        <Analytics />
        <Script id="apollo-tracker" strategy="afterInteractive">
          {`(function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;o.async=!0;o.defer=!0;o.onload=function(){window.trackingFunctions.onLoad({appId:"66e07159271247019bd8555a"})};document.head.appendChild(o)})();`}
        </Script>
      </body>
    </html>
  );
}
