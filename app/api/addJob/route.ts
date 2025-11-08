import { authMiddleware } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // const auth = await authMiddleware(req);
  // if ("user" in auth === false) return auth;
  // const { user } = auth as any;
  const authResult = await authMiddleware(req);

  // If middleware returned a NextResponse (error or refreshed token)
  if (authResult instanceof NextResponse) {
    // If it's a valid refresh response → continue request normally
    if ((authResult as any).user) {
      const user = (authResult as any).user;
      return NextResponse.json({ message: "User data", user });
    }
    // Otherwise, just return middleware's response (error)
    return authResult;
  }

  // If token valid and user decoded
  const { user } = authResult;

  try {
    const body = await req.json();
    const { job_name, jobs_no, reported_no, time_slot } = body;
    const result = await pool.query(
      `insert into jobs(job_name,completed_job,reported_job,time_slot,user_id) values($1,$2,$3,$4,$5)`,
      [job_name, jobs_no, reported_no, time_slot, user.id]
    );
    return NextResponse.json(
      { message: "Job added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
