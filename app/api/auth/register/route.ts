import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await pool.query(
      "SELECT * FROM nvidausers WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "Email or username already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user as inactive
    const newUser = await pool.query(
      `INSERT INTO nvidausers (email, username, password, active) 
       VALUES ($1, $2, $3, false) 
       RETURNING id, email, username, active`,
      [email, username, hashedPassword]
    );

    const user = newUser.rows[0];

    return NextResponse.json(
      {
        message:
          "User registered successfully. Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          active: user.active,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
