export function getDeadlineStatus(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const d = new Date(deadline);
  const diff = d - now;
  if (diff < 0) return { text: 'Просрочено!', color: '#ef4444', urgent: true };
  const h = diff / 3600000;
  if (h < 1) return { text: 'Менее часа', color: '#ef4444', urgent: true };
  if (h < 24) return { text: `${Math.ceil(h)}ч осталось`, color: '#f97316', urgent: true };
  const days = Math.ceil(h / 24);
  if (days <= 3) return { text: `${days}д осталось`, color: '#eab308', urgent: false };
  return { text: d.toLocaleDateString('ru-RU'), color: '#6b7280', urgent: false };
}