"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";

export default function CartHydrator() {
  const { data: session, status } = useSession();
  const loadFromDatabase = useCartStore((s) => s.loadFromDatabase);
  const setHydrated = useCartStore((s) => s.setHydrated);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      loadFromDatabase(session.user.id);
      return;
    }

    if (status === "unauthenticated") {
      setHydrated(true);
    }
  }, [status, session?.user?.id, loadFromDatabase, setHydrated]);

  return null;
}
