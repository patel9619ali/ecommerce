import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);

    setHydrated(true);

    // small delay to avoid flicker
    const t = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, [setLoading]);

  return hydrated;
}
