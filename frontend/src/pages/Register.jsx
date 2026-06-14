import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { api, setTokens } from '../api/client';
import Button from '../components/Button.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register/', form);
      setTokens(data.tokens);
      toast.success('Account created');
      navigate('/app');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="flex min-h-screen items-center justify-center bg-shield-black aurora px-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-8">
        <UserPlus className="h-10 w-10 text-shield-emerald" />
        <h1 className="mt-5 text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Start scanning suspicious messages in seconds.</p>
        {[
          ['name', 'Name', 'text'],
          ['email', 'Email', 'email'],
          ['password', 'Password', 'password'],
        ].map(([key, label, type]) => (
          <label key={key} className="mt-4 block text-sm text-slate-300">
            {label}
            <input required type={type} className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-shield-blue" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
        <Button loading={loading} className="mt-6 w-full">Create account</Button>
        <p className="mt-5 text-sm text-slate-400">Already protected? <Link to="/login" className="text-shield-blue">Login</Link></p>
      </form>
    </PageTransition>
  );
}
