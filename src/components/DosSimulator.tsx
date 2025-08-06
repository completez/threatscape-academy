import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Zap, Shield, TrendingUp, Server, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AttackStats {
  requestsSent: number;
  responseTime: number;
  successRate: number;
  serverStatus: "online" | "degraded" | "offline";
}

const DosSimulator = () => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [targetUrl, setTargetUrl] = useState("https://demo-server.local");
  const [attackType, setAttackType] = useState("http-flood");
  const [intensity, setIntensity] = useState("medium");
  const [progress, setProgress] = useState(0);
  const [attackStats, setAttackStats] = useState<AttackStats>({
    requestsSent: 0,
    responseTime: 50,
    successRate: 100,
    serverStatus: "online"
  });

  const attackTypes = [
    { value: "http-flood", label: "HTTP Flood" },
    { value: "syn-flood", label: "SYN Flood" },
    { value: "udp-flood", label: "UDP Flood" },
    { value: "ping-flood", label: "Ping Flood" },
    { value: "slowloris", label: "Slowloris" }
  ];

  const intensityLevels = [
    { value: "low", label: "Low (100 req/s)", color: "primary" },
    { value: "medium", label: "Medium (500 req/s)", color: "warning" },
    { value: "high", label: "High (1000 req/s)", color: "destructive" },
    { value: "extreme", label: "Extreme (5000 req/s)", color: "destructive" }
  ];

  const startDosAttack = () => {
    setIsAttacking(true);
    setProgress(0);
    setAttackStats({
      requestsSent: 0,
      responseTime: 50,
      successRate: 100,
      serverStatus: "online"
    });

    toast({
      title: "DoS Attack Started",
      description: `Launching ${attackType} attack at ${intensity} intensity`,
    });

    // Simulate attack progression
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update attack stats based on progress
        setAttackStats(prevStats => ({
          requestsSent: Math.floor((newProgress / 100) * 10000),
          responseTime: Math.min(50 + (newProgress * 20), 5000),
          successRate: Math.max(100 - (newProgress * 0.8), 0),
          serverStatus: newProgress < 30 ? "online" : 
                       newProgress < 70 ? "degraded" : "offline"
        }));

        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAttacking(false);
          toast({
            title: "Attack Completed",
            description: "Target server is unresponsive",
            variant: "destructive",
          });
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const stopAttack = () => {
    setIsAttacking(false);
    setProgress(0);
    setAttackStats({
      requestsSent: 0,
      responseTime: 50,
      successRate: 100,
      serverStatus: "online"
    });
    
    toast({
      title: "Attack Stopped",
      description: "DoS attack has been terminated",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-primary";
      case "degraded": return "text-warning";
      case "offline": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyber">
            <Zap className="h-6 w-6" />
            Denial of Service (DoS) Simulator
          </CardTitle>
          <CardDescription>
            Understand DoS attacks and learn about mitigation strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This simulator uses mock targets only. Never attack real servers or networks.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="simulator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simulator">Attack Simulator</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
          <TabsTrigger value="education">Learn More</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Attack Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Target Server</Label>
                  <Input
                    id="target"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://demo-server.local"
                    disabled={isAttacking}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attack Type</Label>
                  <Select value={attackType} onValueChange={setAttackType} disabled={isAttacking}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {attackTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Attack Intensity</Label>
                  <Select value={intensity} onValueChange={setIntensity} disabled={isAttacking}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {intensityLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={startDosAttack} 
                    disabled={isAttacking}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isAttacking ? "Attacking..." : "Start DoS Attack"}
                  </Button>
                  {isAttacking && (
                    <Button onClick={stopAttack} variant="outline">
                      Stop
                    </Button>
                  )}
                </div>

                {isAttacking && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Attack Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Real-time Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {attackStats.requestsSent.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Requests Sent</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-warning">
                      {attackStats.responseTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Response Time</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate:</span>
                    <Badge variant={attackStats.successRate > 80 ? "secondary" : "destructive"}>
                      {attackStats.successRate.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Status:</span>
                    <span className={`text-sm font-medium capitalize ${getStatusColor(attackStats.serverStatus)}`}>
                      {attackStats.serverStatus}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Attack Duration: {((progress / 100) * 50).toFixed(0)}s
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mitigation" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>DoS Attack Mitigation Strategies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">
                      Limit the number of requests from a single IP address within a time window
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Server className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Load Balancing</h4>
                    <p className="text-sm text-muted-foreground">
                      Distribute traffic across multiple servers to handle increased load
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">DDoS Protection Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Use cloud-based DDoS protection like Cloudflare or AWS Shield
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Understanding DoS Attacks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What is a DoS Attack?</h4>
                  <p className="text-sm text-muted-foreground">
                    A Denial of Service attack aims to make a service unavailable by overwhelming 
                    it with traffic or exploiting vulnerabilities to consume system resources.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Types of DoS Attacks:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>HTTP Flood:</strong> Overwhelm web servers with HTTP requests</li>
                    <li>• <strong>SYN Flood:</strong> Exploit TCP handshake process</li>
                    <li>• <strong>UDP Flood:</strong> Send large numbers of UDP packets</li>
                    <li>• <strong>Slowloris:</strong> Keep connections open to exhaust server resources</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">DDoS vs DoS:</h4>
                  <p className="text-sm text-muted-foreground">
                    DDoS (Distributed Denial of Service) uses multiple compromised systems 
                    (botnet) to launch coordinated attacks, making them much harder to defend against.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DosSimulator;