import { NextResponse } from "next/server";
import { getSessionToken, laravelFetch, normalizeAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const { response, data } = await laravelFetch("/customer/profile", { token });
    return NextResponse.json(
      {
        ...data,
        user: normalizeAuthenticatedUser(data),
      },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch user." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const formData = await request.formData();
    const { response, data } = await laravelFetch("/profile_update", {
      method: "POST",
      token,
      body: formData,
    });

    let user = normalizeAuthenticatedUser(data);

    if (response.ok && !user) {
      const profileResult = await laravelFetch("/customer/profile", { token });
      user = normalizeAuthenticatedUser(profileResult.data);
    }

    return NextResponse.json(
      {
        ...data,
        user,
      },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
