import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  MessageSquare, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Globe
} from "lucide-react";

interface PhishingTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  targetSite: string;
}

const phishingTemplates: PhishingTemplate[] = [
  {
    id: "fake-bank",
    name: "Fake Bank Login",
    description: "Simulates a banking website login page",
    targetSite: "SecureBank",
    html: `<!DOCTYPE html>
<html>
<head>
    <title>SecureBank - Login</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .logo { text-align: center; color: #2563eb; font-size: 24px; font-weight: bold; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; color: #333; }
        input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
        .btn { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
        .btn:hover { background: #1d4ed8; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px; border-radius: 4px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏦 SecureBank</div>
        <form onsubmit="handleLogin(event)">
            <div class="form-group">
                <label>Username or Email</label>
                <input type="text" id="username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn">Sign In</button>
        </form>
        <div id="result" style="display: none;" class="warning">
            <strong>⚠️ This was a phishing simulation!</strong><br>
            You entered: <span id="captured-data"></span><br>
            Never enter credentials on suspicious websites!
        </div>
    </div>
    <script>
        function handleLogin(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            document.getElementById('captured-data').innerText = 'Username: ' + username + ', Password: [hidden]';
            document.getElementById('result').style.display = 'block';
        }
    </script>
</body>
</html>`
  },
  {
    id: "fake-social",
    name: "Fake Social Media",
    description: "Simulates a social media login page",
    targetSite: "SocialConnect",
    html: `<!DOCTYPE html>
<html>
<head>
    <title>SocialConnect - Login</title>
    <style>
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; min-height: 100vh; }
        .container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
        .logo { text-align: center; color: #667eea; font-size: 28px; font-weight: bold; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; color: #333; font-weight: 500; }
        input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; }
        .btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 8px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">📱 SocialConnect</div>
        <form onsubmit="handleLogin(event)">
            <div class="form-group">
                <label>Email or Phone</label>
                <input type="text" id="email" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn">Log In</button>
        </form>
        <div id="result" style="display: none;" class="warning">
            <strong>🎯 Phishing Attack Detected!</strong><br>
            Your credentials would have been stolen: <span id="captured-data"></span><br>
            Always verify the URL and look for HTTPS!
        </div>
    </div>
    <script>
        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            document.getElementById('captured-data').innerText = email + ' / [password hidden]';
            document.getElementById('result').style.display = 'block';
        }
    </script>
</body>
</html>`
  }
];

const PhishingSimulator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<PhishingTemplate | null>(null);
  const [customEmail, setCustomEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("Urgent: Please verify your account");
  const [emailBody, setEmailBody] = useState(`Dear valued customer,

We have detected unusual activity on your account. For your security, please click the link below to verify your identity immediately.

Click here to verify: [MALICIOUS_LINK]

This link will expire in 24 hours. If you do not verify your account, it may be temporarily suspended.

Thank you for your cooperation.
Security Team`);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const generatePhishingUrl = (template: PhishingTemplate) => {
    // Generate a fake suspicious URL for educational purposes
    const suspiciousUrls = [
      `secure-${template.targetSite.toLowerCase()}-verify.com`,
      `${template.targetSite.toLowerCase()}-security-update.net`,
      `verify-${template.targetSite.toLowerCase()}-account.org`,
      `${template.targetSite.toLowerCase()}-maintenance.info`
    ];
    return suspiciousUrls[Math.floor(Math.random() * suspiciousUrls.length)];
  };

  const copyTemplate = () => {
    if (selectedTemplate) {
      navigator.clipboard.writeText(selectedTemplate.html);
      toast({
        title: "Template Copied",
        description: "Phishing template HTML has been copied to clipboard",
      });
    }
  };

  const sendSimulationEmail = () => {
    if (!customEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending email (educational only)
    toast({
      title: "⚠️ Educational Simulation Only",
      description: `Email simulation would be sent to: ${customEmail}`,
    });
    
    // In a real scenario, this would need backend/Supabase integration
    console.log("Simulated phishing email:", {
      to: customEmail,
      subject: emailSubject,
      body: emailBody
    });
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Card className="border-warning bg-warning/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Educational Purpose Only</span>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">
            This tool is designed for cybersecurity education. Never use these techniques for malicious purposes.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="email">Email Simulation</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Phishing Templates
              </CardTitle>
              <CardDescription>
                Pre-built phishing page templates for educational testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {phishingTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <Badge variant="outline" className="mt-2">
                            Target: {template.targetSite}
                          </Badge>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedTemplate && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex gap-2">
                    <Button onClick={copyTemplate} variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy HTML
                    </Button>
                    <Button 
                      onClick={() => setShowPreview(!showPreview)} 
                      variant="secondary"
                      className="flex-1"
                    >
                      {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showPreview ? 'Hide' : 'Preview'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Suspicious URL Generated</Label>
                    <div className="font-mono text-sm bg-destructive/10 text-destructive p-2 rounded border">
                      https://{generatePhishingUrl(selectedTemplate)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ⚠️ This URL looks suspicious - notice the slight misspelling or extra domains
                    </p>
                  </div>

                  {showPreview && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted px-3 py-2 text-sm font-medium">Live Preview</div>
                      <div className="max-h-96 overflow-auto">
                        <iframe
                          srcDoc={selectedTemplate.html}
                          className="w-full h-80 border-none"
                          title="Phishing Template Preview"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-secondary" />
                Phishing Email Simulation
              </CardTitle>
              <CardDescription>
                Create and test phishing email content (simulation only)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-email">Target Email (Educational Test)</Label>
                <Input
                  id="target-email"
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-body">Email Content</Label>
                <Textarea
                  id="email-body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Enter email content..."
                  rows={8}
                />
              </div>

              <Button 
                onClick={sendSimulationEmail} 
                className="w-full cyber-glow"
                disabled={!customEmail}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Simulation Email
              </Button>

              <div className="bg-muted/20 p-4 rounded text-sm">
                <strong>Note:</strong> This is a simulation only. In a real phishing test, emails would be sent through 
                a controlled environment with proper authorization and user consent.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <div className="grid gap-4">
            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle>How Phishing Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-primary">1. Target Selection</h4>
                    <p className="text-sm text-muted-foreground">Attackers research and select victims, often through social media or data breaches.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary">2. Deceptive Communication</h4>
                    <p className="text-sm text-muted-foreground">Fake emails, texts, or calls that appear to be from trusted sources.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent">3. Malicious Links/Attachments</h4>
                    <p className="text-sm text-muted-foreground">Direct victims to fake websites or download malware.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-warning">4. Data Harvesting</h4>
                    <p className="text-sm text-muted-foreground">Collect credentials, personal information, or financial data.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle>Detection & Prevention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Verify the Sender</h4>
                      <p className="text-sm text-muted-foreground">Check email addresses carefully for slight misspellings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-secondary mt-1" />
                    <div>
                      <h4 className="font-semibold">Check URLs</h4>
                      <p className="text-sm text-muted-foreground">Hover over links to see the real destination before clicking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold">Look for HTTPS</h4>
                      <p className="text-sm text-muted-foreground">Legitimate sites use secure connections (lock icon)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-warning mt-1" />
                    <div>
                      <h4 className="font-semibold">Trust Your Instincts</h4>
                      <p className="text-sm text-muted-foreground">If something feels urgent or too good to be true, verify independently</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhishingSimulator;