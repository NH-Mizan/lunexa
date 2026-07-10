import { NextResponse } from "next/server";
import { getSessionToken, laravelFetch } from "@/lib/auth";

export async function POST(request) {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const body = await request.json();
    const { response, data } = await laravelFetch("/api/order-save", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to place order." },
      { status: 500 }
    );
  }
}
