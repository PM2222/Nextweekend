import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { styles } from '../theme/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-primary-dark/60 backdrop-blur-md fixed w-full z-50 border-b border-primary-accent/10 rounded-b-[2rem] shadow-sm">
      <div className={styles.container}>
        <div className="flex justify-between items-center h-20">
          <Logo />
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="nav-link"
              onClick={handleFeaturesClick}
            >
              Features
            </a>
            <Link to="/how-it-works" className="nav-link">How it Works</Link>
            <a 
              href="#pricing" 
              className="nav-link"
              onClick={handlePricingClick}
            >
              Pricing
            </a>
            {session ? (
              <Link 
                to="/dashboard" 
                className={`${styles.button.primary} flex items-center gap-2`}
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
            ) : (
              <Link to="/signup" className={styles.button.primary}>
                Get Started
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl hover:bg-primary-accent/10 transition-all duration-300 hover:scale-105 hover:rotate-3"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-primary-highlight" />
              ) : (
                <Menu className="h-6 w-6 text-primary-highlight" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-3/4 bg-primary-dark/60 backdrop-blur-md
          transform transition-transform duration-300 ease-in-out z-40
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
          flex flex-col
          pt-24 pb-8 px-6
          border-l border-primary-accent/10
        `}
      >
        <div className="flex flex-col space-y-6">
          <a 
            href="#features"
            className="text-primary-highlight text-lg font-medium hover:text-primary-accent transition-colors"
            onClick={(e) => {
              handleFeaturesClick(e);
              setIsMenuOpen(false);
            }}
          >
            Features
          </a>
          <Link
            to="/how-it-works"
            className="text-primary-highlight text-lg font-medium hover:text-primary-accent transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            How it Works
          </Link>
          <a 
            href="#pricing" 
            className="text-primary-highlight text-lg font-medium hover:text-primary-accent transition-colors"
            onClick={(e) => {
              handlePricingClick(e);
              setIsMenuOpen(false);
            }}
          >
            Pricing
          </a>
          <div className="pt-4">
            {session ? (
              <Link 
                to="/dashboard" 
                className={`${styles.button.primary} w-full justify-center flex items-center gap-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
            ) : (
              <Link 
                to="/signup" 
                className={`${styles.button.primary} w-full justify-center`}
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}