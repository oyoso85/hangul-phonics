import { useState, useEffect } from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import type { AudioPlaybackState } from '../types';

interface AudioIndicatorProps {
  state: AudioPlaybackState;
  currentRepetition: number;
  totalRepetitions: number;
  waitDuration?: number;
}

export default function AudioIndicator({
  state,
  currentRepetition,
  totalRepetitions,
  waitDuration = 2000,
}: AudioIndicatorProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (state !== 'waiting') {
      setProgress(100);
      return;
    }

    setProgress(100);
    const frame = requestAnimationFrame(() => setProgress(0));
    return () => cancelAnimationFrame(frame);
  }, [state, currentRepetition]);

  if (state === 'idle') return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card shadow-md border border-muted">
        {state === 'playing' && (
          <Volume2 className="w-5 h-5 text-primary animate-wiggle" />
        )}
        {state === 'waiting' && (
          <Volume2 className="w-5 h-5 text-muted-foreground" />
        )}
        {state === 'completed' && (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        )}
        <span className="text-sm font-medium text-muted-foreground">
          {state === 'playing' && `재생 중 ${currentRepetition}/${totalRepetitions}`}
          {state === 'waiting' && `다시 들려줄게요 ${currentRepetition}/${totalRepetitions}`}
          {state === 'completed' && '완료!'}
        </span>
      </div>

      {state === 'waiting' && (
        <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: `${progress}%`,
              transition: progress === 0 ? `width ${waitDuration}ms linear` : 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
