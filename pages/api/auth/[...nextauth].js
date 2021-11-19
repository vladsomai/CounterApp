import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        /* const res = await fetch("/your/endpoint", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()
        */

        const user = {
          email: "vlad.somai@continental.com",
          password: "3ng1n33r",
          user:{
              name: "Vlad Somai",
          }
        };

        console.log(credentials);
        console.log(user);

        // If no error and we have user data, return it
        if (
          user.email === credentials.email &&
          user.password === credentials.password
        ) {
          console.log("User OK");
          return user;
        }
        // Return null if user data could not be retrieved
        console.log("User NOK");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: "Sy21b2!G*&JY!GYGaknlngkdsbsi!NUI#GVUYT!^&Vy",
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
        return true
      },
      async redirect({ url, baseUrl }) {
        return baseUrl
      },
      async session({ session, token, user }) {
        return session
      },
      async jwt({ token, user, account, profile, isNewUser }) {
        return token
      }
  },
});
