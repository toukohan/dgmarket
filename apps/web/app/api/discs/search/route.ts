import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:4000/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const url = new URL(`${API_URL}/discs/search`);
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch discs" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
