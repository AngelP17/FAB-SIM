import { useState, useEffect, useCallback } from 'react';

interface UseTypingAnimationOptions {
  text: string;
  speed?: number;        // ms per character
  delay?: number;        // ms before starting
  onComplete?: () => void;
}

export function useTypingAnimation({
  text,
  speed = 30,
  delay = 0,
  onComplete
}: UseTypingAnimationOptions) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    setDisplayText('');
    setIsComplete(false);
    setIsTyping(true);
  }, []);

  const reset = useCallback(() => {
    setDisplayText('');
    setIsComplete(false);
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isTyping, text, speed, delay, onComplete]);

  return {
    displayText,
    isComplete,
    isTyping,
    startTyping,
    reset
  };
}

// Hook for typing multiple lines sequentially
interface UseMultiLineTypingOptions {
  lines: string[];
  speed?: number;
  lineDelay?: number;    // ms between lines
  onComplete?: () => void;
}

export function useMultiLineTyping({
  lines,
  speed = 30,
  lineDelay = 500,
  onComplete
}: UseMultiLineTypingOptions) {
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    setDisplayLines([]);
    setCurrentLineIndex(0);
    setIsComplete(false);
    setIsTyping(true);
  }, []);

  const reset = useCallback(() => {
    setDisplayLines([]);
    setCurrentLineIndex(0);
    setIsComplete(false);
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (!isTyping || currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < currentLine.length) {
        setDisplayLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.slice(0, charIndex + 1);
          return newLines;
        });
        charIndex++;
      } else {
        clearInterval(interval);
        
        if (currentLineIndex < lines.length - 1) {
          setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
          }, lineDelay);
        } else {
          setIsComplete(true);
          setIsTyping(false);
          onComplete?.();
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isTyping, lines, currentLineIndex, speed, lineDelay, onComplete]);

  return {
    displayLines,
    isComplete,
    isTyping,
    startTyping,
    reset
  };
}
