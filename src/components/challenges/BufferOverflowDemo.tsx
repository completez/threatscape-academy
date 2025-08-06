import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";

interface BufferOverflowDemoProps {
  onFlagFound: (flag: string) => void;
}

const BufferOverflowDemo = ({ onFlagFound }: BufferOverflowDemoProps) => {
  const [inputData, setInputData] = useState("");
  const [result, setResult] = useState("");
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [memoryState, setMemoryState] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);

  const FLAG = "FLAG{buff3r_0v3rfl0w_m4st3r_2024}";
  const BUFFER_SIZE = 16;

  const simulateBufferOverflow = () => {
    setAttempts(prev => prev + 1);
    
    if (!isVulnerable) {
      // Safe implementation
      const truncatedInput = inputData.slice(0, BUFFER_SIZE);
      setResult(`ข้อมูลถูกตัดให้มีขนาด ${BUFFER_SIZE} ตัวอักษร / Input truncated to ${BUFFER_SIZE} characters: "${truncatedInput}"`);
      setMemoryState([truncatedInput]);
      return;
    }

    // Vulnerable implementation
    const memory = ['', 'return_address', 'saved_ebp', 'local_vars'];
    
    if (inputData.length > BUFFER_SIZE) {
      // Buffer overflow detected
      memory[0] = inputData.slice(0, BUFFER_SIZE);
      memory[1] = inputData.slice(BUFFER_SIZE, BUFFER_SIZE + 8) || 'return_address';
      memory[2] = inputData.slice(BUFFER_SIZE + 8, BUFFER_SIZE + 16) || 'saved_ebp';
      
      // Check for specific overflow patterns
      if (inputData.includes("A".repeat(20)) || 
          inputData.includes("AAAA") ||
          inputData.includes("\x41\x41\x41\x41") ||
          inputData.length > 32) {
        setResult(`🚨 Buffer Overflow ตรวจพบ! / Buffer Overflow Detected!
Memory corrupted: ${inputData.length} bytes written to ${BUFFER_SIZE} byte buffer
Return address overwritten: ${memory[1]}
Administrator access granted!`);
        
        setTimeout(() => {
          onFlagFound(FLAG);
        }, 1000);
      } else {
        setResult(`⚠️ Buffer เกิดการ overflow แต่ไม่สามารถ exploit ได้ / Buffer overflow occurred but no successful exploit
จำนวนข้อมูลที่เกิน: ${inputData.length - BUFFER_SIZE} bytes`);
      }
    } else {
      memory[0] = inputData;
      setResult(`✅ การป้อนข้อมูลปกติ / Normal input: "${inputData}" (${inputData.length}/${BUFFER_SIZE} bytes)`);
    }
    
    setMemoryState(memory);
  };

  const resetDemo = () => {
    setInputData("");
    setResult("");
    setMemoryState([]);
    setAttempts(0);
  };

  const toggleSecurity = () => {
    setIsVulnerable(!isVulnerable);
    resetDemo();
  };

  return (
    <Card className="terminal-effect">
      <CardHeader>
        <CardTitle className="text-cyber flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Buffer Overflow Laboratory
          <span className="text-sm text-muted-foreground">
            / ห้องปฏิบัติการ Buffer Overflow
          </span>
        </CardTitle>
        <CardDescription>
          เรียนรู้เกี่ยวกับ Buffer Overflow และวิธีการป้องกัน<br />
          Learn about buffer overflow vulnerabilities and prevention techniques
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isVulnerable ? "destructive" : "secondary"}>
              {isVulnerable ? "🚨 Vulnerable Mode" : "🛡️ Protected Mode"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isVulnerable ? "โหมดเสี่ยงภัย" : "โหมดปลอดภัย"}
            </span>
          </div>
          <Button onClick={toggleSecurity} variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Toggle Security
          </Button>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {isVulnerable ? (
              <>
                <strong>โหมดเสี่ยงภัย:</strong> Buffer size จำกัดอยู่ที่ {BUFFER_SIZE} ตัวอักษร แต่ไม่มีการตรวจสอบขนาด<br />
                <strong>Vulnerable Mode:</strong> Buffer size limited to {BUFFER_SIZE} characters but no bounds checking
              </>
            ) : (
              <>
                <strong>โหมดปลอดภัย:</strong> มีการตรวจสอบขนาดข้อมูลก่อนการประมวลผล<br />
                <strong>Protected Mode:</strong> Input validation and bounds checking enabled
              </>
            )}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="exploit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exploit">Buffer Overflow Test</TabsTrigger>
            <TabsTrigger value="memory">Memory View / มุมมองหน่วยความจำ</TabsTrigger>
          </TabsList>

          <TabsContent value="exploit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="overflow-input">
                ข้อมูลป้อนเข้า / Input Data (Buffer Size: {BUFFER_SIZE} bytes)
              </Label>
              <Input
                id="overflow-input"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="พิมพ์ข้อมูลของคุณที่นี่ / Enter your data here..."
                className="font-mono"
              />
              <div className="text-xs text-muted-foreground">
                ขนาดปัจจุบัน / Current size: {inputData.length} characters
              </div>
            </div>

            <Button onClick={simulateBufferOverflow} className="w-full">
              Execute Buffer Operation / ดำเนินการ Buffer
            </Button>

            {result && (
              <Alert className={result.includes("🚨") ? "border-destructive" : result.includes("⚠️") ? "border-warning" : "border-primary"}>
                <AlertDescription>
                  <pre className="text-xs font-mono whitespace-pre-wrap">{result}</pre>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">ตัวอย่าง Payload / Example Payloads:</h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputData("A".repeat(20))}
                  className="justify-start font-mono"
                >
                  {"A".repeat(20)} (Classic overflow)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputData("AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIIIJJJJKKKKLLLL")}
                  className="justify-start font-mono text-xs"
                >
                  Pattern-based overflow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputData("Hello World")}
                  className="justify-start font-mono"
                >
                  Hello World (Normal input)
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="memory" className="space-y-4">
            <h4 className="text-sm font-semibold">สถานะหน่วยความจำ / Memory State:</h4>
            <div className="space-y-2">
              {['Buffer', 'Return Address', 'Saved EBP', 'Local Variables'].map((label, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-24 text-xs text-muted-foreground">{label}:</div>
                  <div className="flex-1 p-2 bg-muted rounded font-mono text-xs border">
                    {memoryState[index] || 'Empty / ว่าง'}
                  </div>
                  {index === 1 && memoryState[1] && memoryState[1] !== 'return_address' && (
                    <Badge variant="destructive" className="text-xs">Overwritten!</Badge>
                  )}
                </div>
              ))}
            </div>
            
            {memoryState.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  จำนวนครั้งที่ทดสอบ / Attempts: {attempts}<br />
                  Buffer Size: {BUFFER_SIZE} bytes<br />
                  Input Size: {inputData.length} bytes<br />
                  Overflow: {inputData.length > BUFFER_SIZE ? `${inputData.length - BUFFER_SIZE} bytes` : 'None / ไม่มี'}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <Button onClick={resetDemo} variant="secondary" className="w-full">
          รีเซ็ตการทดลอง / Reset Demo
        </Button>
      </CardContent>
    </Card>
  );
};

export default BufferOverflowDemo;