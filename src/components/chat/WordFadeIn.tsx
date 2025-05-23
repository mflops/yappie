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

  // Create the visible text by joining the visible words
  const visibleText = words.slice(0, visibleWordCount).join(' ');
  
  return (
    <div className="prose break-words max-w-full whitespace-pre-wrap">
      <div className="inline">
        {words.map((word, index) => (
          <span 
            key={index}
            className={`inline transition-opacity duration-300 ${
              index < visibleWordCount ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              animationDelay: `${index * (speed || 150)}ms`
            }}
          >
            {word}
            {index < words.length - 1 && ' '}
          </span>
        ))}
      </div>
    </div>
  );
} 