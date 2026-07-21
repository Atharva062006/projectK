import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "ProjectK - Member Portfolio Showcase",
  description: "Bento-style member portfolio showcase portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="bg-[#090a0f] text-gray-100 min-h-screen font-[family-name:var(--font-roboto)]">
        <AuthProvider>
          <Navbar />
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
