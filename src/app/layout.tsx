import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Marcel Mateos Salles · Software Engineer & ML Researcher";
const description =
  "Backend software engineer and ML researcher (Brown CS-Econ). Explore my experience and projects as an interactive neural network — probe the units, steer the features.";

/* machine-readable identity for search engines and AI answer engines
   (knowledge panels, citations) — rendered as JSON-LD in <head> */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Marcel Mateos Salles',
  alternateName: 'Marcel Matsal',
  url: 'https://www.marcelmatsal.com',
  image: 'https://www.marcelmatsal.com/marcel_pfp.JPEG',
  jobTitle: 'Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Pinterest',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Brown University',
    sameAs: 'https://www.brown.edu',
  },
  email: 'mailto:marcel_mateos_salles@alumni.brown.edu',
  sameAs: [
    'https://github.com/MarcelMatsal',
    'https://www.linkedin.com/in/marcelmatsal/',
    'https://scholar.google.com/citations?hl=en&user=7QmQOSgAAAAJ',
  ],
  knowsAbout: [
    'Machine learning',
    'Language model interpretability',
    'LoRA finetuning and spurious correlations',
    'Backend software engineering',
    'Deep learning',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marcelmatsal.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://www.marcelmatsal.com",
    siteName: "Marcel Mateos Salles",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HTK8GFW1R1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HTK8GFW1R1');
          `}
        </Script>
      </head>
      {/* browser extensions (Grammarly, PerkSpot, …) inject classes into
          <body> before hydration; suppress the resulting false-positive
          mismatch warning — this only applies one level deep */}
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AnalyticsTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
