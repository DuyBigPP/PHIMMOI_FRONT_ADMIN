import { useEffect, useState, useCallback } from "react";
import { getDashboardStatsProgressive, clearDashboardCache, getCacheStatus } from "@/services/dashboardService";
import { DashboardStats } from "@/types/api";
import { StatsCards } from "./components/StatsCards";
import { TopMoviesList } from "./components/TopMoviesList";
import { ChartsGrid } from "./components/ChartsGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, RefreshCw, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>('Initializing...');
  const [progress, setProgress] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      const data = await getDashboardStatsProgressive((stage, partialData) => {
        switch (stage) {
          case 'core':
            setLoadingStage('Loading core statistics...');
            setProgress(33);
            // Update dashboard with core data immediately
            setDashboardData(prev => ({ 
              ...prev!, 
              categoryStats: partialData.categoryStats || [],
              countryStats: partialData.countryStats || []
            }));
            break;
          case 'movies':
            setLoadingStage('Loading movie statistics...');
            setProgress(66);
            setDashboardData(prev => ({ 
              ...prev!, 
              topRated: partialData.topRated || [],
              topViewed: partialData.topViewed || []
            }));
            break;
          case 'additional':
            setLoadingStage('Loading additional data...');
            setProgress(100);
            setDashboardData(prev => ({ 
              ...prev!, 
              topFavorite: partialData.topFavorite || [],
              topCommented: partialData.topCommented || []
            }));
            break;
        }
      });
      
      setDashboardData(data);
      setLoadingStage('Complete');
    } catch (error: unknown) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    clearDashboardCache();
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading progress
  if (loading && !dashboardData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-[400px]">
            <div className="text-center space-y-4">
              <RefreshCw className="mx-auto h-12 w-12 animate-spin text-primary" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Loading Dashboard</h3>
                <p className="text-muted-foreground">{loadingStage}</p>
                <div className="w-64 mx-auto">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }// Calculate totals for stats cards with safety checks
  const totalMovies = dashboardData && dashboardData.categoryStats.length > 0 ? 
    dashboardData.categoryStats.reduce((sum, cat) => sum + (cat.movieCount || 0), 0) : 0;
  
  const totalCategories = dashboardData && dashboardData.categoryStats ? 
    dashboardData.categoryStats.length : 0;
    const totalCountries = dashboardData && dashboardData.countryStats ? 
    dashboardData.countryStats.length : 0;
  
  const averageRating = dashboardData && dashboardData.topRated && dashboardData.topRated.length > 0 ? 
    dashboardData.topRated.reduce((sum, movie) => sum + Number(movie.average_rating || 0), 0) / dashboardData.topRated.length : 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">   
       <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {loading && <Badge variant="secondary" className="animate-pulse">
            <Clock className="mr-1 h-3 w-3" />
            {loadingStage}
          </Badge>}
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => {
              const status = getCacheStatus();
              console.log('Cache status:', status);
            }} 
            variant="ghost" 
            size="sm"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Cache Status
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="movies">Movies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">          <StatsCards
            totalMovies={totalMovies}
            totalCategories={totalCategories}
            totalCountries={totalCountries}
            averageRating={averageRating}
            loading={loading}
          />
          
          {dashboardData && (
            <TopMoviesList
              topRated={dashboardData.topRated}
              topViewed={dashboardData.topViewed}
              loading={loading}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">          {dashboardData && (
            <ChartsGrid
              categoryStats={dashboardData.categoryStats}
              countryStats={dashboardData.countryStats}
              loading={loading}
            />
          )}
        </TabsContent>        <TabsContent value="movies" className="space-y-4">
          {dashboardData && (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Favorite Movies</CardTitle>
                  <CardDescription>Most favorited content</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.topFavorite && dashboardData.topFavorite.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.topFavorite.slice(0, 5).map((movie, index) => (
                        <div key={movie.id} className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{movie.name}</p>
                            <p className="text-xs text-muted-foreground">{movie.year}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Number(movie.view || 0).toLocaleString()} views
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No favorite movies data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Commented Movies</CardTitle>
                  <CardDescription>Movies with most engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.topCommented && dashboardData.topCommented.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.topCommented.slice(0, 5).map((movie, index) => (
                        <div key={movie.id} className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{movie.name}</p>
                            <p className="text-xs text-muted-foreground">{movie.year}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Number(movie.view || 0).toLocaleString()} views
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No commented movies data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

