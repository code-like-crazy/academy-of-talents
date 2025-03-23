import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registerApiSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  console.log(
    "[API] POST /api/register - Request received at:",
    new Date().toISOString(),
  );
  try {
    console.log("[API] Registration request received");

    // Check content type
    const contentType = request.headers.get("Content-Type");
    if (contentType !== "application/json") {
      console.log("[API] Invalid content type:", contentType);
      return NextResponse.json(
        { message: "Invalid content type. Expected application/json" },
        { status: 400 },
      );
    }

    const body = await request.json();
    console.log("[API] Request body parsed successfully");

    const validationResult = registerApiSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validationResult.data;
    console.log("validated successfully");

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    await db.insert(users).values({
      id: nanoid(),
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
