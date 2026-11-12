'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/** Intérêt de recherche sur 5 ans (indice 0-100, un point par mois). */
export default function Courbe({
  points,
}: {
  points: { mois: string; valeur: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <defs>
            <linearGradient id="degrade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8fe34f" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#8fe34f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgb(255 255 255 / 0.07)" vertical={false} />
          <XAxis
            dataKey="mois"
            stroke="#98a6a1"
            fontSize={12}
            interval={11}
            tickLine={false}
          />
          <YAxis
            stroke="#98a6a1"
            fontSize={12}
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0b121b',
              border: '1px solid rgb(255 255 255 / 0.1)',
              borderRadius: 12,
              color: '#eef3ef',
            }}
            formatter={(v) => [v, 'Intérêt']}
          />
          <Area
            type="monotone"
            dataKey="valeur"
            stroke="#8fe34f"
            strokeWidth={2.5}
            fill="url(#degrade)"
            style={{ filter: 'drop-shadow(0 0 6px rgb(143 227 79 / 0.6))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
