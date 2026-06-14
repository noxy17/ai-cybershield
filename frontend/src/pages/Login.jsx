import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';
import { api, setTokens } from '../api/client';
import Button from '../components/Button.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'demo@cybershield.ai', password: 'CyberShield123!' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login/', form);
      setTokens(data.tokens);
      toast.success('Welcome back');
      navigate('/app');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="flex min-h-screen items-center justify-center bg-shield-black aurora px-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-8">
        <ShieldCheck className="h-10 w-10 text-shield-blue" />
        <h1 className="mt-5 text-3xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-slate-400">Access the threat intelligence console.</p>
        <label className="mt-6 block text-sm text-slate-300">Email</label>
        <input className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-shield-blue" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="mt-4 block text-sm text-slate-300">Password</label>
        <input type="password" className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-shield-blue" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button loading={loading} className="mt-6 w-full">Login</Button>
        <div className="mt-5 flex justify-between text-sm text-slate-400">
          <Link to="/register" className="hover:text-shield-blue">Create account</Link>
          <button type="button" onClick={() => toast.success('Password reset workflow endpoint is ready')} className="hover:text-shield-blue">Forgot password?</button>
        </div>
      </form>
    </PageTransition>
  );
}
