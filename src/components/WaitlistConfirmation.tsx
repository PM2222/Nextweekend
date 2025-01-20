import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, PartyPopper, Calendar } from 'lucide-react';
import { styles } from '../theme/styles';

export default function WaitlistConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;

  useEffect(() => {
    if (!message) {
      navigate('/signup');
    }
  }, [message, navigate]);

  if (!message) return null;

  return (
    <div className="min-h-screen bg-primary-highlight flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-primary-main/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div 
          className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full mx-4 shadow-2xl animate-[popIn_0.5s_ease-out]"
          style={{
            animation: 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          }}
        >
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-ping">
                <PartyPopper className="w-12 h-12 text-primary-accent opacity-50" />
              </div>
              <PartyPopper className="w-12 h-12 text-primary-accent relative" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-primary-main mt-6 mb-4">
              You're in!
            </h1>
            
            <div className="flex justify-center mb-6">
              <Sparkles className="w-6 h-6 text-primary-accent animate-[spin_3s_linear_infinite]" />
            </div>
            
            <p className="text-xl text-primary-light mb-8">
              Thank you for joining our waitlist! We'll notify you as soon as we're ready to revolutionize your weekends.
            </p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate('/')}
                className={`${styles.button.primary} w-full flex items-center justify-center group`}
              >
                <span className="flex items-center">
                  Back to Home
                  <Calendar className="w-5 h-5 ml-2 transform transition-transform group-hover:rotate-12" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}