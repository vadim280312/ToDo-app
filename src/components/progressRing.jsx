import React from 'react';

export default function ProgressRing({ progress, size = 64, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (progress / 100) * c;
  const col = progress === 100 ? '#22c55e' : 'var(--accent)';

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="currentColor" strokeWidth={stroke}
        opacity="0.12"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={col} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text
        x="50%" y="50%" textAnchor="middle" dy="0.35em"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
        fill="currentColor" fontSize="13" fontWeight="700"
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
}