import { BarChart as Chart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChart({ data }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
