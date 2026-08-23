import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function checkAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authorized: false, session: null };
  }

  const role = (session.user as any).role;
  const email = session.user.email?.toLowerCase().trim();
  const isAdmin = role === "ADMIN" || email === "admin@solarmc.net" || email === "admin@solarstore.com";

  if (!isAdmin) {
    return { authorized: false, session };
  }

  return { authorized: true, session };
}
