import { useState } from 'react';
import styles from '@/styles/Home.module.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleTextToSpeech = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'uk-UA'; 
      speechSynthesis.speak(utterance);
    } catch (err) {
      setError('An error occurred with text-to-speech conversion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles['modal-feature']}>
      <h2>Text to Speech</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        rows={4}
        className={styles['text-input']}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button 
        onClick={handleTextToSpeech} 
        disabled={loading}
        className={styles['action-button']}
      >
        {loading ? 'Converting...' : 'Convert to Speech'}
      </button>
    </div>
  );
};

export default TextToSpeech; 