import React from 'react';
import { ArrowRight } from 'lucide-react';
import { styles } from '../theme/styles';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <div className="bg-primary-main py-16">
      <div className={styles.container}>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready for Better Weekends?
          </h2>
          <p className="text-xl text-primary-highlight/90 mb-8 max-w-2xl mx-auto">
            Join thousands of couples who are already enjoying AI-planned perfect weekends.
          </p>
          <Link 
            to="/signup" 
            className={`${styles.button.highlight} inline-flex items-center hover:scale-105 transition-transform duration-300`}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}