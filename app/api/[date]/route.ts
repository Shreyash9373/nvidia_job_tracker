import { authMiddleware } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
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
    const date = params.date;
    const result = await pool.query(
      `select job_name,completed_job,reported_job,time_slot from jobs where job_date=$1 and user_id=$2 ORDER BY created_at DESC`,
      [date, user.id]
    );
    const total = await pool.query(
      `Select SUM(completed_job) AS total_completed, SUM(reported_job) AS total_reported from jobs where job_date=$1 and user_id=$2`,
      [date, user.id]
    );
    return NextResponse.json({
      data: result.rows,
      total: total.rows[0],
      success: true,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
