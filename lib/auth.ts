import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";

const ADMIN_COOKIE_NAME = "detailinghub_admin";
const OWNER_COOKIE_NAME = "detailinghub_owner";

function getSecret() {
  return process.env.AUTH_SECRET || "dev-detailinghub-secret";
}

function sign(email: string) {
  return createHmac("sha256", getSecret()).update(email).digest("hex");
}

function createToken(email: string) {
  return `${Buffer.from(email).toString("base64url")}.${sign(email)}`;
}

function verifyToken(token?: string) {
  if (!token) {
    return null;
  }

  const [encodedEmail, signature] = token.split(".");
  if (!encodedEmail || !signature) {
    return null;
  }

  const email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  const expected = sign(email);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) {
    return null;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer) ? email : null;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (isDatabaseConfigured()) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (user?.role === "ADMIN" && (await compare(password, user.passwordHash))) {
        return normalizedEmail;
      }
    } catch (error) {
      console.warn("Admin DB auth failed, falling back to env auth.", error);
    }
  }

  const envEmail = (process.env.ADMIN_EMAIL || "admin@detailinghub.rs").toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD || "admin12345";

  if (normalizedEmail === envEmail && password === envPassword) {
    return normalizedEmail;
  }

  return null;
}

export async function verifyOwnerCredentials(email: string, password: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (user?.role === "OWNER" && (await compare(password, user.passwordHash))) {
    return normalizedEmail;
  }

  return null;
}

export async function createAdminSession(email: string) {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, createToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function createOwnerSession(email: string) {
  const cookieStore = await cookies();

  cookieStore.set(OWNER_COOKIE_NAME, createToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function clearOwnerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(OWNER_COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const email = verifyToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  return email ? { email } : null;
}

export async function getOwnerSession() {
  const cookieStore = await cookies();
  const email = verifyToken(cookieStore.get(OWNER_COOKIE_NAME)?.value);

  if (!email || !isDatabaseConfigured()) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      ownedStudios: {
        select: { id: true, name: true, slug: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!user || user.role !== "OWNER") {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireOwner() {
  const session = await getOwnerSession();

  if (!session) {
    redirect("/studio/login");
  }

  return session;
}
