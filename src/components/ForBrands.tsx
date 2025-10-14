import { Button } from "@/components/ui/button";
import { Check, Target, BarChart, Users } from "lucide-react";

export const ForBrands = () => {
  const benefits = [
    "Access 10,000+ verified micro-influencers",
    "Target specific niches with precision matching",
    "Track ROI with detailed performance analytics",
    "Pay only for successful collaborations (10-15% platform fee)",
    "Automated campaign management and reporting",
    "Scale from pilot to enterprise campaigns"
  ];

  return (
    <section className="py-20 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-1 gap-6 order-2 lg:order-1">
            <div className="bg-card/10 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">5X</div>
                  <div className="text-sm text-white/70">Better ROI vs Traditional</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card/10 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-accent/20 p-3 rounded-xl">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">85%</div>
                  <div className="text-sm text-white/70">Higher Engagement Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-card/10 backdrop-blur border border-white/10 rounded-2xl p-8">
              <blockquote className="italic text-white/80 mb-4">
                "We ran 20 campaigns through CloutCash and saw 3x better engagement than 
                working with macro-influencers. The data transparency is unmatched."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full"></div>
                <div>
                  <p className="font-semibold text-white">Rahul Mehta</p>
                  <p className="text-sm text-white/60">Marketing Director, TechGear India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              For Brands
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Find Authentic Creators Who
              <span className="text-primary"> Drive Real Results</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Skip the agencies. Our AI matches you with micro-influencers whose audiences 
              align perfectly with your brand. Get measurable ROI from every campaign.
            </p>

            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary/20 rounded-full p-1 mt-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="text-lg px-10 py-6 h-auto">
              Launch Your Campaign
              <BarChart className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
