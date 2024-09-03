import { signUpSchema } from "@/schemas/schema";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const parsedBody = signUpSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid Inputs",
        },
        { status: 411 }
      );
    }

    const { username, email, password } = parsedBody.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User Sucessfully signed up!",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error!",
      },
      { status: 500 }
    );
  }
}
