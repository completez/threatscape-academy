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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Key, Lock, Unlock, AlertTriangle, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CrackingResult {
  algorithm: string;
  input: string;
  result: string;
  timeElapsed: number;
  attemptsMode: number;
}

const CryptographyAttacks = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("caesar");
  const [inputText, setInputText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [isAttacking, setIsAttacking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crackingResults, setCrackingResults] = useState<CrackingResult[]>([]);
  const [rsaPublicKey, setRsaPublicKey] = useState("65537,3233"); // e,n
  const [aesKey, setAesKey] = useState("secret123456789");

  const algorithms = [
    { value: "caesar", label: "Caesar Cipher", difficulty: "Beginner" },
    { value: "vigenere", label: "Vigenère Cipher", difficulty: "Intermediate" },
    { value: "substitution", label: "Substitution Cipher", difficulty: "Intermediate" },
    { value: "rsa-weak", label: "Weak RSA", difficulty: "Advanced" },
    { value: "aes-weak", label: "Weak AES", difficulty: "Expert" }
  ];

  // Simple Caesar cipher implementation
  const caesarEncrypt = (text: string, shift: number): string => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    }).join('');
  };

  const caesarCrack = (ciphertext: string): { shift: number, plaintext: string } => {
    // Try all possible shifts
    for (let shift = 1; shift <= 25; shift++) {
      const plaintext = caesarEncrypt(ciphertext, -shift);
      // Simple heuristic: look for common English words
      if (plaintext.toLowerCase().includes('the') || 
          plaintext.toLowerCase().includes('and') ||
          plaintext.toLowerCase().includes('is')) {
        return { shift, plaintext };
      }
    }
    return { shift: 0, plaintext: ciphertext };
  };

  const encryptText = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to encrypt",
        variant: "destructive",
      });
      return;
    }

    let encrypted = "";
    
    switch (selectedAlgorithm) {
      case "caesar":
        encrypted = caesarEncrypt(inputText, 3);
        break;
      case "vigenere":
        encrypted = "ENCRYPTED_VIGENERE_" + inputText.toUpperCase();
        break;
      case "substitution":
        encrypted = inputText.split('').map(c => 
          c.match(/[a-z]/i) ? String.fromCharCode(((c.charCodeAt(0) - 65 + 5) % 26) + 65) : c
        ).join('');
        break;
      case "rsa-weak":
        encrypted = `RSA_ENCRYPTED:${btoa(inputText)}`;
        break;
      case "aes-weak":
        encrypted = `AES_ENCRYPTED:${btoa(inputText)}`;
        break;
      default:
        encrypted = inputText;
    }

    setEncryptedText(encrypted);
    toast({
      title: "Text Encrypted",
      description: `Encrypted using ${algorithms.find(a => a.value === selectedAlgorithm)?.label}`,
    });
  };

  const startCryptographicAttack = () => {
    if (!encryptedText.trim()) {
      toast({
        title: "Error",
        description: "Please encrypt some text first",
        variant: "destructive",
      });
      return;
    }

    setIsAttacking(true);
    setProgress(0);

    toast({
      title: "Attack Started",
      description: `Attempting to crack ${algorithms.find(a => a.value === selectedAlgorithm)?.label}`,
    });

    // Simulate attack progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAttacking(false);
          
          // Simulate cracking result
          let result = "";
          let attempts = 0;
          
          switch (selectedAlgorithm) {
            case "caesar":
              const cracked = caesarCrack(encryptedText);
              result = cracked.plaintext;
              attempts = cracked.shift;
              break;
            case "vigenere":
              result = "Partial key found: 'KEY'";
              attempts = 15000;
              break;
            case "substitution":
              result = "Frequency analysis suggests: " + inputText;
              attempts = 50000;
              break;
            case "rsa-weak":
              result = "Factored: p=61, q=53";
              attempts = 1000000;
              break;
            case "aes-weak":
              result = "Brute force unsuccessful";
              attempts = 2**32;
              break;
            default:
              result = "Unknown algorithm";
          }

          const crackResult: CrackingResult = {
            algorithm: algorithms.find(a => a.value === selectedAlgorithm)?.label || "",
            input: encryptedText,
            result,
            timeElapsed: Math.random() * 60,
            attemptsMode: attempts
          };

          setCrackingResults(prev => [crackResult, ...prev]);
          
          toast({
            title: "Attack Completed",
            description: selectedAlgorithm === "aes-weak" ? "Attack failed" : "Cipher cracked!",
            variant: selectedAlgorithm === "aes-weak" ? "destructive" : "default",
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-primary/20 text-primary";
      case "Intermediate": return "bg-warning/20 text-warning";
      case "Advanced": return "bg-accent/20 text-accent";
      case "Expert": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyber">
            <Shield className="h-6 w-6" />
            Cryptography Attack Simulator
          </CardTitle>
          <CardDescription>
            Learn about cryptographic vulnerabilities and attack methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Key className="h-4 w-4" />
            <AlertDescription>
              This tool demonstrates cryptographic concepts for educational purposes only.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="attacks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attacks">Attack Simulation</TabsTrigger>
          <TabsTrigger value="results">Attack Results</TabsTrigger>
          <TabsTrigger value="education">Learn More</TabsTrigger>
        </TabsList>

        <TabsContent value="attacks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Encryption Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Cryptographic Algorithm</Label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map(algo => (
                        <SelectItem key={algo.value} value={algo.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{algo.label}</span>
                            <Badge className={getDifficultyColor(algo.difficulty)} variant="outline">
                              {algo.difficulty}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plaintext">Plaintext</Label>
                  <Textarea
                    id="plaintext"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to encrypt..."
                  />
                </div>

                <Button onClick={encryptText} className="w-full">
                  Encrypt Text
                </Button>

                {encryptedText && (
                  <div className="space-y-2">
                    <Label>Encrypted Text</Label>
                    <div className="bg-muted/50 p-3 rounded-lg border font-mono text-sm">
                      {encryptedText}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Attack Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAlgorithm === "rsa-weak" && (
                  <div className="space-y-2">
                    <Label htmlFor="rsa">RSA Public Key (e,n)</Label>
                    <Input
                      id="rsa"
                      value={rsaPublicKey}
                      onChange={(e) => setRsaPublicKey(e.target.value)}
                      placeholder="65537,3233"
                    />
                  </div>
                )}

                {selectedAlgorithm === "aes-weak" && (
                  <div className="space-y-2">
                    <Label htmlFor="aes">AES Key (weak)</Label>
                    <Input
                      id="aes"
                      value={aesKey}
                      onChange={(e) => setAesKey(e.target.value)}
                      placeholder="weak key"
                    />
                  </div>
                )}

                <Button 
                  onClick={startCryptographicAttack} 
                  disabled={isAttacking || !encryptedText}
                  variant="destructive"
                  className="w-full"
                >
                  {isAttacking ? "Attacking..." : "Start Cryptographic Attack"}
                </Button>

                {isAttacking && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cracking Progress...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                  <h4 className="font-medium mb-2">Attack Method:</h4>
                  <ul className="text-muted-foreground space-y-1">
                    {selectedAlgorithm === "caesar" && <li>• Brute force all shifts (1-25)</li>}
                    {selectedAlgorithm === "vigenere" && <li>• Frequency analysis + key guessing</li>}
                    {selectedAlgorithm === "substitution" && <li>• Statistical frequency analysis</li>}
                    {selectedAlgorithm === "rsa-weak" && <li>• Integer factorization attack</li>}
                    {selectedAlgorithm === "aes-weak" && <li>• Brute force key search</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5" />
                Attack Results History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {crackingResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No attacks performed yet. Run some cryptographic attacks to see results here.
                </p>
              ) : (
                <div className="space-y-4">
                  {crackingResults.map((result, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{result.algorithm} Attack</h4>
                        <Badge variant="outline">
                          {result.timeElapsed.toFixed(2)}s
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Input: </span>
                          <span className="font-mono">{result.input.substring(0, 50)}...</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Result: </span>
                          <span className="font-mono">{result.result}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Attempts: </span>
                          <span>{result.attemptsMode.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Understanding Cryptographic Attacks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Common Attack Methods:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Brute Force:</strong> Try all possible keys systematically</li>
                    <li>• <strong>Frequency Analysis:</strong> Analyze letter/pattern frequencies</li>
                    <li>• <strong>Factorization:</strong> Break down composite numbers (RSA)</li>
                    <li>• <strong>Dictionary Attack:</strong> Use common passwords/keys</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cryptographic Vulnerabilities:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Weak key generation</li>
                    <li>• Small key sizes</li>
                    <li>• Poor random number generation</li>
                    <li>• Implementation flaws</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Modern Security:</h4>
                  <p className="text-sm text-muted-foreground">
                    Modern cryptographic systems like AES-256, RSA-2048+, and elliptic curve 
                    cryptography are designed to resist these attacks when properly implemented.
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

export default CryptographyAttacks;