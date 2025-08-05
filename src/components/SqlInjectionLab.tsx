import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Code2, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Shield,
  FileText
} from "lucide-react";

interface SqlResult {
  success: boolean;
  query: string;
  result?: any[];
  error?: string;
  vulnerability?: string;
}

const SqlInjectionLab = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [customQuery, setCustomQuery] = useState("");
  const [loginResult, setLoginResult] = useState<SqlResult | null>(null);
  const [searchResult, setSearchResult] = useState<SqlResult | null>(null);
  const [queryResult, setQueryResult] = useState<SqlResult | null>(null);
  const [isVulnerable, setIsVulnerable] = useState(true);
  const { toast } = useToast();

  // Mock database for demonstration
  const mockUsers = [
    { id: 1, username: "admin", password: "admin123", email: "admin@company.com", role: "administrator" },
    { id: 2, username: "john", password: "password", email: "john@company.com", role: "user" },
    { id: 3, username: "jane", password: "qwerty", email: "jane@company.com", role: "user" },
    { id: 4, username: "bob", password: "123456", email: "bob@company.com", role: "user" },
  ];

  const mockProducts = [
    { id: 1, name: "Laptop", price: 999, category: "Electronics" },
    { id: 2, name: "Phone", price: 699, category: "Electronics" },
    { id: 3, name: "Book", price: 29, category: "Education" },
    { id: 4, name: "Chair", price: 199, category: "Furniture" },
  ];

  const vulnerableLogin = (user: string, pass: string): SqlResult => {
    // Simulate vulnerable SQL query
    const query = `SELECT * FROM users WHERE username = '${user}' AND password = '${pass}'`;
    
    // Check for SQL injection attempts
    if (user.includes("'") || user.includes("--") || user.includes("/*") || 
        pass.includes("'") || pass.includes("--") || pass.includes("/*")) {
      
      // Common SQL injection patterns
      if (user.includes("' OR '1'='1") || user.includes("' OR 1=1") || 
          user.includes("admin'--") || pass.includes("' OR '1'='1")) {
        return {
          success: true,
          query,
          result: mockUsers,
          vulnerability: "SQL Injection successful! Bypassed authentication."
        };
      }
    }

    // Normal login
    const foundUser = mockUsers.find(u => u.username === user && u.password === pass);
    return {
      success: !!foundUser,
      query,
      result: foundUser ? [foundUser] : [],
      vulnerability: foundUser ? undefined : "Login failed"
    };
  };

  const secureLogin = (user: string, pass: string): SqlResult => {
    // Simulate parameterized query
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    
    // Input validation and sanitization
    if (user.includes("'") || user.includes("--") || user.includes("/*")) {
      return {
        success: false,
        query,
        error: "Invalid characters detected in username"
      };
    }

    const foundUser = mockUsers.find(u => u.username === user && u.password === pass);
    return {
      success: !!foundUser,
      query,
      result: foundUser ? [foundUser] : [],
      vulnerability: foundUser ? undefined : "Login failed"
    };
  };

  const vulnerableSearch = (search: string): SqlResult => {
    const query = `SELECT * FROM products WHERE name LIKE '%${search}%'`;
    
    // Check for UNION injection
    if (search.includes("UNION") && search.includes("SELECT")) {
      return {
        success: true,
        query,
        result: [
          ...mockProducts.filter(p => p.name.toLowerCase().includes(search.split("UNION")[0].toLowerCase())),
          ...mockUsers.map(u => ({ id: u.id, name: u.username, price: "EXPOSED", category: u.email }))
        ],
        vulnerability: "UNION injection successful! User data exposed."
      };
    }

    // Check for other injection patterns
    if (search.includes("'") || search.includes("--") || search.includes("/*")) {
      return {
        success: true,
        query,
        result: mockProducts,
        vulnerability: "Potential SQL injection detected but no data extracted in this simulation."
      };
    }

    const results = mockProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    
    return {
      success: true,
      query,
      result: results
    };
  };

  const executeCustomQuery = (query: string): SqlResult => {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (normalizedQuery.startsWith("select")) {
      if (normalizedQuery.includes("users")) {
        return {
          success: true,
          query,
          result: mockUsers,
          vulnerability: "Direct database access achieved!"
        };
      } else if (normalizedQuery.includes("products")) {
        return {
          success: true,
          query,
          result: mockProducts
        };
      }
    } else if (normalizedQuery.startsWith("drop") || normalizedQuery.startsWith("delete")) {
      return {
        success: true,
        query,
        result: [],
        vulnerability: "⚠️ DESTRUCTIVE OPERATION SIMULATED - In real scenario, data would be lost!"
      };
    }

    return {
      success: false,
      query,
      error: "Query not recognized or access denied"
    };
  };

  const handleLogin = () => {
    const result = isVulnerable ? 
      vulnerableLogin(username, password) : 
      secureLogin(username, password);
    
    setLoginResult(result);
    
    if (result.vulnerability) {
      toast({
        title: "Security Alert",
        description: result.vulnerability,
        variant: result.success ? "destructive" : "default"
      });
    }
  };

  const handleSearch = () => {
    const result = vulnerableSearch(searchQuery);
    setSearchResult(result);
    
    if (result.vulnerability) {
      toast({
        title: "SQL Injection Detected",
        description: result.vulnerability,
        variant: "destructive"
      });
    }
  };

  const handleCustomQuery = () => {
    const result = executeCustomQuery(customQuery);
    setQueryResult(result);
    
    if (result.vulnerability) {
      toast({
        title: "Query Executed",
        description: result.vulnerability,
        variant: "destructive"
      });
    }
  };

  const commonInjections = [
    "' OR '1'='1",
    "admin'--",
    "' OR 1=1--",
    "' UNION SELECT * FROM users--",
    "'; DROP TABLE users;--"
  ];

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <Card className="terminal-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            SQL Injection Laboratory
          </CardTitle>
          <CardDescription>
            Practice SQL injection attacks in a controlled environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label>Application Mode:</Label>
            <div className="flex gap-2">
              <Button
                variant={isVulnerable ? "default" : "outline"}
                onClick={() => setIsVulnerable(true)}
                size="sm"
              >
                Vulnerable
              </Button>
              <Button
                variant={!isVulnerable ? "default" : "outline"}
                onClick={() => setIsVulnerable(false)}
                size="sm"
              >
                Secured
              </Button>
            </div>
            <Badge variant={isVulnerable ? "destructive" : "secondary"}>
              {isVulnerable ? "Vulnerable to Injection" : "SQL Injection Protected"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="login">Login Form</TabsTrigger>
          <TabsTrigger value="search">Search Feature</TabsTrigger>
          <TabsTrigger value="query">Direct Query</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Vulnerable Login Form</CardTitle>
              <CardDescription>
                Try common SQL injection payloads to bypass authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username or try: admin'--"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password or try: ' OR '1'='1"
                    />
                  </div>

                  <Button onClick={handleLogin} className="w-full cyber-glow">
                    <Shield className="h-4 w-4 mr-2" />
                    Login
                  </Button>

                  <div className="space-y-2">
                    <Label>Common Injection Payloads:</Label>
                    <div className="space-y-1">
                      {commonInjections.map((injection, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setUsername(injection)}
                          className="w-full text-left justify-start font-mono text-xs"
                        >
                          {injection}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {loginResult && (
                    <Card className={`${loginResult.success ? 'border-primary' : 'border-destructive'}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {loginResult.success ? (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          {loginResult.success ? 'Login Successful' : 'Login Failed'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs">SQL Query:</Label>
                          <div className="font-mono text-xs bg-muted p-2 rounded mt-1">
                            {loginResult.query}
                          </div>
                        </div>

                        {loginResult.vulnerability && (
                          <div className="bg-destructive/10 p-2 rounded">
                            <div className="text-xs font-semibold text-destructive">
                              Vulnerability:
                            </div>
                            <div className="text-xs text-destructive">
                              {loginResult.vulnerability}
                            </div>
                          </div>
                        )}

                        {loginResult.result && loginResult.result.length > 0 && (
                          <div>
                            <Label className="text-xs">Retrieved Data:</Label>
                            <div className="text-xs bg-muted p-2 rounded mt-1 max-h-32 overflow-auto">
                              <pre>{JSON.stringify(loginResult.result, null, 2)}</pre>
                            </div>
                          </div>
                        )}

                        {loginResult.error && (
                          <div className="text-xs text-destructive">
                            Error: {loginResult.error}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Product Search (UNION Injection)</CardTitle>
              <CardDescription>
                Try UNION SELECT attacks to extract data from other tables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-query">Search Products</Label>
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try: laptop' UNION SELECT id, username, email, role FROM users--"
                />
              </div>

              <Button onClick={handleSearch} className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Search
              </Button>

              {searchResult && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Search Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">SQL Query:</Label>
                      <div className="font-mono text-xs bg-muted p-2 rounded mt-1">
                        {searchResult.query}
                      </div>
                    </div>

                    {searchResult.vulnerability && (
                      <div className="bg-destructive/10 p-2 rounded">
                        <div className="text-xs font-semibold text-destructive">
                          Security Alert:
                        </div>
                        <div className="text-xs text-destructive">
                          {searchResult.vulnerability}
                        </div>
                      </div>
                    )}

                    {searchResult.result && (
                      <div>
                        <Label className="text-xs">Results:</Label>
                        <div className="grid gap-2 mt-2">
                          {searchResult.result.map((item: any, index: number) => (
                            <div key={index} className="text-xs bg-muted p-2 rounded">
                              {JSON.stringify(item)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <Card className="terminal-effect">
            <CardHeader>
              <CardTitle>Direct SQL Query Interface</CardTitle>
              <CardDescription>
                Execute custom SQL queries (simulation)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-query">SQL Query</Label>
                <Input
                  id="custom-query"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="SELECT * FROM users; DROP TABLE users;"
                  className="font-mono"
                />
              </div>

              <Button onClick={handleCustomQuery} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Execute Query
              </Button>

              <div className="space-y-2">
                <Label>Example Queries:</Label>
                <div className="grid gap-1">
                  {[
                    "SELECT * FROM users",
                    "SELECT * FROM products",
                    "DROP TABLE users",
                    "DELETE FROM products"
                  ].map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomQuery(query)}
                      className="text-left justify-start font-mono text-xs"
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>

              {queryResult && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label className="text-xs">Executed Query:</Label>
                      <div className="font-mono text-xs bg-muted p-2 rounded mt-1">
                        {queryResult.query}
                      </div>
                    </div>

                    {queryResult.vulnerability && (
                      <div className="bg-destructive/10 p-2 rounded">
                        <div className="text-xs font-semibold text-destructive">
                          Result:
                        </div>
                        <div className="text-xs text-destructive">
                          {queryResult.vulnerability}
                        </div>
                      </div>
                    )}

                    {queryResult.result && (
                      <div>
                        <Label className="text-xs">Query Results:</Label>
                        <div className="text-xs bg-muted p-2 rounded mt-1 max-h-40 overflow-auto">
                          <pre>{JSON.stringify(queryResult.result, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    {queryResult.error && (
                      <div className="text-xs text-destructive">
                        Error: {queryResult.error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <div className="grid gap-4">
            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle>SQL Injection Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-primary">1. Union-based Injection</h4>
                    <p className="text-sm text-muted-foreground">Uses UNION operator to extract data from other tables</p>
                    <code className="text-xs bg-muted p-1 rounded">
                      ' UNION SELECT username, password FROM users--
                    </code>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary">2. Boolean-based Blind</h4>
                    <p className="text-sm text-muted-foreground">Infers information based on True/False responses</p>
                    <code className="text-xs bg-muted p-1 rounded">
                      ' AND (SELECT COUNT(*) FROM users) &gt; 0--
                    </code>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent">3. Time-based Blind</h4>
                    <p className="text-sm text-muted-foreground">Uses time delays to infer information</p>
                    <code className="text-xs bg-muted p-1 rounded">
                      ' AND (SELECT SLEEP(5))--
                    </code>
                  </div>
                  <div>
                    <h4 className="font-semibold text-warning">4. Error-based</h4>
                    <p className="text-sm text-muted-foreground">Extracts data through error messages</p>
                    <code className="text-xs bg-muted p-1 rounded">
                      ' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version())))--
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-effect">
              <CardHeader>
                <CardTitle>Prevention Techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Parameterized Queries</h4>
                      <p className="text-sm text-muted-foreground">Use prepared statements with parameter binding</p>
                      <code className="text-xs bg-muted p-1 rounded block mt-1">
                        SELECT * FROM users WHERE username = ? AND password = ?
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-secondary mt-1" />
                    <div>
                      <h4 className="font-semibold">Input Validation</h4>
                      <p className="text-sm text-muted-foreground">Validate and sanitize all user inputs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold">Least Privilege</h4>
                      <p className="text-sm text-muted-foreground">Limit database user permissions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-warning mt-1" />
                    <div>
                      <h4 className="font-semibold">WAF Protection</h4>
                      <p className="text-sm text-muted-foreground">Deploy Web Application Firewalls</p>
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

export default SqlInjectionLab;