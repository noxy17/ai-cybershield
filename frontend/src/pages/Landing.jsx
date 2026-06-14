import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { ArrowRight, BrainCircuit, CheckCircle2, Globe2, LockKeyhole, Radar, ShieldAlert, Zap } from 'lucide-react';
import Button from '../components/Button.jsx';
import PageTransition from '../components/PageTransition.jsx';

const features = [
  { icon: BrainCircuit, title: 'Explainable AI', text: 'Shows keywords, intent patterns, URL risk, urgency, and credential-harvesting signals.' },
  { icon: Radar, title: 'Real-time Scanning', text: 'Analyze email, SMS, WhatsApp, social media copy, and suspicious URLs instantly.' },
  { icon: LockKeyhole, title: 'Enterprise Security', text: 'JWT auth, rate limits, secure headers, validation, request logging, and role-aware access.' },
  { icon: Zap, title: 'Operational Analytics', text: 'Track scan velocity, risk distribution, detection volume, user activity, and weekly threat trends.' },
];

const workflow = ['Message', 'NLP Engine', 'AI Detection', 'Risk Analysis', 'Result'];

export default function Landing() {
  return (
    <PageTransition className="min-h-screen overflow-hidden bg-shield-black text-white">
      <section className="relative min-h-[92vh] aurora">
        <div className="absolute inset-0 cyber-grid opacity-60" />
        <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-shield-blue/20" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-dashed border-shield-purple/35"
        />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3 font-bold">
            <span className="rounded-md bg-shield-blue/15 p-2 text-shield-blue"><ShieldAlert className="h-6 w-6" /></span>
            AI CyberShield
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm text-slate-300 hover:text-white sm:inline">Login</Link>
            <Link to="/register"><Button className="min-h-10 px-4">Get Started</Button></Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex rounded-md border border-shield-emerald/25 bg-shield-emerald/10 px-3 py-2 text-sm text-shield-emerald">
              AI threat intelligence for modern teams
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
              AI-Powered Real-Time Protection Against Phishing Attacks
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Detect malicious URLs, scam messages, credential traps, and social engineering language with a transparent AI pipeline built for security operations.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-8 flex flex-wrap gap-4">
              <Link to="/app/scan"><Button>Scan Now <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/register"><Button variant="secondary">Get Started</Button></Link>
            </motion.div>
          </div>

          <div className="relative min-h-[460px]">
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity }} className="glass absolute inset-x-4 top-8 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Global threat mesh</p>
                  <p className="text-2xl font-bold">Live phishing radar</p>
                </div>
                <Globe2 className="h-9 w-9 text-shield-blue" />
              </div>
              <div className="relative mx-auto mt-8 aspect-square max-w-80 rounded-full border border-shield-blue/25 bg-black/30">
                <div className="radar absolute inset-0 rounded-full opacity-50" />
                {[20, 35, 50, 68, 78].map((size) => <div key={size} className="absolute rounded-full border border-shield-blue/15" style={{ inset: `${size / 2}px` }} />)}
                {['left-12 top-20', 'right-14 top-28', 'left-28 bottom-16', 'right-24 bottom-24'].map((pos) => (
                  <span key={pos} className={`absolute ${pos} h-3 w-3 rounded-full bg-shield-emerald shadow-glow`} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[.03] px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            ['Threats Blocked', 1289400, '+'],
            ['Users Protected', 84200, '+'],
            ['Detection Accuracy', 97, '%'],
          ].map(([label, value, suffix]) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-black text-shield-blue"><CountUp end={value} separator="," />{suffix}</p>
              <p className="mt-2 text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-shield-emerald">Platform</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Enterprise controls with transparent AI</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <motion.div key={feature.title} whileHover={{ y: -8 }} className="glass rounded-lg p-6 hover:shadow-glow">
              <feature.icon className="h-8 w-8 text-shield-blue" />
              <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white/[.025] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold md:text-4xl">AI workflow</h2>
          <div className="mt-10 grid gap-3 md:grid-cols-5">
            {workflow.map((step, index) => (
              <motion.div key={step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="glass rounded-lg p-5">
                <CheckCircle2 className="h-6 w-6 text-shield-emerald" />
                <p className="mt-4 font-semibold">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="glass rounded-lg p-8 md:p-10">
          <p className="text-lg text-slate-200">“CyberShield gives our analysts instant context. The highlighted reasoning is what made it operationally useful, not just impressive.”</p>
          <p className="mt-5 text-sm font-semibold text-shield-blue">Maya Raman, SOC Director</p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 text-sm text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <p>AI CyberShield</p>
          <p>Secure by design. Explainable by default.</p>
        </div>
      </footer>
    </PageTransition>
  );
}
