import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Wifi, Lock, AlertTriangle, Eye, Network } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TrafficData {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  data: string;
  isEncrypted: boolean;
}

const MitmAttackSimulator = () => {
  const [isActive, setIsActive] = useState(false);
  const [targetUrl, setTargetUrl] = useState("https://example.com");
  const [capturedTraffic, setCapturedTraffic] = useState<TrafficData[]>([]);
  const [injectedData, setInjectedData] = useState("");
  const [progress, setProgress] = useState(0);

  const mockTrafficData: TrafficData[] = [
    {
      id: "1",
      timestamp: "2024-01-20 10:30:15",
      source: "192.168.1.100",
      destination: "203.0.113.1",
      protocol: "HTTP",
      data: "GET /login HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0...",
      isEncrypted: false
    },
    {
      id: "2", 
      timestamp: "2024-01-20 10:30:16",
      source: "203.0.113.1",
      destination: "192.168.1.100",
      protocol: "HTTP",
      data: "HTTP/1.1 200 OK\nContent-Type: text/html\n<html><body>Login Page</body></html>",
      isEncrypted: false
    },
    {
      id: "3",
      timestamp: "2024-01-20 10:30:17",
      source: "192.168.1.100", 
      destination: "203.0.113.1",
      protocol: "HTTPS",
      data: "[Encrypted SSL/TLS Traffic]",
      isEncrypted: true
    }
  ];

  const startMitmAttack = () => {
    setIsActive(true);
    setProgress(0);
    setCapturedTraffic([]);
    
    toast({
      title: "MITM Attack Started",
      description: "Intercepting network traffic...",
    });

    // Simulate traffic capture
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCapturedTraffic(mockTrafficData);
          setIsActive(false);
          toast({
            title: "Traffic Captured",
            description: `Intercepted ${mockTrafficData.length} packets`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const injectData = () => {
    if (!injectedData.trim()) {
      toast({
        title: "Error",
        description: "Please enter data to inject",
        variant: "destructive",
      });
      return;
    }

    const newPacket: TrafficData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      source: "Attacker (MITM)",
      destination: "192.168.1.100",
      protocol: "HTTP",
      data: injectedData,
      isEncrypted: false
    };

    setCapturedTraffic(prev => [...prev, newPacket]);
    setInjectedData("");
    
    toast({
      title: "Data Injected",
      description: "Malicious packet injected into traffic stream",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyber">
            <Network className="h-6 w-6" />
            Man-in-the-Middle Attack Simulator
          </CardTitle>
          <CardDescription>
            Learn how MITM attacks work and how to prevent them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This is an educational tool. Never use these techniques on networks you don't own.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="attack" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attack">Attack Simulation</TabsTrigger>
          <TabsTrigger value="defense">Defense Strategies</TabsTrigger>
          <TabsTrigger value="education">Learn More</TabsTrigger>
        </TabsList>

        <TabsContent value="attack" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Network Interception Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target URL</Label>
                <Input
                  id="target"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              
              <Button 
                onClick={startMitmAttack} 
                disabled={isActive}
                className="w-full"
              >
                {isActive ? "Intercepting..." : "Start MITM Attack"}
              </Button>

              {isActive && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Capturing Traffic...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {capturedTraffic.length > 0 && (
            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Captured Traffic
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {capturedTraffic.map((packet) => (
                    <div key={packet.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={packet.isEncrypted ? "secondary" : "destructive"}>
                            {packet.protocol}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {packet.timestamp}
                          </span>
                        </div>
                        {packet.isEncrypted ? (
                          <Lock className="h-4 w-4 text-primary" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {packet.source} → {packet.destination}
                      </div>
                      <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                        {packet.data}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <Label htmlFor="inject">Inject Malicious Data</Label>
                  <Textarea
                    id="inject"
                    value={injectedData}
                    onChange={(e) => setInjectedData(e.target.value)}
                    placeholder="Enter malicious payload to inject..."
                    className="mt-2"
                  />
                  <Button onClick={injectData} variant="destructive" className="mt-2">
                    Inject Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="defense" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>MITM Attack Prevention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Use HTTPS/TLS</h4>
                    <p className="text-sm text-muted-foreground">
                      Always use encrypted connections to prevent traffic interception
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Certificate Pinning</h4>
                    <p className="text-sm text-muted-foreground">
                      Pin SSL certificates to prevent certificate-based attacks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wifi className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Avoid Public WiFi</h4>
                    <p className="text-sm text-muted-foreground">
                      Use VPN when connecting to untrusted networks
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
              <CardTitle>Understanding MITM Attacks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What is a MITM Attack?</h4>
                  <p className="text-sm text-muted-foreground">
                    A Man-in-the-Middle attack occurs when an attacker secretly intercepts and 
                    relays communication between two parties who believe they are communicating 
                    directly with each other.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common MITM Techniques:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• ARP Spoofing</li>
                    <li>• DNS Spoofing</li>
                    <li>• Evil Twin WiFi</li>
                    <li>• SSL Stripping</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Real-World Impact:</h4>
                  <p className="text-sm text-muted-foreground">
                    MITM attacks can lead to credential theft, session hijacking, and data 
                    manipulation. They are particularly dangerous on unsecured networks.
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

export default MitmAttackSimulator;