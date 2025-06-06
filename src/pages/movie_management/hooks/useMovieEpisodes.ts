import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EpisodeResponse, EpisodeCreateRequest, EpisodeUpdateRequest, MovieListResponse } from '@/types/api';
import { addEpisode, updateEpisode, deleteEpisode, getMovieBySlug } from '@/services/function';

export function useMovieEpisodes() {
  const { toast } = useToast();
  const [episodes, setEpisodes] = useState<EpisodeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  // Load episodes for a movie using movie slug
  const loadEpisodes = useCallback(async (movieSlug: string) => {
    if (!movieSlug) {
      setEpisodes([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Loading episodes for movie slug:', movieSlug);
      const response = await getMovieBySlug(movieSlug);
        if (response.success && response.data) {
        // The API returns a movie object that might have episodes
        // Check if the response contains movie data with episodes
        const movieData = response.data as MovieListResponse;
        
        console.log('Movie data from API:', movieData);        // Since getMovieBySlug returns MovieListResponse, check if it's wrapped in movies array
        if (movieData.movies && movieData.movies.length > 0) {
          // Try to access episodes from the first movie - the API may extend the base Movie type
          const movie = movieData.movies[0];
          const movieWithEpisodes = movie as typeof movie & { episodes?: EpisodeResponse[] };
          
          if (movieWithEpisodes.episodes && Array.isArray(movieWithEpisodes.episodes)) {
            console.log('Found episodes in movie object:', movieWithEpisodes.episodes);
            setEpisodes(movieWithEpisodes.episodes);
          } else {
            console.log('No episodes found in movie object, setting empty array');
            setEpisodes([]);
          }
        } else {
          // Fallback: check if the data itself has episodes (in case API structure changes)
          const responseWithEpisodes = movieData as typeof movieData & { episodes?: EpisodeResponse[] };
          if (responseWithEpisodes.episodes && Array.isArray(responseWithEpisodes.episodes)) {
            console.log('Found episodes directly:', responseWithEpisodes.episodes);
            setEpisodes(responseWithEpisodes.episodes);
          } else {
            console.log('No episodes found in response, setting empty array');
            setEpisodes([]);
          }
        }
      } else {
        console.error('Failed to get movie data:', response.message);
        setEpisodes([]);
      }    } catch (error) {
      console.error('Failed to load episodes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load episodes',
        variant: 'destructive',
      });
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add new episode
  const handleAddEpisode = useCallback(async (episodeData: EpisodeCreateRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await addEpisode(episodeData);
      if (response.success) {
        setEpisodes(prev => [...prev, response.data]);
        toast({
          title: 'Success',
          description: 'Episode added successfully',
        });
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to add episode:', error);
      toast({
        title: 'Error',
        description: 'Failed to add episode',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update episode
  const handleUpdateEpisode = useCallback(async (episodeData: EpisodeUpdateRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await updateEpisode(episodeData);
      if (response.success) {
        setEpisodes(prev => 
          prev.map(ep => ep.id === episodeData.id ? response.data : ep)
        );
        toast({
          title: 'Success',
          description: 'Episode updated successfully',
        });
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to update episode:', error);
      toast({
        title: 'Error',
        description: 'Failed to update episode',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete episode
  const handleDeleteEpisode = useCallback(async (episodeId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await deleteEpisode(episodeId);
      if (response.success) {
        setEpisodes(prev => prev.filter(ep => ep.id !== episodeId));
        toast({
          title: 'Success',
          description: 'Episode deleted successfully',
        });
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to delete episode:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete episode',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    episodes,
    loading,
    loadEpisodes,
    addEpisode: handleAddEpisode,
    updateEpisode: handleUpdateEpisode,
    deleteEpisode: handleDeleteEpisode,
  };
}
