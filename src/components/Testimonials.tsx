import { Star, TrendingUp, Users, DollarSign } from "lucide-react";
export const Testimonials = () => {
  const metrics = [{
    icon: Users,
    value: "10K+",
    label: "Matches Made",
    color: "primary"
  }, {
    icon: DollarSign,
    value: "₹2Cr+",
    label: "In Brand Collaborations",
    color: "accent"
  }, {
    icon: TrendingUp,
    value: "95%",
    label: "Match Success Rate",
    color: "primary"
  }, {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
    color: "accent"
  }];
  const testimonials = [{
    quote: "CloutCash completely transformed how I work with brands. I went from 2 campaigns a year to 15+ with better rates and full transparency.",
    author: "Ananya Verma",
    role: "Food & Travel Creator",
    followers: "62K followers",
    image: "bg-gradient-to-br from-primary to-accent"
  }, {
    quote: "The ROI we get from micro-influencers on CloutCash is 5x better than traditional campaigns. Plus, the data insights are invaluable.",
    author: "Karan Singh",
    role: "Growth Lead",
    company: "FitLife Nutrition",
    image: "bg-gradient-to-br from-accent to-primary"
  }, {
    quote: "Finally, a platform that values authentic engagement over vanity metrics. I've built long-term partnerships that actually pay fairly.",
    author: "Meera Patel",
    role: "Sustainable Fashion Advocate",
    followers: "48K followers",
    image: "bg-gradient-to-br from-primary/80 to-accent/80"
  }];
  return <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Metrics Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Trusted by Thousands of
            <span className="text-primary"> Creators & Brands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join India’s fastest-growing creator–brand collaboration network.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {metrics.map((metric, index) => <div key={index} className="bg-card border border-border rounded-2xl p-6 text-center hover-lift" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <metric.icon className={`h-8 w-8 mx-auto mb-3 text-${metric.color}`} />
              <div className={`text-3xl md:text-4xl font-bold mb-1 text-${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>)}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-card border border-border rounded-2xl p-8 hover-lift" style={{
          animationDelay: `${index * 0.15}s`
        }}>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              
              <blockquote className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`w-12 h-12 rounded-full ${testimonial.image}`}></div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  {testimonial.followers && <p className="text-xs text-muted-foreground">{testimonial.followers}</p>}
                  {testimonial.company && <p className="text-xs text-muted-foreground">{testimonial.company}</p>}
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};