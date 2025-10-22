import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const date = params.date;
    const result = await pool.query(
      `select job_name,completed_job,reported_job,time_slot from jobs where job_date=$1`,
      [date]
    );
    const total = await pool.query(
      `Select SUM(completed_job) AS total_completed, SUM(reported_job) AS total_reported from jobs where job_date=$1`,
      [date]
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
