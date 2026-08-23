import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@solarmc.net" },
        password: { label: "Password", type: "password" },
        minecraftUsername: { label: "Minecraft Username", type: "text" },
        isMinecraftQuickLogin: { label: "Quick Login", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Quick Minecraft Player Login without password
        if (credentials.isMinecraftQuickLogin === "true" && credentials.minecraftUsername) {
          const cleanUsername = credentials.minecraftUsername.trim();
          let user = await prisma.user.findFirst({
            where: { minecraftUsername: cleanUsername },
          });

          if (!user) {
            // Create user automatically
            user = await prisma.user.create({
              data: {
                name: cleanUsername,
                email: `${cleanUsername.toLowerCase()}@player.local`,
                minecraftUsername: cleanUsername,
                minecraftEdition: "Java",
                role: "USER",
              },
            });
          }

          return {
            id: user.id,
            name: user.name || cleanUsername,
            email: user.email,
            role: user.role,
            minecraftUsername: user.minecraftUsername,
            minecraftEdition: user.minecraftEdition || "Java",
          };
        }

        // Standard Email & Password Authentication
        if (!credentials.email || !credentials.password) {
          throw new Error("Por favor ingresa tu correo y contraseña");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.password) {
          throw new Error("Credenciales inválidas");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Credenciales inválidas");
        }

        const isAdminEmail = normalizedEmail === "admin@solarmc.net" || user.role === "ADMIN";

        return {
          id: user.id,
          name: user.name || user.minecraftUsername || "Usuario",
          email: user.email,
          role: isAdminEmail ? "ADMIN" : user.role,
          minecraftUsername: user.minecraftUsername,
          minecraftEdition: user.minecraftEdition || "Java",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        const normalizedEmail = user.email ? user.email.toLowerCase().trim() : "";
        const isAdminEmail = normalizedEmail === "admin@solarmc.net" || (user as any).role === "ADMIN";
        token.role = isAdminEmail ? "ADMIN" : ((user as any).role || "USER");
        token.minecraftUsername = (user as any).minecraftUsername || null;
        token.minecraftEdition = (user as any).minecraftEdition || "Java";
      }

      // Allow client-side session update
      if (trigger === "update" && session) {
        if (session.minecraftUsername !== undefined) {
          token.minecraftUsername = session.minecraftUsername;
        }
        if (session.minecraftEdition !== undefined) {
          token.minecraftEdition = session.minecraftEdition;
        }
        if (session.role !== undefined) {
          token.role = session.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || "USER";
        (session.user as any).minecraftUsername = (token.minecraftUsername as string) || null;
        (session.user as any).minecraftEdition = (token.minecraftEdition as string) || "Java";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "solarmc_minecraft_store_secret_jwt_key_2026_super_secure",
  pages: {
    signIn: "/",
  },
};
