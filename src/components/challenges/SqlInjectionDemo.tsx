import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SqlInjectionDemoProps {
  onFlagFound: (flag: string) => void;
}

const SqlInjectionDemo = ({ onFlagFound }: SqlInjectionDemoProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string>("");
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const FLAG = "CYBER{SQL_1nj3ct10n_M4st3r}";
  
  const vulnerableUsers = [
    { id: 1, username: "admin", password: "password123", role: "administrator", flag: FLAG },
    { id: 2, username: "user1", password: "qwerty", role: "user", flag: null },
    { id: 3, username: "guest", password: "guest", role: "guest", flag: null }
  ];

  const handleLogin = () => {
    setAttempts(prev => prev + 1);

    if (isVulnerable) {
      // Simulate SQL injection vulnerability
      const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
      
      // Check for common SQL injection patterns
      const injectionPatterns = [
        "' OR '1'='1",
        "' OR 1=1 --",
        "' OR 'a'='a",
        "admin' --",
        "' UNION SELECT",
        "' OR username='admin' --"
      ];

      const isInjectionAttempt = injectionPatterns.some(pattern => 
        username.toLowerCase().includes(pattern.toLowerCase()) || 
        password.toLowerCase().includes(pattern.toLowerCase())
      );

      if (isInjectionAttempt) {
        // Successful SQL injection
        const adminUser = vulnerableUsers.find(u => u.role === "administrator");
        if (adminUser) {
          setResult(`
Query: ${query}

SQL Injection Successful! 
Logged in as: ${adminUser.username}
Role: ${adminUser.role}
User ID: ${adminUser.id}

🚩 FLAG FOUND: ${adminUser.flag}
          `);
          
          toast({
            title: "SQL Injection Successful!",
            description: "You bypassed authentication and found the flag!",
          });
          
          onFlagFound(adminUser.flag);
          return;
        }
      }

      // Normal login attempt
      const user = vulnerableUsers.find(u => u.username === username && u.password === password);
      if (user) {
        setResult(`
Query: ${query}

Login successful!
Welcome: ${user.username}
Role: ${user.role}
${user.flag ? `🚩 FLAG: ${user.flag}` : "No special privileges"}
        `);
        
        if (user.flag) {
          onFlagFound(user.flag);
        }
      } else {
        setResult(`
Query: ${query}

Login failed: Invalid username or password
        `);
      }
    } else {
      // Secure version - parameterized queries
      const user = vulnerableUsers.find(u => u.username === username && u.password === password);
      if (user) {
        setResult(`Secure login successful! Welcome: ${user.username}`);
      } else {
        setResult("Login failed: Invalid credentials");
      }
    }
  };

  const toggleSecurity = () => {
    setIsVulnerable(!isVulnerable);
    setResult("");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              SQL Injection Testing Lab
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isVulnerable ? "destructive" : "default"}>
                {isVulnerable ? "Vulnerable" : "Secure"}
              </Badge>
              <Button variant="outline" size="sm" onClick={toggleSecurity}>
                <Shield className="h-4 w-4 mr-2" />
                Toggle Security
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isVulnerable 
                ? "This form is vulnerable to SQL injection. Try bypassing authentication!"
                : "This form uses parameterized queries and is secure against SQL injection."
              }
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Login Form</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Login
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Hint:</strong> Try these SQL injection payloads:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>' OR '1'='1</li>
                  <li>admin' --</li>
                  <li>' OR 1=1 --</li>
                  <li>' OR username='admin' --</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Query Result</h3>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm whitespace-pre-line min-h-[200px]">
                {result || "Execute a query to see results..."}
              </div>
              
              {attempts > 0 && (
                <div className="text-xs text-muted-foreground">
                  Attempts: {attempts}
                </div>
              )}
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Objective:</strong> Use SQL injection to bypass authentication and access admin account to find the flag.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SqlInjectionDemo;