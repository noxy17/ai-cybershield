import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Search } from 'lucide-react';
import { api } from '../api/client';
import Button from '../components/Button.jsx';
import PageTransition from '../components/PageTransition.jsx';

const fallback = [
  { id: 'demo-1', content: 'Verify your account immediately...', prediction: 'PHISHING', risk_score: 92, scan_type: 'email', timestamp: new Date().toISOString() },
  { id: 'demo-2', content: 'Your package has shipped.', prediction: 'SAFE', risk_score: 12, scan_type: 'sms', timestamp: new Date().toISOString() },
];

export default function History() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { data = fallback } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const { data: history } = await api.get('/history/');
      return history.results || history;
    },
    retry: false,
  });

  const rows = useMemo(() => data.filter((row) => {
    const matchesSearch = row.content.toLowerCase().includes(search.toLowerCase()) || row.prediction.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || row.prediction.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  }), [data, search, filter]);

  const exportCsv = () => {
    const csv = ['Prediction,Risk,Type,Timestamp,Content', ...rows.map((row) => `"${row.prediction}",${row.risk_score},"${row.scan_type}","${row.timestamp}","${row.content.replaceAll('"', '""')}"`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cybershield-history.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-shield-emerald">Audit trail</p>
          <h2 className="text-3xl font-bold">Scan history</h2>
        </div>
        <Button onClick={exportCsv} variant="secondary"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <section className="glass rounded-lg p-5">
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative min-w-64 flex-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scans..." className="w-full rounded-md border border-white/10 bg-black/30 py-3 pl-10 pr-4 outline-none focus:border-shield-blue" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-shield-blue">
            <option value="all">All predictions</option>
            <option value="phishing">Phishing</option>
            <option value="safe">Safe</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-white/10">
                <th className="py-3">Content</th>
                <th>Prediction</th>
                <th>Risk</th>
                <th>Type</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/6">
                  <td className="max-w-md truncate py-4 text-slate-200">{row.content}</td>
                  <td><span className={`rounded-md px-2 py-1 text-xs font-bold ${row.prediction === 'PHISHING' ? 'bg-shield-danger/15 text-rose-200' : 'bg-shield-emerald/15 text-emerald-200'}`}>{row.prediction}</span></td>
                  <td>{row.risk_score}%</td>
                  <td className="capitalize">{row.scan_type}</td>
                  <td className="text-slate-400">{new Date(row.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageTransition>
  );
}
