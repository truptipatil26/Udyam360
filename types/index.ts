// types/index.ts

export interface UserProfile {
  name: string;
  location: string;
  district: string;
  state: string;
  avatarInitials: string;
  notificationsCount: number;
}

export interface OpportunityScoreData {
  score: number; // 0-100
  label: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  updatedAt: string;
}

export interface CapitalInfo {
  availableAmount: number;
  currency: 'INR';
  schemesEligible: number;
  maxLoanAmount: number;
}

export type DemandLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface MarketPotentialInfo {
  score: number; // 0-100
  label: string;
  growthPercent: number;
  demandLevel: DemandLevel;
}

export type BusinessCategory =
  | 'Agriculture'
  | 'Dairy'
  | 'Retail'
  | 'Food Processing'
  | 'Handicraft'
  | 'Services'
  | 'Textile'
  | 'Poultry';

export interface BusinessRecommendation {
  id: string;
  title: string;
  category: BusinessCategory;
  matchScore: number; // 0-100
  estimatedInvestment: number;
  estimatedMonthlyIncome: number;
  roiMonths: number;
  description: string;
  iconName: string;
}

export type OpportunityTag = 'Hot' | 'New' | 'Trending' | 'High Demand';

export interface NearbyOpportunity {
  id: string;
  title: string;
  category: BusinessCategory;
  village: string;
  distanceKm: number;
  potentialScore: number; // 0-100
  investmentRange: string;
  tag?: OpportunityTag;
  iconName: string;
}

export interface MarketPulseItem {
  id: string;
  name: string;
  detail: string;
  changePercent: number;
  trend: 'up' | 'down';
}