import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Radio, Calendar, Users, Gift, Zap, Trophy, AlertTriangle, Clock } from "lucide-react";

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  type: "webinar" | "ctf" | "workshop" | "competition";
  status: "live" | "upcoming" | "ended";
  startTime: Date;
  duration: number; // minutes
  participants: number;
  maxParticipants?: number;
  instructor?: string;
  instructorAvatar?: string;
  prizes?: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  tags: string[];
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "security" | "platform" | "event" | "maintenance";
  timestamp: Date;
  priority: "low" | "medium" | "high" | "critical";
  author: string;
}

const LiveEvents = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const events: LiveEvent[] = [
    {
      id: "live1",
      title: "Advanced Penetration Testing Workshop",
      description: "Learn advanced techniques for network penetration testing with industry experts",
      type: "workshop",
      status: "live",
      startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 min ago
      duration: 120,
      participants: 847,
      maxParticipants: 1000,
      instructor: "Dr. Sarah Chen",
      instructorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      difficulty: "advanced",
      tags: ["pentesting", "network", "tools", "methodology"]
    },
    {
      id: "upcoming1",
      title: "Global Cybersecurity CTF Championship",
      description: "24-hour capture the flag competition with teams from around the world",
      type: "ctf",
      status: "upcoming",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
      duration: 1440, // 24 hours
      participants: 156,
      maxParticipants: 500,
      prizes: ["$10,000", "$5,000", "$2,500", "Swag Packs"],
      difficulty: "expert",
      tags: ["ctf", "competition", "team", "24h", "prizes"]
    },
    {
      id: "upcoming2",
      title: "Bug Bounty Basics Webinar",
      description: "Introduction to bug bounty hunting for beginners",
      type: "webinar",
      status: "upcoming",
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // In 4 hours
      duration: 60,
      participants: 234,
      instructor: "Marcus Rodriguez",
      instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      difficulty: "beginner",
      tags: ["bug-bounty", "beginner", "web-security"]
    },
    {
      id: "competition1",
      title: "Speed Hacking Challenge",
      description: "See who can solve cybersecurity challenges the fastest",
      type: "competition",
      status: "upcoming",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 180,
      participants: 89,
      maxParticipants: 200,
      prizes: ["Premium Account", "Certification Voucher", "Hacker Badge"],
      difficulty: "intermediate",
      tags: ["speed", "challenge", "individual", "ranking"]
    }
  ];

  const announcements: Announcement[] = [
    {
      id: "ann1",
      title: "New Vulnerability Lab Added",
      content: "We've added a new lab focusing on API security vulnerabilities. Check out the latest OWASP API Top 10 challenges!",
      type: "platform",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: "medium",
      author: "Platform Team"
    },
    {
      id: "ann2",
      title: "Critical Security Alert: Log4j Simulation",
      content: "Practice detecting and mitigating Log4j vulnerabilities in our new interactive environment. This simulation covers CVE-2021-44228.",
      type: "security",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: "critical",
      author: "Security Team"
    },
    {
      id: "ann3",
      title: "Platform Maintenance Scheduled",
      content: "Scheduled maintenance on Sunday 2AM-4AM UTC. Some features may be temporarily unavailable.",
      type: "maintenance",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      priority: "high",
      author: "DevOps Team"
    },
    {
      id: "ann4",
      title: "Monthly Leaderboard Reset",
      content: "The monthly leaderboard has been reset. Start climbing your way back to the top!",
      type: "event",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      priority: "low",
      author: "Community Team"
    }
  ];

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500/20 text-red-500 animate-pulse";
      case "upcoming": return "bg-blue-500/20 text-blue-500";
      case "ended": return "bg-gray-500/20 text-gray-500";
      default: return "bg-muted/20 text-muted-foreground";
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-500 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-500 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "low": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default: return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "webinar": return Radio;
      case "ctf": return Trophy;
      case "workshop": return Users;
      case "competition": return Zap;
      default: return Calendar;
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "security": return AlertTriangle;
      case "platform": return Zap;
      case "event": return Gift;
      case "maintenance": return Clock;
      default: return Radio;
    }
  };

  const formatTimeUntil = (date: Date) => {
    const diff = date.getTime() - currentTime.getTime();
    if (diff <= 0) return "Now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatRelativeTime = (date: Date) => {
    const diff = currentTime.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      return `${Math.floor(hours / 24)} days ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    }
    return "Just now";
  };

  return (
    <div className="space-y-6">
      {/* Live Status Banner */}
      <Card className="terminal-effect bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-red-500">LIVE NOW</span>
              <span className="text-sm">Advanced Penetration Testing Workshop</span>
            </div>
            <Badge className="bg-red-500/20 text-red-500">847 watching</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Live Events
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => {
              const Icon = getTypeIcon(event.type);
              const isLive = event.status === "live";
              
              return (
                <Card 
                  key={event.id} 
                  className={`terminal-effect ${isLive ? "ring-2 ring-red-500/30 shadow-lg" : ""}`}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${isLive ? "text-red-500" : "text-primary"}`} />
                        <Badge className={getEventStatusColor(event.status)}>
                          {event.status.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge className={getDifficultyColor(event.difficulty)}>
                        {event.difficulty}
                      </Badge>
                    </div>
                    
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {event.description}
                      </CardDescription>
                    </div>

                    {event.instructor && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={event.instructorAvatar} />
                          <AvatarFallback>{event.instructor[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">by {event.instructor}</span>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          {event.status === "live" ? "Started" : "Starts"}
                        </div>
                        <div className="font-semibold">
                          {event.status === "live" 
                            ? formatRelativeTime(event.startTime)
                            : formatTimeUntil(event.startTime)
                          }
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-semibold">
                          {Math.floor(event.duration / 60)}h {event.duration % 60}m
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                          {event.participants}
                          {event.maxParticipants && ` / ${event.maxParticipants}`} participants
                        </span>
                      </div>
                    </div>

                    {event.prizes && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold flex items-center gap-1">
                          <Gift className="h-4 w-4" />
                          Prizes
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {event.prizes.map((prize, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎁"} {prize}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full" 
                      variant={isLive ? "default" : "outline"}
                      disabled={event.status === "ended"}
                    >
                      {isLive ? "Join Live" : event.status === "upcoming" ? "Register" : "Ended"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {announcements.map((announcement) => {
                const Icon = getAnnouncementIcon(announcement.type);
                
                return (
                  <Card 
                    key={announcement.id} 
                    className={`terminal-effect border ${getPriorityColor(announcement.priority)}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <CardTitle className="text-base">{announcement.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getPriorityColor(announcement.priority)}>
                                {announcement.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                by {announcement.author}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(announcement.timestamp)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        {announcement.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveEvents;