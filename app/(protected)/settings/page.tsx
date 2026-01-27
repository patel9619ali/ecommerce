'use client'
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
export default function Settings() {
  const user = useCurrentUser();
 
  return (
    <>
 {JSON.stringify(user)}
  {/* <form > 
    <button type="submit" onClick={onClick}>
      Sign Out
    </button>

  </form> */}
    </>
  );
}