import { CategoryStats } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, TrendingUp, Hash, BarChart3 } from 'lucide-react';

interface CategoryStatsOverviewProps {
  categories: CategoryStats[];
  loading?: boolean;
}

export function CategoryStatsOverview({ categories, loading }: CategoryStatsOverviewProps) {
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

  const totalCategories = categories.length;
  const totalMovies = categories.reduce((sum, cat) => sum + cat.movieCount, 0);
  const averageMoviesPerCategory = totalCategories > 0 ? Math.round(totalMovies / totalCategories) : 0;
  const topCategory = categories.reduce((max, cat) => 
    cat.movieCount > max.movieCount ? cat : max, 
    categories[0] || { name: 'N/A', movieCount: 0 }
  );

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories.toLocaleString(),
      icon: Tag,
      description: "Available categories",
      trend: "+2 this month"
    },
    {
      title: "Total Movies",
      value: totalMovies.toLocaleString(),
      icon: BarChart3,
      description: "Across all categories",
      trend: "+15% from last month"
    },
    {
      title: "Average per Category",
      value: averageMoviesPerCategory.toLocaleString(),
      icon: Hash,
      description: "Movies per category",
      trend: "12% above target"
    },
    {
      title: "Top Category",
      value: topCategory.name || 'N/A',
      icon: TrendingUp,
      description: `${topCategory.movieCount} movies`,
      trend: "Most popular"
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
