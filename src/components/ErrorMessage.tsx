interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = '앗! 문제가 생겼어요',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-card rounded-3xl shadow-xl p-8 text-center max-w-sm animate-bounce-in">
        <div className="text-5xl mb-4">😢</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{message}</h2>
        <p className="text-muted-foreground text-sm mb-4">다시 시도해보세요</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
