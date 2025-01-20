import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Heart, AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { styles } from '../theme/styles';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';

type PreferencesType = {
  location: string;
  radius: number;
  budget: string;
  timePreference: string;
  activityTypes: string[];
  specialConsiderations: string[];
};

const ACTIVITY_TYPES = [
  'Outdoor Adventures',
  'Cultural Events',
  'Food & Dining',
  'Sports & Recreation',
  'Arts & Crafts',
  'Music & Entertainment',
  'Relaxation & Wellness',
  'Shopping & Markets'
];

const SPECIAL_CONSIDERATIONS = [
  'Wheelchair Accessible',
  'Pet Friendly',
  'Vegetarian/Vegan Options',
  'Family Friendly',
  'Quiet Environment',
  'Indoor Activities',
  'Public Transport Access'
];

export default function Preferences() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<PreferencesType>({
    location: '',
    radius: 10,
    budget: 'medium',
    timePreference: 'both',
    activityTypes: [],
    specialConsiderations: []
  });

  useEffect(() => {
    const loadPreferences = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        
        if (data?.preferences) {
          setPreferences(data.preferences as PreferencesType);
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
        setError('Failed to load preferences');
      }
    };

    loadPreferences();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleActivity = (activity: string) => {
    setPreferences(prev => ({
      ...prev,
      activityTypes: prev.activityTypes.includes(activity)
        ? prev.activityTypes.filter(a => a !== activity)
        : [...prev.activityTypes, activity]
    }));
  };

  const toggleConsideration = (consideration: string) => {
    setPreferences(prev => ({
      ...prev,
      specialConsiderations: prev.specialConsiderations.includes(consideration)
        ? prev.specialConsiderations.filter(c => c !== consideration)
        : [...prev.specialConsiderations, consideration]
    }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary-highlight pt-20 pb-16">
        <div className={styles.container}>
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleBack}
              className="mb-6 flex items-center text-primary-main hover:text-primary-accent transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary-main mb-4">
                Your Weekend Preferences
              </h1>
              <p className="text-primary-light">
                Help us understand what makes your perfect weekend. We'll use this information
                to curate activities that match your interests.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary-main flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location Preferences
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className={styles.label}>Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={preferences.location}
                      onChange={handleChange}
                      className={styles.input.base}
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="radius" className={styles.label}>Search Radius (km)</label>
                    <input
                      type="number"
                      id="radius"
                      name="radius"
                      value={preferences.radius}
                      onChange={handleChange}
                      min="1"
                      max="100"
                      className={styles.input.base}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary-main flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Budget Preference
                </h2>
                
                <select
                  name="budget"
                  value={preferences.budget}
                  onChange={handleChange}
                  className={styles.input.base}
                  required
                >
                  <option value="low">Budget-Friendly</option>
                  <option value="medium">Moderate</option>
                  <option value="high">Premium</option>
                </select>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary-main flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Time Preference
                </h2>
                
                <select
                  name="timePreference"
                  value={preferences.timePreference}
                  onChange={handleChange}
                  className={styles.input.base}
                  required
                >
                  <option value="morning">Morning Person</option>
                  <option value="afternoon">Afternoon Person</option>
                  <option value="evening">Evening Person</option>
                  <option value="both">Flexible</option>
                </select>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary-main flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Activity Types
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ACTIVITY_TYPES.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => toggleActivity(activity)}
                      className={`
                        p-3 rounded-xl text-sm text-center transition-all duration-200
                        ${preferences.activityTypes.includes(activity)
                          ? 'bg-primary-main text-primary-highlight shadow-md scale-105'
                          : 'bg-white text-primary-light border border-primary-light/20 hover:border-primary-accent/40'}
                      `}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary-main flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Special Considerations
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPECIAL_CONSIDERATIONS.map((consideration) => (
                    <button
                      key={consideration}
                      type="button"
                      onClick={() => toggleConsideration(consideration)}
                      className={`
                        p-3 rounded-xl text-sm text-center transition-all duration-200
                        ${preferences.specialConsiderations.includes(consideration)
                          ? 'bg-primary-accent text-primary-main shadow-md scale-105'
                          : 'bg-white text-primary-light border border-primary-light/20 hover:border-primary-accent/40'}
                      `}
                    >
                      {consideration}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${styles.button.primary} w-full flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}