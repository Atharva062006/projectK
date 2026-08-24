"use client";
import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { STATUS } from "@/lib/theme";

interface ResponseBoxProps {
  result: { ok: boolean; message: string; data?: unknown } | null;
}

export default function ResponseBox({ result }: ResponseBoxProps) {
  if (!result) return null;

  const isSuccess = result.ok;
  const bg = isSuccess ? STATUS.successBg : STATUS.errorBg;
  const border = isSuccess ? STATUS.successBorder : STATUS.errorBorder;
  const color = isSuccess ? STATUS.success : STATUS.error;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        borderRadius: "8px",
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: color,
        fontSize: "14px",
        marginTop: "12px",
      }}
    >
      {isSuccess ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{result.message}</span>
    </div>
  );
}
