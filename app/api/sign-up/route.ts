import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, businessName, tos } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.json(
        {
          error:
            "User with this email already exists and is verified. Please log in.",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await prisma.user.create({
      data: {
        name: fullName,
        email: email,
        password: hashedPassword,
        businessName,
      },
    });

    const token = signToken({
      email: createUser.email,
      id: createUser.id,
    });

    const cookieStore = await cookies();
    cookieStore.set("token-234", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 6, // 6 hour
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Account Creation Successful",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to initiate authentication. Please try again later." },
      { status: 500 },
    );
  }
}
