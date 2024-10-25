/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialProviders from "next-auth/providers/credentials"

const authOptions: NextAuthOptions = {
    providers: [
        CredentialProviders({
            name: 'Credentials',
            async authorize(credentials: any): Promise<any> {
                try {
                    return {
                        user: JSON.parse(credentials?.user),
                        token: credentials?.token
                    }
                } catch (error: any) {
                    console.log(error)
                    throw new Error(error?.message) || 'defaultMessageErrorLogin'
                }
            },
            credentials: {
                user: { label: 'user', type: 'text' },
                token: { label: 'token', type: 'text' }
            }
        })
    ],
    callbacks: {
        async session(payload) {
            const { session, token }: any = payload

            return { ...session, user: { ...token, ...token?.user, ...token.user.user } }
        },
        async signIn({ user, account, profile }) {
            return true
        },
        async jwt(payload: any) {
            const { token, user, session, trigger, account, profile } = payload

            if (user) {
                token.user = { ...user }
                token.token = user.token
            } else if (trigger === 'update') {
                token.user = { ...session }
            }

            return token
        }
    }
}

const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }

export default handler