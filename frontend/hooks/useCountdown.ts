// frontend/hooks/useCountdown.ts
import { useEffect, useState } from "react";

export default function useCountdown(initial = 0) {
  const [sec, setSec] = useState(initial);
  useEffect(() => {
    if (!sec) return;
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [sec]);
  return [sec, setSec] as const;
}
