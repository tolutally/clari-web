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
        <Script id="apollo-form-enrichment" strategy="afterInteractive">
          {`(function initApolloInbound(){var TIMEOUT_MS=15000;var timeoutId;var style=document.createElement('style');style.id='apollo-form-prehide-css';style.textContent='form:has(input[type="email" i]),form:has(input[name="email" i]),.hs-form-iframe{position:relative!important}form:has(input[type="email" i])::before,form:has(input[name="email" i])::before,.hs-form-iframe::before{content:"";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;width:50px;height:50px;margin:auto;border:2.5px solid #e1e1e1;border-top:2.5px solid #9ea3a6;border-radius:50%;animation:spin 1s linear infinite;background-color:transparent;pointer-events:auto;z-index:999999;opacity:1}form:has(input[type="email" i]) *,form:has(input[name="email" i]) *,.hs-form-iframe *{opacity:0!important;user-select:none!important;pointer-events:none!important}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}';(document.head||document.documentElement).appendChild(style);function cleanup(){var styleEl=document.getElementById('apollo-form-prehide-css');if(styleEl)styleEl.remove();if(timeoutId)clearTimeout(timeoutId);}timeoutId=setTimeout(function(){console.warn('[Apollo] Form enrichment timeout after 15s - revealing forms.');cleanup();},TIMEOUT_MS);var nocache=Math.random().toString(36).substring(7);var script=document.createElement('script');script.src='https://assets.apollo.io/js/apollo-inbound.js?nocache='+nocache;script.defer=true;script.onerror=function(){console.error('[Apollo] Failed to load form enrichment script');cleanup();};script.onload=function(){try{window.ApolloInbound.formEnrichment.init({appId:'699497db61d844001d898413',onReady:function(){cleanup();},onError:function(err){console.error('[Apollo] Form enrichment init error:',err);cleanup();}});}catch(err){console.error('[Apollo] Error initializing form enrichment:',err);cleanup();}};document.head.appendChild(script);})();`}
        </Script>
      </body>
    </html>
  );
}
