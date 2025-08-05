import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Timer, 
  Zap, 
  Eye, 
  EyeOff, 
  Hash, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle 
} from "lucide-react";

interface CrackResult {
  success: boolean;
  password?: string;
  timeElapsed: number;
  attempts: number;
  method: string;
}

const PasswordCracker = () => {
  const [targetPassword, setTargetPassword] = useState("");
  const [hashType, setHashType] = useState("md5");
  const [showPassword, setShowPassword] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CrackResult | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState("");
  const [attackMethod, setAttackMethod] = useState("brute-force");
  const { toast } = useToast();

  // Common passwords for dictionary attack
  const commonPasswords = [
    "password", "123456", "password123", "admin", "qwerty", "letmein", 
    "welcome", "monkey", "1234567890", "password1", "abc123", "111111",
    "iloveyou", "password123", "admin123", "root", "toor", "pass",
    "test", "guest", "user", "demo", "sample", "default"
  ];

  // Simple hash functions for demonstration
  const hashPassword = (password: string, type: string): string => {
    // These are simplified for educational purposes
    switch (type) {
      case "md5":
        return btoa(password).replace(/=/g, "").toLowerCase() + "md5";
      case "sha1":
        return btoa(password + "salt").replace(/=/g, "").toLowerCase() + "sha1";
      case "sha256":
        return btoa(password + "sha256salt").replace(/=/g, "").toLowerCase() + "256";
      default:
        return btoa(password);
    }
  };

  const generatePasswordHash = () => {
    if (!targetPassword) {
      toast({
        title: "Error",
        description: "Please enter a password to hash",
        variant: "destructive"
      });
      return;
    }
    
    const hash = hashPassword(targetPassword, hashType);
    toast({
      title: "Hash Generated",
      description: `${hashType.toUpperCase()}: ${hash}`,
    });
  };

  const startCracking = async () => {
    if (!targetPassword) {
      toast({
        title: "Error",
        description: "Please enter a target password first",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResult(null);
    setCurrentAttempt("");

    const startTime = Date.now();
    let attempts = 0;
    let found = false;

    if (attackMethod === "dictionary") {
      // Dictionary attack
      for (let i = 0; i < commonPasswords.length && !found; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate time
        attempts++;
        setCurrentAttempt(commonPasswords[i]);
        setProgress((i + 1) / commonPasswords.length * 100);
        
        if (commonPasswords[i] === targetPassword) {
          found = true;
          const endTime = Date.now();
          setResult({
            success: true,
            password: commonPasswords[i],
            timeElapsed: endTime - startTime,
            attempts,
            method: "Dictionary Attack"
          });
        }
      }
    } else {
      // Brute force attack (simplified)
      const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
      const maxLength = Math.min(targetPassword.length + 2, 6); // Limit for demo
      
      for (let length = 1; length <= maxLength && !found; length++) {
        const totalCombinations = Math.pow(charset.length, length);
        
        for (let i = 0; i < Math.min(totalCombinations, 1000) && !found; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
          
          // Generate password combination
          let attempt = "";
          let num = i;
          for (let j = 0; j < length; j++) {
            attempt = charset[num % charset.length] + attempt;
            num = Math.floor(num / charset.length);
          }
          
          setCurrentAttempt(attempt);
          setProgress((attempts / 1000) * 100);
          
          if (attempt === targetPassword) {
            found = true;
            const endTime = Date.now();
            setResult({
              success: true,
              password: attempt,
              timeElapsed: endTime - startTime,
              attempts,
              method: "Brute Force Attack"
            });
          }
        }
      }
    }

    if (!found) {
      const endTime = Date.now();
      setResult({
        success: false,
        timeElapsed: endTime - startTime,
        attempts,
        method: attackMethod === "dictionary" ? "Dictionary Attack" : "Brute Force Attack"
      });
    }

    setIsRunning(false);
    setCurrentAttempt("");
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      notCommon: !commonPasswords.includes(password.toLowerCase())
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) return { level: "Weak", color: "destructive", percentage: 20 };
    if (score <= 4) return { level: "Medium", color: "warning", percentage: 60 };
    return { level: "Strong", color: "primary", percentage: 100 };
  };

  const strength = targetPassword ? getPasswordStrength(targetPassword) : null;

  return (
    <div className="space-y-6">
      {/* Password Setup */}
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Target Password Setup
          </CardTitle>
          <CardDescription>
            Set up the password you want to test and crack
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-password">Target Password</Label>
            <div className="relative">
              <Input
                id="target-password"
                type={showPassword ? "text" : "password"}
                value={targetPassword}
                onChange={(e) => setTargetPassword(e.target.value)}
                placeholder="Enter password to crack..."
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {strength && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Password Strength</span>
                <Badge variant="outline" className={`bg-${strength.color}/20 text-${strength.color}`}>
                  {strength.level}
                </Badge>
              </div>
              <Progress value={strength.percentage} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hash Algorithm</Label>
              <select 
                value={hashType} 
                onChange={(e) => setHashType(e.target.value)}
                className="w-full p-2 rounded-md border border-border bg-background text-foreground"
              >
                <option value="md5">MD5</option>
                <option value="sha1">SHA-1</option>
                <option value="sha256">SHA-256</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Attack Method</Label>
              <select 
                value={attackMethod} 
                onChange={(e) => setAttackMethod(e.target.value)}
                className="w-full p-2 rounded-md border border-border bg-background text-foreground"
              >
                <option value="brute-force">Brute Force</option>
                <option value="dictionary">Dictionary Attack</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={generatePasswordHash} 
              variant="outline"
              className="flex-1"
            >
              <Hash className="h-4 w-4 mr-2" />
              Generate Hash
            </Button>
            <Button 
              onClick={startCracking} 
              disabled={isRunning || !targetPassword}
              className="flex-1 cyber-glow"
            >
              {isRunning ? (
                <>
                  <Timer className="h-4 w-4 mr-2 animate-spin" />
                  Cracking...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Start Attack
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attack Progress */}
      {isRunning && (
        <Card className="terminal-effect border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-5 w-5 animate-pulse" />
              Attack in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            
            {currentAttempt && (
              <div className="space-y-2">
                <Label>Current Attempt</Label>
                <div className="font-mono text-sm bg-muted p-2 rounded border">
                  {currentAttempt}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Method: {attackMethod === "dictionary" ? "Dictionary Attack" : "Brute Force Attack"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card className={`terminal-effect ${result.success ? 'border-primary/50' : 'border-destructive/50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
              Attack Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {result.success ? "✓" : "✗"}
                </div>
                <div className="text-sm text-muted-foreground">Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {(result.timeElapsed / 1000).toFixed(1)}s
                </div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {result.attempts.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {result.method}
                </div>
                <div className="text-sm text-muted-foreground">Method</div>
              </div>
            </div>

            {result.success && result.password && (
              <div className="space-y-2">
                <Label>Cracked Password</Label>
                <div className="font-mono text-lg bg-primary/10 text-primary p-3 rounded border border-primary/20">
                  {result.password}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded">
              <strong>Educational Note:</strong> This simulation demonstrates how passwords can be cracked. 
              In reality, use strong passwords with mixed characters, enable 2FA, and never use common passwords.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methods">Attack Methods</TabsTrigger>
          <TabsTrigger value="defense">Defense</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Password Cracking Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p>Password cracking is the process of attempting to recover passwords from data that has been stored or transmitted by a computer system in encrypted form.</p>
              
              <h4>Why Learn This?</h4>
              <ul>
                <li>Understand password vulnerabilities</li>
                <li>Test your own password strength</li>
                <li>Learn how attackers operate</li>
                <li>Improve your security practices</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Common Attack Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-primary">1. Dictionary Attack</h4>
                  <p className="text-sm text-muted-foreground">Uses a list of common passwords and tries each one.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">2. Brute Force Attack</h4>
                  <p className="text-sm text-muted-foreground">Tries every possible combination of characters.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-accent">3. Hybrid Attack</h4>
                  <p className="text-sm text-muted-foreground">Combines dictionary words with numbers/symbols.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-warning">4. Rainbow Tables</h4>
                  <p className="text-sm text-muted-foreground">Uses precomputed hash tables for faster lookups.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defense" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Defense Strategies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Strong Passwords</h4>
                    <p className="text-sm text-muted-foreground">Use 12+ characters with mixed case, numbers, and symbols</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <h4 className="font-semibold">Salt & Hash</h4>
                    <p className="text-sm text-muted-foreground">Add random data before hashing to prevent rainbow table attacks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <h4 className="font-semibold">Multi-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add additional authentication factors beyond passwords</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-warning mt-1" />
                  <div>
                    <h4 className="font-semibold">Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">Limit the number of login attempts to slow down attacks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PasswordCracker;