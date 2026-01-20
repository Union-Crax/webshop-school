import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    // Auto-generate username and password
    const username = `user_${nanoid(8)}`;
    const password = nanoid(12);
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin: false
      }
    });

    return NextResponse.json({
      success: true,
      credentials: {
        username,
        password
      },
      message: "Account created! Please save your credentials."
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create account" },
      { status: 500 }
    );
  }
}
