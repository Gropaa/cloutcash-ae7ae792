import { UserPlus, Search, Handshake, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose your journey and start matching in minutes
          </p>
        </div>

        <Tabs defaultValue="influencer" className="max-w-5xl mx-auto mb-16">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="influencer" className="text-lg py-3">
              For Influencers
            </TabsTrigger>
            <TabsTrigger value="brand" className="text-lg py-3">
              For Brands
            </TabsTrigger>
          </TabsList>

          <TabsContent value="influencer">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StepCard
                number="1"
                icon={UserPlus}
                title="Create Profile"
                description="Connect your Instagram and we'll automatically fetch your metrics, audience demographics, and engagement data."
              />
              <StepCard
                number="2"
                icon={Search}
                title="Get Matched"
                description="Our AI intelligently analyzes your content style and audience to find campaigns that perfectly align with your niche."
              />
              <StepCard
                number="3"
                icon={Handshake}
                title="Review & Connect"
                description="Browse matched campaigns, see transparent budgets, and connect directly with brands you truly love."
              />
              <StepCard
                number="4"
                icon={TrendingUp}
                title="Create & Earn"
                description="Deliver your content, track performance in real-time, and receive payment securely through our streamlined and reliable platform."
              />
            </div>
          </TabsContent>

          <TabsContent value="brand">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StepCard
                number="1"
                icon={UserPlus}
                title="Post Campaign"
                description="Define your campaign goals, budget, target audience, and content requirements in just a few minutes."
              />
              <StepCard
                number="2"
                icon={Search}
                title="Get Recommendations"
                description="Receive AI-curated creator recommendations based on quality and performance metrics."
              />
              <StepCard
                number="3"
                icon={Handshake}
                title="Review & Select"
                description="Browse creator portfolios, compare metrics, and shortlist the perfect creators for your campaign in a jiffy."
              />
              <StepCard
                number="4"
                icon={TrendingUp}
                title="Launch & Track"
                description="Manage collaborations, track campaign analytics, and measure ROI with detailed performance reports."
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 text-center">
          <div className="inline-block bg-primary/10 border border-primary/20 rounded-2xl px-8 py-6">
            <p className="text-lg font-semibold text-foreground mb-2">
              Average Time to First Match
            </p>
            <p className="text-4xl font-bold text-primary">24 Hours</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ number, icon: Icon, title, description }: { number: string; icon: any; title: string; description: string }) => (
  <div className="relative">
    <div className="bg-card border-2 border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">
        {number}
      </div>
      <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);
