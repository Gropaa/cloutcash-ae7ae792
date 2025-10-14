import { Sparkles, Target, BarChart3, Shield, Zap, Users } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Matching",
      description: "Our proprietary algorithm matches influencers with brands based on audience overlap, engagement, and campaign goals."
    },
    {
      icon: Target,
      title: "Niche Precision",
      description: "Find perfect-fit partnerships in your specific content vertical, from beauty to tech to lifestyle."
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description: "Access real engagement metrics, audience demographics, and performance analytics for every match."
    },
    {
      icon: Shield,
      title: "Transparent Pricing",
      description: "No hidden fees. See budget ranges upfront and negotiate fair deals with full visibility."
    },
    {
      icon: Zap,
      title: "Quick Connections",
      description: "Get matched with relevant opportunities daily. From discovery to deal in days, not months."
    },
    {
      icon: Users,
      title: "Quality Partners",
      description: "Vetted brands and verified influencers ensure authentic collaborations that drive real results."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            The Smartest Way to
            <span className="text-primary"> Match & Collaborate</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our IP-driven platform takes the guesswork out of influencer marketing with data-backed matchmaking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
      <Icon className="h-7 w-7 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);
