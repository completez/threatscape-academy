import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Gamepad2, Trophy, Timer, Target, Users, Crown, Star, Zap, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  rank: string;
  achievements: string[];
  streak: number;
}

interface GameSession {
  id: string;
  mode: "speed" | "survival" | "team" | "tournament";
  players: Player[];
  timeLimit: number;
  currentChallenge: string;
  status: "waiting" | "active" | "completed";
  reward: number;
}

const GameMode = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    id: "player1",
    name: "CyberHacker",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face",
    level: 12,
    xp: 2450,
    xpToNext: 550,
    rank: "Security Analyst",
    achievements: ["First Blood", "Speed Demon", "SQL Master"],
    streak: 7
  });

  const [activeSessions, setActiveSessions] = useState<GameSession[]>([
    {
      id: "speed1",
      mode: "speed",
      players: [currentPlayer],
      timeLimit: 300,
      currentChallenge: "SQL Injection Speed Run",
      status: "waiting",
      reward: 500
    },
    {
      id: "team1", 
      mode: "team",
      players: [
        currentPlayer,
        {
          id: "player2",
          name: "WhiteHat",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
          level: 15,
          xp: 3200,
          xpToNext: 800,
          rank: "Senior Analyst",
          achievements: ["Team Player", "Crypto King"],
          streak: 12
        }
      ],
      timeLimit: 1800,
      currentChallenge: "CTF: Corporate Network Infiltration",
      status: "active",
      reward: 1500
    }
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: "EliteHacker", points: 15420, level: 25, change: "+2" },
    { rank: 2, name: "CyberNinja", points: 14890, level: 24, change: "0" },
    { rank: 3, name: "WhiteHat", points: 14230, level: 23, change: "-1" },
    { rank: 4, name: "SecurityGuru", points: 13500, level: 22, change: "+1" },
    { rank: 5, name: "CyberHacker", points: 12450, level: 21, change: "+3" }
  ]);

  const [dailyQuests, setDailyQuests] = useState([
    { id: "daily1", title: "Crack 3 passwords", progress: 2, max: 3, reward: 100, completed: false },
    { id: "daily2", title: "Complete SQL injection lab", progress: 1, max: 1, reward: 150, completed: true },
    { id: "daily3", title: "Find 5 vulnerabilities", progress: 3, max: 5, reward: 200, completed: false },
    { id: "daily4", title: "Participate in team challenge", progress: 0, max: 1, reward: 300, completed: false }
  ]);

  const gameStats = {
    totalPlayers: 2847,
    activeGames: 23,
    completedToday: 156,
    averageLevel: 8.5
  };

  const achievements = [
    { name: "First Blood", description: "Complete your first challenge", icon: "🩸", rarity: "common" },
    { name: "Speed Demon", description: "Complete 10 challenges under time limit", icon: "⚡", rarity: "rare" },
    { name: "SQL Master", description: "Master all SQL injection challenges", icon: "🗃️", rarity: "epic" },
    { name: "Team Player", description: "Win 5 team challenges", icon: "🤝", rarity: "rare" },
    { name: "Crypto King", description: "Solve all cryptography puzzles", icon: "👑", rarity: "legendary" }
  ];

  const joinSession = (sessionId: string) => {
    toast({
      title: "Joining Game Session",
      description: "Preparing your hacking environment...",
    });
    
    setActiveSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: "active" as const }
          : session
      )
    );
  };

  const createQuickMatch = () => {
    const newSession: GameSession = {
      id: `quick_${Date.now()}`,
      mode: "speed",
      players: [currentPlayer],
      timeLimit: 600,
      currentChallenge: "Random Security Challenge",
      status: "waiting",
      reward: 300
    };
    
    setActiveSessions(prev => [...prev, newSession]);
    
    toast({
      title: "Quick Match Created!",
      description: "Looking for opponents...",
    });
  };

  const getRankColor = (rank: string) => {
    if (rank.includes("Senior")) return "text-accent";
    if (rank.includes("Analyst")) return "text-primary";
    return "text-muted-foreground";
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "epic": return "bg-gradient-to-r from-purple-400 to-pink-500 text-white";
      case "rare": return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Player Profile Header */}
      <Card className="terminal-effect bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={currentPlayer.avatar} />
                <AvatarFallback>{currentPlayer.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-cyber">{currentPlayer.name}</h2>
                <p className={`text-sm ${getRankColor(currentPlayer.rank)}`}>{currentPlayer.rank}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Level {currentPlayer.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{currentPlayer.streak} day streak</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{currentPlayer.xp.toLocaleString()} XP</div>
              <Progress value={(currentPlayer.xp / (currentPlayer.xp + currentPlayer.xpToNext)) * 100} className="w-32 mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {currentPlayer.xpToNext} XP to level {currentPlayer.level + 1}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="play" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="play" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Play
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="quests" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Daily Quests
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="play" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-accent" />
                  Quick Match
                </CardTitle>
                <CardDescription>
                  Jump into a random cybersecurity challenge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={createQuickMatch} className="w-full" size="lg">
                  Find Match
                </Button>
              </CardContent>
            </Card>

            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Team Challenges
                </CardTitle>
                <CardDescription>
                  Collaborate with other hackers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" size="lg">
                  Create Team
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Active Game Sessions</h3>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <Card key={session.id} className="terminal-effect">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant={session.status === "active" ? "default" : "secondary"}>
                          {session.mode} • {session.status}
                        </Badge>
                        <div>
                          <h4 className="font-semibold">{session.currentChallenge}</h4>
                          <p className="text-sm text-muted-foreground">
                            {session.players.length} players • {Math.floor(session.timeLimit / 60)} min limit
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{session.reward} XP</div>
                          <div className="text-xs text-muted-foreground">Reward</div>
                        </div>
                        <Button 
                          onClick={() => joinSession(session.id)}
                          disabled={session.status === "active"}
                          variant={session.status === "active" ? "secondary" : "default"}
                        >
                          {session.status === "active" ? "In Progress" : "Join"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>Top cybersecurity professionals worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((player, index) => (
                  <div 
                    key={player.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.name === currentPlayer.name ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-primary">#{player.rank}</div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-muted-foreground">Level {player.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{player.points.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                      <Badge variant={player.change.startsWith("+") ? "default" : player.change.startsWith("-") ? "destructive" : "secondary"}>
                        {player.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quests" className="space-y-6">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Daily Quests
              </CardTitle>
              <CardDescription>Complete these challenges for extra XP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyQuests.map((quest) => (
                  <div 
                    key={quest.id}
                    className={`p-4 rounded-lg border ${quest.completed ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-border"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{quest.title}</h4>
                      <Badge variant={quest.completed ? "default" : "secondary"}>
                        {quest.completed ? "Completed" : `${quest.reward} XP`}
                      </Badge>
                    </div>
                    <Progress value={(quest.progress / quest.max) * 100} className="mb-2" />
                    <div className="text-sm text-muted-foreground">
                      Progress: {quest.progress}/{quest.max}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>Showcase your cybersecurity mastery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const isUnlocked = currentPlayer.achievements.includes(achievement.name);
                  return (
                    <div 
                      key={achievement.name}
                      className={`p-4 rounded-lg border ${
                        isUnlocked ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="terminal-effect">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{gameStats.totalPlayers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Players</div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">{gameStats.activeGames}</div>
                <div className="text-sm text-muted-foreground">Active Games</div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">{gameStats.completedToday}</div>
                <div className="text-sm text-muted-foreground">Completed Today</div>
              </CardContent>
            </Card>
            <Card className="terminal-effect">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-warning">{gameStats.averageLevel}</div>
                <div className="text-sm text-muted-foreground">Average Level</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameMode;