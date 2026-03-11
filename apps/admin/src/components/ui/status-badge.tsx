export function StatusBadge({
  value,
}: {
  value: 'active' | 'inactive' | 'scheduled' | 'running' | 'completed' | 'processing' | 'failed';
}) {
  return <span className={`status-badge status-${value}`}>{value}</span>;
}
