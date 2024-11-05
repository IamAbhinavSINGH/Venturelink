import NextAuth from "next-auth";
import { userHandler } from '../../../../lib/userHandler';

const handler = NextAuth(userHandler)

export { handler as GET , handler as POST }