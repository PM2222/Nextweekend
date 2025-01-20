import React from 'react';
import { Check, Star } from 'lucide-react';
import { styles } from '../theme/styles';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: '9.99',
    interval: 'month',
    features: [
      '5 Weekend Plans per Month',
      'Basic AI Recommendations',
      'Local Activities',
      'Email Support'
    ]
  },
  {
    name: 'Pro',
    price: '19.99',
    interval: 'month',
    popular: true,
    features: [
      'Unlimited Weekend Plans',
      'Advanced AI Recommendations',
      'Local & Travel Activities',
      'Priority Support',
      'Custom Preferences',
      'Calendar Integration'
    ]
  },
  {
    name: 'Annual Pro',
    price: '199.99',
    interval: 'year',
    features: [
      'All Pro Features',
      '2 Months Free',
      'Exclusive Events',
      'Early Access to New Features',
      'Personalized Concierge'
    ]
  }
];

export default function Pricing() {
  return (
    <div id="pricing" className="py-24 bg-primary-highlight">
      <div className={styles.container}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-main mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-primary-light">
            Choose the perfect plan for your weekend adventures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-2xl p-8
                ${plan.popular 
                  ? 'bg-primary-main text-primary-highlight shadow-xl transform scale-105' 
                  : 'bg-white text-primary-main shadow-lg'}
                transition-all duration-300 hover:shadow-xl
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-accent text-primary-main px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-sm ml-2">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className={`w-5 h-5 mr-2 ${plan.popular ? 'text-primary-accent' : 'text-primary-accent'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`
                  w-full py-3 px-6 rounded-full font-semibold
                  transition-all duration-300 block text-center
                  ${plan.popular
                    ? 'bg-primary-accent text-primary-main hover:bg-primary-highlight'
                    : 'bg-primary-main text-primary-highlight hover:bg-primary-dark'}
                `}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-primary-light">
            All plans include a 14-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}