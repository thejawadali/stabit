import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

const config = useRuntimeConfig()
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: config.betterAuthUrl || config.public.siteUrl,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: config.public.googleClientId as string,
      clientSecret: config.googleClientSecret as string,
    },
    github: {
      clientId: config.public.githubClientId as string,
      clientSecret: config.githubClientSecret as string,
    },
  },
})
