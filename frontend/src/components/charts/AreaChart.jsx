import { AreaChart as Chart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AreaChart({ data }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="#0ea5e933" />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
