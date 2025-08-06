import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Lock, AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CryptoDemoProps {
  onFlagFound: (flag: string) => void;
}

const CryptoDemo = ({ onFlagFound }: CryptoDemoProps) => {
  const [caesarInput, setCaesarInput] = useState("");
  const [caesarShift, setCaesarShift] = useState(0);
  const [result, setResult] = useState("");
  const [attempts, setAttempts] = useState(0);

  const FLAG = "CYBER{CAESAR_CIPHER_MASTER}";
  const ENCRYPTED_MESSAGE = "FBEOV{FDHVDU_FLKSHU_PDVWHU}"; // Caesar cipher with shift 3
  const HINT_MESSAGE = "Wkh iodj lv klgghq lq wklv phvvdjh"; // "The flag is hidden in this message" with shift 3

  const caesarCipher = (text: string, shift: number) => {
    return text.replace(/[A-Z]/g, (char) => {
      const code = char.charCodeAt(0);
      const shifted = ((code - 65 + shift) % 26 + 26) % 26;
      return String.fromCharCode(shifted + 65);
    }).replace(/[a-z]/g, (char) => {
      const code = char.charCodeAt(0);
      const shifted = ((code - 97 + shift) % 26 + 26) % 26;
      return String.fromCharCode(shifted + 97);
    });
  };

  const handleDecrypt = () => {
    setAttempts(prev => prev + 1);
    const decrypted = caesarCipher(caesarInput.toUpperCase(), -caesarShift);
    setResult(decrypted);

    // Check if the decrypted message contains the flag
    if (decrypted.includes(FLAG)) {
      toast({
        title: "Flag Found!",
        description: "You successfully decrypted the Caesar cipher!",
      });
      onFlagFound(FLAG);
    }
  };

  const tryAllShifts = () => {
    const allResults = [];
    for (let i = 1; i <= 25; i++) {
      const decrypted = caesarCipher(caesarInput.toUpperCase(), -i);
      allResults.push(`Shift ${i}: ${decrypted}`);
    }
    setResult(allResults.join('\n'));
    
    // Check if any result contains the flag
    const hasFlag = allResults.some(result => result.includes(FLAG));
    if (hasFlag) {
      toast({
        title: "Brute Force Successful!",
        description: "Flag found through exhaustive search!",
      });
      onFlagFound(FLAG);
    }
  };

  const frequencyAnalysis = (text: string) => {
    const frequencies: { [key: string]: number } = {};
    const letters = text.replace(/[^A-Z]/g, '');
    
    for (const letter of letters) {
      frequencies[letter] = (frequencies[letter] || 0) + 1;
    }

    return Object.entries(frequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([letter, count]) => `${letter}: ${count}`)
      .join(', ');
  };

  const resetDemo = () => {
    setCaesarInput("");
    setCaesarShift(0);
    setResult("");
    setAttempts(0);
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Cryptography Challenge
            </CardTitle>
            <Button variant="outline" size="sm" onClick={resetDemo}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="caesar" className="space-y-4">
            <TabsList>
              <TabsTrigger value="caesar">Caesar Cipher</TabsTrigger>
              <TabsTrigger value="frequency">Frequency Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="caesar" className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Encrypted Message:</strong> {ENCRYPTED_MESSAGE}
                  <br />
                  <strong>Hint:</strong> {HINT_MESSAGE}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Decryption Tools</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cipher-text">Ciphertext</Label>
                      <Input
                        id="cipher-text"
                        value={caesarInput}
                        onChange={(e) => setCaesarInput(e.target.value)}
                        placeholder="Enter encrypted message"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shift-value">Shift Value (0-25)</Label>
                      <Input
                        id="shift-value"
                        type="number"
                        min="0"
                        max="25"
                        value={caesarShift}
                        onChange={(e) => setCaesarShift(parseInt(e.target.value) || 0)}
                        placeholder="Enter shift value"
                      />
                    </div>

                    <div className="space-y-2">
                      <Button onClick={handleDecrypt} className="w-full">
                        Decrypt with Shift
                      </Button>
                      <Button onClick={tryAllShifts} variant="outline" className="w-full">
                        Try All Shifts (Brute Force)
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Tips:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Caesar cipher shifts each letter by a fixed amount</li>
                      <li>Common shifts are 1, 3, 13 (ROT13), and 25</li>
                      <li>Try frequency analysis to find patterns</li>
                      <li>Look for common English words in the result</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Decryption Result</h3>
                  <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm whitespace-pre-line min-h-[200px] max-h-[300px] overflow-y-auto">
                    {result || "Enter ciphertext and try decryption..."}
                  </div>
                  
                  {attempts > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Attempts: {attempts}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="frequency" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Frequency Analysis</h3>
                
                {caesarInput && (
                  <div className="space-y-3">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">Letter Frequencies:</p>
                      <p className="font-mono text-sm">{frequencyAnalysis(caesarInput.toUpperCase())}</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">Analysis Notes:</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>Most common English letters: E, T, A, O, I, N</li>
                        <li>If 'H' appears frequently, it might be 'E' shifted by 3</li>
                        <li>Look for patterns that match English letter frequency</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Objective:</strong> Decrypt the Caesar cipher to reveal the hidden flag. Use the provided ciphertext or try your own.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoDemo;