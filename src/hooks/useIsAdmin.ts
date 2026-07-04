import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

export function useIsAdmin() {
  const { user } = useApp();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (!cancelled) setIsAdmin(!!data);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  return isAdmin;
}
