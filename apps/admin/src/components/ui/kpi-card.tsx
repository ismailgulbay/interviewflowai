export function KpiCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <article className="kpi-card">
      <p className="kpi-title">{title}</p>
      <h3>{value}</h3>
      {subtitle ? <p className="kpi-subtitle">{subtitle}</p> : null}
    </article>
  );
}
