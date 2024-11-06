import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID_CLIENT,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
        console.log("Cuenta:", account);
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = account.access_token;
        };
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };