const API_BASE_URL =
  'https://udyam-analysis-backend-2.onrender.com';

export type CompetitionAnalysis = {
  pincode: string;
  basic_category: string;
  category_businesses: number;
  total_businesses: number;
  density_score: number;
  competition_level: string;
  latitude: number;
  longitude: number;
};

const CATEGORY_DENSITY_ALIASES: Record<string, string> = {
  grocery: 'retail',
  dairy: 'manufacturing',
  pharmacy: 'healthcare',
  restaurant: 'food_and_hospitality',
  clothing: 'retail',
  salon: 'personal_services',
};

export async function getCompetitionAnalysis(
  pincode: string,
  category: string
): Promise<CompetitionAnalysis | null> {
  const densityCategory = CATEGORY_DENSITY_ALIASES[category] || category;

  const url =
    `${API_BASE_URL}/density` +
    `?pincode=${encodeURIComponent(pincode)}` +
    `&category=${encodeURIComponent(densityCategory)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}