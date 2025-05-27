import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  stage: string;
  progress: number;
  error: string | null;
}

export const useProgressiveLoading = () => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    stage: 'Ready',
    progress: 0,
    error: null
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setStage = useCallback((stage: string, progress?: number) => {
    setState(prev => ({ 
      ...prev, 
      stage, 
      progress: progress ?? prev.progress 
    }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      stage: 'Ready',
      progress: 0,
      error: null
    });
  }, []);

  return {
    state,
    setLoading,
    setStage,
    setProgress,
    setError,
    reset
  };
};
