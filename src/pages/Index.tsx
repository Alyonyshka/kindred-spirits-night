import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import FilterBar from '@/components/FilterBar';
import UserCard from '@/components/UserCard';
import FriendOfWeek from '@/components/FriendOfWeek';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';
import SEO from '@/components/SEO';

export default function Index() {
  const { city, language, user } = useApp();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [ageFilter, setAgeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data } = await supabase.from('profiles').select('*');
      if (data) {
        setProfiles(data.filter(p => p.user_id !== user?.id) as unknown as Profile[]);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, [user?.id]);

  const filtered = useMemo(() => {
    return profiles.filter(p => {
      if (p.city !== city) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (ageFilter && p.age !== Number(ageFilter)) return false;
      if (selectedInterests.length > 0 && !(p.interests || []).some(i => selectedInterests.includes(i))) return false;
      if (selectedDrinks.length > 0 && !(p.drinks || []).some(d => selectedDrinks.includes(d))) return false;
      if (selectedLevel.length > 0 && !selectedLevel.includes(p.alcohol_level || '')) return false;
      return true;
    });
  }, [profiles, city, searchQuery, ageFilter, selectedInterests, selectedDrinks, selectedLevel]);

  const onReset = () => {
    setSelectedInterests([]);
    setSelectedDrinks([]);
    setSelectedLevel([]);
    setAgeFilter('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <SEO title="Find Drinking Buddies — Drink Mate" description="Browse like-minded drinking buddies in your city. Filter by drinks, interests, and vibe to find your next night out companion." path="/" />
      <h1 className="sr-only">Find Drinking Buddies Near You</h1>
      <FriendOfWeek profiles={profiles} />
      <FilterBar
        selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests}
        selectedDrinks={selectedDrinks} setSelectedDrinks={setSelectedDrinks}
        selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}
        ageFilter={ageFilter} setAgeFilter={setAgeFilter}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        resultCount={filtered.length}
        onReset={onReset}
      />
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">{t('loading', language)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((p, i) => (
            <div key={p.user_id} style={{ animationDelay: `${i * 60}ms` }} className="animate-slide-up">
              <UserCard profile={p} />
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">🍻</p>
          <p className="mt-2">{t('noResults', language)}</p>
        </div>
      )}
    </div>
  );
}
