"use client";
import { Banner, Variant as BannerVariant } from "@leafygreen-ui/banner";
import { useTheme } from "@/context/ThemeContext";

interface ResponseBoxProps {
  result: { ok: boolean; message: string; data?: unknown } | null;
}

export default function ResponseBox({ result }: ResponseBoxProps) {
  const { darkMode } = useTheme();

  if (!result) return null;

  return (
    <Banner
      darkMode={darkMode}
      variant={result.ok ? BannerVariant.Success : BannerVariant.Danger}
      style={{ marginTop: "12px" }}
    >
      {result.message}
    </Banner>
  );
}
