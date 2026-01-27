import { Influencer, BrandCampaign, Interaction, InteractionType, ScoredCandidate, MatchFilters } from '@/types/matchmaking';
import { mockInfluencers, mockBrandCampaigns, mockInteractions } from './mockData';
import { rankCandidates } from './matchmaker';

// LocalStorage keys
const STORAGE_KEYS = {
  INTERACTIONS: 'cloutcash_interactions',
};

// Load from localStorage
const loadInteractions = (): Interaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.INTERACTIONS);
    return stored ? JSON.parse(stored) : [...mockInteractions];
  } catch {
    return [...mockInteractions];
  }
};

// In-memory storage for interactions with localStorage sync
let interactions: Interaction[] = loadInteractions();

// Save to localStorage
const saveInteractions = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
  } catch (error) {
    console.error('Failed to save interactions:', error);
  }
};

export const mockApi = {
  async getRankedBatch(
    userId: string,
    role: 'brand' | 'creator',
    userCampaign: BrandCampaign | null,
    cursor: number = 0,
    filters?: MatchFilters,
    limit: number = 10
  ): Promise<{ candidates: ScoredCandidate<Influencer>[]; nextCursor: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const userInteractions = interactions.filter(i => i.userId === userId);
    const context = {
      userId,
      role,
      interactions: userInteractions
    };
    
    // Get all candidates - don't filter by seen IDs to allow infinite swiping
    const candidates = [...mockInfluencers];
    
    // Rank candidates
    const ranked = rankCandidates(role, userCampaign, candidates, context, filters);
    
    // For infinite scroll, wrap around the array
    const totalCandidates = ranked.length;
    const wrappedCursor = cursor % totalCandidates;
    
    // Get batch, wrapping around if needed
    let batch: ScoredCandidate<Influencer>[] = [];
    for (let i = 0; i < limit; i++) {
      const index = (wrappedCursor + i) % totalCandidates;
      batch.push({
        ...ranked[index],
        // Add a unique key for each card instance to avoid React key conflicts
        item: {
          ...ranked[index].item,
          id: `${ranked[index].item.id}-${cursor + i}`
        }
      });
    }
    
    return {
      candidates: batch,
      nextCursor: cursor + limit
    };
  },

  async recordInteraction(
    userId: string,
    targetId: string,
    type: InteractionType
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Extract original ID (remove the cursor suffix)
    const originalId = targetId.split('-')[0];
    
    const interaction: Interaction = {
      userId,
      targetId: originalId,
      type,
      ts: Date.now()
    };
    
    interactions.push(interaction);
    saveInteractions();
    
    // Track analytics
    console.log(`[Analytics] ${type}:`, { userId, targetId: originalId, ts: interaction.ts });
  },

  async getInteractions(userId: string): Promise<Interaction[]> {
    return interactions.filter(i => i.userId === userId);
  },

  clearSeenIds() {
    // No-op now, kept for API compatibility
  },

  resetDemo() {
    interactions = [...mockInteractions];
    saveInteractions();
  }
};