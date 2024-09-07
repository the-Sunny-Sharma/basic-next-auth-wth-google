import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/models/userModel";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/utils";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-dvh">
      <Card>
        <CardHeader>
          <CardTitle>Signup Page</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <form
          action={async (formData: FormData) => {
            "use server";
            const name = formData.get("name") as string | undefined;
            const email = formData.get("email") as string | undefined;
            const password = formData.get("password") as string | undefined;

            console.log(`Name: ${name} Email: ${email} PAssword : ${password}`);

            if (!name || !email || !password)
              throw new Error("Please provide all fields");

            //Connnection with database

            await connectToDatabase();

            const user = await User.findOne({ email });

            if (user) throw new Error("User already Exist");

            //Create new user
            const hasedPassword = await hash(password, 10);

            User.create({
              name,
              email,
              password: hasedPassword,
            });
            redirect("/login");
          }}
        >
          {" "}
          <CardContent className="flex flex-col gap-4">
            <Input placeholder="Name" name="name" />
            <Input placeholder="Email" type="email" name="email" />
            <Input placeholder="Password" type="password" name="password" />
            <Button type="submit">Button</Button>
          </CardContent>
        </form>
        <div className="flex flex-col justify-center align-middle">
          <div className="grid grid-cols-3 p-4">
            <hr />
            <span>or</span>
            <hr />
          </div>
        </div>
        <CardFooter className="flex flex-col gap-4">
          <form action="">
            <Button variant="outline" type="submit">
              Continue with Google
            </Button>
          </form>
          <div>
            <p>
              Already have an account?{" "}
              <Link href={"/login"} className="text-blue-600">
                Login
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
