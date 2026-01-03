import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.STRAPI_URL}/api/auth/local`,
            {
              identifier: credentials?.email,
              password: credentials?.password,
            }
          )

          const user = res.data.user
          console.log(user,"USER")
          if (user) {
            return {
              id: user.id,
              name: user.username,
              email: user.email,
              jwt: res.data.jwt,
            }
          }

          return null
        } catch (err) {
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.jwt = user.jwt
      return token
    },
    async session({ session, token }) {
      session.jwt = token.jwt
      return session
    }
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
