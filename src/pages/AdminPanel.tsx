import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from 'sonner';
import { Shield, Trash2, Ban, Loader2 } from 'lucide-react';

interface ReportRow {
  id: string;
  reason: string;
  details: string | null;
  created_at: string;
  reporter_id: string;
  reported_id: string;
  reporter?: { name: string; avatar_url: string };
  reported?: { name: string; avatar_url: string; status: string };
}

const REASON_LABEL: Record<string, string> = {
  inappropriate: 'Неадекватное поведение',
  fake: 'Фейковый профиль',
  spam: 'Спам / реклама',
  other: 'Другое',
};

export default function AdminPanel() {
  const { language } = useApp();
  const isAdmin = useIsAdmin();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    const { data: reps } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (!reps) { setReports([]); setLoading(false); return; }

    const ids = Array.from(new Set(reps.flatMap((r: any) => [r.reporter_id, r.reported_id])));
    const { data: profs } = await supabase
      .from('profiles')
      .select('user_id, name, avatar_url, status')
      .in('user_id', ids);

    const byUser = new Map((profs || []).map((p: any) => [p.user_id, p]));
    setReports(reps.map((r: any) => ({
      ...r,
      reporter: byUser.get(r.reporter_id),
      reported: byUser.get(r.reported_id),
    })));
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchReports();
  }, [isAdmin]);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/" replace />;

  const dismissReport = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from('reports').delete().eq('id', id);
    setBusyId(null);
    if (error) { toast.error('Ошибка: ' + error.message); return; }
    toast.success('Жалоба отклонена');
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const banUser = async (report: ReportRow) => {
    if (!confirm(`Забанить пользователя ${report.reported?.name || ''}? Это удалит его встречи и заблокирует вход.`)) return;
    setBusyId(report.id);
    const { error } = await supabase.rpc('admin_ban_user', { _target_user: report.reported_id });
    if (error) {
      setBusyId(null);
      toast.error('Ошибка бана: ' + error.message);
      return;
    }
    await supabase.from('reports').delete().eq('id', report.id);
    setBusyId(null);
    toast.success('Пользователь забанен');
    fetchReports();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-primary" size={24} />
        <h1 className="text-2xl font-bold">Панель администратора</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel p-8 text-center text-muted-foreground">
          Жалоб пока нет
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <div key={r.id} className="glass-panel p-4 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Нарушитель</div>
                  <div className="flex items-center gap-2">
                    {r.reported?.avatar_url && (
                      <img src={r.reported.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <div className="font-semibold text-sm">{r.reported?.name || '—'}</div>
                      {r.reported?.status === 'banned' && (
                        <div className="text-xs text-destructive">Забанен</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Пожаловался</div>
                  <div className="flex items-center gap-2">
                    {r.reporter?.avatar_url && (
                      <img src={r.reporter.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div className="font-semibold text-sm">{r.reporter?.name || '—'}</div>
                  </div>
                </div>
                <div className="flex-[2]">
                  <div className="text-xs text-muted-foreground mb-1">
                    {REASON_LABEL[r.reason] || r.reason} · {new Date(r.created_at).toLocaleDateString()}
                  </div>
                  {r.details && (
                    <div className="text-sm text-foreground/90 break-words">{r.details}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 md:flex-col">
                <button
                  onClick={() => dismissReport(r.id)}
                  disabled={busyId === r.id}
                  className="px-3 py-2 rounded-xl border border-border text-sm hover:bg-accent flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 size={14} /> Отклонить
                </button>
                <button
                  onClick={() => banUser(r)}
                  disabled={busyId === r.id || r.reported?.status === 'banned'}
                  className="px-3 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 flex items-center gap-1 disabled:opacity-50"
                >
                  <Ban size={14} /> ЗАБАНИТЬ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
