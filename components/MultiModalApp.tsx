import { useState } from 'react';
import TextToSpeech from './TextToSpeech';
import SpeechToText from './SpeechToText';
import ImageToText from './ImageToText';
import styles from '@/styles/Home.module.css';

type TabType = 'text-to-speech' | 'speech-to-text' | 'image-to-text';

const MultiModalApp = () => {
  const [activeTab, setActiveTab] = useState<TabType>('text-to-speech');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'text-to-speech':
        return <TextToSpeech />;
      case 'speech-to-text':
        return <SpeechToText />;
      case 'image-to-text':
        return <ImageToText />;
      default:
        return <TextToSpeech />;
    }
  };
  
  return (
    <div className={styles['multimodal-container']}>
      <h1>AI Multimodal App</h1>
      <p className={styles.description}>
        Explore different ways to interact with AI using various modalities
      </p>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles['tab-button']} ${activeTab === 'text-to-speech' ? styles.active : ''}`}
          onClick={() => setActiveTab('text-to-speech')}
        >
          Text to Speech
        </button>
        <button 
          className={`${styles['tab-button']} ${activeTab === 'speech-to-text' ? styles.active : ''}`}
          onClick={() => setActiveTab('speech-to-text')}
        >
          Speech to Text
        </button>
        <button 
          className={`${styles['tab-button']} ${activeTab === 'image-to-text' ? styles.active : ''}`}
          onClick={() => setActiveTab('image-to-text')}
        >
          Image Analysis
        </button>
      </div>
      
      <div className={styles['tab-content']}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MultiModalApp; 