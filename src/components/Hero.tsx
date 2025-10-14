import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp } from "lucide-react";
import logo from "@/assets/cloutcash-logo.png";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="CloutCash Logo" className="h-20 md:h-24 mb-8 animate-fade-in" />
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Where Micro-Influencers
            <br />
            Meet Brand Opportunities
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-12">
            IP-driven matchmaking platform connecting micro-influencers (10K-100K followers) 
            with transparent, data-backed brand collaborations. Earn consistently with measurable ROI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button variant="hero" size="lg" className="text-lg px-10 py-6 h-auto">
              I'm an Influencer
              <Users className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline-hero" size="lg" className="text-lg px-10 py-6 h-auto">
              I'm a Brand
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <StatCard number="10K+" label="Active Creators" />
            <StatCard number="500+" label="Brand Partners" />
            <StatCard number="95%" label="Match Success" />
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{number}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);
