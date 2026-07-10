import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  getSessionToken,
  getTokenCookieName,
  laravelFetch,
} from "@/lib/auth";

export async function POST() {
  try {
    const token = await getSessionToken();

    if (token) {
      await laravelFetch("/customer/logout", {
        method: "POST",
        token,
      });
    }

    const response = NextResponse.json({ message: "Logged out successfully." });
    response.cookies.set(getTokenCookieName(), "", {
      ...getSessionCookieOptions(0),
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Logout failed." },
      { status: 500 }
    );
  }
}
