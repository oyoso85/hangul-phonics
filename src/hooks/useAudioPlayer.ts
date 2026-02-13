import { useState, useCallback, useRef, useEffect } from 'react';
import type { AudioPlaybackState } from '../types';
import { playAudio, stopAudio, wait } from '../utils/audio';

interface UseAudioPlayerOptions {
  repetitions?: number;
  onComplete?: () => void;
}

interface UseAudioPlayerReturn {
  playbackState: AudioPlaybackState;
  currentRepetition: number;
  totalRepetitions: number;
  waitDuration: number;
  play: (src: string) => Promise<void>;
  playSequence: (srcs: string[]) => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
  isCompleted: boolean;
  userGestureRequired: boolean;
  enableAudio: () => void;
}

export function useAudioPlayer(options: UseAudioPlayerOptions = {}): UseAudioPlayerReturn {
  const { repetitions = 3, onComplete } = options;

  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>('idle');
  const [currentRepetition, setCurrentRepetition] = useState(0);
  const [waitDuration, setWaitDuration] = useState(0);
  const [userGestureRequired, setUserGestureRequired] = useState(false);
  const cancelledRef = useRef(false);
  const pendingSrcsRef = useRef<string[] | null>(null);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    stopAudio();
    setPlaybackState('idle');
    setCurrentRepetition(0);
  }, []);

  const play = useCallback(async (src: string) => {
    cancelledRef.current = false;
    setPlaybackState('playing');

    try {
      for (let i = 0; i < repetitions; i++) {
        if (cancelledRef.current) return;

        setCurrentRepetition(i + 1);
        setPlaybackState('playing');

        await playAudio(src);

        if (cancelledRef.current) return;

        if (i < repetitions - 1) {
          const ms = 2000;
          setWaitDuration(ms);
          setPlaybackState('waiting');
          await wait(ms);
        }
      }

      if (!cancelledRef.current) {
        setPlaybackState('completed');
        onComplete?.();
      }
    } catch {
      if (!cancelledRef.current) {
        setPlaybackState('idle');
      }
    }
  }, [repetitions, onComplete]);

  const playSequence = useCallback(async (srcs: string[]) => {
    cancelledRef.current = false;
    setPlaybackState('playing');
    pendingSrcsRef.current = srcs;

    try {
      for (let i = 0; i < repetitions; i++) {
        if (cancelledRef.current) return;

        setCurrentRepetition(i + 1);
        setPlaybackState('playing');

        for (const src of srcs) {
          if (cancelledRef.current) return;
          await playAudio(src);
          if (cancelledRef.current) return;
          await wait(500);
        }

        if (cancelledRef.current) return;

        if (i < repetitions - 1) {
          const ms = 2000;
          setWaitDuration(ms);
          setPlaybackState('waiting');
          await wait(ms);
        }
      }

      if (!cancelledRef.current) {
        setPlaybackState('completed');
        onComplete?.();
      }
    } catch {
      if (!cancelledRef.current) {
        setPlaybackState('idle');
      }
    }
  }, [repetitions, onComplete]);

  const enableAudio = useCallback(() => {
    setUserGestureRequired(false);
    const srcs = pendingSrcsRef.current;
    pendingSrcsRef.current = null;
    if (srcs) {
      stopAudio();
      playSequence(srcs);
    }
  }, [playSequence]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      stopAudio();
    };
  }, []);

  return {
    playbackState,
    currentRepetition,
    totalRepetitions: repetitions,
    waitDuration,
    play,
    playSequence,
    stop,
    isPlaying: playbackState === 'playing' || playbackState === 'waiting',
    isCompleted: playbackState === 'completed',
    userGestureRequired,
    enableAudio,
  };
}
