// data/mockData.ts
// Mock data representing a rural Indian user (Sevagram, Wardha district,
// Maharashtra). All values are illustrative for demo/hackathon purposes.

import {
  UserProfile,
  OpportunityScoreData,
  CapitalInfo,
  MarketPotentialInfo,
  BusinessRecommendation,
  NearbyOpportunity,
  MarketPulseItem,
} from '../types';

export const currentUser: UserProfile = {
  name: 'Rajesh Patil',
  location: 'Sevagram',
  district: 'Wardha',
  state: 'Maharashtra',
  avatarInitials: 'RP',
  notificationsCount: 3,
};

export const opportunityScore: OpportunityScoreData = {
  score: 78,
  label: 'Strong Potential',
  trend: 'up',
  trendValue: '+6 pts this month',
  updatedAt: 'Today, 9:40 AM',
};

export const capitalInfo: CapitalInfo = {
  availableAmount: 185000,
  currency: 'INR',
  schemesEligible: 4,
  maxLoanAmount: 500000,
};

export const marketPotential: MarketPotentialInfo = {
  score: 82,
  label: 'High Growth Zone',
  growthPercent: 14,
  demandLevel: 'High',
};

export const topRecommendation: BusinessRecommendation = {
  id: 'br-1',
  title: 'Solar-Powered Cold Storage Unit',
  category: 'Agriculture',
  matchScore: 91,
  estimatedInvestment: 220000,
  estimatedMonthlyIncome: 32000,
  roiMonths: 9,
  description:
    'High demand from nearby vegetable farmers who currently lose 20-30% produce to spoilage. Subsidy available under PM-KUSUM scheme.',
  iconName: 'snow-outline',
};

export const nearbyOpportunities: NearbyOpportunity[] = [
  {
    id: 'op-1',
    title: 'Mini Dairy Processing Unit',
    category: 'Dairy',
    village: 'Pulgaon',
    distanceKm: 12,
    potentialScore: 88,
    investmentRange: '₹1.2L - ₹3L',
    tag: 'Hot',
    iconName: 'water-outline',
  },
  {
    id: 'op-2',
    title: 'Turmeric Powder Packaging Unit',
    category: 'Food Processing',
    village: 'Hinganghat',
    distanceKm: 18,
    potentialScore: 84,
    investmentRange: '₹80K - ₹1.5L',
    tag: 'Trending',
    iconName: 'nutrition-outline',
  },
  {
    id: 'op-3',
    title: 'Bamboo Handicraft Workshop',
    category: 'Handicraft',
    village: 'Arvi',
    distanceKm: 22,
    potentialScore: 76,
    investmentRange: '₹40K - ₹90K',
    tag: 'New',
    iconName: 'construct-outline',
  },
  {
    id: 'op-4',
    title: 'Backyard Poultry Farm',
    category: 'Poultry',
    village: 'Sevagram',
    distanceKm: 3,
    potentialScore: 80,
    investmentRange: '₹60K - ₹1.2L',
    tag: 'High Demand',
    iconName: 'egg-outline',
  },
  {
    id: 'op-5',
    title: 'Kirana + Essentials General Store',
    category: 'Retail',
    village: 'Wardha',
    distanceKm: 15,
    potentialScore: 71,
    investmentRange: '₹1.5L - ₹4L',
    iconName: 'storefront-outline',
  },
];

export const marketPulse: MarketPulseItem[] = [
  {
    id: 'mp-1',
    name: 'Cotton (Wardha Mandi)',
    detail: 'Procurement price rising ahead of season',
    changePercent: 8.2,
    trend: 'up',
  },
  {
    id: 'mp-2',
    name: 'Soybean Demand',
    detail: 'Processing units in Yavatmal expanding capacity',
    changePercent: 5.4,
    trend: 'up',
  },
  {
    id: 'mp-3',
    name: 'Milk Procurement Rate',
    detail: 'Dairy cooperatives revised buying price upward',
    changePercent: 3.1,
    trend: 'up',
  },
  {
    id: 'mp-4',
    name: 'Onion Wholesale Price',
    detail: 'Oversupply from Nashik belt easing prices',
    changePercent: -6.7,
    trend: 'down',
  },
  {
    id: 'mp-5',
    name: 'Turmeric Export Demand',
    detail: 'New buyers entering via Nagpur trade hub',
    changePercent: 11.3,
    trend: 'up',
  },
];