import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();

  // Remove the token cookie
  cookieStore.set("token-234", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 },
  );
}
