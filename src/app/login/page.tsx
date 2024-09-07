import { auth, signIn } from "@/auth";
import { LoginForm } from "@/components/client/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

const msg: string = "Don't have an account?";

// ALT+SHIFT+O
export default async function Page() {
  const session = await auth();

  if (session?.user) redirect("/");
  return (
    <div className="flex justify-center items-center h-dvh">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <LoginForm />
        <div className="flex flex-col justify-center align-middle">
          <div className="grid grid-cols-3 p-4">
            <hr />
            <span>or</span>
            <hr />
          </div>
        </div>
        <CardFooter className="flex flex-col gap-4">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button variant="outline" type="submit">
              Login with Google
            </Button>
          </form>
          <div>
            <p>
              {msg}{" "}
              <Link href={"/signup"} className="text-blue-600">
                Signup
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
