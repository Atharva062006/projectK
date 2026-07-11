"use client";

interface ResponseBoxProps {
  result: { ok: boolean; message: string; data?: unknown } | null;
}

export default function ResponseBox({ result }: ResponseBoxProps) {
  if (!result) return null;
  return (
    <div className={`mt-3 p-3 rounded text-sm font-mono border ${result.ok ? "bg-green-950 border-green-700 text-green-300" : "bg-red-950 border-red-700 text-red-300"}`}>
      <div className="font-bold mb-1">{result.ok ? "✅ Success" : "❌ Error"}: {result.message}</div>
      {result.data !== null && result.data !== undefined && (
        <pre className="whitespace-pre-wrap break-all text-xs mt-2 opacity-80">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
