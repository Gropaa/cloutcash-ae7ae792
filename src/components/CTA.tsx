import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Influencer Marketing?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
            Join 10,000+ creators and 500+ brands already using CloutCash to build 
            authentic, profitable partnerships. Get matched in 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-lg px-10 py-6 h-auto bg-white text-primary hover:bg-white/90"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline-hero" 
              size="lg" 
              className="text-lg px-10 py-6 h-auto border-white text-white hover:bg-white hover:text-primary"
            >
              Book a Demo
            </Button>
          </div>

          <p className="text-sm text-white/70">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};
