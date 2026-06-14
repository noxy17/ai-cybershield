import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, CheckCircle2, Radar, ShieldAlert, Target } from 'lucide-react';
import { api } from '../api/client';
import MetricCard from '../components/MetricCard.jsx';
import PageTransition from '../components/PageTransition.jsx';

const fallback = {
  total_scans: 1248,
  phishing_detected: 312,
  safe_messages: 936,
  detection_accuracy: 97,
  weekly_trend: [
    { day: 'Mon', phishing: 24, safe: 96 },
    { day: 'Tue', phishing: 31, safe: 88 },
    { day: 'Wed', phishing: 44, safe: 102 },
    { day: 'Thu', phishing: 38, safe: 91 },
    { day: 'Fri', phishing: 62, safe: 120 },
    { day: 'Sat', phishing: 57, safe: 132 },
    { day: 'Sun', phishing: 49, safe: 118 },
  ],
  risk_distribution: [
    { name: 'Low', value: 54 },
    { name: 'Medium', value: 24 },
    { name: 'High', value: 22 },
  ],
  user_activity: [
    { name: 'Email', scans: 520 },
    { name: 'SMS', scans: 290 },
    { name: 'WhatsApp', scans: 188 },
    { name: 'Social', scans: 152 },
    { name: 'URL', scans: 98 },
  ],
};

const colors = ['#00FF88', '#FFB020', '#FF3864'];

export default function Dashboard() {
  const { data = fallback, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => (await api.get('/analytics/')).data,
    retry: false,
  });

  return (
    <PageTransition>
      <div className="mb-6">
        <p className="text-sm text-shield-emerald">Command dashboard</p>
        <h2 className="text-3xl font-bold">Threat analytics</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Scans" value={data.total_scans} icon={Radar} />
        <MetricCard label="Phishing Detected" value={data.phishing_detected} icon={ShieldAlert} tone="danger" />
        <MetricCard label="Safe Messages" value={data.safe_messages} icon={CheckCircle2} tone="emerald" />
        <MetricCard label="Detection Accuracy" value={data.detection_accuracy} suffix="%" icon={Target} tone="purple" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <section className="glass rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold">Weekly threat trend</h3>
            {isLoading && <span className="h-2 w-24 animate-pulse rounded-full bg-white/10" />}
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={data.weekly_trend}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="day" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#11182C', border: '1px solid rgba(0,229,255,.2)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="phishing" stroke="#FF3864" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="safe" stroke="#00FF88" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass rounded-lg p-5">
          <h3 className="mb-5 text-xl font-bold">Risk distribution</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.risk_distribution} innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                  {data.risk_distribution.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#11182C', border: '1px solid rgba(0,229,255,.2)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="glass mt-6 rounded-lg p-5">
        <div className="mb-5 flex items-center gap-3">
          <Activity className="h-5 w-5 text-shield-blue" />
          <h3 className="text-xl font-bold">User activity by channel</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data.user_activity}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ background: '#11182C', border: '1px solid rgba(0,229,255,.2)', borderRadius: 8 }} />
              <Bar dataKey="scans" fill="#00E5FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </PageTransition>
  );
}
