import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { CategoryStats, CountryStats } from "@/types/api";
import { AlertCircle } from "lucide-react";

interface ChartsGridProps {
  categoryStats: CategoryStats[];
  countryStats: CountryStats[];
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="text-xs font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ChartsGrid({ categoryStats, countryStats, loading }: ChartsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Prepare data for charts
  const topCategories = categoryStats
    .sort((a, b) => b.movieCount - a.movieCount)
    .slice(0, 10);

  const topCountries = countryStats
    .sort((a, b) => b.movieCount - a.movieCount)
    .slice(0, 8);
  const categoryPieData = categoryStats
    .sort((a, b) => b.movieCount - a.movieCount)
    .slice(0, 6)
    .map(cat => ({
      name: cat.name || 'Unknown',
      value: cat.movieCount
    }));

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Movies by Category</CardTitle>
          <CardDescription>Distribution of movies across categories</CardDescription>
        </CardHeader>
        <CardContent>
          {topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="movieCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>No category data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>      {/* Country Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Movies by Country</CardTitle>
          <CardDescription>Distribution of movies by country</CardDescription>
        </CardHeader>
        <CardContent>
          {topCountries.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCountries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="movieCount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>No country data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
          <CardDescription>Category distribution overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >                {categoryPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
