import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const userVlad = {
  csrfToken: "16d5c19d0c22059793de23406140e67dbdc1f8a5ae579b5185ae83d562cda7e6",
  email: "vlad.somai@continental.com",
  password: "3ng1n33r",
};

export default NextAuth({
  providers: [
    Github({}),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      async authorize(credentials, req) {
        console.log(credentials);
        console.log(userVlad);

        if (
          userVlad.email === credentials.email &&
          userVlad.password === credentials.password
        ) {
          console.log("User OK");
          return userVlad;
        } else {
          console.log("User NOK");
          throw new Error("Invalid account");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  secret: "Sy21b2!G*&JY!GYGaknlngkdsbsi!NUI#GVUYT!^&Vy",
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      const redURL = baseUrl + ":3000" + "/signin";
      return redURL;
    },
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
});
