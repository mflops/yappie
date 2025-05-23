import { useWordFadeIn } from '@/hooks/useWordFadeIn';
import ReactMarkdown from 'react-markdown';

interface WordFadeInProps {
  text: string;
  isActive: boolean;
  speed?: number;
}

export default function WordFadeIn({ text, isActive, speed = 150 }: WordFadeInProps) {
  const { visibleWordCount, words } = useWordFadeIn({ 
    text, 
    speed, 
    isActive 
  });

  if (!isActive) {
    return (
      <div className="prose break-words max-w-full whitespace-pre-wrap">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  }

  // Create visible text by joining visible words, preserving markdown
  const visibleText = words.slice(0, visibleWordCount).join(' ');
  
  return (
    <div className="prose break-words max-w-full whitespace-pre-wrap">
      <ReactMarkdown>{visibleText}</ReactMarkdown>
    </div>
  );
} 