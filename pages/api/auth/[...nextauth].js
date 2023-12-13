import NextAuth from 'next-auth';
import { firestore } from '../firebase/initialize';
import CredentialsProvider from 'next-auth/providers/credentials';
import { collection, query, where,  getDocs, } from '@firebase/firestore';

export const authOptions = {
    // Configure one or more authentication providers
    secret: process.env.SECRET, // SECRET env variable
    providers: [
        CredentialsProvider({

            id: 'DB-login',
            name: 'database-login',

            credentials: {
                username: { label: 'UserEmail', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                var TempUserPK = await getDocs(query(collection(firestore, 'Users'),where('User-Access', '==', 'Admin'), where('Contact-Details.Email', '==', credentials.UserEmail), where('Personal-Details.Password', '==', credentials.Password)));
                if (!TempUserPK.docs[0]) {
                    return false;
                } else {
                    if (!TempUserPK.docs[0]._document.data.value.mapValue.fields?.archived?.booleanValue) {
                        return { id: TempUserPK.docs[0].id };
                    }
                }
                return false;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            //Allow users to sign in
            return true;
        },
        async redirect({ url, baseUrl }) {
            //All redirects
            return baseUrl;
        },
        async session(session, user) {
            session.user = user;
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (account) {
                token.id = user?.id;
                token.Email = user?.Email;
            }
            return token;
        }
    },
    pages: {
        signIn: '/SignIn',
        signOut: '/SignIn',
        error: '/SignIn' 
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 30,
    }
};

export default NextAuth(authOptions);
