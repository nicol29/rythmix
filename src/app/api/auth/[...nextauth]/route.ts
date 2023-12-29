import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { compare } from "bcrypt";
import Users from "@/models/Users";
import connectMongoDB from "@/config/mongoDBConnection";
import GoogleProvider from "next-auth/providers/google";


const googleID = process.env.GOOGLE_CLIENT_ID ?? "";
const googleSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

const handler = NextAuth({
  session: {
    strategy: "jwt"
  },
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
          // return {
          //   id: user._id.toString(),
          //   userName: user.userName,
          //   userType: user.userType,
          //   email: user.email,
          //   profileUrl: user.profileUrl,
          // }
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    // async signIn({ profile, }) {
    //   return profile;
    // }
  }
});

export { handler as GET, handler as POST };
