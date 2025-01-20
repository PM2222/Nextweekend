import React from 'react';
import { Sparkles, Heart, Zap } from 'lucide-react';
import { styles } from '../theme/styles';

const benefits = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Personalisation like never before",
    description: "Our intelligent system learns your preferences and crafts perfectly tailored weekend experiences that both of you will love.",
    image: "https://i.imgur.com/prCtdQg.jpeg"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Unforgettable memories",
    description: "Discover activities that bring you closer together and create lasting memories through shared experiences and adventures.",
    image: "https://i.imgur.com/QlwpRNM.jpeg"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Less time planning, more time for fun",
    description: "Stop spending hours planning. Get instant, curated recommendations that match your interests, budget, and schedule.",
    image: "https://i.imgur.com/SOyrTH9.jpeg"
  }
];

export default function Benefits() {
  return (
    <div className="py-24 bg-white">
      <div className={styles.container}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-main mb-4">
            Why Couples Love NextWeekend
          </h2>
          <p className="text-xl text-primary-light max-w-2xl mx-auto">
            Experience the perfect blend of technology and romance to make every weekend special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Hover Overlay */}
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50" />

              {/* Centered Content on Hover */}
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-500 z-50 text-center w-full max-w-2xl">
                <div className="relative w-full h-48">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                </div>
                <h3 className="text-4xl font-bold text-white mb-4 mt-8">
                  {benefit.title}
                </h3>
                <p className="text-xl text-white/90">
                  {benefit.description}
                </p>
              </div>

              {/* Regular Card Content */}
              <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-primary-main/20 group-hover:bg-primary-main/0 transition-all duration-300" />
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Icon */}
                <div className="absolute top-40 left-6 bg-white p-4 rounded-2xl shadow-lg transform -translate-y-1/2 group-hover:scale-110 transition-all duration-300">
                  <div className="text-primary-accent">
                    {benefit.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary-main mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-primary-light leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}