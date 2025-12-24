import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Sparkles, MessageCircle, Rocket } from "lucide-react";

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(0);

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Tell us about yourself—your niche, your vibe, your goals. Takes less than 5 minutes.",
      icon: UserPlus,
    },
    {
      number: "02",
      title: "Get Matched",
      description: "Our algorithm finds your perfect matches. Swipe right on the ones you like.",
      icon: Sparkles,
    },
    {
      number: "03",
      title: "Connect & Chat",
      description: "When it's mutual, start a conversation. No awkward intros—you already know it's a fit.",
      icon: MessageCircle,
    },
    {
      number: "04",
      title: "Create Together",
      description: "Collaborate on campaigns, track deliverables, and get paid—all in one place.",
      icon: Rocket,
    },
  ];

  const handleCardClick = (index: number) => {
    setActiveStep(activeStep === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
                How It Works
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Collabs made{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ridiculously simple
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're a creator looking for brand deals or a brand hunting for authentic voices—we've got you.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Cards Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const Icon = step.icon;
                
                return (
                  <motion.div
                    key={step.number}
                    layout
                    onClick={() => handleCardClick(index)}
                    className={`
                      relative cursor-pointer rounded-3xl overflow-hidden
                      transition-all duration-300 ease-out
                      ${isActive 
                        ? 'bg-primary shadow-xl shadow-primary/20 scale-[1.02]' 
                        : 'bg-card hover:bg-accent/5 shadow-lg hover:shadow-xl hover:scale-[1.01]'
                      }
                    `}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Card Header - Always Visible */}
                    <div className="p-6 md:p-8 flex items-center gap-4 md:gap-6">
                      <div className={`
                        flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center
                        transition-colors duration-300
                        ${isActive 
                          ? 'bg-primary-foreground/20' 
                          : 'bg-primary/10'
                        }
                      `}>
                        <Icon className={`
                          w-6 h-6 md:w-7 md:h-7 transition-colors duration-300
                          ${isActive ? 'text-primary-foreground' : 'text-primary'}
                        `} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className={`
                          text-xs font-semibold uppercase tracking-wider mb-1 block
                          transition-colors duration-300
                          ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}
                        `}>
                          Step {step.number}
                        </span>
                        <h3 className={`
                          text-xl md:text-2xl font-bold transition-colors duration-300
                          ${isActive ? 'text-primary-foreground' : 'text-foreground'}
                        `}>
                          {step.title}
                        </h3>
                      </div>

                      {/* Expand Indicator */}
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${isActive 
                          ? 'bg-primary-foreground/20 rotate-180' 
                          : 'bg-muted'
                        }
                      `}>
                        <svg 
                          className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expandable Description */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                            <div className="pl-[4.5rem] md:pl-[5.5rem]">
                              <p className="text-primary-foreground/90 text-base md:text-lg leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of creators and brands already making magic happen.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate("/login?mode=signup")}
            >
              Join Free
            </Button>
          </div>
        </section>
      </main>
      <Footer ref={footerRef} />
    </>
  );
};

export default HowItWorksPage;
