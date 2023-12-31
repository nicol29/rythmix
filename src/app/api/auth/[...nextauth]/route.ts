import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { type NextAuthOptions } from "next-auth";
import { compare } from "bcrypt";
import Users from "@/models/Users";
import connectMongoDB from "@/config/mongoDBConnection";
import GoogleProvider from "next-auth/providers/google";


const googleID = process.env.GOOGLE_CLIENT_ID ?? "";
const googleSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? "";

export const handler: NextAuthOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleID,
      clientSecret: googleSecret
    }),
    CredentialsProvider({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials, req) {

        connectMongoDB();
        const user = await Users.findOne({ email: credentials?.email });

        // if (!user) return null;
        if (!user) throw new Error("User does not exist");

        const passwordMatch = await compare(credentials?.password || "", user.password);

        if (passwordMatch) {
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, user, account }) {
      if (account?.provider === "google") {
        try {
          await connectMongoDB();
          const email = profile?.email;
          const userFromDB = await Users.findOne({ email: email });

          if (!userFromDB) {
            await Users.create({
              email: email, 
              profileUrl: email?.split('@')[0],
              profilePicture: user.image,
            });
          } 
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      } 
      return true;
    }, 
    async jwt({ user, token, account }) {
      // console.log(token)
      let { _id, profileUrl, profilePicture, isProfileCompleted, createdAt } = user;
      // console.log(user);
      
      if (account?.provider === "google") {
        const userFromDB = await Users.findOne({ email: user.email });

        if (userFromDB) {
          _id = userFromDB._id.toString();
          profileUrl = userFromDB.profileUrl;
          profilePicture = userFromDB.profilePicture;
          isProfileCompleted = userFromDB.isProfileCompleted;
          createdAt = userFromDB.createdAt;
        }
      } 
      
      if (user) {
        return {
          ...token,
          id: _id?.toString(),
          profileUrl,
          picture: profilePicture,
          isProfileCompleted,
          createdAt,
        }
      } 
      return token;
    },
    async session({ session, token }) {
      console.log("dslkjvbdslkjvsbkdjlvsdbjkjbksvdjvdjb")

      session.user = {
        ...session.user,
        id: token.id,
        profileUrl: token.profileUrl,
        profilePicture: token.profilePicture,
        isProfileCompleted: token.isProfileCompleted,
        createdAt: token.createdAt,
      };
    
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: nextAuthSecret,
});

export { handler as GET, handler as POST };
