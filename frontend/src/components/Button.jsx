import { Loader2 } from 'lucide-react';

const styles = {
  primary: 'bg-shield-blue text-slate-950 hover:bg-cyan-200 shadow-glow',
  secondary: 'bg-white/8 text-white hover:bg-white/14 border border-white/12',
  danger: 'bg-shield-danger text-white hover:bg-rose-400',
};

export default function Button({ children, className = '', variant = 'primary', loading = false, ...props }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
