import { Influencer, BrandCampaign, ScoredCandidate, UserContext, MatchFilters } from '@/types/matchmaking';

const EPSILON_INITIAL = 0.12;
const EPSILON_DECAY = 0.98;
const LEARNING_RATE = 0.02;

// Default scoring weights
const DEFAULT_WEIGHTS = {
  nicheOverlap: 0.22,
  geoAffinity: 0.18,
  ageGenderAffinity: 0.12,
  engagementNorm: 0.14,
  contentQuality: 0.10,
  priceFit: 0.10,
  platformFit: 0.06,
  pastBrandSimilarity: 0.04,
  availabilityFit: 0.02,
  fraudRiskPenalty: 0.06,
  brandSafetyPenalty: 0.06
};

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function calculateNicheOverlap(influencerNiches: string[], brandCategories: string[]): number {
  const overlap = influencerNiches.filter(n => 
    brandCategories.some(c => c.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(c.toLowerCase()))
  );
  return overlap.length / Math.max(influencerNiches.length, brandCategories.length);
}

function calculateGeoAffinity(influencerGeo: string[], targetGeo: string[]): number {
  const overlap = influencerGeo.filter(g => targetGeo.includes(g));
  return overlap.length / Math.max(influencerGeo.length, targetGeo.length);
}

function calculateAgeGenderAffinity(
  influencerAge: string[],
  influencerGender: { male: number; female: number; other: number },
  targetAge: string[],
  targetGender: { male: number; female: number; other: number }
): number {
  const ageOverlap = influencerAge.filter(a => targetAge.includes(a));
  const ageScore = ageOverlap.length / Math.max(influencerAge.length, targetAge.length);
  
  const genderDiff = Math.abs(influencerGender.male - targetGender.male) +
                     Math.abs(influencerGender.female - targetGender.female) +
                     Math.abs(influencerGender.other - targetGender.other);
  const genderScore = 1 - (genderDiff / 200); // Max diff is 200
  
  return (ageScore + genderScore) / 2;
}

function calculatePlatformFit(influencerPlatforms: string[], preferredPlatforms: string[]): number {
  if (preferredPlatforms.length === 0) return 0.5;
  const overlap = influencerPlatforms.filter(p => preferredPlatforms.includes(p));
  return overlap.length / preferredPlatforms.length;
}

function calculatePastBrandSimilarity(influencerBrands: string[], brandCategories: string[]): number {
  // Simple keyword matching for brand similarity
  const relevantBrands = influencerBrands.filter(brand =>
    brandCategories.some(cat => brand.toLowerCase().includes(cat.toLowerCase()))
  );
  return Math.min(1, relevantBrands.length / 3); // Cap at 3 relevant brands
}

function applyHardFilters(
  influencer: Influencer,
  campaign: BrandCampaign
): { pass: boolean; reason?: string } {
  if (influencer.brandSafety < campaign.brandSafetyMin) {
    return { pass: false, reason: 'Brand safety below minimum' };
  }
  if (influencer.followers < campaign.minFollowers) {
    return { pass: false, reason: 'Follower count below minimum' };
  }
  if (influencer.engagementRate < campaign.minEngagement) {
    return { pass: false, reason: 'Engagement rate below minimum' };
  }
  if (influencer.pricePerPost > campaign.maxPrice) {
    return { pass: false, reason: 'Price exceeds budget' };
  }
  if (campaign.exclusions.includes(influencer.handle)) {
    return { pass: false, reason: 'In exclusion list' };
  }
  return { pass: true };
}

function scoreInfluencerForBrand(
  influencer: Influencer,
  campaign: BrandCampaign,
  weights = DEFAULT_WEIGHTS
): { score: number; why: string[] } {
  const why: string[] = [];
  
  const nicheScore = calculateNicheOverlap(influencer.niches, campaign.categories);
  if (nicheScore > 0.6) why.push(`High niche overlap (${Math.round(nicheScore * 100)}%)`);
  
  const geoScore = calculateGeoAffinity(influencer.audienceGeo, campaign.targetGeo);
  if (geoScore > 0.5) why.push(`Strong geo match in ${influencer.audienceGeo.join(', ')}`);
  
  const ageGenderScore = calculateAgeGenderAffinity(
    influencer.audienceAge,
    influencer.audienceGenderMix,
    campaign.targetAge,
    campaign.targetGenderMix
  );
  
  const engagementNorm = normalize(influencer.engagementRate, 0, 10);
  if (influencer.engagementRate > 4.5) why.push(`Excellent engagement (${influencer.engagementRate}%)`);
  
  const contentQualityNorm = normalize(influencer.contentQuality, 1, 5);
  if (influencer.contentQuality >= 4.5) why.push('High content quality');
  
  const priceFitRaw = 1 - (influencer.pricePerPost / campaign.maxPrice);
  const priceFit = Math.max(0, priceFitRaw);
  if (priceFit > 0.7) why.push('Great price fit');
  
  const platformFit = calculatePlatformFit(influencer.platforms, campaign.preferredPlatforms);
  if (platformFit > 0.8) why.push('Perfect platform match');
  
  const pastBrandSim = calculatePastBrandSimilarity(influencer.pastBrands, campaign.categories);
  if (pastBrandSim > 0.6) why.push('Relevant brand experience');
  
  const availabilityFit = influencer.availability ? 1 : 0;
  if (!influencer.availability) why.push('Currently unavailable');
  
  const brandSafetyGap = Math.max(0, campaign.brandSafetyMin - influencer.brandSafety);
  
  const score =
    weights.nicheOverlap * nicheScore +
    weights.geoAffinity * geoScore +
    weights.ageGenderAffinity * ageGenderScore +
    weights.engagementNorm * engagementNorm +
    weights.contentQuality * contentQualityNorm +
    weights.priceFit * priceFit +
    weights.platformFit * platformFit +
    weights.pastBrandSimilarity * pastBrandSim +
    weights.availabilityFit * availabilityFit -
    weights.fraudRiskPenalty * influencer.fraudRisk -
    weights.brandSafetyPenalty * brandSafetyGap;
  
  return { score: Math.max(0, Math.min(1, score)), why };
}

function applyDiversityReranking<T extends Influencer | BrandCampaign>(
  scored: ScoredCandidate<T>[],
  role: 'brand' | 'creator'
): ScoredCandidate<T>[] {
  const result: ScoredCandidate<T>[] = [];
  const nicheCounts: Record<string, number> = {};
  const geoCounts: Record<string, number> = {};
  
  for (const candidate of scored) {
    const item = candidate.item as any;
    const niches = role === 'brand' ? item.categories : item.niches;
    const geos = role === 'brand' ? item.targetGeo : item.audienceGeo;
    
    // Check diversity constraints
    let penaltyFactor = 1;
    
    niches?.forEach((niche: string) => {
      const count = nicheCounts[niche] || 0;
      if (count / (result.length + 1) > 0.4) {
        penaltyFactor *= 0.8;
      }
    });
    
    geos?.forEach((geo: string) => {
      const count = geoCounts[geo] || 0;
      if (count / (result.length + 1) > 0.4) {
        penaltyFactor *= 0.85;
      }
    });
    
    const adjustedScore = candidate.score * penaltyFactor;
    result.push({ ...candidate, score: adjustedScore });
    
    // Update counts
    niches?.forEach((niche: string) => {
      nicheCounts[niche] = (nicheCounts[niche] || 0) + 1;
    });
    geos?.forEach((geo: string) => {
      geoCounts[geo] = (geoCounts[geo] || 0) + 1;
    });
  }
  
  return result.sort((a, b) => b.score - a.score);
}

function applyExploration<T>(
  scored: ScoredCandidate<T>[],
  allCandidates: T[],
  context: UserContext
): ScoredCandidate<T>[] {
  const interactionCount = context.interactions.length;
  const epsilon = EPSILON_INITIAL * Math.pow(EPSILON_DECAY, interactionCount / 10);
  
  if (Math.random() < epsilon && allCandidates.length > scored.length) {
    const unseenCandidates = allCandidates.filter(c =>
      !scored.some(s => (s.item as any).id === (c as any).id)
    );
    
    if (unseenCandidates.length > 0) {
      const novelCount = Math.ceil(scored.length * 0.15);
      const novelItems = unseenCandidates
        .sort(() => Math.random() - 0.5)
        .slice(0, novelCount)
        .map(item => ({
          item,
          score: 0.5,
          why: ['Novel suggestion for exploration']
        }));
      
      scored = [...scored.slice(0, -novelCount), ...novelItems];
    }
  }
  
  return scored;
}

function adjustWeightsFromFeedback(
  context: UserContext,
  weights = { ...DEFAULT_WEIGHTS }
): typeof DEFAULT_WEIGHTS {
  // Simple weight adjustment based on recent interactions
  const recentLikes = context.interactions
    .filter(i => i.type === 'like' || i.type === 'superlike')
    .slice(-10);
  
  if (recentLikes.length < 3) return weights;
  
  // This is a simplified version - in production, you'd analyze the actual features
  // of liked candidates and adjust weights accordingly
  return weights;
}

export function rankCandidates(
  userRole: 'brand' | 'creator',
  userCampaign: BrandCampaign | null,
  candidates: Influencer[],
  context: UserContext,
  filters?: MatchFilters
): ScoredCandidate<Influencer>[] {
  if (!userCampaign || userRole !== 'brand') {
    // For creators viewing brands, we'd need a different scoring function
    // For now, return simple scored list
    return candidates.map(c => ({
      item: c,
      score: 0.5,
      why: ['Candidate match']
    }));
  }
  
  // Apply filters
  let filteredCandidates = candidates;
  
  if (filters?.platforms?.length) {
    filteredCandidates = filteredCandidates.filter(c =>
      c.platforms.some(p => filters.platforms!.includes(p))
    );
  }
  
  if (filters?.niches?.length) {
    filteredCandidates = filteredCandidates.filter(c =>
      c.niches.some(n =>
        filters.niches!.some(fn => fn.toLowerCase() === n.toLowerCase())
      )
    );
  }
  
  if (filters?.geo?.length) {
    filteredCandidates = filteredCandidates.filter(c =>
      c.audienceGeo.some(g =>
        filters.geo!.some(fg => fg.toLowerCase() === g.toLowerCase())
      )
    );
  }
  
  if (filters?.minEngagement) {
    filteredCandidates = filteredCandidates.filter(c =>
      c.engagementRate >= filters.minEngagement!
    );
  }
  
  if (filters?.maxPrice) {
    filteredCandidates = filteredCandidates.filter(c =>
      c.pricePerPost <= filters.maxPrice!
    );
  }

  if (filters?.minFollowers) {
    filteredCandidates = filteredCandidates.filter(c =>
      c.followers >= filters.minFollowers!
    );
  }
  
  // Apply hard filters and score
  const weights = adjustWeightsFromFeedback(context);
  const scored: ScoredCandidate<Influencer>[] = [];
  
  for (const influencer of filteredCandidates) {
    const filterResult = applyHardFilters(influencer, userCampaign);
    if (!filterResult.pass) continue;
    
    const { score, why } = scoreInfluencerForBrand(influencer, userCampaign, weights);
    scored.push({ item: influencer, score, why });
  }
  
  // Sort by score
  scored.sort((a, b) => b.score - a.score);
  
  // Apply diversity re-ranking
  let reranked = applyDiversityReranking(scored, userRole);
  
  // Apply exploration
  reranked = applyExploration(reranked, candidates, context);
  
  return reranked;
}
