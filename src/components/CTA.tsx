import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const CTA = () => {
  const navigate = useNavigate();
  return <section className="py-20 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Influencer Marketing?</h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">Join 10,000+ creators and 500+ brands using CloutCash to build authentic, profitable partnerships. Get matched with the right opportunities faster.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="secondary" size="lg" className="text-lg px-10 py-6 h-auto bg-white text-primary hover:bg-white/90 hover:scale-105 transition-transform group" onClick={() => navigate("/login")}>
              Start Matching
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline-hero" size="lg" className="text-lg px-10 py-6 h-auto border-2 border-white text-white hover:bg-white hover:text-primary transition-all">
              Book a Demo
            </Button>
          </div>

          <p className="text-sm text-white/70">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl animate-float" style={{
        animationDelay: "1.5s"
      }}></div>
      </div>
    </section>;
};