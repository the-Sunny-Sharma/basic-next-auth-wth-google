import { auth } from "@/auth";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  // const user = session?.user;
  // console.log("Home -> session ", user);

  if (!session?.user) redirect("/login");

  const cookees = cookies().get("authjs.session-token");
  console.log(
    await decode({
      token: cookees?.value!,
      salt: "authjs.session-token",
      secret: process.env.AUTH_SECRET!,
    })
  );
  return (
    <div>
      <h1>App Router</h1>
    </div>
  );
}
