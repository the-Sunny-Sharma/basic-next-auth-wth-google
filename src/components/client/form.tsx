"use client";

import { credentialsLogin } from "@/actions/login";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Please provide all fields");
      return;
    }

    const toastId = toast.loading("Logging in");

    try {
      const error = await credentialsLogin(email, password);
      if (!error) {
        toast.success("Login successful", { id: toastId });
        router.refresh();
      } else {
        toast.error(String(error), { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: toastId });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Email" type="email" name="email" required />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            required
          />
          <Button type="submit">Login</Button>
        </CardContent>
      </form>
    </>
  );
};

// "use client";

// import { toast } from "sonner";
// import { CardContent } from "../ui/card";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { credentialsLogin } from "@/actions/login";

// export const LoginForm = () => {
//   return (
//     <>
//       <form
//         action={async (formData) => {
//           const email = formData.get("email") as string;
//           const password = formData.get("password") as string;
//           if (!email || !password) toast.error("Please provide all fields");

//           const toastId = toast.loading("Logging in");

//           const error = await credentialsLogin(email, password);
//           if (!error)
//             toast.success("Login successful", {
//               id: toastId,
//             });
//           else {
//             toast.error(error, {
//               id: toastId,
//             });
//           }
//         }}
//       >
//         <CardContent className="flex flex-col gap-4">
//           <Input placeholder="Email" type="email" name="email" />
//           <Input placeholder="Password" type="password" name="password" />
//           <Button type="submit">Login</Button>
//         </CardContent>
//       </form>
//     </>
//   );
// };
