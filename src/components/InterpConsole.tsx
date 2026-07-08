'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { resolveUnit } from '@/lib/probeData';
import { trackEvent } from '@/lib/analytics';

interface Line {
  kind: 'in' | 'out' | 'err';
  text: string;
}

const HELP = [
  'probe <unit>     open a unit\'s neuron probe (e.g. probe galilai)',
  'ablate <unit>    zero a unit out of the network',
  'restore <unit>   bring an ablated unit back',
  'filter <skill>   toggle a feature filter (e.g. filter python)',
  'steer <0..2>     set the steering coefficient α',
  'clear            clear the feature filter',
  'run              execute a guided forward pass through every layer',
  'backprop         propagate gradients back to the input layer',
  'card             open the model card (/model-card)',
  'close            close this console (or press esc)',
];

/**
 * Hidden interpretability console (press ` or ~): a second interface to the
 * site's existing actions — probe, ablate, filter, steer, backprop.
 */
export default function InterpConsole() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: "marcel-net interpretability console — type 'help'" },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // global toggle on ` / ~ (ignored while typing elsewhere)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      if ((e.key === '`' || e.key === '~') && !typing) {
        e.preventDefault();
        setOpen((o) => {
          if (!o) trackEvent('console_open');
          return !o;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const print = (text: string, kind: Line['kind'] = 'out') =>
    setLines((prev) => [...prev.slice(-40), { kind, text }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    print(cmd, 'in');
    setHistory((h) => [...h, cmd]);
    setHistPos(-1);
    const [verb, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');
    trackEvent('console_command', { command: verb.toLowerCase() });

    switch (verb.toLowerCase()) {
      case 'help':
        HELP.forEach((l) => print(l));
        break;
      case 'probe': {
        const node = resolveUnit(arg);
        if (!node) return print(`no unit matching "${arg}" — try a name like "galilai"`, 'err');
        print(`probing ${node.label} · layer_${node.layer}`);
        window.dispatchEvent(new CustomEvent('interp:probe', { detail: { id: node.id } }));
        setOpen(false);
        break;
      }
      case 'ablate':
      case 'restore': {
        const node = resolveUnit(arg);
        if (!node) return print(`no unit matching "${arg}"`, 'err');
        const action = verb.toLowerCase() === 'ablate' ? 'ablate' : 'restore';
        window.dispatchEvent(
          new CustomEvent('interp:ablate', { detail: { id: node.id, action } })
        );
        print(
          action === 'ablate'
            ? `${node.label} ablated — activation pinned to 0.00`
            : `${node.label} restored`
        );
        break;
      }
      case 'filter': {
        if (!arg) return print('usage: filter <skill>', 'err');
        window.dispatchEvent(new CustomEvent('interp:filter', { detail: { skill: arg } }));
        print(`toggled feature filter: ${arg}`);
        break;
      }
      case 'clear':
        window.dispatchEvent(new CustomEvent('interp:filter', { detail: { clear: true } }));
        print('feature filter cleared');
        break;
      case 'steer': {
        const v = Number(arg);
        if (Number.isNaN(v)) return print('usage: steer <0..2>', 'err');
        const clamped = Math.max(0, Math.min(2, v));
        window.dispatchEvent(new CustomEvent('interp:steer', { detail: { value: clamped } }));
        print(`steering coefficient α = ${clamped.toFixed(1)}`);
        break;
      }
      case 'run':
      case 'forward':
        print('▶ running forward pass…');
        window.dispatchEvent(new Event('interp:run'));
        setOpen(false);
        break;
      case 'card':
        print('loading model card…');
        window.location.href = '/model-card';
        break;
      case 'backprop':
        if (window.scrollY < 4) return print('already at the input layer', 'err');
        document.documentElement.classList.add('backward-pass');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        print('∇ propagating gradients to the input layer…');
        setOpen(false);
        break;
      case 'close':
      case 'exit':
        setOpen(false);
        break;
      default:
        print(`unknown command "${verb}" — type 'help'`, 'err');
    }
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowUp' && history.length > 0) {
      e.preventDefault();
      const pos = histPos === -1 ? history.length - 1 : Math.max(0, histPos - 1);
      setHistPos(pos);
      setInput(history[pos]);
    } else if (e.key === 'ArrowDown' && histPos !== -1) {
      e.preventDefault();
      const pos = histPos + 1;
      if (pos >= history.length) {
        setHistPos(-1);
        setInput('');
      } else {
        setHistPos(pos);
        setInput(history[pos]);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] w-[min(640px,calc(100vw-2rem))] rounded-lg border border-cyan-500/25 bg-[#0b0b1c]/95 backdrop-blur shadow-[0_0_40px_rgba(6,182,212,0.15)] font-mono text-xs"
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <span className="flex items-center gap-2 text-slate-400 tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
              INTERPRETABILITY CONSOLE
            </span>
            <span className="text-slate-600">esc to close</span>
          </div>

          {/* output */}
          <div ref={scrollRef} className="max-h-48 overflow-y-auto px-4 py-3 space-y-1">
            {lines.map((line, i) => (
              <p
                key={i}
                className={
                  line.kind === 'in'
                    ? 'text-cyan-300'
                    : line.kind === 'err'
                      ? 'text-rose-400'
                      : 'text-slate-300'
                }
              >
                {line.kind === 'in' ? `probe> ${line.text}` : line.text}
              </p>
            ))}
          </div>

          {/* input */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/5">
            <span className="text-cyan-400">probe&gt;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              spellCheck={false}
              autoComplete="off"
              aria-label="Console command"
              className="flex-1 bg-transparent outline-none text-cyan-100 placeholder:text-slate-600"
              placeholder="type 'help'"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
