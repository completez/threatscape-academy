import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface XssDemoProps {
  onFlagFound: (flag: string) => void;
}

const XssDemo = ({ onFlagFound }: XssDemoProps) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([
    "Great article! Very informative.",
    "Thanks for sharing this knowledge."
  ]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [sessionCookie, setSessionCookie] = useState("sessionId=abc123; userRole=admin");

  const FLAG = "CYBER{XSS_C00k13_St34l3r}";

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    let processedComment = comment;

    if (isFiltered) {
      // Basic XSS filtering (still bypassable)
      processedComment = comment
        .replace(/<script>/gi, '&lt;script&gt;')
        .replace(/<\/script>/gi, '&lt;/script&gt;')
        .replace(/javascript:/gi, 'blocked:');
    }

    // Check for XSS payload that steals cookies
    const xssPatterns = [
      /document\.cookie/i,
      /alert\(/i,
      /<img[^>]+onerror/i,
      /<svg[^>]+onload/i,
      /javascript:/i,
      /<script/i
    ];

    const hasXssPayload = xssPatterns.some(pattern => pattern.test(comment));

    if (hasXssPayload && !isFiltered) {
      // Simulate successful XSS attack
      setTimeout(() => {
        toast({
          title: "XSS Attack Successful!",
          description: "Cookie stolen! Flag captured.",
        });
        
        setComments(prev => [...prev, `${processedComment} 
        
🚨 XSS EXECUTED! 
Stolen Cookie: ${sessionCookie}
🚩 FLAG: ${FLAG}`]);
        
        onFlagFound(FLAG);
      }, 1000);
    } else {
      setComments(prev => [...prev, processedComment]);
    }

    setComment("");
  };

  const toggleFilter = () => {
    setIsFiltered(!isFiltered);
    setComments([
      "Great article! Very informative.",
      "Thanks for sharing this knowledge."
    ]);
  };

  const resetDemo = () => {
    setComments([
      "Great article! Very informative.",
      "Thanks for sharing this knowledge."
    ]);
    setComment("");
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              XSS (Cross-Site Scripting) Lab
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isFiltered ? "default" : "destructive"}>
                {isFiltered ? "Filtered" : "Vulnerable"}
              </Badge>
              <Button variant="outline" size="sm" onClick={toggleFilter}>
                <Shield className="h-4 w-4 mr-2" />
                Toggle Filter
              </Button>
              <Button variant="outline" size="sm" onClick={resetDemo}>
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isFiltered 
                ? "Basic XSS filtering enabled (but still bypassable with creative payloads)"
                : "No XSS protection! User input is directly rendered in the DOM."
              }
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Comment System</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="comment">Leave a Comment</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button onClick={handleSubmitComment} className="w-full">
                  Post Comment
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-2">
                <p><strong>XSS Payloads to try:</strong></p>
                <div className="bg-muted/50 p-3 rounded font-mono space-y-1">
                  <div>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</div>
                  <div>&lt;img src="x" onerror="alert(document.cookie)"&gt;</div>
                  <div>&lt;svg onload="alert(document.cookie)"&gt;</div>
                  <div>&lt;iframe src="javascript:alert(document.cookie)"&gt;</div>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Objective:</strong> Execute XSS to steal the session cookie and find the flag.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Comments</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-lg">
                    <div 
                      className="text-sm whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: comment }}
                    />
                  </div>
                ))}
              </div>

              <div className="bg-destructive/10 p-3 rounded-lg text-xs">
                <p><strong>Current Session:</strong></p>
                <p className="font-mono">{sessionCookie}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default XssDemo;