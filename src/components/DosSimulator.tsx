import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Globe, RefreshCcw, Cpu, AlertTriangle, Shield, Info } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

/**
 * Beginner-Friendly Rate Limit Demo (SAFE)
 * ---------------------------------------
 * - No real network requests are made (local simulation only)
 * - Beginner Mode (default) shows only two lines: "Accepted" and "Blocked (429)"
 * - Three presets to quickly demonstrate common scenarios
 */

type AttackType = "TCP" | "UDP" | "HTTP"; // UI label only
type LimiterType = "Token Bucket" | "Leaky Bucket" | "Fixed Window" | "Sliding Window";

type Point = {
  t: number; // seconds since start
  sent: number; // how many requests we attempted in this tick
  success: number; // accepted (2xx)
  throttled: number; // rejected (429)
  remaining: number; // remaining tokens/quota
};

const MAX_POINTS = 120;

export default function BeginnerRateLimitDemo() {
  // ====== Beginner mode toggle ======
  const [beginnerMode, setBeginnerMode] = useState(true);

  // ====== Flood settings (SAFE) ======
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackType, setAttackType] = useState<AttackType>("HTTP");
  const [intensity, setIntensity] = useState(40); // target req/s
  const [progress, setProgress] = useState(0);

  // ====== Rate limiter params ======
  const [limiter, setLimiter] = useState<LimiterType>("Token Bucket");
  const [capacity, setCapacity] = useState(100); // max quota
  const [refillRps, setRefillRps] = useState(20); // tokens/sec (or drain rate for leaky bucket)
  const [windowSec, setWindowSec] = useState(1);

  // target (display only; no real requests)
  const [targetUrl, setTargetUrl] = useState("https://demo.local/api");

  // ====== Metrics ======
  const [requestsSent, setRequestsSent] = useState(0);
  const [series, setSeries] = useState<Point[]>([]);
  const startTsRef = useRef<number | null>(null);

  // ====== Internal limiter state ======
  const tokensRef = useRef<number>(capacity); // token bucket
  const leakQueueRef = useRef<number>(0); // leaky bucket queue size
  const windowCountRef = useRef<number>(0); // fixed window count within current window
  const slidingEventsRef = useRef<number[]>([]); // timestamps (ms) of accepted requests for sliding window
  const lastTickRef = useRef<number>(0); // window tick id for fixed window

  // Reset internals when params change
  useEffect(() => {
    tokensRef.current = capacity;
    leakQueueRef.current = 0;
    windowCountRef.current = 0;
    slidingEventsRef.current = [];
  }, [capacity, refillRps, windowSec, limiter]);

  // ====== Simulation loop ======
  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dtMs = now - last;
      last = now;

      if (!startTsRef.current) startTsRef.current = now;
      const tSec = Number(((now - startTsRef.current) / 1000).toFixed(1));

      if (isAttacking) {
        setProgress((p) => Math.min(100, p + dtMs / 100));
      }

      const dt = dtMs / 1000;
      const targetSends = isAttacking ? Math.max(0, Math.round(intensity * dt)) : 0;

      const { accepted, rejected, remaining } = simulateLimiterTick({
        limiter,
        sends: targetSends,
        dt,
        now,
        capacity,
        refillRps,
        windowSec,
        refs: { tokensRef, leakQueueRef, windowCountRef, slidingEventsRef, lastTickRef },
      });

      if (targetSends > 0) {
        setRequestsSent((n) => n + accepted + rejected);
        setSeries((arr) => {
          const next: Point = { t: tSec, sent: targetSends, success: accepted, throttled: rejected, remaining };
          const trimmed = [...arr, next];
          if (trimmed.length > MAX_POINTS) trimmed.shift();
          return trimmed;
        });
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isAttacking, intensity, limiter, capacity, refillRps, windowSec]);

  // Toast when throttling happens (helps beginners notice)
  const { toast } = useToast();
  const lastThrottledRef = useRef(0);
  useEffect(() => {
    const last = series[series.length - 1];
    if (last && last.throttled > 0 && performance.now() - lastThrottledRef.current > 1500) {
      lastThrottledRef.current = performance.now();
      toast({
        title: "429 Too Many Requests",
        description: `${last.throttled} requests were blocked in the last tick`,
        variant: "destructive",
      });
    }
  }, [series, toast]);

  // Controls
  const start = () => {
    setProgress(0);
    setRequestsSent(0);
    setSeries([]);
    startTsRef.current = null;
    setIsAttacking(true);
  };
  const stop = () => setIsAttacking(false);

  // Beginner-friendly presets
  function applyPreset(name: "Low traffic" | "Bursty" | "Over limit") {
    if (name === "Low traffic") {
      setBeginnerMode(true);
      setLimiter("Token Bucket");
      setCapacity(60);
      setRefillRps(20);
      setWindowSec(1);
      setIntensity(10);
    } else if (name === "Bursty") {
      setBeginnerMode(true);
      setLimiter("Token Bucket");
      setCapacity(40);
      setRefillRps(10);
      setWindowSec(1);
      setIntensity(80);
    } else if (name === "Over limit") {
      setBeginnerMode(true);
      setLimiter("Fixed Window");
      setCapacity(20);
      setWindowSec(1);
      setRefillRps(0);
      setIntensity(120);
    }
  }

  // Human-friendly status text
  const lastPoint = series[series.length - 1];
  const status = useMemo(() => {
    if (!lastPoint) return { emoji: "🟢", title: "Not started yet", desc: "Press Start to see the demo" };
    if (lastPoint.throttled > 0 && lastPoint.success === 0) return { emoji: "🔴", title: "Almost fully blocked", desc: "Quota exceeded; all requests blocked (429)" };
    if (lastPoint.throttled > 0) return { emoji: "🟠", title: "Being rate-limited", desc: "Some requests are rejected (429) because sending too fast" };
    return { emoji: "🟢", title: "All good", desc: "All requests are accepted" };
  }, [lastPoint]);

  return (
    <div className="space-y-6">
      {/* Intro / How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            How to read the graph (Beginner)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1) We send requests at a chosen rate (Intensity).</p>
          <p>2) The Rate Limiter checks whether you exceed quota.</p>
          <p>3) If exceeded → some requests return <code>429 Too Many Requests</code>.</p>
        </CardContent>
      </Card>

      {/* Main Simulator Card */}
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Flood (SAFE) + Rate Limit Visualizer — Beginner Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">Beginner Mode</Label>
                <Button variant="outline" size="sm" onClick={() => setBeginnerMode((v) => !v)}>
                  {beginnerMode ? "ON" : "OFF"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => applyPreset("Low traffic")}>Low traffic</Button>
                <Button size="sm" variant="secondary" onClick={() => applyPreset("Bursty")}>Bursty</Button>
                <Button size="sm" variant="secondary" onClick={() => applyPreset("Over limit")}>Over limit</Button>
              </div>

              <div className="space-y-2">
                <Label>Demo Target (display only)</Label>
                <Input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Safe mode: no real requests are sent
                </p>
              </div>

              <div className="space-y-2">
                <Label>Flood Type</Label>
                <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value as AttackType)}
                >
                  <option value="TCP">TCP Flood</option>
                  <option value="UDP">UDP Flood</option>
                  <option value="HTTP">HTTP Flood</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Intensity: {intensity} req/s</Label>
                <Slider value={[intensity]} onValueChange={(v) => setIntensity(v[0])} min={1} max={200} step={1} />
              </div>

              <div className="flex gap-3">
                <Button onClick={start} disabled={isAttacking} className="w-1/2 bg-red-600 hover:bg-red-700">
                  {isAttacking ? <RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
                  Start
                </Button>
                <Button onClick={stop} disabled={!isAttacking} className="w-1/2 bg-green-600 hover:bg-green-700">
                  <RefreshCcw className="h-4 w-4 mr-2" /> Stop
                </Button>
              </div>

              <div className="rounded-xl border p-3 bg-black/10">
                <div className="text-sm font-medium">Progress</div>
                <div className="w-full h-3 rounded bg-black/20 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-yellow-500"
                    style={{ width: `${progress}%`, transition: "width .1s linear" }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{progress.toFixed(0)}%</div>
              </div>
            </div>

            {/* Right: rate limiter params */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rate Limiter Type</Label>
                <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={limiter}
                  onChange={(e) => setLimiter(e.target.value as LimiterType)}
                >
                  <option>Token Bucket</option>
                  <option>Leaky Bucket</option>
                  <option>Fixed Window</option>
                  <option>Sliding Window</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Capacity (max quota)</Label>
                  <Input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Refill rate (req/s)</Label>
                  <Input
                    type="number"
                    value={refillRps}
                    onChange={(e) => setRefillRps(Math.max(0, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Window size (s)</Label>
                  <Input
                    type="number"
                    value={windowSec}
                    onChange={(e) => setWindowSec(Math.max(0.1, Number(e.target.value)))}
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Total requests attempted: <span className="font-semibold">{requestsSent}</span>
              </div>

              <ol className="text-sm bg-black/5 rounded-lg p-3 space-y-1">
                <li>1) We send requests at the chosen intensity</li>
                <li>2) The limiter checks if quota is exceeded</li>
                <li>3) If exceeded → some requests return <code>429 Too Many Requests</code></li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-secondary" />
            Rate Limit Impact (Easy to read)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" tickFormatter={(v) => `${v}s`} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value: number, name: string) => [value, name]} labelFormatter={(l) => `${l}s`} />
                <Legend />
                <ReferenceLine y={0} yAxisId="left" strokeDasharray="3 3" />
                {beginnerMode ? (
                  <>
                    <Line yAxisId="left" type="monotone" dataKey="success"   name="Accepted"          dot={false} strokeWidth={3} />
                    <Line yAxisId="left" type="monotone" dataKey="throttled" name="Blocked (429)"     dot={false} strokeWidth={3} />
                  </>
                ) : (
                  <>
                    <Line yAxisId="left"  type="monotone" dataKey="sent"      name="Sent (all attempts)"     dot={false} strokeWidth={2} />
                    <Line yAxisId="left"  type="monotone" dataKey="success"   name="Accepted (successful)"   dot={false} strokeWidth={2} />
                    <Line yAxisId="left"  type="monotone" dataKey="throttled" name="Throttled (429 errors)"  dot={false} strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="remaining" name="Remaining tokens/quota"  dot={false} strokeWidth={2} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Narration */}
          <div className="mt-4 rounded-xl border p-3 flex items-center gap-3">
            <div className="text-2xl">{status.emoji}</div>
            <div>
              <div className="font-semibold">{status.title}</div>
              <div className="text-sm text-muted-foreground">{status.desc}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-warning bg-warning/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Educational Purpose Only</span>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">
            This tool simulates flooding and rate limiting locally. Do not send traffic to systems you do not own or do not have explicit permission to test.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Limiter engine =====
function simulateLimiterTick({
  limiter,
  sends,
  dt,
  now,
  capacity,
  refillRps,
  windowSec,
  refs,
}: {
  limiter: LimiterType;
  sends: number;
  dt: number;
  now: number;
  capacity: number;
  refillRps: number;
  windowSec: number;
  refs: {
    tokensRef: React.MutableRefObject<number>;
    leakQueueRef: React.MutableRefObject<number>;
    windowCountRef: React.MutableRefObject<number>;
    slidingEventsRef: React.MutableRefObject<number[]>;
    lastTickRef: React.MutableRefObject<number>;
  };
}): { accepted: number; rejected: number; remaining: number } {
  const { tokensRef, leakQueueRef, windowCountRef, slidingEventsRef, lastTickRef } = refs;
  switch (limiter) {
    case "Token Bucket": {
      // Refill tokens
      tokensRef.current = Math.min(capacity, tokensRef.current + refillRps * dt);
      let accepted = 0;
      let rejected = 0;
      for (let i = 0; i < sends; i++) {
        if (tokensRef.current >= 1) {
          tokensRef.current -= 1;
          accepted++;
        } else {
          rejected++;
        }
      }
      return { accepted, rejected, remaining: Math.max(0, Math.floor(tokensRef.current)) };
    }
    case "Leaky Bucket": {
      // Enqueue and drain at constant rate
      leakQueueRef.current += sends;
      const canDrain = Math.min(leakQueueRef.current, Math.floor(refillRps * dt));
      const overflow = Math.max(0, leakQueueRef.current - canDrain - capacity);
      const accepted = canDrain;
      const rejected = overflow;
      leakQueueRef.current = Math.max(0, leakQueueRef.current - accepted - rejected);
      const remaining = Math.max(0, capacity - leakQueueRef.current);
      return { accepted, rejected, remaining };
    }
    case "Fixed Window": {
      // Reset every windowSec seconds
      const tick = Math.floor(now / (windowSec * 1000));
      if (tick !== lastTickRef.current) {
        lastTickRef.current = tick;
        windowCountRef.current = 0;
      }
      const remaining = Math.max(0, capacity - windowCountRef.current);
      const accepted = Math.min(remaining, sends);
      const rejected = Math.max(0, sends - accepted);
      windowCountRef.current += accepted;
      return { accepted, rejected, remaining: Math.max(0, capacity - windowCountRef.current) };
    }
    case "Sliding Window": {
      const windowMs = windowSec * 1000;
      const cutoff = now - windowMs;
      slidingEventsRef.current = slidingEventsRef.current.filter((ts) => ts >= cutoff);
      const remaining = Math.max(0, capacity - slidingEventsRef.current.length);
      const accepted = Math.min(remaining, sends);
      const rejected = Math.max(0, sends - accepted);
      for (let i = 0; i < accepted; i++) {
        slidingEventsRef.current.push(now);
      }
      return { accepted, rejected, remaining: Math.max(0, capacity - slidingEventsRef.current.length) };
    }
  }
}
