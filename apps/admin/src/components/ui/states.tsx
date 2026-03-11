export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <div className="panel center-state">{label}</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="panel error-state">{message}</div>;
}

export function EmptyState({ label = 'No data found' }: { label?: string }) {
  return <div className="panel center-state">{label}</div>;
}
