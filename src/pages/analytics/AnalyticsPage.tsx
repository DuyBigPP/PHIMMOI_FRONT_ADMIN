import { useState, useEffect } from "react";
import { api, AnalyticsData } from "@/services/api";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend as RechartsLegend
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsData = await api.analytics.getDashboardData();
        setData(analyticsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading analytics data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Failed to load analytics data</div>
      </div>
    );
  }

  // Chart configs with color themes
  const lineChartConfig: ChartConfig = {
    views: {
      label: "Views",
      theme: {
        light: "#6366f1",
        dark: "#818cf8"
      }
    }
  };

  const barChartConfig: ChartConfig = {
    views: {
      label: "Views",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    }
  };

  const genreChartConfig: ChartConfig = {
    views: {
      label: "Views",
      theme: {
        light: "#6366f1",
        dark: "#818cf8"
      }
    }
  };

  const pieColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#3b82f6"];
  
  const deviceData = data.viewsByDevice.map(item => ({
    name: item.device,
    value: item.count
  }));

  // Format monthly data for the line chart
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const monthlyData = data.monthlyViews.map((views, index) => ({
    name: months[index],
    views: views
  }));
  
  // Format hourly data for the bar chart (24-hour format)
  const hourlyData = data.viewsByTime.map(item => ({
    hour: `${item.hour}:00`,
    views: item.count
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">View your platform performance metrics</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(data.monthlyViews.reduce((a, b) => a + b, 0) / 12).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.popularGenres[0].name}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Movie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.topMovies[0].title}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Monthly Views</CardTitle>
          <CardDescription>Viewing trends over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ChartContainer config={lineChartConfig}>
              <RechartsLineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload }) => (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      formatter={(value) => value.toLocaleString()}
                    />
                  )} 
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  name="views" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </RechartsLineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Charts - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>Viewing distribution by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ChartContainer config={{}}>
                <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        formatter={(value) => value.toLocaleString()}
                      />
                    )} 
                  />
                  <RechartsLegend />
                </RechartsPieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Genres</CardTitle>
            <CardDescription>Views by genre category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ChartContainer config={genreChartConfig}>
                <RechartsBarChart
                  data={data.popularGenres}
                  margin={{ top: 20, right: 30, left: 80, bottom: 40 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <ChartTooltip 
                    content={({ active, payload }) => (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        formatter={(value) => value.toLocaleString()}
                      />
                    )} 
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="views" name="views" />
                </RechartsBarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Viewing Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Viewing Patterns</CardTitle>
          <CardDescription>Number of views by hour of day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full overflow-hidden">
            <ChartContainer config={barChartConfig}>
              <RechartsBarChart
                data={hourlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload }) => (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      formatter={(value) => value.toLocaleString()}
                    />
                  )} 
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="views" name="views" />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Content */}
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
                {data.topMovies.map((movie, index) => (
                  <tr key={movie.id} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium">#{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{movie.title}</td>
                    <td className="px-4 py-3 text-sm">{movie.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      {((movie.views / data.totalViews) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}