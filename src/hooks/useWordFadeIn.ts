import { useEffect, useState } from 'react';

interface UseWordFadeInOptions {
  text: string;
  speed?: number;
  isActive?: boolean;
}

export function useWordFadeIn({ text, speed = 200, isActive = true }: UseWordFadeInOptions) {
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const words = text.split(' ');

  useEffect(() => {
    if (!isActive) {
      setVisibleWordCount(words.length);
      setIsComplete(true);
      return;
    }

    setVisibleWordCount(0);
    setIsComplete(false);
    
    if (!text || words.length === 0) return;

    let currentWordIndex = 0;
    const timer = setInterval(() => {
      if (currentWordIndex < words.length) {
        setVisibleWordCount(currentWordIndex + 1);
        currentWordIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, isActive, words.length]);

  return { visibleWordCount, isComplete, words };
} 