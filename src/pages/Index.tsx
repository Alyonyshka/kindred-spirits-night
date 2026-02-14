import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import FilterBar from '@/components/FilterBar';
import UserCard from '@/components/UserCard';
import FriendOfWeek from '@/components/FriendOfWeek';
import { mockUsers } from '@/lib/mockData';

export default function Index() {
  const { city } = useApp();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [ageFilter, setAgeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return mockUsers.filter(user => {
      // City filter
      if (user.city !== city) return false;
      // Name search
      if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Age
      if (ageFilter && user.age !== Number(ageFilter)) return false;
      // Interests (OR within)
      if (selectedInterests.length > 0 && !selectedInterests.some(i => user.interests.includes(i))) return false;
      // Drinks (OR within)
      if (selectedDrinks.length > 0 && !selectedDrinks.some(d => user.drinks.includes(d))) return false;
      // Level (OR within)
      if (selectedLevel.length > 0 && !selectedLevel.includes(user.alcoholLevel)) return false;
      return true;
    });
  }, [city, searchQuery, ageFilter, selectedInterests, selectedDrinks, selectedLevel]);

  const onReset = () => {
    setSelectedInterests([]);
    setSelectedDrinks([]);
    setSelectedLevel([]);
    setAgeFilter('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <FriendOfWeek />
      <FilterBar
        selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests}
        selectedDrinks={selectedDrinks} setSelectedDrinks={setSelectedDrinks}
        selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}
        ageFilter={ageFilter} setAgeFilter={setAgeFilter}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        resultCount={filtered.length}
        onReset={onReset}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((user, i) => (
          <div key={user.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-slide-up">
            <UserCard user={user} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">🍻</p>
          <p className="mt-2">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}
