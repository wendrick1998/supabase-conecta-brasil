
import { useState, useCallback } from 'react';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export function useAudioState() {
  const [state, setState] = useState<RecordingState>('idle');
  
  const setIdle = useCallback(() => setState('idle'), []);
  const setRecording = useCallback(() => setState('recording'), []);
  const setPaused = useCallback(() => setState('paused'), []);
  const setStopped = useCallback(() => setState('stopped'), []);
  
  const isRecording = state === 'recording';
  const isPaused = state === 'paused';
  
  return {
    state,
    isRecording,
    isPaused,
    setIdle,
    setRecording,
    setPaused,
    setStopped
  };
}
