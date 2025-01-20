import React from 'react';
import { Sparkles } from 'lucide-react';
import { styles } from '../theme/styles';
import { Link } from 'react-router-dom';

const stats = [
  { value: '300+', label: 'Activities' },
  { value: '50+', label: 'Cities' },
  { value: '1000+', label: 'Hours of Fun' }
];

export default function Hero() {
  return (
    <div className="pt-32 pb-16 bg-primary-highlight">
      <div className={styles.container}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-main">
              Unleash Your
              <span className="block">Weekends with</span>
              <span className="text-primary-accent">Top Activities</span>
            </h1>
            
            <p className="text-xl text-primary-light max-w-xl">
              Elevate your weekend experiences with our curated selection of activities, 
              designed to inspire, connect, and create unforgettable moments together.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-8 py-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary-main mb-2">
                    {stat.value}
                  </div>
                  <div className="text-primary-light text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/signup" 
                className={`${styles.button.primary} flex items-center justify-center`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Planning
              </Link>
              <button className={`${styles.button.secondary} flex items-center justify-center`}>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative hidden lg:block">
            <div className="aspect-square w-full max-w-lg mx-auto">
              <img 
                src="https://i.imgur.com/Yr1Uwk9.jpeg"
                alt="Couple enjoying weekend activities"
                className="rounded-3xl shadow-2xl transform transition-all duration-500 
                  hover:rotate-2 object-cover w-full h-full"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-primary-accent/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}