import { Copy, Download, Edit2, Forward, Reply, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';

interface Props {
  fromMe: boolean;
  hasMedia: boolean;
  mediaUrl?: string;
  position: { x: number; y: number };
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onReply: () => void;
  onForward: () => void;
  onCopy: () => void;
}

export default function MessageContextMenu({
  fromMe, hasMedia, mediaUrl, position, onClose, onDelete, onEdit, onReply, onForward, onCopy,
}: Props) {
  const { language } = useApp();

  const handleDownload = () => {
    if (!mediaUrl) return;
    const a = document.createElement('a');
    a.href = mediaUrl;
    a.download = `media_${Date.now()}`;
    a.click();
    onClose();
  };

  const items = [
    { icon: Reply, label: t('msgReply', language), action: onReply },
    { icon: Copy, label: t('msgCopy', language), action: onCopy },
    ...(fromMe ? [{ icon: Edit2, label: t('msgEdit', language), action: onEdit }] : []),
    { icon: Forward, label: t('msgForward', language), action: onForward },
    ...(hasMedia ? [{ icon: Download, label: t('msgDownload', language), action: handleDownload }] : []),
    ...(fromMe ? [{ icon: Trash2, label: t('msgDelete', language), action: onDelete, destructive: true }] : []),
  ];

  return (
    <>
      <div className="fixed inset-0 z-[300]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-[301] glass-panel-strong border border-border rounded-xl shadow-xl py-1 min-w-[160px]"
        style={{
          left: Math.min(position.x, window.innerWidth - 180),
          top: Math.min(position.y, window.innerHeight - items.length * 40 - 20),
        }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => { item.action(); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors ${
              (item as any).destructive
                ? 'text-destructive hover:bg-destructive/10'
                : 'text-foreground hover:bg-accent'
            }`}
          >
            <item.icon size={14} />
            {item.label}
          </button>
        ))}
      </motion.div>
    </>
  );
}
