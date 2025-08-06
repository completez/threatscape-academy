import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Code, Shield, AlertTriangle, Bug, Eye, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface XssPayload {
  name: string;
  code: string;
  description: string;
  type: "reflected" | "stored" | "dom";
}

const XssPlayground = () => {
  const [userInput, setUserInput] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [selectedPayload, setSelectedPayload] = useState<string>("");
  const [comments, setComments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const xssPayloads: XssPayload[] = [
    {
      name: "Basic Alert",
      code: "<script>alert('XSS')</script>",
      description: "Simple JavaScript alert to demonstrate XSS",
      type: "reflected"
    },
    {
      name: "Cookie Stealer",
      code: "<script>alert('Cookies: ' + document.cookie)</script>",
      description: "Display user cookies (simulated)",
      type: "reflected"
    },
    {
      name: "Image Tag XSS",
      code: "<img src=x onerror='alert(\"XSS via image\")'>",
      description: "XSS through image error handler",
      type: "reflected"
    },
    {
      name: "Iframe Injection",
      code: "<iframe src='javascript:alert(\"XSS via iframe\")'></iframe>",
      description: "XSS through iframe source",
      type: "reflected"
    },
    {
      name: "Event Handler XSS",
      code: "<div onmouseover='alert(\"XSS on mouseover\")'>Hover me</div>",
      description: "XSS through event handlers",
      type: "dom"
    },
    {
      name: "SVG XSS",
      code: "<svg onload='alert(\"SVG XSS\")'>",
      description: "XSS through SVG elements",
      type: "reflected"
    }
  ];

  const sanitizeInput = (input: string): string => {
    if (!isProtected) return input;
    
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  };

  const executePayload = () => {
    if (!userInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an XSS payload",
        variant: "destructive",
      });
      return;
    }

    const sanitized = sanitizeInput(userInput);
    
    if (isProtected && sanitized !== userInput) {
      toast({
        title: "XSS Blocked!",
        description: "Input was sanitized and XSS payload neutralized",
        variant: "default",
      });
    } else if (!isProtected && userInput.includes("<script>")) {
      toast({
        title: "XSS Attack Successful!",
        description: "JavaScript payload would execute in unprotected environment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Input Processed",
        description: "No XSS payload detected",
      });
    }
  };

  const addComment = () => {
    if (!userInput.trim()) return;
    
    const sanitized = sanitizeInput(userInput);
    setComments(prev => [...prev, sanitized]);
    setUserInput("");
    
    if (!isProtected && userInput !== sanitized) {
      toast({
        title: "Stored XSS Vulnerability!",
        description: "Malicious script stored in comments",
        variant: "destructive",
      });
    }
  };

  const searchVulnerability = () => {
    if (!searchQuery.trim()) return;
    
    const sanitized = sanitizeInput(searchQuery);
    
    if (!isProtected && searchQuery !== sanitized) {
      toast({
        title: "DOM XSS Vulnerability!",
        description: "Search query contains malicious script",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Search Executed",
        description: `Searching for: ${sanitized}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyber">
            <Code className="h-6 w-6" />
            Cross-Site Scripting (XSS) Playground
          </CardTitle>
          <CardDescription>
            Learn about XSS vulnerabilities and how to prevent them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This is a safe learning environment. All scripts are simulated and won't harm your system.
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="protection"
              checked={isProtected}
              onCheckedChange={setIsProtected}
            />
            <Label htmlFor="protection">
              Enable XSS Protection {isProtected ? "(Secured)" : "(Vulnerable)"}
            </Label>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reflected" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reflected">Reflected XSS</TabsTrigger>
          <TabsTrigger value="stored">Stored XSS</TabsTrigger>
          <TabsTrigger value="dom">DOM XSS</TabsTrigger>
          <TabsTrigger value="education">Learn More</TabsTrigger>
        </TabsList>

        <TabsContent value="reflected" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Reflected XSS Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payload">XSS Payload</Label>
                  <Textarea
                    id="payload"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter XSS payload..."
                    className="font-mono text-sm"
                  />
                </div>
                
                <Button onClick={executePayload} className="w-full">
                  Test Payload
                </Button>

                <div className="space-y-2">
                  <Label>Output Preview:</Label>
                  <div className="bg-muted/50 p-3 rounded-lg border">
                    <div 
                      className="text-sm"
                      dangerouslySetInnerHTML={{ 
                        __html: sanitizeInput(userInput) || "Your input will appear here..." 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Common XSS Payloads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {xssPayloads.filter(p => p.type === "reflected").map((payload, index) => (
                  <div key={index} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{payload.name}</h4>
                      <Badge variant="outline">{payload.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {payload.description}
                    </p>
                    <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                      {payload.code}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2 w-full"
                      onClick={() => setUserInput(payload.code)}
                    >
                      Try This Payload
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stored" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Stored XSS Simulation
              </CardTitle>
              <CardDescription>
                Simulate stored XSS through a comment system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Add Comment</Label>
                <Textarea
                  id="comment"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Write a comment..."
                />
              </div>
              
              <Button onClick={addComment} className="w-full">
                Post Comment
              </Button>

              <div className="space-y-3">
                <h4 className="font-medium">Comments:</h4>
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet</p>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg border">
                      <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: comment }}
                      />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dom" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                DOM XSS Test
              </CardTitle>
              <CardDescription>
                Test DOM-based XSS through search functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Query</Label>
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter search query..."
                />
              </div>
              
              <Button onClick={searchVulnerability} className="w-full">
                Search
              </Button>

              <div className="bg-muted/50 p-3 rounded-lg border">
                <p className="text-sm mb-2">Search Results for:</p>
                <div 
                  className="text-sm font-medium"
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeInput(searchQuery) || "Enter a search query..." 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Understanding XSS Attacks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What is XSS?</h4>
                  <p className="text-sm text-muted-foreground">
                    Cross-Site Scripting (XSS) allows attackers to inject malicious scripts 
                    into websites viewed by other users, potentially stealing data or 
                    performing actions on their behalf.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Types of XSS:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Reflected XSS:</strong> Script reflected from server in response</li>
                    <li>• <strong>Stored XSS:</strong> Script stored on server and executed later</li>
                    <li>• <strong>DOM XSS:</strong> Script executes through DOM manipulation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Prevention Methods:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Input validation and sanitization</li>
                    <li>• Output encoding</li>
                    <li>• Content Security Policy (CSP)</li>
                    <li>• HTTPOnly cookies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default XssPlayground;