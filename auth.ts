import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    token?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/google-auth",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                avatar: user.image,
              }),
            }
          );

          if (!response.ok) {
            console.error(
              "Failed to authenticate with Laravel:",
              await response.text()
            );
            return token;
          }

          const data = await response.json();
          if (typeof data?.data?.token === "string") {
            token.laravelToken = data?.data?.token;
            token.userId = data?.data?.user?.id;
          } else {
            console.error("No token returned from Laravel.");
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (
        typeof token.laravelToken === "string" &&
        typeof token.userId === "string"
      ) {
        session.user = {
          ...session.user,
          token: token.laravelToken,
          id: token.userId,
        };
      } else {
        console.error("No token found in JWT token.");
      }
      return session;
    },
  },
  // pages: {
  //   signIn: "/",
  // },
});
