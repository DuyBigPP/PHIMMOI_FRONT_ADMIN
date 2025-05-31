import { MovieResponse, MovieCreateRequest, MovieUpdateRequest, ApiResponse, MovieListParams, Pagination } from '@/types/api';
import { Movie, TVShow } from '@/types/movie';
import { getMovieList, addMovie, updateMovie, deleteMovie } from './function';

// Movie list response with pagination
export interface MovieListServiceResponse {
  data: MovieResponse[];
  pagination?: Pagination;
}

// Helper function to convert Movie/TVShow to MovieResponse
const convertToMovieResponse = (movie: Movie | TVShow): MovieResponse => {
  return {
    id: movie.id || '',
    name: movie.name,
    slug: movie.slug,
    originName: movie.originName || movie.name,
    content: movie.content || '',
    type: movie.type || 'movie',
    status: (movie.status) || 'completed',
    posterUrl: movie.posterUrl || '',
    thumbUrl: movie.thumbUrl || movie.posterUrl || '',
    year: movie.year,
    view: 0, // Default view count
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categories: movie.categories?.map(catWrapper => ({
      category: {
        id: catWrapper.category.id,
        name: catWrapper.category.name,
        slug: catWrapper.category.slug
      }
    })) || [],
    countries: movie.countries?.map(countryWrapper => ({
      country: {
        id: countryWrapper.country.id,
        name: countryWrapper.country.name,
        slug: countryWrapper.country.slug
      }
    })) || []
  };
};

// Get movies with API call and pagination
export const getMovies = async (params: Partial<MovieListParams> = {}): Promise<ApiResponse<MovieResponse[]> & { pagination?: Pagination }> => {
  try {
    const defaultParams: MovieListParams = {
      page: 1,
      limit: 10, // Default to 10 movies per page for admin panel
      search: '',
      ...params
    };
      const response = await getMovieList(defaultParams);
      // Extract movies from the response structure
    if (response.success && response.data && response.data.movies) {
      const movieResponses = response.data.movies.map(convertToMovieResponse);
      return {
        success: true,
        data: movieResponses,
        message: 'Movies loaded successfully',
        pagination: response.data.pagination
      };
    }
    
    return {
      success: false,
      data: [],
      message: 'Failed to load movies'
    };
  } catch (error) {
    console.error('Error getting movies:', error);
    return {
      success: false,
      data: [],
      message: 'Failed to load movies'
    };
  }
};

export const createMovie = async (movieData: MovieCreateRequest): Promise<ApiResponse<MovieResponse>> => {
  try {
    return await addMovie(movieData);
  } catch (error) {    console.error('Error creating movie:', error);
    return {
      success: false,
      data: {} as MovieResponse,
      message: 'Failed to create movie'
    };
  }
};

export const updateMovieById = async (movieData: MovieUpdateRequest): Promise<ApiResponse<MovieResponse>> => {
  try {
    return await updateMovie(movieData);
  } catch (error) {    console.error('Error updating movie:', error);
    return {
      success: false,
      data: {} as MovieResponse,
      message: 'Failed to update movie'
    };
  }
};

export const deleteMovieById = async (movieId: string): Promise<ApiResponse<void>> => {
  try {
    return await deleteMovie(movieId);
  } catch (error) {    console.error('Error deleting movie:', error);
    return {
      success: false,
      data: undefined,
      message: 'Failed to delete movie'
    };
  }
};
