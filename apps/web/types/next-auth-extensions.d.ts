import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      phoneNumber: string;
      token : string;
      type: "founder" | "investor"; // Type of user
    };
  }
}