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
  title: "Clarivue | AI infrastructure for workforce and employment training programs",
  description:
    "More placements, less admin, and reports that attract funding. AI-powered resume fixing, mock interviews, voice check-ins, case management, and session capture - built for programs that want to move more people from training into jobs.",
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
    title: "Clarivue | AI infrastructure for workforce and employment training programs",
    description:
      "More placements, less admin, and reports that attract funding. AI-powered resume fixing, mock interviews, voice check-ins, case management, and session capture - built for programs that want to move more people from training into jobs.",
    type: "website",
    siteName: "Clarivue",
    url: "https://clarivue.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clarivue | AI infrastructure for workforce and employment training programs",
    description:
      "More placements, less admin, and reports that attract funding. AI-powered resume fixing, mock interviews, voice check-ins, case management, and session capture - built for programs that want to move more people from training into jobs.",
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
          src="https://www.googletagmanager.com/gtag/js?id=G-2GZ1QZRDF3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-2GZ1QZRDF3');
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
