"use client";

import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data, status } = useSession();

  if (status !== "authenticated") return null;

  return data.user;
}