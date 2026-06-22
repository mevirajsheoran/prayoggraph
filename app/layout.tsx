import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrayogGraph — Virtual Physics Lab",
  description:
    "Real-time collaborative virtual physics laboratory for Indian classrooms. Deterministic circuit simulation built for Bharat.",
  keywords: [
    "physics",
    "virtual lab",
    "circuits",
    "NCERT",
    "education",
    "India",
    "real-time",
    "collaboration",
  ],
  authors: [{ name: "Viraj Sheoran" }],
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}