import React, { useEffect, useRef } from 'react';
import { Calendar, Heart, Map, Clock, Zap, Coffee } from 'lucide-react';
import { styles } from '../theme/styles';

const features = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "AI-Powered Planning",
    description: "Get personalized weekend plans based on your preferences and past activities",
    images: [
      "https://images.unsplash.com/photo-1515847049296-a281d6401047?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f?auto=format&fit=crop&w=150&h=150&q=80"
    ]
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Couple-Focused",
    description: "Activities that bring you closer and create lasting memories together",
    images: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1621112904887-419379ce6824?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1542378151504-0361b8ec8f93?auto=format&fit=crop&w=150&h=150&q=80"
    ]
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Local Discovery",
    description: "Uncover hidden gems and new experiences in your area",
    images: [
      "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=150&h=150&q=80"
    ]
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Time Management",
    description: "Perfectly timed itineraries that make the most of your weekend",
    images: [
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=150&h=150&q=80"
    ]
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Ideas",
    description: "Get immediate suggestions when plans change last minute",
    images: [
      "https://images.unsplash.com/photo-1496449903678-68ddcb189a24?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=150&h=150&q=80"
    ]
  },
  {
    icon: <Coffee className="w-6 h-6" />,
    title: "Mood Matching",
    description: "Activities aligned with your energy level and current mood",
    images: [
      "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=150&h=150&q=80"
    ]
  }
];

export default function Features() {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const row = Math.floor(index / 3);
            const delay = row * 300 + (index % 3) * 150;
            
            setTimeout(() => {
              entry.target.classList.remove('opacity-0', 'translate-y-8', 'scale-95');
              entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
              
              setTimeout(() => {
                entry.target.classList.add('animate-float');
              }, 500);
            }, delay);
            
            observer.unobserve(entry.target);
          }
        },
        {
          threshold: 0.5,
          rootMargin: '-50px 0px'
        }
      );

      if (ref) {
        observer.observe(ref);
      }

      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div id="features" className="py-24 bg-primary-highlight">
      <div className={styles.container}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-main mb-4">
            Everything You Need for Perfect Weekends
          </h2>
          <p className="text-xl text-primary-light">
            Powered by AI, designed for couples who want to make the most of their time together.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => featureRefs.current[index] = el}
              className={`
                relative
                bg-white/80 backdrop-blur-sm p-8 rounded-2xl
                shadow-lg hover:shadow-xl
                border border-primary-accent/20
                opacity-0 translate-y-8 scale-95
                transform transition-all duration-500 ease-out
                hover:border-primary-accent/40
                group
              `}
            >
              <div className="text-primary-main mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:text-primary-accent">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary-main mb-2">{feature.title}</h3>
              <p className="text-primary-light">{feature.description}</p>
              
              {/* Hover Images */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2">
                {feature.images.map((img, i) => (
                  <div 
                    key={i}
                    className={`
                      w-16 h-16 rounded-full overflow-hidden
                      border-2 border-primary-accent
                      shadow-lg
                      transform transition-all duration-300
                      hover:scale-110
                      translate-y-8 group-hover:translate-y-0
                      opacity-0 group-hover:opacity-100
                    `}
                    style={{
                      transitionDelay: `${i * 100}ms`,
                      animationDelay: `${i * 100}ms`
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`${feature.title} example ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}