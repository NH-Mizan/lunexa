import { NextResponse } from "next/server";
import { laravelFetch } from "@/lib/auth";

function validatePhone(phone) {
  return typeof phone === "string" && phone.trim().length >= 10;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const phone = body?.phone?.trim();

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { message: "A valid phone number is required." },
        { status: 422 }
      );
    }

    const { response, data } = await laravelFetch("/customer/store", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to send OTP." },
      { status: 500 }
    );
  }
}
