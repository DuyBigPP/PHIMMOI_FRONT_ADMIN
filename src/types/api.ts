import { Movie, TVShow, /* Genre, Actor  */} from './movie';

// Common response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination type
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Movie list response
export interface MovieListResponse {
  movies: (Movie | TVShow)[];
  pagination: Pagination;
}

// Movie list params
export interface MovieListParams {
  page?: number;
  limit?: number;
  type?: 'single' | 'series';
  category?: string;
  country?: string;
  year?: number;
  search?: string;
  sort?: 'latest' | 'popular' | 'rating';
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  movieId: string;
}

export interface CommentListResponse {
  comments: Comment[];
  pagination: Pagination;
}

// Rating types
export interface Rating {
  id: string;
  score: number;
  review: string;
  userId: string;
  movieId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RatingListResponse {
  ratings: Rating[];
  averageScore: number;
  pagination: Pagination;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 

// Favorite types
export interface Favorite {
  id: string;
  movieId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteListResponse {
  favorites: Favorite[];
  pagination: Pagination;
}

// Admin Stats Types
export interface CategoryStats {
  id: string;
  name: string;
  slug: string;
  movieCount: number;
}

export interface AddCategoryRequest {
  name: string;
  slug: string;
}

export interface CountryStats {
  id: string;
  name: string;
  slug: string;
  movieCount: number;
}

export interface TopRatedMovie {
  id: string;
  name: string;
  slug: string;
  originName: string;
  posterUrl: string;
  thumbUrl: string;
  year: number;
  view: number;
  average_rating: string;
  rating_count: string;
}

export interface TopViewedMovie {
  id: string;
  name: string;
  slug: string;
  originName: string;
  posterUrl: string;
  thumbUrl: string;
  year: number;
  view: number;
}

export interface TopFavoriteMovie {
  id: string;
  name: string;
  slug: string;
  originName: string;
  posterUrl: string;
  thumbUrl: string;
  year: number;
  favoriteCount: number;
  // Support for alternative field names from API
  favorite_count?: number;
  _count?: {
    favorites: number;
  };
}

export interface TopCommentedMovie {
  id: string;
  name: string;
  slug: string;
  originName: string;
  posterUrl: string;
  thumbUrl: string;
  year: number;
  commentCount: number;
  // Support for alternative field names from API
  comment_count?: number;
  _count?: {
    comments: number;
  };
}

export interface ViewStats {
  period: string;
  totalViews: number;
  data: Array<{
    date: string;
    views: number;
  }>;
}

export interface DashboardStats {
  categoryStats: CategoryStats[];
  countryStats: CountryStats[];
  topRated: TopRatedMovie[];
  topViewed: TopViewedMovie[];
  topFavorite: TopFavoriteMovie[];
  topCommented: TopCommentedMovie[];
  viewStats: ViewStats;
}

// Movie management types
export interface MovieCreateRequest {
  name: string;
  slug: string;
  originName: string;
  content: string;
  type: 'movie' | 'series' | 'hoathinh';
  status: 'completed' | 'ongoing';
  poster?: File;
  thumb?: File;
  isCopyright?: boolean;
  subDocquyen?: boolean;
  chieurap?: boolean;
  trailerUrl?: string;
  time?: string;
  episodeCurrent?: string;
  episodeTotal?: string;
  quality?: string;
  lang?: string;
  notify?: string;
  showtimes?: string;
  year: number;
  categories: string[]; // Array of category slugs
  countries: string[]; // Array of country slugs
  actors?: string[]; // Array of actor names
  tmdbId?: string;
  tmdbType?: string;
  tmdbVoteAverage?: number;
  tmdbVoteCount?: number;
  imdbId?: string;
}

export interface MovieUpdateRequest extends Partial<MovieCreateRequest> {
  id: string;
}

export interface MovieResponse {
  id: string;
  name: string;
  slug: string;
  originName: string;
  content: string;
  type: string;
  status: string;
  posterUrl: string;
  thumbUrl: string;
  year: number;
  view: number;
  createdAt: string;
  updatedAt: string;
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  countries: Array<{
    country: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface EpisodeCreateRequest {
  name: string;
  slug: string;
  movieId: string;
  serverName?: string;
  video: File;
}

export interface EpisodeUpdateRequest extends Partial<EpisodeCreateRequest> {
  id: string;
}

export interface EpisodeResponse {
  id: string;
  name: string;
  slug: string;
  filename: string;
  linkEmbed: string;
  linkM3u8: string;
  movieId: string;
  serverName: string;
  createdAt: string;
  updatedAt: string;
}
