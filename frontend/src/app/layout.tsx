import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PageWrapper } from "@/components/PageWrapper";
import Navbar from "@/components/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mono",
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
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans relative overflow-x-hidden okc-body">
        {/* Ambient background orbs — fixed, decorative */}
        <div className="ambient-orbs fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute rounded-full"
            style={{
              width: "700px",
              height: "700px",
              top: "-220px",
              left: "-180px",
              background: "radial-gradient(circle, rgba(240,165,0,0.055) 0%, transparent 68%)",
              animation: "orbitGlow 9s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "550px",
              height: "550px",
              bottom: "-120px",
              right: "-120px",
              background: "radial-gradient(circle, rgba(240,24,112,0.045) 0%, transparent 68%)",
              animation: "orbitGlow 11s ease-in-out infinite reverse",
            }}
          />
        </div>

        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-6 sm:pb-8 relative z-10">
              <PageWrapper>{children}</PageWrapper>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
