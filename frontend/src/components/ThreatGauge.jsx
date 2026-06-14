import { motion } from 'framer-motion';

export default function ThreatGauge({ risk = 0, prediction = 'SAFE' }) {
  const normalized = Math.max(0, Math.min(100, Number(risk) || 0));
  const color = prediction === 'PHISHING' ? '#FF3864' : normalized > 45 ? '#FFB020' : '#00FF88';

  return (
    <div className="relative mx-auto aspect-square w-full max-w-64">
      <div className="absolute inset-0 rounded-full border border-white/10 bg-black/30" />
      <div className="absolute inset-4 overflow-hidden rounded-full border border-shield-blue/20">
        <div className="radar absolute inset-0 opacity-40" />
        <div className="absolute inset-8 rounded-full bg-shield-black/88 backdrop-blur-md" />
      </div>
      <svg className="absolute inset-0 h-full w-full rotate-[-90deg]" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,.1)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={326.7}
          initial={{ strokeDashoffset: 326.7 }}
          animate={{ strokeDashoffset: 326.7 - (326.7 * normalized) / 100 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-sm uppercase tracking-[.22em] text-slate-400">Risk</p>
        <p className="text-5xl font-black" style={{ color }}>{normalized}%</p>
        <p className="mt-1 text-sm font-semibold">{prediction}</p>
      </div>
    </div>
  );
}
