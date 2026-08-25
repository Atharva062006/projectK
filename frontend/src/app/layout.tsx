import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PageWrapper } from "@/components/PageWrapper";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Project K — OKC Talent Portal",
  description:
    "Official Oyster Kode Club member portfolio showcase — discover verified talent, download resumes, and explore engineering projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          minHeight: "100vh",
          backgroundColor: "#f5f5f7",
          color: "#1d1d1f",
          position: "relative",
          overflowX: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main style={{ minHeight: "calc(100vh - 44px)" }}>
              <PageWrapper>{children}</PageWrapper>
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
