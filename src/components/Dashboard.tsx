import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { styles } from '../theme/styles';
import { Calendar, Settings, MapPin, Clock, DollarSign, LogOut } from 'lucide-react';
import { generateRecommendations, type Recommendation } from '../lib/recommendations';
import { CardSkeleton } from './LoadingSkeleton';

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadRecommendations();
    }
  }, [session]);

  const loadRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const recommendations = await generateRecommendations();
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <div className="min-h-screen bg-primary-highlight">
      <div className={`${styles.container} py-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary-main">
              Your Weekend Plans
            </h1>
            <div className="flex items-center gap-4">
              <Link
                to="/preferences"
                className={`${styles.button.secondary} flex items-center gap-2`}
              >
                <Settings className="w-5 h-5" />
                Update Preferences
              </Link>
              <button
                onClick={handleSignOut}
                className={`${styles.button.secondary} flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200`}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>

          {loadingRecommendations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={recommendation.imageUrl}
                      alt={recommendation.title}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {recommendation.title}
                      </h3>
                      <p className="text-primary-highlight text-sm">
                        {recommendation.type}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-primary-light mb-4">
                      {recommendation.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-primary-light">
                        <MapPin className="w-4 h-4 mr-2" />
                        {recommendation.location}
                      </div>
                      <div className="flex items-center text-sm text-primary-light">
                        <Clock className="w-4 h-4 mr-2" />
                        {recommendation.timeOfDay}
                      </div>
                      <div className="flex items-center text-sm text-primary-light">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {recommendation.estimatedCost}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <Calendar className="w-16 h-16 text-primary-accent mx-auto mb-4" />
              <p className="text-xl text-primary-light mb-6">
                No recommendations yet. Let's get started by setting up your preferences!
              </p>
              <Link
                to="/preferences"
                className={`${styles.button.primary} inline-flex items-center gap-2`}
              >
                <Settings className="w-5 h-5" />
                Set Preferences
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}