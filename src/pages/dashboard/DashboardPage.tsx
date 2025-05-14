import { useEffect, useState } from "react";
import { api, AnalyticsData, Movie, User } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Users, 
  Film, 
  TrendingUp, 
  Activity,
  Eye,
  BarChart3,
  PieChart
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }: TooltipProps<any, any> & { formatter?: (value: any) => string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="text-xs font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom legend component
const CustomLegend = ({ payload }: { payload?: any[] }) => {
  if (!payload) return null;
  return (
    <div className="flex justify-center gap-4 text-xs mt-2">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center">
          <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: entry.color }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analytics, moviesData, usersData] = await Promise.all([
          api.analytics.getDashboardData(),
          api.movies.getAll(),
          api.users.getAll()
        ]);
        
        setAnalyticsData(analytics);
        setMovies(moviesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart colors
  const colors = {
    primary: "#6366f1",
    secondary: "#f59e0b",
    success: "#10b981",
    error: "#ef4444",
    purple: "#8b5cf6",
    blue: "#3b82f6",
    cyan: "#06b6d4",
    gray: "#71717a"
  };

  // Pie chart colors
  const pieColors = [colors.primary, colors.secondary, colors.success, colors.error, colors.purple, colors.blue];
  
  // Format data for charts
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const revenueData = analyticsData?.monthlyViews.map((views, index) => ({
    name: months[index],
    revenue: Math.round(views * 0.0025)
  })) || [];

  const monthlyViewsData = analyticsData?.monthlyViews.map((views, index) => ({
    name: months[index],
    views
  })) || [];

  const deviceData = analyticsData?.viewsByDevice.map(item => ({
    name: item.device,
    value: item.count
  })) || [];

  const genreData = analyticsData?.popularGenres.slice(0, 5).map(genre => ({
    name: genre.name,
    views: genre.views
  })) || [];

  const activeUsersByHour = analyticsData?.viewsByTime.map(item => ({
    hour: `${item.hour}:00`,
    users: Math.floor(item.count * 0.00022)
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your streaming platform performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.totalViews.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+5.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {movies.length}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span>+{movies.filter(m => parseInt(m.createdAt.split('-')[1]) === new Date().getMonth() + 1).length}</span> new this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.subscription === 'premium').length}
            </div>
            <div className="mt-1">
              <Progress value={Math.round((users.filter(u => u.subscription === 'premium').length / users.length) * 100)} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((users.filter(u => u.subscription === 'premium').length / users.length) * 100)}% of total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue chart - 2 col span */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue based on views and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }} 
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        width={35} 
                        tick={{ fontSize: 12 }} 
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={(props) => <CustomTooltip {...props} formatter={(value) => `$${value.toLocaleString()}`} />} />
                      <Legend content={<CustomLegend />} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue" 
                        stroke={colors.success}
                        strokeWidth={2}
                        dot={{ r: 0 }}
                        activeDot={{ r: 4, stroke: colors.success, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Active now / Recent activities card */}
            <Card>
              <CardHeader>
                <CardTitle>Active Users Now</CardTitle>
                <CardDescription>Users currently online and watching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">
                      {activeUsersByHour[new Date().getHours()]?.users || 0}
                    </div>
                    <div className="ml-auto font-medium">Live now</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-sm font-medium">Recent Activity</div>
                    <ScrollArea className="h-[195px]">
                      <div className="space-y-4">
                        {users.slice(0, 5).map((user) => (
                          <div key={user.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.subscription === 'premium' ? 'Premium' : user.subscription === 'basic' ? 'Basic' : 'Free'} user
                              </p>
                            </div>
                            <div className="ml-auto font-medium text-xs">
                              <div className="rounded-full w-2 h-2 bg-green-500 mb-1 ml-auto"></div>
                              Online
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Movies */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Content</CardTitle>
              <CardDescription>Most-watched movies in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData?.topMovies.slice(0, 4).map((movieData) => {
                  const movie = movies.find(m => m.id === movieData.id);
                  if (!movie) return null;
                  
                  return (
                    <div key={movie.id} className="group">
                      <div className="aspect-[2/3] rounded-lg overflow-hidden relative">
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <div className="font-semibold truncate">{movie.title}</div>
                          <div className="flex justify-between items-center text-xs mt-1">
                            <span>{movie.releaseYear}</span>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{movieData.views.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          {/* Monthly Views Chart */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Views</CardTitle>
                <CardDescription>Viewing trends over the past 12 months</CardDescription>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyViewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      width={40} 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value}
                    />
                    <Tooltip content={(props) => <CustomTooltip {...props} formatter={(value) => value.toLocaleString()} />} />
                    <Legend content={<CustomLegend />} />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      name="Views" 
                      stroke={colors.primary}
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 4, stroke: colors.primary, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Distribution */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Device Distribution</CardTitle>
                  <CardDescription>Viewing distribution by device type</CardDescription>
                </div>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={2}
                        labelLine={false}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={pieColors[index % pieColors.length]} 
                            stroke="hsl(var(--background))"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={(props) => <CustomTooltip {...props} formatter={(value) => value.toLocaleString()} />} />
                      <Legend 
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span className="text-xs">{value}</span>}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Popular Genres */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Popular Genres</CardTitle>
                  <CardDescription>Views by genre category</CardDescription>
                </div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={genreData}
                      layout="vertical"
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickFormatter={(value) => value >= 1000000 ? `${value/1000000}M` : value >= 1000 ? `${value/1000}k` : value}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={70} 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip content={(props) => <CustomTooltip {...props} formatter={(value) => value.toLocaleString()} />} />
                      <Bar 
                        dataKey="views" 
                        name="Views" 
                        fill={colors.primary}
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Movies Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Content</CardTitle>
              <CardDescription>Most viewed movies on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Movie</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.topMovies.map((movie, index) => (
                      <tr key={movie.id} className="border-b">
                        <td className="px-4 py-3 text-sm font-medium">#{index + 1}</td>
                        <td className="px-4 py-3 text-sm">{movie.title}</td>
                        <td className="px-4 py-3 text-sm">{movie.views.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">
                          {((movie.views / (analyticsData?.totalViews || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Recent additions and status updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium mb-2">Published</div>
                    <div className="text-3xl font-bold">{movies.filter(m => m.status === 'published').length}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium mb-2">Drafts</div>
                    <div className="text-3xl font-bold">{movies.filter(m => m.status === 'draft').length}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium mb-2">Archived</div>
                    <div className="text-3xl font-bold">{movies.filter(m => m.status === 'archived').length}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Recent Updates</h3>
                  <div className="space-y-3">
                    {movies.slice(0, 5).map((movie) => (
                      <div key={movie.id} className="flex items-center gap-3 p-3 border rounded-md">
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{movie.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Last updated: {new Date(movie.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          movie.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : movie.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

