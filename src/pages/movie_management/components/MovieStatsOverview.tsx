import { MovieResponse } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, TrendingUp, Calendar, Star } from 'lucide-react';

interface MovieStatsOverviewProps {
  movies: MovieResponse[];
  loading?: boolean;
}

export function MovieStatsOverview({ movies, loading }: MovieStatsOverviewProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  const totalMovies = movies.length;
  const totalViews = movies.reduce((sum, movie) => sum + movie.view, 0);
  const averageViews = totalMovies > 0 ? Math.round(totalViews / totalMovies) : 0;
  
  // Get current year and count movies from current year
  const currentYear = new Date().getFullYear();
  const currentYearMovies = movies.filter(movie => movie.year === currentYear).length;

  const stats = [
    {
      title: "Total Movies",
      value: totalMovies.toLocaleString(),
      icon: Film,
      description: "Movies in database",
      trend: "+12 this month"
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: TrendingUp,
      description: "Across all movies",
      trend: "+25% from last month"
    },
    {
      title: "Average Views",
      value: averageViews.toLocaleString(),
      icon: Star,
      description: "Views per movie",
      trend: "18% above target"
    },
    {
      title: `${currentYear} Movies`,
      value: currentYearMovies.toLocaleString(),
      icon: Calendar,
      description: `Released in ${currentYear}`,
      trend: "Latest releases"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{stat.description}</span>
                <span className="ml-auto text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
