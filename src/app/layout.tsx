import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prep and Nail Interviews at Scale | Clarivue",
  description:
    "Prep learners for real interviews at scale with AI-driven mock interviews, actionable coaching, readiness analytics, and proven improvements in placement performance.",
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
    title: "Prep and Nail Interviews at Scale | Clarivue",
    description:
      "Prep learners for real interviews at scale with AI-driven mock interviews, actionable coaching, readiness analytics, and proven improvements in placement performance.",
    type: "website",
    siteName: "Clarivue",
    url: "https://clarivue.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prep and Nail Interviews at Scale | Clarivue",
    description:
      "Prep learners for real interviews at scale with AI-driven mock interviews, actionable coaching, readiness analytics, and proven improvements in placement performance.",
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
      </body>
    </html>
  );
}
