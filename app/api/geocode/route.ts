import { NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "OpenWeather API key not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        q
      )}&limit=5&appid=${API_KEY}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json({ error: "Failed to geocode" }, { status: 500 });
  }
}
