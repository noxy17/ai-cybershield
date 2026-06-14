import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, UserCog } from 'lucide-react';
import { api } from '../api/client';
import MetricCard from '../components/MetricCard.jsx';
import PageTransition from '../components/PageTransition.jsx';

const fallback = [
  { id: 1, name: 'Demo Analyst', email: 'demo@cybershield.ai', role: 'admin', is_active: true },
  { id: 2, name: 'SOC User', email: 'analyst@cybershield.ai', role: 'user', is_active: true },
];

export default function Admin() {
  const { data = fallback } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users/')).data,
    retry: false,
  });

  return (
    <PageTransition>
      <div className="mb-6">
        <p className="text-sm text-shield-emerald">Administration</p>
        <h2 className="text-3xl font-bold">Platform monitoring</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Active Users" value={data.length} icon={UserCog} />
        <MetricCard label="Admin Seats" value={data.filter((user) => user.role === 'admin').length} icon={ShieldCheck} tone="purple" />
        <MetricCard label="Enabled Accounts" value={data.filter((user) => user.is_active).length} icon={ShieldCheck} tone="emerald" />
      </div>
      <section className="glass mt-6 rounded-lg p-5">
        <h3 className="mb-5 text-xl font-bold">User management</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-white/10">
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id || user.email} className="border-b border-white/6">
                  <td className="py-4">{user.name}</td>
                  <td className="text-slate-300">{user.email}</td>
                  <td><span className="rounded-md bg-shield-blue/12 px-2 py-1 text-xs font-bold uppercase text-shield-blue">{user.role}</span></td>
                  <td className={user.is_active ? 'text-shield-emerald' : 'text-shield-danger'}>{user.is_active ? 'Active' : 'Disabled'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageTransition>
  );
}
