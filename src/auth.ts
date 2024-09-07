import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./models/userModel";
import { compare } from "bcryptjs";
import { connectToDatabase } from "./lib/utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;
        if (!email || !password)
          throw new CredentialsSignin("Please provide email and password");

        // Connection with database here
        await connectToDatabase();

        const user = await User.findOne({ email }).select("+password");

        if (!user) throw new CredentialsSignin("Invalid Email or Password");
        if (!user.password)
          throw new CredentialsSignin("Invalid Email or Password");

        const isMatch = await compare(password, user.password);

        if (!isMatch) throw new CredentialsSignin("Invalid Email or Password");

        return { name: user.name, email: user.email, id: user._id };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // signIn: async ({ user, account }) => {
    //   if (account?.provider === "google") {
    //     try {
    //       const { email, name, image, id } = user;
    //       await connectToDatabase();
    //       // Only create user if they do not exist
    //       const alreadyUser = await User.findOne({ email });
    //       if (!alreadyUser) {
    //         await User.create({
    //           email,
    //           name,
    //           image,
    //           googleId: id,
    //           // Don't include password field as it's not required
    //         });
    //       }
    //       return true;
    //     } catch (error) {
    //       // console.error("Error while creating user:", error.message);
    //       throw new AuthError("Error while creating user");
    //     }
    //   }
    //   if (account?.provider === "credentials") return true;
    //   return false;
    // },

    async signIn({ user }) {
      try {
        await connectToDatabase(); // Ensure database connection
        await User.findOneAndUpdate(
          { email: user.email },
          { name: user.name, image: user.image },
          { upsert: true }
        );
        return true;
      } catch (error) {
        console.error("Error while creating user:", error);
        return false;
      }
    },
  },
});
