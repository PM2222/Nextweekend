import React from 'react';
import { styles } from '../theme/styles';
import { Sparkles, Calendar, Heart, Map, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const steps = [
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Sign Up",
    description: "Create your account and tell us about your interests and preferences.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Set Preferences",
    description: "Tell us what you both love doing and your ideal weekend vibe.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    icon: <Map className="w-8 h-8" />,
    title: "Get Personalized Plans",
    description: "Receive AI-curated weekend plans tailored to your preferences.",
    image: "https://images.unsplash.com/photo-1484156818044-c040038b0719?auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Fine-tune Together",
    description: "Collaborate and adjust plans until they're perfect for both of you.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=400&q=80"
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Create Memories",
    description: "Enjoy your perfectly planned weekend activities together.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&h=400&q=80"
  }
];

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary-highlight pt-20 pb-16">
        <div className={styles.container}>
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-primary-accent/10 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-primary-main" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-main mb-6">
              How NextWeekend Works
            </h1>
            <p className="text-xl text-primary-light max-w-2xl mx-auto">
              Transform your weekends from ordinary to extraordinary in just a few simple steps.
            </p>
          </div>

          {/* Steps Section */}
          <div className="space-y-24 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} 
                  items-center gap-8 md:gap-12`}
              >
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className={`inline-flex items-center justify-center p-4 rounded-2xl 
                    bg-primary-accent/10 mb-6 transform transition-all duration-300 
                    hover:scale-110 hover:rotate-6`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-primary-main mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-primary-light">
                    {step.description}
                  </p>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-primary-accent/20 rounded-3xl 
                      transform rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                    <img 
                      src={step.image}
                      alt={step.title}
                      className="relative rounded-2xl shadow-lg transform transition-transform 
                        duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-24">
            <h2 className="text-3xl font-bold text-primary-main mb-6">
              Ready to Transform Your Weekends?
            </h2>
            <Link 
              to="/signup"
              className={`${styles.button.primary} inline-flex items-center group`}
            >
              Get Started
              <Calendar className="w-5 h-5 ml-2 transform transition-transform group-hover:rotate-12" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}