import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DiscoverProfile {
  id: string;
  user_id: string;
  full_name: string;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  niche: string | null;
  location: string | null;
  follower_count: number | null;
  engagement_rate: number | null;
  marketing_budget: number | null;
  user_type: string;
  website: string | null;
}

export interface DiscoverFilters {
  niche?: string;
  location?: string;
  maxBudget?: number;
  minEngagement?: number;
  minFollowers?: number;
}

export function useDiscoverProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoverFilters>({});
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);

  // Fetch current user's type
  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('user_type')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setCurrentUserType(data.user_type);
      });
  }, [user]);

  const fetchProfiles = useCallback(async (currentFilters: DiscoverFilters = {}) => {
    if (!user || !currentUserType) return;

    setLoading(true);
    try {
      // Show opposite type: brands see creators, creators see brands
      const targetType = currentUserType === 'brand' ? 'creator' : 'brand';

      let query = supabase
        .from('profiles')
        .select('id, user_id, full_name, handle, avatar_url, bio, niche, location, follower_count, engagement_rate, marketing_budget, user_type, website')
        .neq('user_id', user.id)
        .eq('user_type', targetType);

      // Apply filters
      if (currentFilters.niche) {
        query = query.ilike('niche', `%${currentFilters.niche}%`);
      }
      if (currentFilters.location) {
        query = query.ilike('location', `%${currentFilters.location}%`);
      }
      if (currentFilters.minFollowers && currentFilters.minFollowers > 0) {
        query = query.gte('follower_count', currentFilters.minFollowers);
      }
      if (currentFilters.minEngagement && currentFilters.minEngagement > 0) {
        query = query.gte('engagement_rate', currentFilters.minEngagement);
      }
      if (currentFilters.maxBudget && currentFilters.maxBudget > 0) {
        query = query.lte('marketing_budget', currentFilters.maxBudget);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [user, currentUserType]);

  const updateFilters = useCallback((newFilters: DiscoverFilters) => {
    setFilters(newFilters);
    fetchProfiles(newFilters);
  }, [fetchProfiles]);

  const refetch = useCallback(() => {
    fetchProfiles(filters);
  }, [fetchProfiles, filters]);

  useEffect(() => {
    if (user) {
      fetchProfiles(filters);
    }
  }, [user]);

  return {
    profiles,
    loading,
    updateFilters,
    refetch,
  };
}
