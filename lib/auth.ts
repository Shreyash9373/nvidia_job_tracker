// lib/authMiddleware.ts  (update your existing middleware)
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthUser {
  id: string;
  username: string;
  role: "user" | "admin";
}

/**
 * Middleware helper that verifies access token and tries refresh if expired.
 * Returns { user } on success, or a NextResponse to return immediately.
 */
export async function authMiddleware(
  req: NextRequest,
  allowedRoles: ("user" | "admin")[] = ["user", "admin"]
): Promise<{ user: AuthUser } | NextResponse> {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try verify access token
    try {
      const decoded = jwt.verify(accessToken!, JWT_SECRET) as AuthUser;
      // role check

      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return { user: decoded };
    } catch (err: any) {
      console.log("⚠️ Access token verify error:", err.name);
      // If access token expired and refresh exists, try verify refresh token

      // if (err && err.name === "JsonWebTokenError" && refreshToken) {
      //   console.log("🔁 Trying refresh token flow...");
      //   try {
      //     const refreshDecoded = jwt.verify(
      //       refreshToken,
      //       JWT_SECRET
      //     ) as AuthUser;
      //     console.log("✅ Refresh token verified:", refreshDecoded);

      //     // Optionally: check refresh token expiry etc.

      //     // Generate new access token
      //     const newAccessToken = jwt.sign(
      //       {
      //         id: refreshDecoded.id,
      //         username: refreshDecoded.username,
      //         role: refreshDecoded.role,
      //       },
      //       JWT_SECRET,
      //       { expiresIn: "30s" }
      //     );
      //     console.log("✨ New access token generated");
      //     // Attach new cookie to response so further server calls are authenticated
      //     const res = NextResponse.next();
      //     res.cookies.set("accessToken", newAccessToken, {
      //       httpOnly: true,
      //       secure: process.env.NODE_ENV === "production",
      //       sameSite: "strict",
      //       maxAge: 2 * 60, // 1min
      //       path: "/",
      //     });

      //     // Role check
      //     if (!allowedRoles.includes(refreshDecoded.role)) {
      //       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      //     }

      //     // Add user info to request (optional pattern)
      //     (res as any).user = refreshDecoded;
      //     return res;
      //   } catch (refreshErr) {
      //     console.error("Refresh token invalid/expired:", refreshErr);
      //     return NextResponse.json(
      //       { error: "Invalid or expired refresh token" },
      //       { status: 401 }
      //     );
      //   }
      // }

      // For other verification errors
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.log("⚠️ Access token verification failed:", error);
    console.log("⚠️ Error name:", error.name);
    console.log("⚠️ Error message:", error.message);
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
