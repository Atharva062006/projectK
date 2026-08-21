import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PageWrapper } from "@/components/PageWrapper";
import Navbar from "@/components/Navbar";

// Using Geist — clean, modern, pairs well with LG's design language
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Project K — OKC Talent Portal",
  description:
    "Official Oyster Kode Club member portfolio showcase — discover verified talent, download resumes, and explore engineering projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        style={{
          fontFamily: "var(--font-geist), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          minHeight: "100vh",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            {/* Top ambient glow & dot grid — edge-to-edge behind floating navbar */}
            <div className="top-ambient-glow" aria-hidden="true" />
            <div className="top-dot-grid" aria-hidden="true" />

            <Navbar />
            <div
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "8px 24px 48px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <PageWrapper>{children}</PageWrapper>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
