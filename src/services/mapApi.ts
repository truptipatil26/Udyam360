const API_BASE_URL =
  'https://udyam-analysis-backend-2.onrender.com';

export type Competitor = {
  business_name?: string | null;
  lat?: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
  distance_m?: number | null;
  category?: string | null;
};

export type MapData = {
  proposed_location: {
    lat: number;
    lon: number;
  };
  category: string;
  radius_km: number;
  competitor_count: number;
  competitors: Competitor[];
};

export async function getMapData(
  lat: number,
  lon: number,
  category: string,
  radiusKm: number = 5
): Promise<MapData> {
  const url =
    `${API_BASE_URL}/map-data` +
    `?lat=${encodeURIComponent(lat)}` +
    `&lon=${encodeURIComponent(lon)}` +
    `&category=${encodeURIComponent(category)}` +
    `&radius_km=${encodeURIComponent(radiusKm)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Map API request failed: ${response.status}`);
  }

  return response.json();
}