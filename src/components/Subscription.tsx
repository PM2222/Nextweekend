import React, { useState, useEffect } from 'react';
import { Star, Calendar } from 'lucide-react';
import { styles } from '../theme/styles';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';

export default function Subscription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'annual'>('pro');

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signup');
      }
    };
    checkAuth();
  }, [navigate]);

  const handlePlanSelect = async (plan: 'basic' | 'pro' | 'annual') => {
    setSelectedPlan(plan);
    window.location.href = 'https://buy.stripe.com/test_00g15befNaDk68EaEE';
  };

  const handleSubscriptionComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_tier: selectedPlan,
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary-highlight pt-20">
        <div className={styles.container}>
          <div className="max-w-3xl mx-auto pt-12 pb-16">
            <div className="text-center mb-8">
              <div className="bg-primary-light/10 p-2.5 rounded-2xl inline-block mb-4">
                <Star className="h-8 w-8 text-primary-main" />
              </div>
              <h1 className="text-3xl font-bold text-primary-main">
                Choose Your Plan
              </h1>
              <p className="text-primary-light mt-2">
                Select a plan that works best for you
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Basic Plan */}
              <div 
                className={`
                  relative rounded-2xl p-6 cursor-pointer transition-all
                  ${selectedPlan === 'basic' 
                    ? 'bg-primary-main text-white ring-2 ring-primary-accent' 
                    : 'bg-white text-primary-main hover:shadow-lg'}
                `}
                onClick={() => handlePlanSelect('basic')}
              >
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <div className="text-2xl font-bold mb-4">$9.99<span className="text-sm">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li>5 Weekend Plans per Month</li>
                  <li>Basic AI Recommendations</li>
                  <li>Email Support</li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div 
                className={`
                  relative rounded-2xl p-6 cursor-pointer transition-all
                  ${selectedPlan === 'pro'
                    ? 'bg-primary-main text-white ring-2 ring-primary-accent'
                    : 'bg-white text-primary-main hover:shadow-lg'}
                `}
                onClick={() => handlePlanSelect('pro')}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-accent text-primary-main px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-2xl font-bold mb-4">$19.99<span className="text-sm">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li>Unlimited Weekend Plans</li>
                  <li>Advanced AI Recommendations</li>
                  <li>Priority Support</li>
                  <li>Calendar Integration</li>
                </ul>
              </div>

              {/* Annual Plan */}
              <div 
                className={`
                  relative rounded-2xl p-6 cursor-pointer transition-all
                  ${selectedPlan === 'annual'
                    ? 'bg-primary-main text-white ring-2 ring-primary-accent'
                    : 'bg-white text-primary-main hover:shadow-lg'}
                `}
                onClick={() => handlePlanSelect('annual')}
              >
                <h3 className="text-xl font-bold mb-2">Annual Pro</h3>
                <div className="text-2xl font-bold mb-4">$199.99<span className="text-sm">/year</span></div>
                <ul className="space-y-2 text-sm">
                  <li>All Pro Features</li>
                  <li>2 Months Free</li>
                  <li>Exclusive Events</li>
                  <li>Early Access Features</li>
                </ul>
              </div>
            </div>

            {/* Show this button only if redirected back from Stripe */}
            {new URLSearchParams(window.location.search).get('payment') === 'success' && (
              <button 
                onClick={handleSubscriptionComplete}
                className={`${styles.button.primary} w-full flex items-center justify-center group`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Complete Setup
                    <Calendar className="w-5 h-5 ml-2 transform transition-transform group-hover:rotate-12" />
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}