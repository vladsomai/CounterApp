import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";

const accounts = [
    {
        csrfToken: "16d5c19d0c22059793de23406140e67dbdc1f8a5ae579b5185ae83d562cda7e6",
        email: "vlad.somai@continental.com",
        password: "3ng1n33r",
        group: 'admin'
    }, {
        csrfToken: "16d5c19d0c22059793de23406140e67dbdc1f8a5ae579b5185ae83d562cda7e6",
        email: "cata.achim@continental.com",
        password: "3ng1n33r",
        group: 'power_user'
    }
]
export default NextAuth({
    providers: [
        AzureADProvider(
            {clientId: process.env.AZURE_AD_CLIENT_ID, clientSecret: process.env.AZURE_AD_CLIENT_SECRET, tenantId: process.env.AZURE_AD_TENANT_ID}
        ),
        Github({}),
        CredentialsProvider(
            { // The name to display on the sign in form (e.g. 'Sign in with...')
                name: "Credentials",
                async authorize(credentials, req) {
                    let userFound = null;
                    for(const user of accounts)
                    {
                        if(user.email==credentials.email && user.password==credentials.password)
                        {
                            userFound=user;
                        }
                    }

                    if (userFound) {
                        console.log("User OK");
                        return userFound;
                    } else {
                        console.log("User NOK");
                        throw new Error("Invalid account");
                    }
                }
            }
        ),
    ],
    pages: {
        signIn: "/signin",
        error: "/signin"
    },
    secret: "Sy21b2!G*&JY!GYGaknlngkdsbsi!NUI#GVUYT!^&Vy",
    callbacks: {
        async signIn(
            {
                user,
                account,
                profile,
                email,
                credentials
            }
        ) {
            return true;
        },
        async redirect(
            {url, baseUrl}
        ) {
            return url;
        },
        async session(
            {session, token, user}
        ) { 
            for(const user of accounts)
            {
                if(user.email==session.user.email)
                {
                    session.user={email:user.email, group: user.group}
                }
            }
            return session;
        },
        async jwt(
            {
                token,
                user,
                account,
                profile,
                isNewUser
            }
        ) {
            return token;
        }
    }
});
