export function LoadingPanel({ label }: { label: string }) {
  return <div className="center-panel">{label}</div>;
}

export function ErrorPanel({ message }: { message: string }) {
  return <div className="error-panel">{message}</div>;
}
