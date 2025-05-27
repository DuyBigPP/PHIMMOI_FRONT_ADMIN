import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Film, Eye } from "lucide-react";

interface StatsCardsProps {
  totalMovies: number;
  totalCategories: number;
  totalCountries: number;
  averageRating: number;
  loading?: boolean;
}

export function StatsCards({ totalMovies, totalCategories, totalCountries, averageRating, loading }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Movies",
      value: totalMovies.toLocaleString(),
      icon: Film,
      description: "Movies in database",
      trend: "+12%"
    },
    {
      title: "Categories",
      value: totalCategories.toLocaleString(),
      icon: Eye,
      description: "Available categories",
      trend: "+3%"
    },    {
      title: "Countries",
      value: totalCountries.toLocaleString(),
      icon: Users,
      description: "Available countries",
      trend: "+5%"
    },
    {
      title: "Average Rating",
      value: averageRating.toFixed(1),
      icon: TrendingUp,
      description: "Content rating",
      trend: "+0.2"
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardTitle>
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
