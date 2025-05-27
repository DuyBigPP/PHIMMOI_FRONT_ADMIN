// Enhanced dashboard service with caching and performance optimizations
import { DashboardStats } from '@/types/api';
import { 
  getCategoryStats, 
  getCountryStats, 
  getTopRatedStats, 
  getTopViewedStats, 
  getTopFavoriteStats, 
  getTopCommentedStats, 
  getMovieViewStats 
} from './function';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: unknown; timestamp: number }>();

// Helper function to check if cache is valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Generic cached fetch function
const fetchWithCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T | null> => {
  // Check cache first
  const cached = cache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    console.log(`Cache hit for ${key}`);
    return cached.data as T;
  }

  try {
    const data = await fetchFn();
    // Store in cache
    cache.set(key, { data, timestamp: Date.now() });
    console.log(`Cache updated for ${key}`);
    return data;
  } catch (error) {
    console.warn(`Failed to fetch ${key}:`, error);
    // Return cached data even if expired, better than nothing
    if (cached) {
      console.log(`Returning expired cache for ${key}`);
      return cached.data as T;
    }
    return null;
  }
};

// Priority-based dashboard loading
export const getDashboardStatsOptimized = async (): Promise<{
  stats: DashboardStats;
  loadingStatus: { [key: string]: 'loading' | 'loaded' | 'error' };
}> => {
  console.log('Starting optimized dashboard fetch...');
  
  const defaultStats: DashboardStats = {
    categoryStats: [],
    countryStats: [],
    topRated: [],
    topViewed: [],
    topFavorite: [],
    topCommented: [],
    viewStats: {
      period: 'month',
      totalViews: 0,
      data: []
    }
  };

  const loadingStatus: { [key: string]: 'loading' | 'loaded' | 'error' } = {
    categories: 'loading',
    countries: 'loading',
    topRated: 'loading',
    topViewed: 'loading',
    topFavorite: 'loading',
    topCommented: 'loading',
    viewStats: 'loading'
  };

  // Priority 1: Essential data (load first)
  const essentialPromises = [
    fetchWithCache('categories', () => getCategoryStats()),
    fetchWithCache('countries', () => getCountryStats()),
  ];

  // Priority 2: Important data (load after essential)
  const importantPromises = [
    fetchWithCache('topRated', () => getTopRatedStats(10)),
    fetchWithCache('topViewed', () => getTopViewedStats(10)),
  ];

  // Priority 3: Nice-to-have data (load last)
  const optionalPromises = [
    fetchWithCache('topFavorite', () => getTopFavoriteStats(10)),
    fetchWithCache('topCommented', () => getTopCommentedStats(10)),
    fetchWithCache('viewStats', () => getMovieViewStats('month', 30)),
  ];

  // Load essential data first
  const [categoryResult, countryResult] = await Promise.allSettled(essentialPromises);
  
  // Update essential data
  if (categoryResult.status === 'fulfilled' && categoryResult.value) {
    defaultStats.categoryStats = categoryResult.value.data || [];
    loadingStatus.categories = 'loaded';
  } else {
    loadingStatus.categories = 'error';
  }

  if (countryResult.status === 'fulfilled' && countryResult.value) {
    defaultStats.countryStats = countryResult.value.data || [];
    loadingStatus.countries = 'loaded';
  } else {
    loadingStatus.countries = 'error';
  }  // Load important data (can run in background)
  Promise.allSettled(importantPromises).then(([topRatedResult, topViewedResult]) => {
    if (topRatedResult.status === 'fulfilled' && topRatedResult.value) {
      // Type assertion with specific type
      const topRatedData = topRatedResult.value.data || [];
      defaultStats.topRated = topRatedData as unknown as typeof defaultStats.topRated;
      loadingStatus.topRated = 'loaded';
    } else {
      loadingStatus.topRated = 'error';
    }

    if (topViewedResult.status === 'fulfilled' && topViewedResult.value) {
      defaultStats.topViewed = topViewedResult.value.data || [];
      loadingStatus.topViewed = 'loaded';
    } else {
      loadingStatus.topViewed = 'error';
    }
  });

  // Load optional data (in background)
  Promise.allSettled(optionalPromises).then(([topFavoriteResult, topCommentedResult, viewStatsResult]) => {
    if (topFavoriteResult.status === 'fulfilled' && topFavoriteResult.value) {
      // Type assertion with specific type
      const topFavoriteData = topFavoriteResult.value.data || [];
      defaultStats.topFavorite = topFavoriteData as unknown as typeof defaultStats.topFavorite;
      loadingStatus.topFavorite = 'loaded';
    } else {
      loadingStatus.topFavorite = 'error';
    }

    if (topCommentedResult.status === 'fulfilled' && topCommentedResult.value) {
      // Type assertion with specific type
      const topCommentedData = topCommentedResult.value.data || [];
      defaultStats.topCommented = topCommentedData as unknown as typeof defaultStats.topCommented;
      loadingStatus.topCommented = 'loaded';
    } else {
      loadingStatus.topCommented = 'error';
    }

    if (viewStatsResult.status === 'fulfilled' && viewStatsResult.value) {
      // Type assertion with specific type
      const viewStats = viewStatsResult.value.data || defaultStats.viewStats;
      defaultStats.viewStats = viewStats as unknown as typeof defaultStats.viewStats;
      loadingStatus.viewStats = 'loaded';
    } else {
      loadingStatus.viewStats = 'error';
    }
  });

  return { stats: defaultStats, loadingStatus };
};

// Progressive loading for dashboard
export const getDashboardStatsProgressive = async (
  onProgress?: (stage: string, data: Partial<DashboardStats>) => void
): Promise<DashboardStats> => {
  console.log('Starting progressive dashboard fetch...');
    const stats: DashboardStats = {
    categoryStats: [],
    countryStats: [],
    topRated: [],
    topViewed: [],
    topFavorite: [],
    topCommented: [],
    viewStats: {
      period: 'month',
      totalViews: 0,
      data: []
    }
  };

  // Stage 1: Load core stats (categories & countries)
  try {
    const [categoryData, countryData] = await Promise.allSettled([
      fetchWithCache('categories', () => getCategoryStats()),
      fetchWithCache('countries', () => getCountryStats()),
    ]);

    if (categoryData.status === 'fulfilled' && categoryData.value) {
      stats.categoryStats = categoryData.value.data || [];
    }
    if (countryData.status === 'fulfilled' && countryData.value) {
      stats.countryStats = countryData.value.data || [];
    }

    onProgress?.('core', { categoryStats: stats.categoryStats, countryStats: stats.countryStats });
  } catch (error) {
    console.error('Error loading core stats:', error);
  }
  // Stage 2: Load movie stats
  try {
    const [topRatedData, topViewedData] = await Promise.allSettled([
      fetchWithCache('topRated', () => getTopRatedStats(5)), // Reduce limit for faster loading
      fetchWithCache('topViewed', () => getTopViewedStats(5)),
    ]);

    if (topRatedData.status === 'fulfilled' && topRatedData.value) {
      const ratedMovies = topRatedData.value.data || [];
      stats.topRated = ratedMovies as unknown as typeof stats.topRated;
    }
    if (topViewedData.status === 'fulfilled' && topViewedData.value) {
      stats.topViewed = topViewedData.value.data || [];
    }

    onProgress?.('movies', { topRated: stats.topRated, topViewed: stats.topViewed });
  } catch (error) {
    console.error('Error loading movie stats:', error);
  }

  // Stage 3: Load additional stats (optional)
  try {
    const [topFavoriteData, topCommentedData] = await Promise.allSettled([
      fetchWithCache('topFavorite', () => getTopFavoriteStats(5)),
      fetchWithCache('topCommented', () => getTopCommentedStats(5)),
    ]);

    if (topFavoriteData.status === 'fulfilled' && topFavoriteData.value) {
      const favoriteMovies = topFavoriteData.value.data || [];
      stats.topFavorite = favoriteMovies as unknown as typeof stats.topFavorite;
    }
    if (topCommentedData.status === 'fulfilled' && topCommentedData.value) {
      const commentedMovies = topCommentedData.value.data || [];
      stats.topCommented = commentedMovies as unknown as typeof stats.topCommented;
    }

    onProgress?.('additional', { topFavorite: stats.topFavorite, topCommented: stats.topCommented });
  } catch (error) {
    console.error('Error loading additional stats:', error);
  }

  console.log('Progressive dashboard fetch completed');
  return stats;
};

// Clear cache function
export const clearDashboardCache = (): void => {
  cache.clear();
  console.log('Dashboard cache cleared');
};

// Get cache status
export const getCacheStatus = () => {
  const status: { [key: string]: { age: number; valid: boolean } } = {};
  cache.forEach((value, key) => {
    const age = Date.now() - value.timestamp;
    status[key] = {
      age: Math.floor(age / 1000), // age in seconds
      valid: isCacheValid(value.timestamp)
    };
  });
  return status;
};
