import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { compare } from "bcrypt";
import Users from "@/models/Users";
import connectMongoDB from "@/config/mongoDBConnection";


const handler = NextAuth({
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials, req) {

        connectMongoDB();
        const user = await Users.findOne({ email: credentials?.email });

        if (!user) return null;

        const passwordMatch = await compare(credentials?.password || "", user.password);
        
        console.log(user._id.toString(), passwordMatch);

        if (passwordMatch) {
          return {
            id: user._id.toString(),
            email: user.email,
          }
        } 

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
