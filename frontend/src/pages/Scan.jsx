import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Copy, Send, Sparkles } from 'lucide-react';
import { api, demoScan } from '../api/client';
import Button from '../components/Button.jsx';
import PageTransition from '../components/PageTransition.jsx';
import ThreatGauge from '../components/ThreatGauge.jsx';

const types = ['email', 'sms', 'whatsapp', 'social', 'url'];

function HighlightedText({ text = '', keywords = [] }) {
  const html = useMemo(() => {
    if (!text) return '';
    const escaped = text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    return keywords.reduce((value, keyword) => {
      const pattern = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return value.replace(pattern, '<span class="danger-word">$1</span>');
    }, escaped);
  }, [text, keywords]);

  return <p className="whitespace-pre-wrap leading-7 text-slate-200" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Scan() {
  const queryClient = useQueryClient();
  const [scanType, setScanType] = useState(demoScan.scan_type);
  const [content, setContent] = useState(demoScan.content);
  const [result, setResult] = useState(null);

  const mutation = useMutation({
    mutationFn: async () => (await api.post('/predict/', { scan_type: scanType, content })).data,
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Threat analysis complete');
    },
    onError: (error) => toast.error(error.response?.data?.detail || 'Scan failed'),
  });

  return (
    <PageTransition>
      <div className="mb-6">
        <p className="text-sm text-shield-emerald">AI scanner</p>
        <h2 className="text-3xl font-bold">Analyze suspicious content</h2>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_.9fr]">
        <section className="glass rounded-lg p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold">Input message</h3>
            <button onClick={() => setContent(demoScan.content)} className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/8">
              <Copy className="h-4 w-4" /> Demo
            </button>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setScanType(type)}
                className={`rounded-md px-3 py-2 text-sm capitalize transition ${scanType === type ? 'bg-shield-blue text-slate-950' : 'bg-white/7 text-slate-300 hover:bg-white/12'}`}
              >
                {type}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-80 w-full resize-y rounded-lg border border-white/10 bg-black/35 p-4 leading-7 outline-none focus:border-shield-blue"
            placeholder="Paste an email, SMS, WhatsApp message, social post, or URL..."
          />
          <Button loading={mutation.isPending} onClick={() => mutation.mutate()} className="mt-5">
            Scan Content <Send className="h-4 w-4" />
          </Button>
        </section>

        <section className="glass rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold">Real-time AI results</h3>
            <Sparkles className="h-5 w-5 text-shield-purple" />
          </div>
          {mutation.isPending ? (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <div className="relative h-44 w-44 overflow-hidden rounded-full border border-shield-blue/25">
                <div className="radar absolute inset-0" />
              </div>
              <p className="mt-6 text-shield-blue">Scanning threat indicators...</p>
            </div>
          ) : result ? (
            <div>
              <ThreatGauge risk={result.risk_score} prediction={result.prediction} />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-white/6 p-4">
                  <p className="text-xs text-slate-400">Threat Level</p>
                  <p className="mt-1 text-lg font-bold">{result.threat_level}</p>
                </div>
                <div className="rounded-lg bg-white/6 p-4">
                  <p className="text-xs text-slate-400">Confidence</p>
                  <p className="mt-1 text-lg font-bold">{result.confidence}%</p>
                </div>
                <div className="rounded-lg bg-white/6 p-4">
                  <p className="text-xs text-slate-400">Scan Type</p>
                  <p className="mt-1 text-lg font-bold capitalize">{result.scan_type}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-slate-300">Detected suspicious keywords</p>
                <div className="flex flex-wrap gap-2">
                  {result.suspicious_keywords?.length ? result.suspicious_keywords.map((word) => (
                    <span key={word} className="rounded-md bg-shield-danger/15 px-3 py-1 text-sm text-rose-200">{word}</span>
                  )) : <span className="rounded-md bg-shield-emerald/15 px-3 py-1 text-sm text-emerald-200">No major suspicious keywords</span>}
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-white/10 bg-black/25 p-4">
                <p className="text-sm font-semibold text-shield-blue">AI Reasoning</p>
                <p className="mt-2 leading-7 text-slate-300">{result.reasoning}</p>
              </div>
              <div className="mt-6 rounded-lg border border-white/10 bg-black/25 p-4">
                <HighlightedText text={content} keywords={result.suspicious_keywords || []} />
              </div>
            </div>
          ) : (
            <div className="flex min-h-96 flex-col items-center justify-center text-center text-slate-400">
              <div className="rounded-full border border-shield-blue/20 p-8">
                <Sparkles className="h-12 w-12 text-shield-blue" />
              </div>
              <p className="mt-5 max-w-sm">Submit content to see prediction, risk percentage, confidence, suspicious keywords, and highlighted evidence.</p>
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
