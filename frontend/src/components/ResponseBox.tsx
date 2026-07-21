"use client";

interface ResponseBoxProps {
  result?: { ok: boolean; message: string; data?: unknown } | null;
  ok?: boolean;
  message?: string;
}

export default function ResponseBox({ result, ok, message }: ResponseBoxProps) {
  const isOk = result !== undefined ? result?.ok : ok;
  const msg = result !== undefined ? result?.message : message;

  if (!msg) return null;

  return (
    <div
      className="p-3 rounded-xl text-sm border anim-fadeInUp"
      style={
        isOk
          ? { background: "rgba(34,197,94,0.07)", borderColor: "rgba(34,197,94,0.2)", color: "#86efac" }
          : { background: "rgba(239,68,68,0.07)", borderColor: "rgba(239,68,68,0.2)", color: "#fca5a5" }
      }
    >
      <div className="font-semibold">{isOk ? "✅" : "❌"} {msg}</div>
    </div>
  );
}
