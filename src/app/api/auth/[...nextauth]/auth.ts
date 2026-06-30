import GithubProvider from "next-auth/providers/github";
import {db_connection} from '@/dbConfig/dbconfig';
import User from '@/models/userModels';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callback: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        await db_connection();

        try {
          // Look for an existing user record matching this GitHub email
          let dbUser = await User.findOne({ email: profile.email });

          // If they don't exist in your database yet, create a new record for them
          if (!dbUser) {
            dbUser = await User.create({
              username: profile.login || profile.name || "github_user",
              email: profile.email,
              // Add a default placeholder password or handle it according to your schema requirements
              password: "oauth_generated_accounts_fallback_pass", 
              isVerified: true
            });
            console.log("Created a new database user record for GitHub profile:", dbUser._id);
          }

          // Force the token id to equal your MongoDB collection document string _id
          token.id = dbUser._id.toString();

        } 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (error: any) {
          console.error("Database tracking error inside NextAuth jwt callback:", error.message);
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET as string,
};