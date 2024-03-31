import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import { compare } from "bcrypt";
import Users from "@/models/Users";
import connectMongoDB from "@/config/mongoDBConnection";
import GoogleProvider from "next-auth/providers/google";
import Notifications from "@/models/Notifications";


const googleID = process.env.GOOGLE_CLIENT_ID ?? "";
const googleSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? "";

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials) {
        try {
          await connectMongoDB();

          const user = await Users.findOne({ email: credentials?.email });
          if (!user) throw new Error("User does not exist");

          const passwordMatch = await compare(credentials?.password || "", user.password);

          if (passwordMatch) {
            return user;
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          throw new Error(`${error}`);
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
            },{ new: true });

            const newUser = await Users.findOne({ email: email });

            if (newUser) {
              await Notifications.create({
                userId: newUser?._id.toString(),
                type: 'system',
                message: 'Welcome to Rythmix, start by browsing beats.',
              });
            }
          } 
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      } 
      return true;
    }, 
    async jwt({ user, token, account, trigger, session }) {
      if (trigger === "update") {
        token.userName = session.userName;
        token.userType = session.userType;
        token.isProfileCompleted = session.isProfileCompleted;
        token.image = session.image;
      }

      if (account?.provider === "google" && user) {
        const userFromDB = await Users.findOne({ email: user.email });

        if (userFromDB) {
          return {
            ...token,
            image: userFromDB.profilePicture,
            id: userFromDB._id.toString(),
            profileUrl: userFromDB.profileUrl,
            isProfileCompleted: userFromDB.isProfileCompleted,
            userName: userFromDB.userName,
            userType: userFromDB.userType, 
          }
        }
      } else if (account?.provider === "credentials" && user) {
        const { _id, profileUrl, profilePicture, isProfileCompleted, userName, userType, } = user;

        return {
          ...token,
          id: _id?.toString(),
          profileUrl,
          image: profilePicture,
          isProfileCompleted,
          userName,
          userType,
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        image: token.image,
        profileUrl: token.profileUrl,
        isProfileCompleted: token.isProfileCompleted,
        userName: token.userName,
        userType: token.userType, 
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: nextAuthSecret,
};