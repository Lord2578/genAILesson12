/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from '@/styles/Home.module.css';
import axios from 'axios';

const ImageToText = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Process image with OpenAI
  const processImageWithOpenAI = async (imageFile: File) => {
    setLoading(true);
    setError('');
    setAnalysisResult('');
    
    try {
      // Convert the image file to base64
      const base64Image = await fileToBase64(imageFile);
      
      // Call our API route
      const response = await axios.post('/api/analyze-image', {
        base64Image
      });
      
      if (response.data.result) {
        setAnalysisResult(response.data.result);
      } else {
        throw new Error('No analysis result returned');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error analyzing image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Create preview
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    
    // Process the image with OpenAI
    await processImageWithOpenAI(file);
    
    // Clean up the preview URL when done
    return () => URL.revokeObjectURL(preview);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    maxFiles: 1,
    maxSize: 10485760 // 10MB max file size
  });
  
  return (
    <div className={styles['modal-feature']}>
      <h2>Image Analysis with AI</h2>
      <p>Upload an image to analyze it using OpenAIs vision capabilities. The AI will describe the image and extract any text that appears in it.</p>
            
      <div 
        {...getRootProps()} 
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag and drop an image here, or click to select a file</p>
        )}
      </div>
      
      {imagePreview && (
        <div className={styles['preview-container']}>
          <img src={imagePreview} alt="Preview" className={styles['image-preview']} />
        </div>
      )}
      
      {loading && <p className={styles.loading}>Analyzing image with AI...</p>}
      {error && <p className={styles.error}>{error}</p>}
      
      {analysisResult && (
        <div className={styles['result-container']}>
          <h3>AI Analysis Results</h3>
          <p className={styles['result-text']}>{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default ImageToText; 