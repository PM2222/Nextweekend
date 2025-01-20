import { supabase } from './supabase';

export type Recommendation = {
  title: string;
  description: string;
  type: string;
  timeOfDay: string;
  estimatedCost: string;
  location: string;
  imageUrl: string;
};

// Local database of activities
const activityDatabase = [
  {
    type: 'Outdoor Adventures',
    activities: [
      {
        title: 'Sunrise Hiking Adventure',
        description: 'Start your day with an invigorating hike while watching the sunrise together.',
        timeOfDay: 'Morning',
        estimatedCost: '$0-20',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80'
      },
      {
        title: 'Scenic Bike Ride',
        description: 'Explore local bike trails and scenic routes together.',
        timeOfDay: 'Morning/Afternoon',
        estimatedCost: '$20-40',
        imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    type: 'Cultural Events',
    activities: [
      {
        title: 'Local Art Gallery Tour',
        description: 'Explore contemporary art exhibitions and discuss your interpretations.',
        timeOfDay: 'Afternoon',
        estimatedCost: '$0-30',
        imageUrl: 'https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&q=80'
      },
      {
        title: 'Live Music Evening',
        description: 'Enjoy live performances at a cozy venue.',
        timeOfDay: 'Evening',
        estimatedCost: '$40-80',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    type: 'Food & Dining',
    activities: [
      {
        title: 'Cooking Class for Two',
        description: 'Learn to cook a new cuisine together with expert guidance.',
        timeOfDay: 'Afternoon/Evening',
        estimatedCost: '$80-150',
        imageUrl: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80'
      },
      {
        title: 'Food Truck Festival',
        description: 'Sample various cuisines from local food trucks.',
        timeOfDay: 'Afternoon',
        estimatedCost: '$30-60',
        imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    type: 'Relaxation & Wellness',
    activities: [
      {
        title: 'Couples Spa Day',
        description: 'Unwind together with massages and wellness treatments.',
        timeOfDay: 'Morning/Afternoon',
        estimatedCost: '$150-300',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80'
      },
      {
        title: 'Sunset Beach Yoga',
        description: 'Practice yoga together as the sun sets over the horizon.',
        timeOfDay: 'Evening',
        estimatedCost: '$20-40',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80'
      }
    ]
  }
];

export async function generateRecommendations(): Promise<Recommendation[]> {
  // Get user preferences from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No active session');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('preferences')
    .eq('id', session.user.id)
    .single();

  if (error) throw error;
  if (!profile?.preferences) throw new Error('No preferences found');

  const preferences = profile.preferences;

  try {
    // Filter activities based on preferences
    const recommendations: Recommendation[] = [];
    const preferredTypes = new Set(preferences.activityTypes);

    // Get activities matching preferred types
    for (const category of activityDatabase) {
      if (preferredTypes.has(category.type)) {
        for (const activity of category.activities) {
          // Filter by time preference if specified
          if (preferences.timePreference === 'both' || 
              activity.timeOfDay.toLowerCase().includes(preferences.timePreference.toLowerCase())) {
            
            // Filter by budget
            const cost = parseInt(activity.estimatedCost.replace(/[^0-9]/g, ''));
            const isWithinBudget = 
              (preferences.budget === 'low' && cost <= 50) ||
              (preferences.budget === 'medium' && cost <= 150) ||
              (preferences.budget === 'high');

            if (isWithinBudget) {
              recommendations.push({
                ...activity,
                type: category.type,
                location: preferences.location
              });
            }
          }
        }
      }
    }

    // Randomly select 3 activities
    const shuffled = recommendations.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);

  } catch (err) {
    console.error('Error generating recommendations:', err);
    
    // Return fallback recommendations
    return [
      {
        title: "Sunrise Yoga in the Park",
        description: "Start your weekend with a rejuvenating couple's yoga session as the sun rises over the city skyline.",
        type: "Relaxation & Wellness",
        timeOfDay: "Morning",
        estimatedCost: "$20-30",
        location: preferences.location,
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80"
      },
      {
        title: "Local Cafe Exploration",
        description: "Discover hidden gems in your local coffee scene while enjoying freshly baked pastries.",
        type: "Food & Dining",
        timeOfDay: "Morning",
        estimatedCost: "$30-50",
        location: preferences.location,
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
      },
      {
        title: "Evening Nature Walk", 
        description: "Take a peaceful stroll through scenic paths as the day winds down.",
        type: "Outdoor Adventures",
        timeOfDay: "Evening",
        estimatedCost: "Free",
        location: preferences.location,
        imageUrl: "https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&q=80"
      }
    ];
  }
}