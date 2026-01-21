import { auth, signOut } from "@/lib/auth";

export default async function Settings() {
    const session = await auth();
  return (
    <>
 {JSON.stringify(session)}
 <form action={
  async () =>{
    "use server";
    await signOut()
  }
 }>
  <button type="submit">
    Sign Out
  </button>

 </form>
    </>
  );
}