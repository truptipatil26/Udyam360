const API_BASE_URL =
  'https://udyam-analysis-backend-2.onrender.com';

export type CompetitionAnalysis = {
  category: string;
  location: {
    lat: number;
    lon: number;
  };
  competitors: {
    within_1km: number;
    within_3km: number;
    within_5km: number;
  };
  nearest_competitor: {
    business_name: string | null;
    distance_m: number | null;
  };
  competition_level: string;
};

export async function getCompetitionAnalysis(
  lat: number,
  lon: number,
  category: string
): Promise<CompetitionAnalysis> {
  const url =
    `${API_BASE_URL}/analysis` +
    `?lat=${encodeURIComponent(lat)}` +
    `&lon=${encodeURIComponent(lon)}` +
    `&category=${encodeURIComponent(category)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}