'use client'
import { useSession } from "next-auth/react";
export default function Settings() {
  const { data: session } = useSession();
  return (
    <>
 {JSON.stringify(session)}
  <form > 
    <button type="submit">
      Sign Out
    </button>

  </form>
    </>
  );
}