import { UserPlus, Search, Handshake, TrendingUp } from "lucide-react";

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From signup to successful collaboration in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard
            number="1"
            icon={UserPlus}
            title="Create Profile"
            description="Sign up and connect your social media. We'll auto-fetch your metrics and audience data."
          />
          <StepCard
            number="2"
            icon={Search}
            title="Get Matched"
            description="Our AI scans thousands of opportunities to find your perfect brand partnerships."
          />
          <StepCard
            number="3"
            icon={Handshake}
            title="Connect & Negotiate"
            description="Review matches, connect with brands, and finalize collaboration terms transparently."
          />
          <StepCard
            number="4"
            icon={TrendingUp}
            title="Deliver & Earn"
            description="Create content, track performance, and get paid. Build long-term partnerships."
          />
        </div>

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
