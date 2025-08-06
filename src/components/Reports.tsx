import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Eye, 
  Shield, 
  Target, 
  Award,
  Clock,
  BookOpen,
  Trophy,
  AlertTriangle
} from "lucide-react";
import { supabase, UserActivity, ChallengeAttempt, TutorialProgress } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface ActivityData {
  date: string;
  toolsUsed: number;
  vulnerabilitiesFound: number;
  challengesCompleted: number;
  timeSpent: number;
}

interface SkillProgress {
  skill: string;
  currentLevel: number;
  maxLevel: number;
  experience: number;
  nextLevelExp: number;
}

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedCategory, setSelectedCategory] = useState("overview");
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [challengeAttempts, setChallengeAttempts] = useState<ChallengeAttempt[]>([]);
  const [tutorialProgress, setTutorialProgress] = useState<TutorialProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, [selectedPeriod]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const daysBack = selectedPeriod === "7days" ? 7 : 
                      selectedPeriod === "30days" ? 30 : 
                      selectedPeriod === "90days" ? 90 : 365;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Load activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (activitiesError) throw activitiesError;

      // Load challenge attempts
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenge_attempts')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (challengesError) throw challengesError;

      // Load tutorial progress
      const { data: tutorialsData, error: tutorialsError } = await supabase
        .from('tutorial_progress')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (tutorialsError) throw tutorialsError;

      setActivities(activitiesData || []);
      setChallengeAttempts(challengesData || []);
      setTutorialProgress(tutorialsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const activityData: ActivityData[] = [
    { date: "2024-01-15", toolsUsed: 3, vulnerabilitiesFound: 5, challengesCompleted: 2, timeSpent: 120 },
    { date: "2024-01-16", toolsUsed: 2, vulnerabilitiesFound: 3, challengesCompleted: 1, timeSpent: 90 },
    { date: "2024-01-17", toolsUsed: 4, vulnerabilitiesFound: 8, challengesCompleted: 3, timeSpent: 180 },
    { date: "2024-01-18", toolsUsed: 1, vulnerabilitiesFound: 2, challengesCompleted: 0, timeSpent: 45 },
    { date: "2024-01-19", toolsUsed: 5, vulnerabilitiesFound: 12, challengesCompleted: 4, timeSpent: 240 },
    { date: "2024-01-20", toolsUsed: 3, vulnerabilitiesFound: 6, challengesCompleted: 2, timeSpent: 150 },
    { date: "2024-01-21", toolsUsed: 2, vulnerabilitiesFound: 4, challengesCompleted: 1, timeSpent: 75 }
  ];

  const skillProgress: SkillProgress[] = [
    { skill: "Password Security", currentLevel: 5, maxLevel: 10, experience: 750, nextLevelExp: 1000 },
    { skill: "Web Vulnerabilities", currentLevel: 3, maxLevel: 10, experience: 450, nextLevelExp: 600 },
    { skill: "Network Security", currentLevel: 2, maxLevel: 10, experience: 180, nextLevelExp: 300 },
    { skill: "Cryptography", currentLevel: 1, maxLevel: 10, experience: 50, nextLevelExp: 150 },
    { skill: "Social Engineering", currentLevel: 4, maxLevel: 10, experience: 620, nextLevelExp: 750 },
    { skill: "Incident Response", currentLevel: 1, maxLevel: 10, experience: 25, nextLevelExp: 150 }
  ];

  const toolUsageStats = [
    { name: "Password Cracker", uses: 25, successRate: 92, avgTime: "5.2 min" },
    { name: "Vulnerability Scanner", uses: 18, successRate: 78, avgTime: "12.3 min" },
    { name: "SQL Injection Lab", uses: 15, successRate: 67, avgTime: "8.7 min" },
    { name: "Phishing Simulator", uses: 12, successRate: 83, avgTime: "15.1 min" },
    { name: "XSS Playground", uses: 9, successRate: 74, avgTime: "7.4 min" },
    { name: "MITM Simulator", uses: 6, successRate: 58, avgTime: "18.5 min" },
    { name: "DoS Simulator", uses: 4, successRate: 45, avgTime: "22.1 min" },
    { name: "Cryptography Attacks", uses: 3, successRate: 33, avgTime: "28.7 min" }
  ];

  const challengeStats = {
    total: 15,
    completed: 8,
    inProgress: 3,
    notStarted: 4,
    totalPoints: 1850,
    averageScore: 87,
    bestCategory: "Social Engineering",
    weakestCategory: "Cryptography"
  };

  const periods = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 3 Months" },
    { value: "1year", label: "Last Year" }
  ];

  const totalStats = activityData.reduce(
    (acc, day) => ({
      toolsUsed: acc.toolsUsed + day.toolsUsed,
      vulnerabilitiesFound: acc.vulnerabilitiesFound + day.vulnerabilitiesFound,
      challengesCompleted: acc.challengesCompleted + day.challengesCompleted,
      timeSpent: acc.timeSpent + day.timeSpent
    }),
    { toolsUsed: 0, vulnerabilitiesFound: 0, challengesCompleted: 0, timeSpent: 0 }
  );

  const getSkillLevelColor = (level: number) => {
    if (level >= 8) return "text-primary";
    if (level >= 5) return "text-warning";
    if (level >= 3) return "text-accent";
    return "text-muted-foreground";
  };

  const exportReport = () => {
    // Simulate report generation
    const reportData = {
      period: selectedPeriod,
      totalStats,
      skillProgress,
      toolUsage: toolUsageStats,
      challenges: challengeStats,
      generatedAt: new Date().toISOString()
    };
    
    console.log("Exporting report:", reportData);
    // In a real app, this would generate and download a PDF/CSV
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-cyber">
                <BarChart3 className="h-6 w-6" />
                Progress Reports & Analytics
              </CardTitle>
              <CardDescription>
                Track your cybersecurity learning progress and achievements
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="tools">Tools Usage</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="terminal-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tools Used</p>
                    <p className="text-2xl font-bold text-primary">{totalStats.toolsUsed}</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Vulnerabilities Found</p>
                    <p className="text-2xl font-bold text-destructive">{totalStats.vulnerabilitiesFound}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Challenges Completed</p>
                    <p className="text-2xl font-bold text-warning">{totalStats.challengesCompleted}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-warning/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(totalStats.timeSpent / 60)}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-accent/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart */}
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Daily Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.map((day, index) => (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Tools: {day.toolsUsed}</span>
                        <span>Vulns: {day.vulnerabilitiesFound}</span>
                        <span>Challenges: {day.challengesCompleted}</span>
                        <span>Time: {Math.round(day.timeSpent / 60)}h</span>
                      </div>
                      <Progress value={(day.timeSpent / 300) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillProgress.map((skill) => (
              <Card key={skill.skill} className="terminal-effect">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{skill.skill}</CardTitle>
                    <Badge variant="outline" className={getSkillLevelColor(skill.currentLevel)}>
                      Level {skill.currentLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level {skill.currentLevel + 1}</span>
                      <span>{skill.experience}/{skill.nextLevelExp} XP</span>
                    </div>
                    <Progress value={(skill.experience / skill.nextLevelExp) * 100} className="h-3" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Level {skill.currentLevel}/{skill.maxLevel}</span>
                    <span>{skill.nextLevelExp - skill.experience} XP to next level</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tool Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {toolUsageStats.map((tool, index) => (
                  <div key={tool.name} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{tool.name}</h4>
                      <Badge variant="outline">{tool.uses} uses</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Success Rate</div>
                        <div className="font-medium text-primary">{tool.successRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Time</div>
                        <div className="font-medium">{tool.avgTime}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Usage</div>
                        <Progress value={(tool.uses / 25) * 100} className="h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="terminal-effect">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{challengeStats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-warning">{challengeStats.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent">{challengeStats.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-secondary">{challengeStats.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>
          </div>

          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Challenge Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Completion Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>{challengeStats.completed}/{challengeStats.total}</span>
                    </div>
                    <Progress value={(challengeStats.completed / challengeStats.total) * 100} className="h-3" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Category Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Best: {challengeStats.bestCategory}</span>
                      <Badge variant="outline" className="text-primary">95%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Needs Work: {challengeStats.weakestCategory}</span>
                      <Badge variant="outline" className="text-destructive">45%</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3">Recent Achievements</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Trophy className="h-4 w-4 text-warning" />
                    <span>Completed "SQL Injection Bypass" challenge</span>
                    <Badge variant="outline">250 pts</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span>Reached Level 5 in Password Security</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Target className="h-4 w-4 text-accent" />
                    <span>Perfect score on "Weak Password Challenge"</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;