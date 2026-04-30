import { NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const action = searchParams.get("action") || "all";

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "OpenWeather API key not configured" },
      { status: 500 }
    );
  }

  try {
    const urls = {
      current_aqi: `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
      forecast_weather: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
      current_weather: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
      forecast_aqi: `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    };

    if (action === "history") {
      const end = Math.floor(Date.now() / 1000);
      const start = end - 7 * 24 * 60 * 60; // 7 days ago
      const historyRes = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`
      );
      const historyData = await historyRes.json();
      return NextResponse.json({ history: historyData });
    }

    const [aqiRes, weatherRes, forecastRes, forecastAqiRes] = await Promise.all([
      fetch(urls.current_aqi),
      fetch(urls.current_weather),
      fetch(urls.forecast_weather),
      fetch(urls.forecast_aqi),
    ]);

    const aqiData = await aqiRes.json();
    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();
    const forecastAqiData = await forecastAqiRes.json();

    return NextResponse.json({
      aqi: aqiData,
      weather: weatherData,
      forecast: forecastData,
      forecastAqi: forecastAqiData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
