import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BookOpen, Play, CheckCircle, Clock, Search, Star, User } from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  duration: number; // minutes
  progress: number; // percentage
  rating: number;
  author: string;
  completed: boolean;
  steps: string[];
}

const Tutorials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const tutorials: Tutorial[] = [
    {
      id: "password-security",
      title: "Password Security Fundamentals / พื้นฐานความปลอดภัยรหัสผ่าน",
      description: "เรียนรู้พื้นฐานการสร้างรหัสผ่านที่แข็งแกร่งและทำความเข้าใจวิธีการโจมตีทั่วไป / Learn the basics of creating strong passwords and understanding common attack methods",
      category: "Authentication / การยืนยันตัวตน",
      difficulty: "Beginner",
      duration: 15,
      progress: 100,
      rating: 4.8,
      author: "CyberSec Team",
      completed: true,
      steps: [
        "ทำความเข้าใจความต้องการความซับซ้อนของรหัสผ่าน / Understanding password complexity requirements",
        "วิธีการโจมตีรหัสผ่านทั่วไป / Common password attack methods",
        "ใช้ตัวจัดการรหัสผ่านอย่างมีประสิทธิภาพ / Using password managers effectively",
        "การตั้งค่าการยืนยันตัวตนสองปัจจัย / Two-factor authentication setup",
        "แนวทางปฏิบัติที่ดีที่สุดสำหรับนโยบายรหัสผ่าน / Password policy best practices"
      ]
    },
    {
      id: "phishing-awareness",
      title: "Identifying Phishing Attacks / การระบุการโจมตี Phishing",
      description: "เรียนรู้การจดจำและป้องกันการพยายาม phishing และ social engineering / Learn to recognize and defend against phishing attempts and social engineering",
      category: "Social Engineering / วิศวกรรมสังคม",
      difficulty: "Beginner",
      duration: 20,
      progress: 60,
      rating: 4.9,
      author: "Security Expert",
      completed: false,
      steps: [
        "ประเภทของการโจมตี phishing / Types of phishing attacks",
        "เทคนิคการวิเคราะห์อีเมล / Email analysis techniques",
        "วิธีการตรวจสอบ URL / URL inspection methods",
        "การรายงานความพยายาม phishing / Reporting phishing attempts",
        "การสร้างโปรแกรมความตระหนัก / Creating awareness programs"
      ]
    },
    {
      id: "web-vulnerabilities",
      title: "Common Web Vulnerabilities / ช่องโหว่เว็บทั่วไป",
      description: "สำรวจช่องโหว่ OWASP Top 10 และวิธีการระบุพวกมัน / Explore OWASP Top 10 vulnerabilities and how to identify them",
      category: "Web Security / ความปลอดภัยเว็บ",
      difficulty: "Intermediate",
      duration: 45,
      progress: 25,
      rating: 4.7,
      author: "Web Security Pro",
      completed: false,
      steps: [
        "พื้นฐาน SQL Injection / SQL Injection fundamentals",
        "Cross-Site Scripting (XSS)",
        "Cross-Site Request Forgery (CSRF)",
        "การกำหนดค่าความปลอดภัยที่ผิดพลาด / Security misconfigurations",
        "การยืนยันตัวตนที่เสียหาย / Broken authentication",
        "การเปิดเผยข้อมูลที่สำคัญ / Sensitive data exposure"
      ]
    },
    {
      id: "network-security",
      title: "Network Security Basics / พื้นฐานความปลอดภัยเครือข่าย",
      description: "ทำความเข้าใจโปรโตคอลเครือข่าย ไฟร์วอลล์ และการตรวจจับการบุกรุก / Understanding network protocols, firewalls, and intrusion detection",
      category: "Network Security / ความปลอดภัยเครือข่าย",
      difficulty: "Intermediate",
      duration: 35,
      progress: 0,
      rating: 4.6,
      author: "Network Admin",
      completed: false,
      steps: [
        "พื้นฐานโปรโตคอลเครือข่าย / Network protocol fundamentals",
        "การกำหนดค่าไฟร์วอลล์ / Firewall configuration",
        "การตั้งค่าและการจัดการ VPN / VPN setup and management",
        "ระบบตรวจจับการบุกรุก / Intrusion detection systems",
        "เครื่องมือการตรวจสอบเครือข่าย / Network monitoring tools"
      ]
    },
    {
      id: "crypto-implementation",
      title: "Cryptography Implementation / การใช้งานการเข้ารหัส",
      description: "แนวคิดการเข้ารหัสขั้นสูงและการปฏิบัติการใช้งานที่ปลอดภัย / Advanced cryptographic concepts and secure implementation practices",
      category: "Cryptography / การเข้ารหัส",
      difficulty: "Expert",
      duration: 60,
      progress: 0,
      rating: 4.9,
      author: "Crypto Specialist",
      completed: false,
      steps: [
        "การเข้ารหัสแบบสมมาตรเทียบกับแบบไม่สมมาตร / Symmetric vs asymmetric encryption",
        "แนวทางปฏิบัติที่ดีที่สุดในการจัดการคีย์ / Key management best practices",
        "ลายเซ็นดิจิทัลและใบรับรอง / Digital signatures and certificates",
        "ฟังก์ชัน hash และความสมบูรณ์ / Hash functions and integrity",
        "ความลับส่งต่อที่สมบูรณ์แบบ / Perfect forward secrecy",
        "การเข้ารหัสหลังยุคควอนตัม / Post-quantum cryptography"
      ]
    },
    {
      id: "incident-response",
      title: "Incident Response Planning / การวางแผนการตอบสนองเหตุการณ์",
      description: "เรียนรู้วิธีการเตรียมพร้อมและตอบสนองต่อเหตุการณ์ด้านความปลอดภัยไซเบอร์ / Learn how to prepare for and respond to cybersecurity incidents",
      category: "Incident Response / การตอบสนองเหตุการณ์",
      difficulty: "Advanced",
      duration: 40,
      progress: 0,
      rating: 4.8,
      author: "IR Team Lead",
      completed: false,
      steps: [
        "การจำแนกเหตุการณ์ / Incident classification",
        "การจัดองค์กรทีมตอบสนอง / Response team organization",
        "ขั้นตอนการรวบรวมหลักฐาน / Evidence collection procedures",
        "โปรโตคอลการสื่อสาร / Communication protocols",
        "การฟื้นฟูและบทเรียนที่ได้เรียนรู้ / Recovery and lessons learned"
      ]
    }
  ];

  const categories = ["all", ...Array.from(new Set(tutorials.map(t => t.category)))];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-primary/20 text-primary";
      case "Intermediate": return "bg-warning/20 text-warning";
      case "Advanced": return "bg-accent/20 text-accent";
      case "Expert": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
  };

  if (selectedTutorial) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedTutorial(null)}>
            ← Back to Tutorials
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-cyber">{selectedTutorial.title}</h1>
            <p className="text-muted-foreground">{selectedTutorial.description}</p>
          </div>
        </div>

        <Card className="terminal-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tutorial Content
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(selectedTutorial.difficulty)}>
                  {selectedTutorial.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedTutorial.duration}min
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{selectedTutorial.progress}%</span>
              </div>
              <Progress value={selectedTutorial.progress} className="h-2" />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Tutorial Steps:</h3>
              {selectedTutorial.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {index < Math.floor((selectedTutorial.progress / 100) * selectedTutorial.steps.length) ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Step {index + 1}</h4>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                {selectedTutorial.progress > 0 ? "Continue Tutorial" : "Start Tutorial"}
              </Button>
              {selectedTutorial.completed && (
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyber">
            <BookOpen className="h-6 w-6" />
            Cybersecurity Tutorials
          </CardTitle>
          <CardDescription>
            Learn cybersecurity concepts through structured tutorials and hands-on exercises
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category === "all" ? "All" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="terminal-effect hover:scale-105 transition-all duration-300">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {tutorial.completed && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-warning fill-current" />
                      <span className="text-xs text-muted-foreground">{tutorial.rating}</span>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {tutorial.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {tutorial.duration}min
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{tutorial.progress}%</span>
                    </div>
                    <Progress value={tutorial.progress} className="h-1" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{tutorial.author}</span>
                  </div>

                  <Button 
                    onClick={() => startTutorial(tutorial)}
                    className="w-full"
                    variant={tutorial.completed ? "outline" : "default"}
                  >
                    {tutorial.progress > 0 ? (
                      tutorial.completed ? "Review" : "Continue"
                    ) : "Start Tutorial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredTutorials.length === 0 && (
        <Card className="terminal-effect">
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No tutorials found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria or browse all categories
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tutorials;