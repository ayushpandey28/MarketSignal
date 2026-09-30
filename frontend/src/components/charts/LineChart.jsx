import { LineChart as Chart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function LineChart({ data }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={false} />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
