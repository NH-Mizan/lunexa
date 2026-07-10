import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  getTokenCookieName,
  laravelFetch,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const phone = body?.phone?.trim();
    const otp = body?.otp?.trim();

    if (!phone || !otp) {
      return NextResponse.json(
        { message: "Phone number and OTP are required." },
        { status: 422 }
      );
    }

    const { response, data } = await laravelFetch("/customer/verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const token = data?.token ?? data?.access_token;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token missing from response." },
        { status: 502 }
      );
    }

    const nextResponse = NextResponse.json(
      {
        message: data?.message || "OTP verified successfully.",
        user: data?.user ?? data?.data ?? null,
      },
      { status: 200 }
    );

    nextResponse.cookies.set(
      getTokenCookieName(),
      token,
      getSessionCookieOptions()
    );

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "OTP verification failed." },
      { status: 500 }
    );
  }
}
