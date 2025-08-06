import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Play, CheckCircle, Clock, Search, Star, User, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase, TutorialProgress } from "@/lib/supabase";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  duration: number;
  rating: number;
  author: string;
  steps: TutorialStep[];
}

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

const FunctionalTutorials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const [tutorialProgress, setTutorialProgress] = useState<TutorialProgress[]>([]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const tutorials: Tutorial[] = [
    {
      id: "password-security",
      title: "Password Security Fundamentals",
      description: "Learn the basics of creating strong passwords and understanding common attack methods",
      category: "Authentication",
      difficulty: "Beginner",
      duration: 15,
      rating: 4.8,
      author: "CyberSec Team",
      steps: [
        {
          id: "step1",
          title: "Introduction to Password Security",
          content: `Password security is the first line of defense in cybersecurity. Weak passwords are one of the most common vulnerabilities that attackers exploit.

Key concepts:
• Passwords are authentication factors
• They verify user identity
• Weak passwords enable unauthorized access
• Strong passwords significantly improve security

Statistics show that 81% of data breaches involve weak or stolen passwords.`,
          quiz: {
            question: "What percentage of data breaches involve weak or stolen passwords?",
            options: ["50%", "65%", "81%", "95%"],
            correctAnswer: 2
          }
        },
        {
          id: "step2",
          title: "Password Complexity Requirements",
          content: `Strong passwords should meet these criteria:

• Minimum 12 characters (preferably 16+)
• Mix of uppercase and lowercase letters
• Include numbers and special characters
• Avoid dictionary words
• Don't use personal information
• Unique for each account

Example of a strong password: My$ecur3P@ssw0rd2024!`,
          codeExample: `# Password strength checker (Python example)
import re

def check_password_strength(password):
    score = 0
    feedback = []
    
    if len(password) >= 12:
        score += 2
    else:
        feedback.append("Use at least 12 characters")
    
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Include uppercase letters")
    
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Include lowercase letters")
    
    if re.search(r'[0-9]', password):
        score += 1
    else:
        feedback.append("Include numbers")
    
    if re.search(r'[!@#$%^&*]', password):
        score += 1
    else:
        feedback.append("Include special characters")
    
    return score, feedback`
        },
        {
          id: "step3",
          title: "Common Attack Methods",
          content: `Understand how attackers try to crack passwords:

1. **Dictionary Attacks**: Using common passwords and words
2. **Brute Force**: Trying all possible combinations
3. **Credential Stuffing**: Using leaked password databases
4. **Social Engineering**: Tricking users into revealing passwords
5. **Keylogging**: Recording keystrokes
6. **Phishing**: Fake websites to steal credentials

Knowing these methods helps you defend against them.`,
          quiz: {
            question: "Which attack method involves trying all possible password combinations?",
            options: ["Dictionary Attack", "Brute Force", "Social Engineering", "Phishing"],
            correctAnswer: 1
          }
        },
        {
          id: "step4",
          title: "Password Managers",
          content: `Password managers are essential tools for modern security:

Benefits:
• Generate strong, unique passwords
• Store passwords securely
• Auto-fill login forms
• Sync across devices
• Alert you to breached passwords

Popular password managers:
• Bitwarden (open source)
• 1Password
• LastPass
• Dashlane
• KeePass

Never reuse passwords across multiple sites!`
        },
        {
          id: "step5",
          title: "Two-Factor Authentication (2FA)",
          content: `2FA adds an extra layer of security beyond just passwords:

Types of 2FA:
• SMS codes (least secure)
• Authenticator apps (Google Authenticator, Authy)
• Hardware tokens (YubiKey)
• Biometric authentication

Even with 2FA, use strong passwords as the first factor.

Best practices:
• Enable 2FA on all important accounts
• Use authenticator apps over SMS when possible
• Keep backup codes in a safe place`,
          quiz: {
            question: "Which 2FA method is considered most secure?",
            options: ["SMS codes", "Email codes", "Authenticator apps", "Hardware tokens"],
            correctAnswer: 3
          }
        }
      ]
    },
    {
      id: "web-vulnerabilities",
      title: "Common Web Vulnerabilities",
      description: "Explore OWASP Top 10 vulnerabilities and how to identify them",
      category: "Web Security",
      difficulty: "Intermediate",
      duration: 45,
      rating: 4.7,
      author: "Web Security Pro",
      steps: [
        {
          id: "step1",
          title: "Introduction to OWASP Top 10",
          content: `The OWASP Top 10 is a standard awareness document for developers and web application security. It represents a broad consensus about the most critical security risks to web applications.

2021 OWASP Top 10:
1. A01: Broken Access Control
2. A02: Cryptographic Failures
3. A03: Injection
4. A04: Insecure Design
5. A05: Security Misconfiguration
6. A06: Vulnerable and Outdated Components
7. A07: Identification and Authentication Failures
8. A08: Software and Data Integrity Failures
9. A09: Security Logging and Monitoring Failures
10. A10: Server-Side Request Forgery (SSRF)`,
          quiz: {
            question: "What is the #1 vulnerability in the 2021 OWASP Top 10?",
            options: ["Injection", "Broken Access Control", "Security Misconfiguration", "Cryptographic Failures"],
            correctAnswer: 1
          }
        },
        {
          id: "step2",
          title: "SQL Injection Fundamentals",
          content: `SQL Injection occurs when user input is not properly sanitized before being used in SQL queries.

Example vulnerable code:
\`\`\`sql
SELECT * FROM users WHERE username = '$username' AND password = '$password'
\`\`\`

Attack payload: \`admin' OR '1'='1' --\`

Resulting query:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = '$password'
\`\`\`

Prevention:
• Use parameterized queries
• Input validation
• Principle of least privilege
• Web Application Firewalls`,
          codeExample: `// Vulnerable code (don't do this)
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// Secure code (parameterized query)
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [userId]);

// Or using prepared statements
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const result = stmt.get(userId);`
        }
      ]
    }
  ];

  useEffect(() => {
    loadTutorialProgress();
  }, []);

  const loadTutorialProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      setTutorialProgress(data || []);
    } catch (error) {
      console.error('Error loading tutorial progress:', error);
    }
  };

  const updateProgress = async (tutorialId: string, stepIndex: number, completed: boolean = false) => {
    try {
      const existingProgress = tutorialProgress.find(p => p.tutorial_id === tutorialId);
      const tutorial = tutorials.find(t => t.id === tutorialId);
      
      if (!tutorial) return;

      const stepsCompleted = existingProgress?.steps_completed || [];
      if (!stepsCompleted.includes(stepIndex)) {
        stepsCompleted.push(stepIndex);
      }

      const progressPercent = Math.round((stepsCompleted.length / tutorial.steps.length) * 100);
      const isCompleted = completed || stepsCompleted.length === tutorial.steps.length;

      const progressData = {
        tutorial_id: tutorialId,
        user_id: userId,
        progress: progressPercent,
        completed: isCompleted,
        steps_completed: stepsCompleted,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('tutorial_progress')
        .upsert(progressData);
      
      if (error) throw error;
      await loadTutorialProgress();

      if (isCompleted) {
        toast({
          title: "Tutorial Completed!",
          description: `You've completed "${tutorial.title}"`,
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleStepComplete = () => {
    if (!selectedTutorial) return;
    
    const currentStepData = selectedTutorial.steps[currentStep];
    
    // Check if this step has a quiz
    if (currentStepData.quiz) {
      if (quizAnswer === null) {
        toast({
          title: "Quiz Required",
          description: "Please answer the quiz question to proceed",
          variant: "destructive",
        });
        return;
      }
      
      if (quizAnswer !== currentStepData.quiz.correctAnswer) {
        toast({
          title: "Incorrect Answer",
          description: "Please review the content and try again",
          variant: "destructive",
        });
        return;
      }
    }

    updateProgress(selectedTutorial.id, currentStep);
    
    if (currentStep < selectedTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setQuizAnswer(null);
    } else {
      updateProgress(selectedTutorial.id, currentStep, true);
      setSelectedTutorial(null);
      setCurrentStep(0);
    }
  };

  const getTutorialProgress = (tutorialId: string) => {
    return tutorialProgress.find(p => p.tutorial_id === tutorialId);
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(tutorials.map(t => t.category)));

  if (selectedTutorial) {
    const currentStepData = selectedTutorial.steps[currentStep];
    const progress = getTutorialProgress(selectedTutorial.id);
    const stepProgress = ((currentStep + 1) / selectedTutorial.steps.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedTutorial(null);
              setCurrentStep(0);
              setQuizAnswer(null);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutorials
          </Button>
          
          <Badge variant="outline">
            Step {currentStep + 1} of {selectedTutorial.steps.length}
          </Badge>
        </div>

        <Card className="terminal-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {selectedTutorial.title}
            </CardTitle>
            <Progress value={stepProgress} className="w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{currentStepData.title}</h2>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {currentStepData.content}
                </div>
              </div>
            </div>

            {currentStepData.codeExample && (
              <div className="space-y-2">
                <h3 className="font-semibold">Code Example</h3>
                <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm whitespace-pre overflow-x-auto">
                  {currentStepData.codeExample}
                </div>
              </div>
            )}

            {currentStepData.quiz && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Quiz Question</h3>
                <p className="text-sm">{currentStepData.quiz.question}</p>
                <div className="space-y-2">
                  {currentStepData.quiz.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="quiz"
                        value={index}
                        checked={quizAnswer === index}
                        onChange={() => setQuizAnswer(index)}
                        className="text-primary"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                    setQuizAnswer(null);
                  }
                }}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button onClick={handleStepComplete}>
                {currentStep === selectedTutorial.steps.length - 1 ? (
                  "Complete Tutorial"
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
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
            Interactive learning paths to master cybersecurity concepts step by step
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {tutorialProgress.filter(p => p.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed Tutorials</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {tutorialProgress.filter(p => p.progress > 0 && !p.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">{tutorials.length}</div>
              <div className="text-sm text-muted-foreground">Total Tutorials</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial) => {
          const progress = getTutorialProgress(tutorial.id);
          return (
            <Card 
              key={tutorial.id} 
              className="terminal-effect hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedTutorial(tutorial)}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {progress?.completed && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-warning fill-current" />
                    <span className="text-xs font-medium">{tutorial.rating}</span>
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
                  <Badge variant="outline">{tutorial.difficulty}</Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {tutorial.duration}min
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    {tutorial.author}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{progress?.progress || 0}%</span>
                  </div>
                  <Progress value={progress?.progress || 0} className="h-1" />
                </div>

                <div className="text-xs text-muted-foreground">
                  {tutorial.steps.length} steps • {tutorial.category}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FunctionalTutorials;