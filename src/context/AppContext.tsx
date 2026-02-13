import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, UserProfile, LearningCategory, VocabularyCategory } from '../types';
import { loadUserProfile, saveUserProfile, removeUserProfile } from '../utils/storage';

type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_CATEGORY'; payload: LearningCategory | null }
  | { type: 'SET_VOCABULARY_CATEGORY'; payload: VocabularyCategory | null };

const initialState: AppState = {
  user: null,
  currentCategory: null,
  selectedVocabularyCategory: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null };
    case 'SET_CATEGORY':
      return { ...state, currentCategory: action.payload };
    case 'SET_VOCABULARY_CATEGORY':
      return { ...state, selectedVocabularyCategory: action.payload };
  }
}

interface AppContextValue {
  state: AppState;
  setUser: (nickname: string) => void;
  clearUser: () => void;
  setCategory: (category: LearningCategory | null) => void;
  setVocabularyCategory: (category: VocabularyCategory | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = loadUserProfile();
    if (saved) {
      dispatch({ type: 'SET_USER', payload: saved });
    }
  }, []);

  const setUser = (nickname: string) => {
    const profile: UserProfile = { nickname, lastVisited: new Date().toISOString() };
    saveUserProfile(profile);
    dispatch({ type: 'SET_USER', payload: profile });
  };

  const clearUser = () => {
    removeUserProfile();
    dispatch({ type: 'CLEAR_USER' });
  };

  const setCategory = (category: LearningCategory | null) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const setVocabularyCategory = (category: VocabularyCategory | null) => {
    dispatch({ type: 'SET_VOCABULARY_CATEGORY', payload: category });
  };

  return (
    <AppContext.Provider value={{ state, setUser, clearUser, setCategory, setVocabularyCategory }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
