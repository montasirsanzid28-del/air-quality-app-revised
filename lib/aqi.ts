// AQI calculation logic

type Breakpoint = {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
};

const PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
  { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
];

const PM10_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 504, iLow: 301, iHigh: 400 },
  { cLow: 505, cHigh: 604, iLow: 401, iHigh: 500 },
];

function calcAQI(conc: number, breakpoints: Breakpoint[]): number {
  if (conc < 0) return 0;
  for (const bp of breakpoints) {
    if (conc >= bp.cLow && conc <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (conc - bp.cLow) + bp.iLow
      );
    }
  }
  // High extremes
  const last = breakpoints[breakpoints.length - 1];
  if (conc > last.cHigh) return 500;
  return 0;
}

export function getUS_AQI(pm25: number, pm10: number): number {
  const aqi25 = calcAQI(pm25, PM25_BREAKPOINTS);
  const aqi10 = calcAQI(pm10, PM10_BREAKPOINTS);
  return Math.max(aqi25, aqi10);
}

export function getAQIString(aqi: number) {
  if (aqi <= 50) return "Excellent";
  if (aqi <= 100) return "Good";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Very Poor";
  return "Hazardous";
}

export function getAQIColor(aqi: number) {
  if (aqi <= 50) return "text-primary-container"; // Green
  if (aqi <= 100) return "text-secondary-fixed-dim"; // Yellowish
  if (aqi <= 150) return "text-secondary-container"; // Orangeish
  if (aqi <= 200) return "text-tertiary-container"; // Red
  if (aqi <= 300) return "text-tertiary"; // Deep red
  return "text-error";
}

export function getPollutantLevel(name: string, conc: number) {
  // Simple heuristic just for visuals
  if (name === "PM2.5") return conc < 12 ? "Good" : conc < 35.4 ? "Fair" : "Poor";
  if (name === "PM10") return conc < 54 ? "Good" : conc < 154 ? "Fair" : "Poor";
  if (name === "O3") return conc < 54 ? "Good" : conc < 70 ? "Fair" : "Poor";
  if (name === "NO2") return conc < 53 ? "Good" : conc < 100 ? "Fair" : "Poor";
  return "Moderate";
}
