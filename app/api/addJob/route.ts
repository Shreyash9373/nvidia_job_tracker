import { authMiddleware } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req);
  if ("user" in auth === false) return auth;
  const { user } = auth as any;

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
