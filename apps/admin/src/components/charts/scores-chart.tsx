import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function ScoresChart({ data }: { data: Array<{ name: string; score: number }> }) {
  return (
    <div className="panel chart-panel">
      <h3>Evaluation Score Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3440" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#00a5cf" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
