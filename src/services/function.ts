import axios from 'axios';
import {
  CREATE_COMMENT,
  GET_COMMENT_BY_MOVIE_ID,
  DELETE_COMMENT,
  GET_MOVIE_LIST,
  GET_MOVIE_BY_SLUG,
  CREATE_RATING,
  GET_RATING_BY_MOVIE_ID,
  DELETE_RATING,
  GET_POPULAR_MOVIE,
  GET_RELATED_MOVIE,
  CREATE_VIEW,
  REGISTER,
  LOGIN,
  GET_USER_INFO,
  GET_USER_FAVORITE,
  ADD_FAVORITE,
  DELETE_FAVORITE,
  GET_CATEGORY_STATS,
  GET_COUNTRY_STATS,
  GET_TOP_RATED_STATS,
  GET_TOP_VIEWED_STATS,
  GET_TOP_FAVORITE_STATS,
  GET_TOP_COMMENTED_STATS,
  GET_MOVIE_VIEW_STATS
} from './endpoint';
import {
  ApiResponse,
  Comment,
  CommentListResponse,
  MovieListResponse,
  MovieListParams,
  Rating,
  RatingListResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  FavoriteListResponse,
  Favorite,
  CategoryStats,
  CountryStats,
  TopRatedMovie,
  TopViewedMovie,
  ViewStats,
  DashboardStats
} from '@/types/api';

// Comment API functions
export const createComment = async (movieId: string, content: string): Promise<ApiResponse<Comment>> => {
  const response = await axios.post(CREATE_COMMENT.replace('{movieId}', movieId), { content });
  return response.data;
};

export const getCommentsByMovieId = async (
  movieId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<CommentListResponse>> => {
  const response = await axios.get(GET_COMMENT_BY_MOVIE_ID.replace('{movieId}', movieId), {
    params: { page, limit }
  });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(DELETE_COMMENT.replace('{commentId}', commentId));
  return response.data;
};

// Movie API functions
export const getMovieList = async (params: MovieListParams): Promise<ApiResponse<MovieListResponse>> => {
  const response = await axios.get(GET_MOVIE_LIST, { params });
  return response.data;
};

export const getMovieBySlug = async (slug: string): Promise<ApiResponse<MovieListResponse>> => {
  const response = await axios.get(GET_MOVIE_BY_SLUG.replace('{slug}', slug));
  return response.data;
};

// Rating API functions
export const createRating = async (
  movieId: string,
  score: number,
  review: string
): Promise<ApiResponse<Rating>> => {
  const response = await axios.post(CREATE_RATING.replace('{movieId}', movieId), { score, review });
  return response.data;
};

export const getRatingsByMovieId = async (
  movieId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<RatingListResponse>> => {
  const response = await axios.get(GET_RATING_BY_MOVIE_ID.replace('{movieId}', movieId), {
    params: { page, limit }
  });
  return response.data;
};

export const deleteRating = async (ratingId: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(DELETE_RATING.replace('{ratingId}', ratingId));
  return response.data;
};

// Recommendation API functions
export const getPopularMovies = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<MovieListResponse>> => {
  const response = await axios.get(GET_POPULAR_MOVIE, { params: { page, limit } });
  return response.data;
};

export const getRelatedMovies = async (
  movieId: string,
  limit: number = 10
): Promise<ApiResponse<MovieListResponse>> => {
  const response = await axios.get(GET_RELATED_MOVIE.replace('{movieId}', movieId), {
    params: { limit }
  });
  return response.data;
};

// View API functions
export const createView = async (movieId: string): Promise<ApiResponse<void>> => {
  const response = await axios.post(CREATE_VIEW.replace('{movieId}', movieId));
  return response.data;
};

// Auth API functions
export const register = async (data: RegisterRequest): Promise<AuthResponse | ApiResponse<AuthResponse>> => {
  console.log('Calling register API with data:', data);
  try {
    const response = await axios.post(REGISTER, data);
    console.log('Register API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register API error:', error);
    // Check if the error has a response with data that might be useful
    if (axios.isAxiosError(error) && error.response?.data) {
      console.log('Register API error details:', error.response.data);
    }
    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<AuthResponse | ApiResponse<AuthResponse>> => {
  console.log('Calling login API with data:', data);
  try {
    const response = await axios.post(LOGIN, data);
    console.log('Login API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    // Check if the error has a response with data that might be useful
    if (axios.isAxiosError(error) && error.response?.data) {
      console.log('Login API error details:', error.response.data);
    }
    throw error;
  }
};

export const getUserInfo = async (): Promise<User | ApiResponse<User>> => {
  console.log('Calling getUserInfo API');
  try {
    const response = await axios.get(GET_USER_INFO);
    console.log('GetUserInfo API response:', response.data);
    
    // Kiểm tra nếu response.data có cấu trúc của một ApiResponse
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      return response.data as ApiResponse<User>;
    }
    
    // Nếu không, coi như response.data chính là User object
    return response.data as User;
  } catch (error) {
    console.error('GetUserInfo API error:', error);
    throw error;
  }
};

// Favorite API functions
export const getUserFavorite = async (): Promise<ApiResponse<FavoriteListResponse>> => {
  const response = await axios.get(GET_USER_FAVORITE);
  return response.data;
};

export const addFavorite = async (movieId: string): Promise<ApiResponse<Favorite>> => {
  const response = await axios.post(ADD_FAVORITE, { movieId });
  return response.data;
};

export const deleteFavorite = async (movieId: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(DELETE_FAVORITE.replace('{movieId}', movieId));
  return response.data;
};

// Logout function
export const logout = (): void => {
  // Remove token and user info from localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
  
  // Remove authorization header from axios defaults
  delete axios.defaults.headers.common['Authorization'];
  
  console.log('User logged out successfully');
};

// Admin Stats API functions
export const getCategoryStats = async (): Promise<ApiResponse<CategoryStats[]>> => {
  const response = await axios.get(GET_CATEGORY_STATS);
  return response.data;
};

export const getCountryStats = async (): Promise<ApiResponse<CountryStats[]>> => {
  const response = await axios.get(GET_COUNTRY_STATS);
  return response.data;
};

export const getTopRatedStats = async (limit: number = 10): Promise<ApiResponse<TopRatedMovie[]>> => {
  const response = await axios.get(GET_TOP_RATED_STATS, { params: { limit } });
  return response.data;
};

export const getTopViewedStats = async (limit: number = 10): Promise<ApiResponse<TopViewedMovie[]>> => {
  const response = await axios.get(GET_TOP_VIEWED_STATS, { params: { limit } });
  return response.data;
};

export const getTopFavoriteStats = async (limit: number = 10): Promise<ApiResponse<TopViewedMovie[]>> => {
  const response = await axios.get(GET_TOP_FAVORITE_STATS, { params: { limit } });
  return response.data;
};

export const getTopCommentedStats = async (limit: number = 10): Promise<ApiResponse<TopViewedMovie[]>> => {
  const response = await axios.get(GET_TOP_COMMENTED_STATS, { params: { limit } });
  return response.data;
};

export const getMovieViewStats = async (
  period: 'day' | 'week' | 'month' | 'year' = 'week',
  limit: number = 10
): Promise<ApiResponse<ViewStats>> => {
  const response = await axios.get(GET_MOVIE_VIEW_STATS, { params: { period, limit } });
  return response.data;
};

// Combined dashboard data function with improved error handling
export const getDashboardStats = async (): Promise<DashboardStats> => {
  console.log('Starting to fetch dashboard stats...');
  
  // Default/fallback data structure
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

  try {
    // Fetch each endpoint individually and handle failures gracefully
    const results = await Promise.allSettled([
      getCategoryStats(),
      getCountryStats(),
      getTopRatedStats(10),
      getTopViewedStats(10),
      getTopFavoriteStats(10),
      getTopCommentedStats(10),
      getMovieViewStats('month', 30)
    ]);

    // Process results and use defaults for failed requests
    const [
      categoryStatsResult,
      countryStatsResult,
      topRatedResult,
      topViewedResult,
      topFavoriteResult,
      topCommentedResult,
      viewStatsResult
    ] = results;

    const dashboardStats: DashboardStats = {
      categoryStats: categoryStatsResult.status === 'fulfilled' ? categoryStatsResult.value.data : [],
      countryStats: countryStatsResult.status === 'fulfilled' ? countryStatsResult.value.data : [],
      topRated: topRatedResult.status === 'fulfilled' ? topRatedResult.value.data : [],
      topViewed: topViewedResult.status === 'fulfilled' ? topViewedResult.value.data : [],
      topFavorite: topFavoriteResult.status === 'fulfilled' ? topFavoriteResult.value.data : [],
      topCommented: topCommentedResult.status === 'fulfilled' ? topCommentedResult.value.data : [],
      viewStats: viewStatsResult.status === 'fulfilled' ? viewStatsResult.value.data : defaultStats.viewStats
    };

    // Log which endpoints failed for debugging
    results.forEach((result, index) => {
      const endpoints = ['categories', 'countries', 'top-rated', 'top-viewed', 'top-favorite', 'top-commented', 'view-stats'];
      if (result.status === 'rejected') {
        console.warn(`Failed to fetch ${endpoints[index]} stats:`, result.reason);
      }
    });

    console.log('Dashboard stats loaded successfully:', dashboardStats);
    return dashboardStats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default stats instead of throwing
    return defaultStats;
  }
};
