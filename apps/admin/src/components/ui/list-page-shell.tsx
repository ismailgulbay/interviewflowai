import type { ReactNode } from 'react';

export function ListPageShell({
  title,
  subtitle,
  controls,
  table,
  pagination,
}: {
  title: string;
  subtitle: string;
  controls: ReactNode;
  table: ReactNode;
  pagination: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="page-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {controls}
      </div>
      {table}
      {pagination}
    </section>
  );
}
