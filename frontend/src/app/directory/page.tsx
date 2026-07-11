"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DirectoryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-500 font-mono text-xs flex items-center justify-center">
      Redirecting to Directory...
    </div>
  );
}
