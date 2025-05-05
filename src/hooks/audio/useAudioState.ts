
import { useState, useCallback } from 'react';

// Define all possible states for our recording state machine
export type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped';

/**
 * Hook for managing audio recorder state
 */
export function useAudioState() {
  const [state, setState] = useState<RecorderState>('idle');
  
  const setIdle = useCallback(() => setState('idle'), []);
  const setRecording = useCallback(() => setState('recording'), []);
  const setPaused = useCallback(() => setState('paused'), []);
  const setStopped = useCallback(() => setState('stopped'), []);
  
  return {
    state,
    setIdle,
    setRecording,
    setPaused,
    setStopped,
    isRecording: state === 'recording',
    isPaused: state === 'paused',
    isStopped: state === 'stopped',
    isIdle: state === 'idle'
  };
}
