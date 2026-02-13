import { Volume2 } from 'lucide-react';

interface AudioGesturePromptProps {
  onActivate: () => void;
}

export default function AudioGesturePrompt({ onActivate }: AudioGesturePromptProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-3xl p-8 mx-4 max-w-sm text-center shadow-2xl animate-bounce-in">
        <div className="flex justify-center mb-4">
          <Volume2 className="w-12 h-12 text-primary animate-float" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          소리를 켜볼까요?
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          아래 버튼을 눌러 소리를 활성화하세요
        </p>
        <button
          onClick={onActivate}
          className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          소리 켜기
        </button>
      </div>
    </div>
  );
}
