import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Lock, Eye, Zap, Bug, Code, AlertTriangle, Database, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PasswordCracker from "@/components/PasswordCracker";
import PhishingSimulator from "@/components/PhishingSimulator";
import VulnerabilityScanner from "@/components/VulnerabilityScanner";
import SqlInjectionLab from "@/components/SqlInjectionLab";
import MitmAttackSimulator from "@/components/MitmAttackSimulator";
import DosSimulator from "@/components/DosSimulator";
import XssPlayground from "@/components/XssPlayground";
import CryptographyAttacks from "@/components/CryptographyAttacks";
import FunctionalTutorials from "@/components/FunctionalTutorials";
import Challenges from "@/components/Challenges";
import Reports from "@/components/Reports";

const tools = [
  {
    id: "password-cracker",
    title: "Password Cracker",
    description: "Test password strength with brute force and dictionary attacks",
    icon: Lock,
    difficulty: "Beginner",
    category: "Authentication",
    color: "primary"
  },
  {
    id: "phishing-sim",
    title: "Phishing Simulator",
    description: "Create and test phishing websites for educational purposes",
    icon: Eye,
    difficulty: "Intermediate",
    category: "Social Engineering",
    color: "secondary"
  },
  {
    id: "vuln-scanner",
    title: "Vulnerability Scanner",
    description: "Scan websites for common security vulnerabilities",
    icon: Bug,
    difficulty: "Advanced",
    category: "Web Security",
    color: "accent"
  },
  {
    id: "mitm-attack",
    title: "MITM Attack Simulator",
    description: "Simulate man-in-the-middle attacks and learn prevention",
    icon: Zap,
    difficulty: "Expert",
    category: "Network Security",
    color: "warning"
  },
  {
    id: "dos-simulator",
    title: "DoS Simulator",
    description: "Understand denial-of-service attacks and mitigation",
    icon: AlertTriangle,
    difficulty: "Intermediate",
    category: "Network Security",
    color: "destructive"
  },
  {
    id: "sql-injection",
    title: "SQL Injection Lab",
    description: "Practice SQL injection attacks on vulnerable applications",
    icon: Database,
    difficulty: "Intermediate",
    category: "Web Security",
    color: "accent"
  },
  {
    id: "xss-lab",
    title: "XSS Playground",
    description: "Learn about cross-site scripting vulnerabilities",
    icon: Code,
    difficulty: "Beginner",
    category: "Web Security",
    color: "secondary"
  },
  {
    id: "crypto-attacks",
    title: "Cryptography Attacks",
    description: "Simulate attacks on encryption algorithms",
    icon: Shield,
    difficulty: "Expert",
    category: "Cryptography",
    color: "primary"
  }
];

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">กำลังโหลด... / Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-primary/20 text-primary";
      case "Intermediate": return "bg-warning/20 text-warning";
      case "Advanced": return "bg-accent/20 text-accent";
      case "Expert": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const renderToolContent = () => {
    switch (selectedTool) {
      case "password-cracker":
        return <PasswordCracker />;
      case "phishing-sim":
        return <PhishingSimulator />;
      case "vuln-scanner":
        return <VulnerabilityScanner />;
      case "sql-injection":
        return <SqlInjectionLab />;
      case "mitm-attack":
        return <MitmAttackSimulator />;
      case "dos-simulator":
        return <DosSimulator />;
      case "xss-lab":
        return <XssPlayground />;
      case "crypto-attacks":
        return <CryptographyAttacks />;
      default:
        return (
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="text-cyber">Tool Coming Soon</CardTitle>
              <CardDescription>This security tool is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">More cybersecurity tools and challenges are being added. Check back soon!</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (selectedTool || selectedPage) {
    const isPage = selectedPage !== null;
    const title = isPage 
      ? (selectedPage === 'tutorials' ? 'Tutorials' : 
         selectedPage === 'challenges' ? 'Challenges' : 'Reports')
      : tools.find(t => t.id === selectedTool)?.title;
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedTool(null);
                setSelectedPage(null);
              }}
              className="cyber-glow"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-cyber">
              {title}
            </h1>
          </div>
          {isPage ? (
            selectedPage === 'tutorials' ? <FunctionalTutorials /> :
            selectedPage === 'challenges' ? <Challenges /> :
            <Reports />
          ) : (
            renderToolContent()
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1 space-y-6">
              <h1 className="text-5xl font-bold text-cyber">
                ThreatScape Academy
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                เรียนรู้ Ethical Hacking และ Cybersecurity ผ่านการจำลองสถานการณ์จริง<br />
                Learn ethical hacking and cybersecurity through hands-on simulations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">ยินดีต้อนรับ / Welcome</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <Button variant="outline" onClick={() => signOut()} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                ออกจากระบบ / Logout
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tools.length}</div>
              <div className="text-sm text-muted-foreground">Security Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{completedLabs.length}</div>
              <div className="text-sm text-muted-foreground">Labs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">100%</div>
              <div className="text-sm text-muted-foreground">Safe Environment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">เครื่องมือและห้องปฏิบัติการความปลอดภัย / Security Tools & Labs</h2>
          <p className="text-muted-foreground">เลือกเครื่องมือเพื่อเริ่มต้นการเรียนรู้ Cybersecurity / Choose a tool to start your cybersecurity journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isCompleted = completedLabs.includes(tool.id);
            
            return (
              <Card 
                key={tool.id} 
                className="terminal-effect hover:scale-105 transition-all duration-300 cursor-pointer cyber-glow"
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    {isCompleted && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        ✓ Complete
                      </Badge>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {tool.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getDifficultyColor(tool.difficulty)}>
                      {tool.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  {tool.id === "password-cracker" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>Ready</span>
                      </div>
                      <Progress value={100} className="h-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Learning Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="text-primary">📚 Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Step-by-step guides for each security concept
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedPage('tutorials')}
                >
                  Browse Tutorials
                </Button>
              </CardContent>
            </Card>

            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="text-secondary">🎯 Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Test your skills with real-world scenarios
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedPage('challenges')}
                >
                  View Challenges
                </Button>
              </CardContent>
            </Card>

            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="text-accent">📊 Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your progress and achievements
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedPage('reports')}
                >
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;