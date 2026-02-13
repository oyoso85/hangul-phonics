import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function NicknameInput() {
  const { state, setUser } = useAppContext();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(state.user?.nickname ?? '');
  const [error, setError] = useState('');

  if (state.user && !nickname) {
    navigate('/select-category', { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();

    if (trimmed.length < 1 || trimmed.length > 20) {
      setError('이름은 1~20자로 입력해주세요');
      return;
    }

    setUser(trimmed);
    navigate('/select-category');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-card rounded-3xl shadow-2xl p-8 w-full max-w-md text-center animate-bounce-in animate-fill-both">
        <div className="text-6xl mb-4 animate-wiggle">👋</div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          안녕!
        </h1>
        <p className="text-muted-foreground mb-6">이름을 알려주세요</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setError('');
            }}
            placeholder="이름을 입력하세요"
            maxLength={20}
            className="w-full px-6 py-4 text-xl text-center border-2 border-muted rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all bg-background mb-2"
            autoFocus
          />
          {error && (
            <p className="text-destructive text-sm mb-2">{error}</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
