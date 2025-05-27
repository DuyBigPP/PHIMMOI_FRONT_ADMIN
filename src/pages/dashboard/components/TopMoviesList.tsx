import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TopRatedMovie, TopViewedMovie } from "@/types/api";

interface TopMoviesListProps {
  topRated: TopRatedMovie[];
  topViewed: TopViewedMovie[];
  loading?: boolean;
}

export function TopMoviesList({ topRated, topViewed, loading }: TopMoviesListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Rated Movies</CardTitle>
            <CardDescription>Highest rated content</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-muted animate-pulse rounded-md" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Movies</CardTitle>
            <CardDescription>Popular content by views</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-muted animate-pulse rounded-md" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top Rated Movies</CardTitle>
          <CardDescription>Highest rated content</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {topRated.slice(0, 10).map((movie) => (
                <div key={movie.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={movie.posterUrl} alt={movie.name} />
                      <AvatarFallback>{movie.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {movie.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {movie.year} • {Number(movie.view).toLocaleString()} views
                    </p>
                  </div>
                  <Badge variant="secondary">
                    ⭐ {Number(movie.average_rating).toFixed(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Viewed Movies</CardTitle>
          <CardDescription>Popular content by views</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {topViewed.slice(0, 10).map((movie) => (
                <div key={movie.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={movie.posterUrl} alt={movie.name} />
                      <AvatarFallback>{movie.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {movie.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {movie.year} • {movie.originName}
                    </p>
                  </div>
                  <Badge variant="outline">
                    👁️ {Number(movie.view).toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
