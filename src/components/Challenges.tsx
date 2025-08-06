import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Target, Clock, Star, Flag, Medal, Award, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  points: number;
  timeLimit: number; // minutes
  completed: boolean;
  attempts: number;
  successRate: number;
  scenario: string;
  objectives: string[];
  hints: string[];
}

const Challenges = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentHint, setCurrentHint] = useState(0);

  const challenges: Challenge[] = [
    {
      id: "weak-password",
      title: "The Weak Password Challenge",
      description: "Find the password used by an employee through social engineering techniques",
      category: "Social Engineering",
      difficulty: "Easy",
      points: 100,
      timeLimit: 15,
      completed: true,
      attempts: 2,
      successRate: 85,
      scenario: "You're conducting a penetration test for Acme Corp. You've discovered that John Smith, a marketing manager, uses predictable passwords. Using OSINT techniques, find his likely password.",
      objectives: [
        "Gather information about John Smith from public sources",
        "Analyze his social media for password patterns",
        "Identify his likely password format",
        "Submit the correct password"
      ],
      hints: [
        "Check his LinkedIn profile for important dates",
        "Look for pet names in his social media posts",
        "Consider common password patterns (name + year)"
      ]
    },
    {
      id: "sql-injection-basic",
      title: "SQL Injection Bypass",
      description: "Bypass the login form using SQL injection techniques",
      category: "Web Security",
      difficulty: "Medium",
      points: 250,
      timeLimit: 30,
      completed: false,
      attempts: 1,
      successRate: 62,
      scenario: "You've found a login form that appears vulnerable to SQL injection. The form uses basic input validation but doesn't sanitize user input properly.",
      objectives: [
        "Identify the vulnerable parameter",
        "Craft a SQL injection payload",
        "Bypass authentication without valid credentials",
        "Access the admin panel"
      ],
      hints: [
        "Try basic SQL injection payloads in the username field",
        "Consider comment syntax to bypass password validation",
        "Look for error messages that reveal database structure"
      ]
    },
    {
      id: "network-recon",
      title: "Network Reconnaissance",
      description: "Perform network scanning to map the target infrastructure",
      category: "Network Security",
      difficulty: "Medium",
      points: 300,
      timeLimit: 45,
      completed: false,
      attempts: 0,
      successRate: 45,
      scenario: "You've been tasked with mapping the network infrastructure of a company. Use scanning techniques to discover live hosts, open ports, and running services.",
      objectives: [
        "Discover live hosts on the network",
        "Identify open ports and services",
        "Determine operating systems",
        "Map the network topology"
      ],
      hints: [
        "Start with a ping sweep to find live hosts",
        "Use port scanning to identify services",
        "Consider OS fingerprinting techniques"
      ]
    },
    {
      id: "cryptographic-analysis",
      title: "Caesar Cipher Cryptanalysis",
      description: "Decrypt a message encrypted with a Caesar cipher",
      category: "Cryptography",
      difficulty: "Easy",
      points: 150,
      timeLimit: 20,
      completed: false,
      attempts: 0,
      successRate: 78,
      scenario: "You've intercepted an encrypted message that appears to use a Caesar cipher. Decrypt the message to reveal the secret information.",
      objectives: [
        "Analyze the ciphertext for patterns",
        "Determine the shift value",
        "Decrypt the complete message",
        "Extract the flag from the plaintext"
      ],
      hints: [
        "Try frequency analysis on the ciphertext",
        "Look for common English words",
        "The flag format is: CYBER{...}"
      ]
    },
    {
      id: "advanced-xss",
      title: "Advanced XSS Exploitation",
      description: "Exploit a complex XSS vulnerability to steal session cookies",
      category: "Web Security",
      difficulty: "Hard",
      points: 500,
      timeLimit: 60,
      completed: false,
      attempts: 0,
      successRate: 23,
      scenario: "You've found an XSS vulnerability in a web application with CSP protections. Craft a payload that bypasses these protections and extracts sensitive information.",
      objectives: [
        "Analyze the Content Security Policy",
        "Find a way to bypass CSP restrictions",
        "Craft an XSS payload",
        "Extract session cookies or sensitive data"
      ],
      hints: [
        "Study the CSP headers carefully",
        "Look for allowed script sources",
        "Consider using JSONP or similar techniques"
      ]
    },
    {
      id: "privilege-escalation",
      title: "Linux Privilege Escalation",
      description: "Escalate privileges from a low-privileged user to root",
      category: "System Security",
      difficulty: "Expert",
      points: 750,
      timeLimit: 90,
      completed: false,
      attempts: 0,
      successRate: 15,
      scenario: "You have shell access as a limited user on a Linux system. Find and exploit a vulnerability to gain root privileges.",
      objectives: [
        "Enumerate the system for vulnerabilities",
        "Identify privilege escalation vectors",
        "Exploit the vulnerability",
        "Achieve root access"
      ],
      hints: [
        "Check for SUID binaries",
        "Look for writable directories in PATH",
        "Examine running processes and services"
      ]
    }
  ];

  const categories = Array.from(new Set(challenges.map(c => c.category)));
  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-primary/20 text-primary";
      case "Medium": return "bg-warning/20 text-warning";
      case "Hard": return "bg-accent/20 text-accent";
      case "Expert": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setChallengeStarted(true);
    setTimeRemaining(challenge.timeLimit * 60); // Convert to seconds
    setCurrentHint(0);
    setUserAnswer("");
    
    toast({
      title: "Challenge Started!",
      description: `You have ${challenge.timeLimit} minutes to complete this challenge`,
    });

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "Time's Up!",
            description: "Challenge time limit exceeded",
            variant: "destructive",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please provide an answer",
        variant: "destructive",
      });
      return;
    }

    // Simulate answer checking
    const isCorrect = Math.random() > 0.3; // 70% success rate for demo
    
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: `Challenge completed! You earned ${selectedChallenge?.points} points`,
      });
      setChallengeStarted(false);
      setSelectedChallenge(null);
    } else {
      toast({
        title: "Incorrect",
        description: "Try again or use a hint",
        variant: "destructive",
      });
    }
  };

  const useHint = () => {
    if (selectedChallenge && currentHint < selectedChallenge.hints.length) {
      toast({
        title: "Hint",
        description: selectedChallenge.hints[currentHint],
      });
      setCurrentHint(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedChallenge) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => {
              setSelectedChallenge(null);
              setChallengeStarted(false);
            }}>
              ← Back to Challenges
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-cyber">{selectedChallenge.title}</h1>
              <p className="text-muted-foreground">{selectedChallenge.description}</p>
            </div>
          </div>
          {challengeStarted && (
            <div className="text-right">
              <div className="text-2xl font-bold text-destructive">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-muted-foreground">Time Remaining</div>
            </div>
          )}
        </div>

        <Card className="terminal-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Challenge Details
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                  {selectedChallenge.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Trophy className="h-3 w-3 mr-1" />
                  {selectedChallenge.points} pts
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Scenario</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {selectedChallenge.scenario}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Objectives</h3>
                <ul className="space-y-2">
                  {selectedChallenge.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Flag className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {challengeStarted && (
              <div className="space-y-4 border-t border-border pt-4">
                <div>
                  <h3 className="font-semibold mb-2">Your Answer</h3>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your solution, flag, or findings..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={submitAnswer} className="flex-1">
                    Submit Answer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={useHint}
                    disabled={currentHint >= selectedChallenge.hints.length}
                  >
                    Use Hint ({currentHint}/{selectedChallenge.hints.length})
                  </Button>
                </div>
              </div>
            )}

            {!challengeStarted && (
              <Button 
                onClick={() => startChallenge(selectedChallenge)}
                className="w-full"
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Challenge
              </Button>
            )}
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
            <Trophy className="h-6 w-6" />
            Cybersecurity Challenges
          </CardTitle>
          <CardDescription>
            Test your skills with real-world cybersecurity scenarios and challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{completedChallenges}</div>
              <div className="text-sm text-muted-foreground">Challenges Completed</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-warning">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">{challenges.length}</div>
              <div className="text-sm text-muted-foreground">Total Challenges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(0, 6).map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className="terminal-effect hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedChallenge(challenge)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {challenge.completed && (
                        <Medal className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-warning" />
                      <span className="text-xs font-medium">{challenge.points}</span>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {challenge.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {challenge.timeLimit}min
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {challenge.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Success Rate</span>
                      <span>{challenge.successRate}%</span>
                    </div>
                    <Progress value={challenge.successRate} className="h-1" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Attempts: {challenge.attempts}</span>
                    {challenge.completed && (
                      <div className="flex items-center gap-1 text-primary">
                        <Award className="h-3 w-3" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.filter(c => c.category === category).map((challenge) => (
                <Card 
                  key={challenge.id} 
                  className="terminal-effect hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  {/* Same card content as above */}
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        {challenge.completed && (
                          <Medal className="h-4 w-4 text-warning" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-warning" />
                        <span className="text-xs font-medium">{challenge.points}</span>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {challenge.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {challenge.timeLimit}min
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Success Rate</span>
                        <span>{challenge.successRate}%</span>
                      </div>
                      <Progress value={challenge.successRate} className="h-1" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Attempts: {challenge.attempts}</span>
                      {challenge.completed && (
                        <div className="flex items-center gap-1 text-primary">
                          <Award className="h-3 w-3" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Challenges;