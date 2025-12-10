import { Button } from "@/components/ui/button";
import { Check, Sparkles, DollarSign, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ForInfluencers = () => {
  const navigate = useNavigate();
  const benefits = [
    "Access 500+ verified brand campaigns monthly",
    "Transparent budget ranges from ₹5K to ₹50K+ per campaign",
    "No middlemen - negotiate directly with brands",
    "Track your earnings and performance metrics",
    "Get matched based on your authentic audience data",
    "Build long-term partnerships with growing brands"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              For Influencers
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Turn Your Influence Into
              <span className="text-primary"> Consistent Income</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Stop waiting for brands to find you. Get matched with campaigns that fit your content, 
              audience, and rates. No more guesswork, just transparent opportunities.
            </p>

            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-10 py-6 h-auto group"
              onClick={() => navigate("/login?mode=signup")}
            >
              Start Earning Today
              <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <MetricCard
              icon={DollarSign}
              metric="₹35K"
              label="Average Campaign Value"
              color="primary"
            />
            <MetricCard
              icon={Calendar}
              metric="12+"
              label="Campaigns Per Month"
              color="accent"
            />
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <blockquote className="italic text-muted-foreground mb-4">
                "CloutCash helped me land 8 brand deals in my first month. The transparent pricing 
                and quick matching process is a game-changer."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full"></div>
                <div>
                  <p className="font-semibold text-foreground">Priya Sharma</p>
                  <p className="text-sm text-muted-foreground">Beauty & Lifestyle • 45K followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricCard = ({ icon: Icon, metric, label, color }: { icon: any; metric: string; label: string; color: string }) => (
  <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <Icon className={`h-10 w-10 text-${color}`} />
      <div className="text-right">
        <div className={`text-4xl font-bold text-${color}`}>{metric}</div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  </div>
);
