import { useState } from 'react';
import { ChevronDown, X, RotateCcw, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t, interestKeys, drinkKeys, alcoholLevelKeys } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  selectedInterests: string[];
  setSelectedInterests: (v: string[]) => void;
  selectedDrinks: string[];
  setSelectedDrinks: (v: string[]) => void;
  selectedLevel: string[];
  setSelectedLevel: (v: string[]) => void;
  ageFilter: string;
  setAgeFilter: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  resultCount: number;
  onReset: () => void;
}

type DropdownType = 'interests' | 'drinks' | 'drinkAmount' | null;

export default function FilterBar(props: FilterBarProps) {
  const { language } = useApp();
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

  const toggle = (type: DropdownType) => setOpenDropdown(openDropdown === type ? null : type);

  const hasFilters = props.selectedInterests.length > 0 || props.selectedDrinks.length > 0 ||
    props.selectedLevel.length > 0 || props.ageFilter !== '';

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const renderDropdown = (
    type: DropdownType,
    labelKey: string,
    keys: readonly string[],
    selected: string[],
    setter: (v: string[]) => void
  ) => (
    <div className="relative">
      <button
        onClick={() => toggle(type)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
          selected.length > 0
            ? 'amber-border-glow text-primary bg-primary/10'
            : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground glass-panel'
        }`}
      >
        {t(labelKey, language)}
        {selected.length > 0 && (
          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${openDropdown === type ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {openDropdown === type && (
          <motion.div
            className="absolute top-full mt-2 left-0 z-[60] glass-panel-strong p-3 min-w-[200px] max-h-[300px] overflow-y-auto scrollbar-hide"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="flex flex-col gap-1">
              {keys.map(key => (
                <button
                  key={key}
                  onClick={() => toggleItem(selected, key, setter)}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 ${
                    selected.includes(key)
                      ? 'bg-primary/15 text-primary amber-border-glow border'
                      : 'hover:bg-accent text-foreground border border-transparent'
                  }`}
                >
                  {t(key, language)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={props.searchQuery}
          onChange={(e) => props.setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder', language)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-panel border border-border bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all duration-200"
        />
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {renderDropdown('interests', 'interests', interestKeys, props.selectedInterests, props.setSelectedInterests)}
        {renderDropdown('drinks', 'drinks', drinkKeys, props.selectedDrinks, props.setSelectedDrinks)}
        {renderDropdown('drinkAmount', 'drinkAmount', alcoholLevelKeys, props.selectedLevel, props.setSelectedLevel)}

        {/* Age input */}
        <input
          type="number"
          value={props.ageFilter}
          onChange={(e) => props.setAgeFilter(e.target.value)}
          placeholder={t('age', language)}
          className="w-20 px-3 py-2 rounded-xl text-xs sm:text-sm border border-border glass-panel bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all duration-200"
          min={18}
          max={99}
        />

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={props.onReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-all whitespace-nowrap"
          >
            <RotateCcw size={12} />
            {t('resetFilters', language)}
          </button>
        )}

        {/* Results counter */}
        <div className="flex items-center gap-1 px-3 py-2 rounded-xl glass-panel whitespace-nowrap">
          <span className="text-xs text-muted-foreground">{t('resultsFound', language)}:</span>
          <span className="text-sm font-bold amber-glow">{props.resultCount}</span>
        </div>
      </div>

      {/* Click outside overlay */}
      {openDropdown && (
        <div className="fixed inset-0 z-[55]" onClick={() => setOpenDropdown(null)} />
      )}
    </div>
  );
}
