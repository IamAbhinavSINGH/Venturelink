import { Session, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import db from '@repo/db/client';
import { JWT } from 'next-auth/jwt';
import jwt from 'jsonwebtoken'

// Extend the session and token types
export interface CustomSession extends Session {
  user: {
    id: string;
    name: string;
    username: string;
    phoneNumber: string;
    token: string;
    type: "founder" | "investor";
  };
}

export interface CustomToken extends JWT {
  id: string;
  username: string;
  phoneNumber: string;
  token : string;
  type : 'founder' | 'investor'
}

export const userHandler = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        name: { label: "Name", type: "text", placeholder: "Your name", required: true },
        phoneNumber: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
        username: { label: 'email', type: 'text', placeholder: 'email' },
        password: { label: 'password', type: 'password', placeholder: '1234' },
        type : { label : "type of user" , type : "text" , placeholder : '' },
        age : { label : "Age" , type : "text" , placeholder : "" },
        address : { label : "Address" , type : "text" , placeholder : "" },
        country : { label : "Country" , type : "text" , placeholder : '' }
      },

      async authorize(credentials: any) {
        return await validateUser(credentials);
      }
    })
  ],

  pages : {
    signIn : "/signin",
    error : "/signin"
  },

  secret: process.env.NEXTAUTH_SECRET || 'secret',

  callbacks: {
    async session({ session, token } : any) {
      const customSession = session as CustomSession;
      const customToken = token as CustomToken;

      if (customToken && customSession.user) {
        customSession.user = {
          id: customToken.id,
          name: customToken.name as string,
          username: customToken.username as string,
          phoneNumber: customToken.phoneNumber as string,
          type: customToken.type,
          token : customToken.token as  string,
        };
      }

      return customSession;
    },
    async jwt({ token, user } : any) {
      const customToken = token as CustomToken;

      if (user) {
        customToken.id = user.id;
        customToken.name = user.name;
        customToken.username = user.username;
        customToken.phoneNumber = user.phoneNumber;
        customToken.type = user.type;
        customToken.token = user.token;
      }
      
      return customToken;
    }
  },
} satisfies NextAuthOptions;



const validateUser = async (credentials : any) => {

  if(credentials.type === 'founder'){
    const existingUser = await db.user.findFirst({ where: { username: credentials.username } });

        if (existingUser != null) {
          const passwordMatch = await bcrypt.compare(credentials.password, existingUser.hashedPassword);
          if (!passwordMatch) return null;

          const jsonSecret = process.env.JWT_SECRET || "secret"
          const token = jwt.sign({ username : existingUser.username } , jsonSecret);

          await db.user.update({
            where : { username : existingUser.username , id : existingUser.id },
            data : { token : token }
          })

          return {
            id: existingUser.id.toString(),
            username: existingUser.username,
            name: existingUser.name,
            phoneNumber: existingUser.phoneNumber,
            token : token,
            type: 'founder'
          };
        }

        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const jsonSecret = process.env.JWT_SECRET || 'secret';
          const token = jwt.sign({ username : credentials.username } , jsonSecret);

          const user = await db.user.create({
            data: {
              name: credentials.name,
              username: credentials.username,
              hashedPassword: hashedPassword,
              phoneNumber: credentials.phoneNumber,
              token : token,
              provider: 'Credentials'
            },
            select: {
              id: true,
              name: true,
              username: true,
              phoneNumber: true,
              token : true
            }
          });

          return {
            id: user.id.toString(),
            name: user.name,
            username: user.username,
            phoneNumber: user.phoneNumber,
            token : token,
            type: 'founder'
          };
        } catch (err) {
          console.error("Error occurred while signing in a user:", err);
        }

        return null;
  }
  else{
    const existingUser = await db.investor.findFirst({ where: { username: credentials.username } });

    if (existingUser != null) {
      const passwordMatch = await bcrypt.compare(credentials.password, existingUser.hashedPassword);
      if (!passwordMatch) return null;

      const jsonSecret = process.env.JWT_SECRET || "secret"
      const token = jwt.sign({ username : existingUser.username } , jsonSecret);

      await db.user.update({
        where : { username : existingUser.username , id : existingUser.id },
        data : { token : token }
      });

      return {
        id: existingUser.id.toString(),
        username: existingUser.username,
        name: existingUser.name,
        phoneNumber: existingUser.phoneNumber,
        token : token,
        type: 'investor'
      };
    }

    try {
      const hashedPassword = await bcrypt.hash(credentials.password, 10);
      const jsonSecret = process.env.JWT_SECRET || "secret"
      const token = jwt.sign({ username : credentials.username } , jsonSecret);

      const user = await db.investor.create({
        data: {
          name: credentials.name,
          username: credentials.username,
          hashedPassword: hashedPassword,
          phoneNumber: credentials.phoneNumber,
          age : credentials.age,
          address : credentials.address,
          token : token,
          provider: 'Credentials',
        },
        select : {
          id : true,
          name : true,
          username : true,
          phoneNumber : true,
          token : true
        }
      });

      return {
        id: user.id.toString(),
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber,
        token : token,
        type: 'investor'
      };
    } catch (err) {
      console.error("Error occurred while signing in a user:", err);
    }

    return null;
  }

}