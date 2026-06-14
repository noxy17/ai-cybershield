import CountUp from 'react-countup';
import { motion } from 'framer-motion';

export default function MetricCard({ label, value, suffix = '', icon: Icon, tone = 'cyan' }) {
  const toneMap = {
    cyan: 'text-shield-blue bg-shield-blue/10',
    purple: 'text-shield-purple bg-shield-purple/10',
    emerald: 'text-shield-emerald bg-shield-emerald/10',
    danger: 'text-shield-danger bg-shield-danger/10',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass rounded-lg p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold">
            <CountUp end={Number(value)} duration={1.4} separator="," />
            {suffix}
          </p>
        </div>
        {Icon && (
          <div className={`rounded-md p-3 ${toneMap[tone]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
