import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Shield, Lock, Eye, Zap, Bug, Code, AlertTriangle, Database, 
  Globe, Network, Key, Search, Brain, Target, Crown, Star
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  maxLevel: number;
  prerequisites: string[];
  unlocked: boolean;
  completed: boolean;
  rewards: string[];
  challenges: string[];
  position: { x: number; y: number };
}

interface SkillPath {
  id: string;
  name: string;
  description: string;
  icon: any;
  totalLevels: number;
  completedLevels: number;
  estimatedTime: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
}

const SkillTree = () => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("web-security");
  
  const skillPaths: SkillPath[] = [
    {
      id: "web-security",
      name: "Web Application Security",
      description: "Master web vulnerabilities and exploitation techniques",
      icon: Globe,
      totalLevels: 25,
      completedLevels: 8,
      estimatedTime: "3-4 months",
      difficulty: "intermediate"
    },
    {
      id: "network-security",
      name: "Network Security",
      description: "Learn network protocols, scanning, and penetration testing",
      icon: Network,
      totalLevels: 30,
      completedLevels: 5,
      estimatedTime: "4-5 months",
      difficulty: "advanced"
    },
    {
      id: "cryptography",
      name: "Cryptography & Encryption",
      description: "Understand encryption algorithms and cryptographic attacks",
      icon: Key,
      totalLevels: 20,
      completedLevels: 12,
      estimatedTime: "2-3 months",
      difficulty: "advanced"
    },
    {
      id: "incident-response",
      name: "Incident Response",
      description: "Learn to detect, analyze, and respond to security incidents",
      icon: AlertTriangle,
      totalLevels: 18,
      completedLevels: 3,
      estimatedTime: "2-3 months",
      difficulty: "expert"
    },
    {
      id: "reverse-engineering",
      name: "Reverse Engineering",
      description: "Analyze malware and understand binary exploitation",
      icon: Search,
      totalLevels: 35,
      completedLevels: 1,
      estimatedTime: "6-8 months",
      difficulty: "expert"
    }
  ];

  const webSecurityNodes: SkillNode[] = [
    {
      id: "web-basics",
      name: "Web Fundamentals",
      description: "HTTP, HTML, CSS, JavaScript basics",
      icon: Globe,
      category: "Foundation",
      level: 5,
      currentXP: 1500,
      requiredXP: 2000,
      maxLevel: 5,
      prerequisites: [],
      unlocked: true,
      completed: true,
      rewards: ["Web Security Badge", "100 XP"],
      challenges: ["HTTP Headers Analysis", "Basic Web Recon"],
      position: { x: 2, y: 1 }
    },
    {
      id: "sql-injection",
      name: "SQL Injection",
      description: "Learn to exploit SQL injection vulnerabilities",
      icon: Database,
      category: "Injection",
      level: 3,
      currentXP: 800,
      requiredXP: 1200,
      maxLevel: 5,
      prerequisites: ["web-basics"],
      unlocked: true,
      completed: false,
      rewards: ["SQL Master Badge", "250 XP"],
      challenges: ["Basic SQLi", "Blind SQLi", "Advanced SQLi"],
      position: { x: 1, y: 2 }
    },
    {
      id: "xss",
      name: "Cross-Site Scripting",
      description: "Master XSS attack vectors and bypasses",
      icon: Code,
      category: "Injection",
      level: 2,
      currentXP: 600,
      requiredXP: 1000,
      maxLevel: 5,
      prerequisites: ["web-basics"],
      unlocked: true,
      completed: false,
      rewards: ["XSS Expert Badge", "200 XP"],
      challenges: ["Reflected XSS", "Stored XSS", "DOM XSS"],
      position: { x: 3, y: 2 }
    },
    {
      id: "csrf",
      name: "CSRF & SSRF",
      description: "Cross-Site Request Forgery and Server-Side Request Forgery",
      icon: Target,
      category: "Request Forgery",
      level: 1,
      currentXP: 300,
      requiredXP: 800,
      maxLevel: 4,
      prerequisites: ["web-basics"],
      unlocked: true,
      completed: false,
      rewards: ["CSRF Hunter Badge", "180 XP"],
      challenges: ["CSRF Token Bypass", "SSRF Exploitation"],
      position: { x: 4, y: 2 }
    },
    {
      id: "auth-bypass",
      name: "Authentication Bypass",
      description: "Bypass authentication mechanisms and session handling",
      icon: Lock,
      category: "Authentication",
      level: 0,
      currentXP: 0,
      requiredXP: 1500,
      maxLevel: 5,
      prerequisites: ["sql-injection", "xss"],
      unlocked: false,
      completed: false,
      rewards: ["Auth Breaker Badge", "300 XP"],
      challenges: ["Session Fixation", "JWT Attacks", "OAuth Bypass"],
      position: { x: 2, y: 3 }
    },
    {
      id: "file-upload",
      name: "File Upload Attacks",
      description: "Exploit file upload vulnerabilities",
      icon: Bug,
      category: "File Handling",
      level: 0,
      currentXP: 0,
      requiredXP: 1000,
      maxLevel: 4,
      prerequisites: ["web-basics"],
      unlocked: true,
      completed: false,
      rewards: ["File Hunter Badge", "220 XP"],
      challenges: ["Unrestricted Upload", "Path Traversal"],
      position: { x: 5, y: 2 }
    },
    {
      id: "advanced-web",
      name: "Advanced Web Attacks",
      description: "XML External Entities, Deserialization, etc.",
      icon: Crown,
      category: "Advanced",
      level: 0,
      currentXP: 0,
      requiredXP: 2000,
      maxLevel: 6,
      prerequisites: ["auth-bypass", "file-upload"],
      unlocked: false,
      completed: false,
      rewards: ["Web Master Badge", "500 XP", "Certificate"],
      challenges: ["XXE Exploitation", "Deserialization Attacks"],
      position: { x: 3.5, y: 4 }
    }
  ];

  const getPathProgress = (pathId: string) => {
    const path = skillPaths.find(p => p.id === pathId);
    if (!path) return 0;
    return (path.completedLevels / path.totalLevels) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-primary/20 text-primary";
      case "intermediate": return "bg-warning/20 text-warning";
      case "advanced": return "bg-accent/20 text-accent";
      case "expert": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const getNodeStatus = (node: SkillNode) => {
    if (node.completed) return "completed";
    if (!node.unlocked) return "locked";
    if (node.level > 0) return "in-progress";
    return "available";
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-primary border-primary text-primary-foreground";
      case "in-progress": return "bg-warning/20 border-warning text-warning";
      case "available": return "bg-secondary border-secondary hover:bg-secondary/80";
      case "locked": return "bg-muted border-muted opacity-50 cursor-not-allowed";
      default: return "bg-muted border-muted";
    }
  };

  const upgradeSkill = (nodeId: string) => {
    const node = webSecurityNodes.find(n => n.id === nodeId);
    if (!node || !node.unlocked || node.level >= node.maxLevel) return;

    if (node.currentXP >= node.requiredXP) {
      toast({
        title: "Skill Upgraded!",
        description: `${node.name} is now level ${node.level + 1}`,
      });
    } else {
      toast({
        title: "Not enough XP",
        description: `Need ${node.requiredXP - node.currentXP} more XP to upgrade`,
        variant: "destructive",
      });
    }
  };

  const currentPathNodes = webSecurityNodes; // For now, showing web security

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyber">
            <Brain className="h-6 w-6" />
            Cybersecurity Skill Tree
          </CardTitle>
          <CardDescription>
            Progress through structured learning paths to master cybersecurity
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedPath} onValueChange={setSelectedPath} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          {skillPaths.map((path) => {
            const Icon = path.icon;
            return (
              <TabsTrigger key={path.id} value={path.id} className="flex items-center gap-2 text-xs">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{path.name.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {skillPaths.map((path) => {
          const Icon = path.icon;
          return (
            <TabsContent key={path.id} value={path.id} className="space-y-6">
              {/* Path Overview */}
              <Card className="terminal-effect">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle>{path.name}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(path.difficulty)}>
                      {path.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {path.completedLevels}/{path.totalLevels}
                      </div>
                      <div className="text-sm text-muted-foreground">Skills Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{path.estimatedTime}</div>
                      <div className="text-sm text-muted-foreground">Estimated Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {Math.round(getPathProgress(path.id))}%
                      </div>
                      <div className="text-sm text-muted-foreground">Progress</div>
                    </div>
                  </div>
                  <Progress value={getPathProgress(path.id)} className="h-2" />
                </CardContent>
              </Card>

              {/* Skill Tree Visualization */}
              <Card className="terminal-effect">
                <CardHeader>
                  <CardTitle>Skill Tree</CardTitle>
                  <CardDescription>
                    Click on skills to view details and unlock new abilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative min-h-[500px] bg-muted/20 rounded-lg p-8 overflow-auto">
                    <div className="relative" style={{ width: '600px', height: '400px' }}>
                      {/* Skill Nodes */}
                      {currentPathNodes.map((node) => {
                        const Icon = node.icon;
                        const status = getNodeStatus(node);
                        
                        return (
                          <TooltipProvider key={node.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`absolute w-20 h-20 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${getNodeColor(status)}`}
                                  style={{
                                    left: `${node.position.x * 100}px`,
                                    top: `${node.position.y * 80}px`
                                  }}
                                  onClick={() => setSelectedNode(node)}
                                >
                                  <Icon className="h-8 w-8" />
                                  {node.level > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                      {node.level}
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <div className="font-semibold">{node.name}</div>
                                  <div className="text-sm text-muted-foreground">{node.description}</div>
                                  <div className="text-xs">
                                    Level {node.level}/{node.maxLevel}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}

                      {/* Connection Lines */}
                      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                        {currentPathNodes.map((node) => 
                          node.prerequisites.map((prereqId) => {
                            const prereq = currentPathNodes.find(n => n.id === prereqId);
                            if (!prereq) return null;
                            
                            return (
                              <line
                                key={`${prereqId}-${node.id}`}
                                x1={prereq.position.x * 100 + 40}
                                y1={prereq.position.y * 80 + 40}
                                x2={node.position.x * 100 + 40}
                                y2={node.position.y * 80 + 40}
                                stroke="hsl(var(--border))"
                                strokeWidth="2"
                                strokeDasharray={node.unlocked ? "0" : "5,5"}
                              />
                            );
                          })
                        )}
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Node Details */}
              {selectedNode && (
                <Card className="terminal-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <selectedNode.icon className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle>{selectedNode.name}</CardTitle>
                          <CardDescription>{selectedNode.description}</CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setSelectedNode(null)}>
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-muted-foreground">
                              Level {selectedNode.level}/{selectedNode.maxLevel}
                            </span>
                          </div>
                          <Progress 
                            value={(selectedNode.currentXP / selectedNode.requiredXP) * 100} 
                            className="h-2" 
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {selectedNode.currentXP}/{selectedNode.requiredXP} XP
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-2">Challenges</h4>
                          <div className="space-y-1">
                            {selectedNode.challenges.map((challenge, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>{challenge}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Rewards</h4>
                          <div className="space-y-1">
                            {selectedNode.rewards.map((reward, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Crown className="h-3 w-3 text-primary" />
                                <span>{reward}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-2">Prerequisites</h4>
                          {selectedNode.prerequisites.length === 0 ? (
                            <span className="text-sm text-muted-foreground">None</span>
                          ) : (
                            <div className="space-y-1">
                              {selectedNode.prerequisites.map((prereqId) => {
                                const prereq = currentPathNodes.find(n => n.id === prereqId);
                                return prereq ? (
                                  <div key={prereqId} className="flex items-center gap-2 text-sm">
                                    <Shield className="h-3 w-3 text-primary" />
                                    <span>{prereq.name}</span>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => upgradeSkill(selectedNode.id)}
                        disabled={!selectedNode.unlocked || selectedNode.level >= selectedNode.maxLevel}
                        className="flex-1"
                      >
                        {selectedNode.level >= selectedNode.maxLevel 
                          ? "Maxed Out" 
                          : `Upgrade (${selectedNode.requiredXP - selectedNode.currentXP} XP needed)`
                        }
                      </Button>
                      <Button variant="outline">
                        Practice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default SkillTree;