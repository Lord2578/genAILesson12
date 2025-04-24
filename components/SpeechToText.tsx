import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';

const SpeechToText = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    let recognition: SpeechRecognition | null = null;
    
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'uk-UA'; 
      
      recognition.onresult = (event: { results: Iterable<unknown> | ArrayLike<unknown>; }) => {
        const transcript = Array.from(event.results)
          .map(result => (result as SpeechRecognitionResult)[0])
          .map(result => result.transcript)
          .join('');
        
        setText(transcript);
      };
      
      recognition.onerror = (event: { error: string; }) => {
        setError('Speech recognition error: ' + event.error);
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in this browser');
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  
  const toggleListening = () => {
    setError('');
    
    if (!isListening) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'uk-UA'; 
        
        recognition.onresult = (event: { results: Iterable<unknown> | ArrayLike<unknown>; }) => {
          const transcript = Array.from(event.results)
            .map(result => (result as SpeechRecognitionResult)[0])
            .map(result => result.transcript)
            .join('');
          
          setText(transcript);
        };
        
        recognition.onerror = (event: { error: string; }) => {
          setError('Speech recognition error: ' + event.error);
          setIsListening(false);
        };
        
        recognition.start();
        setIsListening(true);
      } catch (err) {
        setError('Failed to start speech recognition');
        console.error(err);
      }
    } else {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.stop();
        setIsListening(false);
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  return (
    <div className={styles['modal-feature']}>
      <h2>Speech to Text</h2>
      <div className={styles['result-container']}>
        <p className={styles['result-text']}>{text || 'Your speech will appear here...'}</p>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button 
        onClick={toggleListening} 
        className={`${styles['action-button']} ${isListening ? styles.listening : ''}`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default SpeechToText; 