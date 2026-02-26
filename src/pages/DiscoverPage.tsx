import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Star, Heart, MapPin, DollarSign, TrendingUp, Users, Loader2, SlidersHorizontal, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { useDiscoverProfiles, DiscoverProfile } from '@/hooks/useDiscoverProfiles';
import { useAuth } from '@/hooks/useAuth';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profiles, loading, updateFilters, refetch } = useDiscoverProfiles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter states
  const [filterNiche, setFilterNiche] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterBudgetRange, setFilterBudgetRange] = useState([0]);
  const [filterEngagement, setFilterEngagement] = useState([0]);
  const [filterFollowers, setFilterFollowers] = useState([0]);

  // Current and next cards
  const currentProfile = profiles[currentIndex];
  const nextCards = profiles.slice(currentIndex + 1, currentIndex + 3);

  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-15, 15]);

  // Reset index when profiles change (e.g. after filter)
  useEffect(() => {
    setCurrentIndex(0);
  }, [profiles]);

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    if (!currentProfile || isAnimating) return;

    setIsAnimating(true);

    const exitX = direction === 'left' ? -500 : direction === 'right' ? 500 : 0;
    const exitY = direction === 'up' ? -500 : 0;

    x.set(exitX);
    y.set(exitY);

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      x.set(0);
      y.set(0);
      setIsAnimating(false);
    }, 200);
  }, [currentProfile, isAnimating, x, y]);

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    if (isAnimating) return;

    const swipeThreshold = 100;
    const velocity = Math.abs(info.velocity.x);

    if (Math.abs(info.offset.x) > swipeThreshold || velocity > 500) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    } else if (info.offset.y < -swipeThreshold) {
      handleSwipe('up');
    } else {
      x.set(0);
      y.set(0);
    }
  }, [isAnimating, handleSwipe, x, y]);

  const handleApplyFilters = () => {
    updateFilters({
      niche: filterNiche || undefined,
      location: filterLocation || undefined,
      maxBudget: filterBudgetRange[0] > 0 ? filterBudgetRange[0] : undefined,
      minEngagement: filterEngagement[0] > 0 ? filterEngagement[0] : undefined,
      minFollowers: filterFollowers[0] > 0 ? filterFollowers[0] : undefined,
    });

    setFiltersOpen(false);

    toast({
      title: "Filters Applied",
      description: [
        filterNiche && `Niche: ${filterNiche}`,
        filterLocation && `Location: ${filterLocation}`,
        filterBudgetRange[0] > 0 && `Max budget: ₹${filterBudgetRange[0].toLocaleString()}`,
        filterEngagement[0] > 0 && `Min engagement: ${filterEngagement[0]}%`,
        filterFollowers[0] > 0 && `Min followers: ${filterFollowers[0].toLocaleString()}`,
      ].filter(Boolean).join(' • ') || 'Showing all profiles',
    });
  };

  const handleClearFilters = () => {
    setFilterNiche('');
    setFilterLocation('');
    setFilterBudgetRange([0]);
    setFilterEngagement([0]);
    setFilterFollowers([0]);
    updateFilters({});
    toast({ title: "Filters Cleared", description: "Showing all profiles" });
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Niche */}
      <div>
        <Label className="text-sm font-medium">Niche</Label>
        <Input
          placeholder="e.g. Fashion, Tech, Food..."
          value={filterNiche}
          onChange={(e) => setFilterNiche(e.target.value)}
          className="mt-2 bg-background/50"
        />
      </div>

      {/* Location */}
      <div>
        <Label className="text-sm font-medium">Location</Label>
        <Input
          placeholder="e.g. Mumbai, Delhi..."
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="mt-2 bg-background/50"
        />
      </div>

      {/* Budget */}
      <div>
        <Label className="text-sm font-medium">
          Max Budget (₹){filterBudgetRange[0] > 0 && `: ₹${filterBudgetRange[0].toLocaleString()}`}
        </Label>
        <Slider
          value={filterBudgetRange}
          onValueChange={setFilterBudgetRange}
          max={1000000}
          step={10000}
          className="mt-3"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Any</span>
          <span>₹10,00,000</span>
        </div>
      </div>

      {/* Engagement */}
      <div>
        <Label className="text-sm font-medium">
          Min Engagement Rate{filterEngagement[0] > 0 && `: ${filterEngagement[0]}%`}
        </Label>
        <Slider
          value={filterEngagement}
          onValueChange={setFilterEngagement}
          max={10}
          step={0.5}
          className="mt-3"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Any</span>
          <span>10%</span>
        </div>
      </div>

      {/* Followers */}
      <div>
        <Label className="text-sm font-medium">
          Min Followers{filterFollowers[0] > 0 && `: ${filterFollowers[0].toLocaleString()}`}
        </Label>
        <Slider
          value={filterFollowers}
          onValueChange={setFilterFollowers}
          max={1000000}
          step={10000}
          className="mt-3"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Any</span>
          <span>10L</span>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={handleClearFilters} variant="outline" className="w-full">
          Clear Filters
        </Button>
      </div>
    </div>
  );

  if (loading && profiles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-r border-border bg-card/50 backdrop-blur-sm p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 text-foreground">Filters</h2>
          <FiltersContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background overflow-hidden">
          {/* Mobile Filter Button */}
          <div className="w-full max-w-md lg:hidden mb-4">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
                <div className="pt-4 pb-8 overflow-y-auto h-full">
                  <h2 className="text-xl font-bold mb-6 text-foreground">Filters</h2>
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {currentProfile ? (
            <div className="relative w-full max-w-sm sm:max-w-md flex flex-col h-full max-h-[720px]">
              <div className="relative w-full max-w-md h-[590px] sm:h-[700px]">
                {/* Background cards */}
                {nextCards.map((profile, idx) => (
                  <motion.div
                    key={profile.id}
                    initial={false}
                    animate={{
                      scale: 1 - (idx + 1) * 0.04,
                      y: (idx + 1) * 8,
                      opacity: 1 - (idx + 1) * 0.2,
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: -idx - 1 }}
                  >
                    <Card className="h-full bg-card/80 border border-border/50 rounded-2xl overflow-hidden" />
                  </motion.div>
                ))}

                {/* Active card */}
                <motion.div
                  key={currentProfile.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ x, y, rotate }}
                  drag={!isAnimating}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.9}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ cursor: 'grabbing' }}
                  className="absolute inset-0 cursor-grab touch-none"
                >
                  <Card className="h-full bg-card border border-primary/20 rounded-2xl overflow-hidden shadow-lg">
                    <RealProfileCard profile={currentProfile} />
                  </Card>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-3 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-11 h-11 rounded-full border-2 border-destructive hover:bg-destructive/10 shadow-md"
                  onClick={() => handleSwipe('left')}
                  disabled={isAnimating}
                >
                  <X className="w-4 h-4 text-destructive" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-11 h-11 rounded-full border-2 border-accent hover:bg-accent/10 shadow-md"
                  onClick={() => handleSwipe('up')}
                  disabled={isAnimating}
                >
                  <Star className="w-4 h-4 text-accent" />
                </Button>
                <Button
                  size="sm"
                  className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 shadow-md"
                  onClick={() => handleSwipe('right')}
                  disabled={isAnimating}
                >
                  <Heart className="w-5 h-5 fill-primary-foreground" />
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4 lg:hidden">
                Swipe right to like • Swipe left to pass
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center px-4"
            >
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No more profiles</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {profiles.length === 0 ? 'No users have joined yet. Invite others to the platform!' : 'Adjust your filters to see more'}
              </p>
              {profiles.length > 0 && (
                <Button onClick={handleClearFilters} className="bg-primary hover:bg-primary/90">
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function RealProfileCard({ profile }: { profile: DiscoverProfile }) {
  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-card to-card/95">
      {/* User Type Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-2 py-0.5 text-[10px] sm:text-sm font-semibold shadow-lg border border-primary/30">
          {profile.user_type === 'creator' ? '🎨 Creator' : '🏢 Brand'}
        </Badge>
      </div>

      {/* Profile Image / Avatar */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {initials}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="relative flex-1 p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-bold leading-tight">{profile.full_name}</h3>
          {profile.handle && (
            <p className="text-muted-foreground text-xs">@{profile.handle}</p>
          )}
        </div>

        {/* Niche Badge */}
        {profile.niche && (
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 w-fit">
            {profile.niche}
          </Badge>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {profile.location && (
            <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{profile.location}</span>
            </div>
          )}
          {profile.user_type === 'creator' && profile.follower_count != null && (
            <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
              <Users className="w-3 h-3" />
              <span>{(profile.follower_count / 1000).toFixed(0)}K followers</span>
            </div>
          )}
          {profile.user_type === 'creator' && profile.engagement_rate != null && (
            <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
              <TrendingUp className="w-3 h-3" />
              <span>{profile.engagement_rate}% ER</span>
            </div>
          )}
          {profile.user_type === 'brand' && profile.marketing_budget != null && (
            <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
              <DollarSign className="w-3 h-3" />
              <span>₹{(profile.marketing_budget / 1000).toFixed(0)}K budget</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
              <Globe className="w-3 h-3" />
              <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-[11px] text-muted-foreground line-clamp-3">{profile.bio}</p>
        )}

        {/* View Profile Button */}
        <div className="pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/profile/${profile.id}`, '_blank');
            }}
          >
            View Full Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
