import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, MapPin, DollarSign, TrendingUp, Users, Loader2, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useMatchFeed } from '@/hooks/useMatchFeed';
import { useFeedback } from '@/hooks/useFeedback';
import { Navbar } from '@/components/Navbar';
import { Influencer } from '@/types/matchmaking';
import { toast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { candidates, loading, fetchMore, hasMore, updateFilters, refetch } = useMatchFeed('brand');
  const { recordFeedback } = useFeedback();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter states
  const [filterNiches, setFilterNiches] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterBudgetRange, setFilterBudgetRange] = useState([0]);
  const [filterEngagement, setFilterEngagement] = useState([0]);
  const [filterFollowers, setFilterFollowers] = useState([0]);

  // Get current and next cards
  const currentCandidate = candidates[currentIndex];
  const nextCards = candidates.slice(currentIndex + 1, currentIndex + 3);
  
  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-15, 15]);

  // Load more candidates when running low
  useEffect(() => {
    if (candidates.length - currentIndex < 5 && hasMore && !loading) {
      fetchMore();
    }
  }, [currentIndex, candidates.length, hasMore, loading, fetchMore]);

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    if (!currentCandidate || isAnimating) return;

    setIsAnimating(true);
    const cardId = currentCandidate.item.id;
    const interactionType = direction === 'right' ? 'like' : direction === 'up' ? 'superlike' : 'pass';
    
    recordFeedback(cardId, interactionType);

    // Animate card exit
    const exitX = direction === 'left' ? -500 : direction === 'right' ? 500 : 0;
    const exitY = direction === 'up' ? -500 : 0;
    
    x.set(exitX);
    y.set(exitY);

    // Move to next card after animation
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      x.set(0);
      y.set(0);
      setIsAnimating(false);
    }, 200);
  }, [currentCandidate, isAnimating, recordFeedback, x, y]);

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    if (isAnimating) return;

    const swipeThreshold = 100;
    const velocity = Math.abs(info.velocity.x);
    
    if (Math.abs(info.offset.x) > swipeThreshold || velocity > 500) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    } else if (info.offset.y < -swipeThreshold) {
      handleSwipe('up');
    } else {
      // Snap back with spring animation
      x.set(0);
      y.set(0);
    }
  }, [isAnimating, handleSwipe, x, y]);

  const handleApplyFilters = async () => {
    setIsApplyingFilters(true);
    
    await updateFilters({
      niches: filterNiches ? filterNiches.split(',').map(n => n.trim()) : undefined,
      geo: filterLocation ? filterLocation.split(',').map(l => l.trim()) : undefined,
      maxPrice: filterBudgetRange[0] > 0 ? filterBudgetRange[0] : undefined,
      minEngagement: filterEngagement[0] > 0 ? filterEngagement[0] : undefined,
      minFollowers: filterFollowers[0] > 0 ? filterFollowers[0] : undefined,
    });
    await refetch();
    
    setCurrentIndex(0);
    setIsApplyingFilters(false);
    setFiltersOpen(false);
    
    toast({
      title: "Filters Applied",
      description: "Showing updated results",
    });
  };

  const handleClearFilters = () => {
    setFilterNiches('');
    setFilterLocation('');
    setFilterBudgetRange([0]);
    setFilterEngagement([0]);
    setFilterFollowers([0]);
    updateFilters({});
    setCurrentIndex(0);
    toast({
      title: "Filters Cleared",
      description: "Showing all profiles",
    });
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="niche" className="text-sm font-medium">Niche</Label>
        <Input
          id="niche"
          placeholder="e.g., Fashion, Tech"
          value={filterNiches}
          onChange={(e) => setFilterNiches(e.target.value)}
          className="mt-2 bg-background/50"
        />
      </div>

      <div>
        <Label htmlFor="location" className="text-sm font-medium">Location</Label>
        <Input
          id="location"
          placeholder="e.g., Mumbai, Delhi"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="mt-2 bg-background/50"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Budget Range (₹/post)</Label>
        <div className="mt-4 mb-2">
          <Slider
            value={filterBudgetRange}
            onValueChange={setFilterBudgetRange}
            max={100000}
            step={5000}
            className="mt-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>₹{filterBudgetRange[0].toLocaleString()}</span>
            
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Min Engagement Rate (%)</Label>
        <div className="mt-4 mb-2">
          <Slider
            value={filterEngagement}
            onValueChange={setFilterEngagement}
            max={20}
            step={0.5}
            className="mt-2"
          />
          <div className="text-sm text-muted-foreground mt-2">
            {filterEngagement[0]}%
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Min Followers</Label>
        <div className="mt-4 mb-2">
          <Slider
            value={filterFollowers}
            onValueChange={setFilterFollowers}
            max={1000000}
            step={10000}
            className="mt-2"
          />
          <div className="text-sm text-muted-foreground mt-2">
            {filterFollowers[0].toLocaleString()}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <Button 
          onClick={handleApplyFilters} 
          className="w-full"
          disabled={isApplyingFilters}
        >
          {isApplyingFilters ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            'Apply Filters'
          )}
        </Button>
        <Button 
          onClick={handleClearFilters} 
          variant="outline" 
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  if ((loading && candidates.length === 0) || isApplyingFilters) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isApplyingFilters ? 'Applying filters...' : 'Loading profiles...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-80 border-r border-border bg-card/50 backdrop-blur-sm p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 text-foreground">Filters</h2>
          <FiltersContent />
        </div>
        {/* Main Content - Swipe Cards */}
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

          {currentCandidate ? (
            <div className="relative w-full max-w-sm sm:max-w-md flex flex-col h-full max-h-[720px]">
              {/* Card Stack */}
              <div className="relative w-full max-w-md h-[590px] sm:h-[700px]">
                {/* Background cards with stagger effect */}
                {nextCards.map((candidate, idx) => (
                  <motion.div
                    key={candidate.item.id}
                    initial={false}
                    animate={{ 
                      scale: 1 - (idx + 1) * 0.04, 
                      y: (idx + 1) * 8,
                      opacity: 1 - (idx + 1) * 0.2 
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: -idx - 1 }}
                  >
                    <Card className="h-full bg-card/80 border border-border/50 rounded-2xl overflow-hidden" />
                  </motion.div>
                ))}

                {/* Active card */}
                <motion.div
                  key={currentCandidate.item.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    x: x.get(),
                    y: y.get(),
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                  }}
                  style={{
                    x,
                    y,
                    rotate,
                  }}
                  drag={!isAnimating}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.9}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ cursor: 'grabbing' }}
                  className="absolute inset-0 cursor-grab touch-none"
                >
                  <Card className="h-full bg-card border border-primary/20 rounded-2xl overflow-hidden shadow-lg">
                    <ProfileCard influencer={currentCandidate.item} matchScore={currentCandidate.score} />
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

              {/* Swipe hints - mobile only */}
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
              <p className="text-sm sm:text-base text-muted-foreground mb-4">Adjust your filters to see more</p>
              <Button onClick={handleClearFilters} className="bg-primary hover:bg-primary/90">
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ influencer, matchScore }: { influencer: Influencer; matchScore: number }) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-card to-card/95">
      {/* Match Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-2 py-0.5 text-[10px] sm:text-sm font-semibold shadow-lg border border-primary/30">
          {Math.round(matchScore * 100)}% Match
        </Badge>
      </div>

      {/* Profile Image */}
      <div className="relative h-32 sm:h-36 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10">
        {influencer.avatar ? (
          <img
            src={influencer.avatar}
            alt={influencer.name || influencer.handle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center"> */}
              <Users className="w-10 h-10 text-primary/50" />
            {/* </div> */}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="relative flex-1 p-3 space-y-3 flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-bold leading-tight">{influencer.name || influencer.handle}</h3>
          <p className="text-muted-foreground text-xs">{influencer.handle}</p>
        </div>

        {/* Niche Badge */}
        {/* <div> */}
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 w-fit">
            {influencer.niches[0]}
          </Badge>
        {/* </div> */}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
            <MapPin className="w-3 h-3"/>
            <span className="truncate">{influencer.audienceGeo[0]}</span>
          </div>
          <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
            <DollarSign className="w-3 h-3" />
            <span>₹{(influencer.pricePerPost / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
            <Users className="w-3 h-3" />
            <span>{(influencer.followers / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-1 bg-background/40 rounded-md px-2 py-1">
            <TrendingUp className="w-3 h-3"/>
            <span>{influencer.engagementRate}%</span>
          </div>
        </div>

        {/* Bio - hide on very small screens */}
        {influencer.bio && (
          <p className="text-[11px] text-muted-foreground line-clamp-2">{influencer.bio}</p>
        )}

        {/* Mini Insights */}
        {/* <div className="pt-2 sm:pt-3 border-t border-border/50"> */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-2 border-t border-border/50">
            <div className="bg-primary/5 rounded-lg py-1.5 sm:py-2 border border-primary/10">
              <div className="text-muted-foreground">Overlap</div>
              <div className="font-semibold">
                {Math.round(matchScore * 85)}%
              </div>
            </div>
            <div className="bg-accent/5 rounded-lg py-1.5 sm:py-2 border border-accent/10">
              <div className="text-muted-foreground">Engagement</div>
              <div className="font-semibold">
                {influencer.engagementRate}%
              </div>
            </div>
            <div className="bg-muted rounded-lg py-1.5 sm:py-2 border border-border/50">
              <div className="text-muted-foreground">Response</div>
              <div className="font-semibold">~2h</div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}