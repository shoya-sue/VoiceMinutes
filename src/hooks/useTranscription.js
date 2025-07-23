import { useState } from 'react';
import useStore from '../store/useStore';
import { transcribeWithWhisper, transcribeWithWebSpeech } from '../utils/transcription';
import { analyzeTranscript, generateMinutes } from '../utils/minutesGenerator';
import { loadAudioFile, formatDuration } from '../utils/audioUtils';

const useTranscription = () => {
  const {
    audioFile,
    selectedEngine,
    language,
    setTranscriptionStatus,
    setTranscriptionProgress,
    setTranscriptionResult,
    setMinutes
  } = useStore();

  const [error, setError] = useState(null);

  const transcribe = async () => {
    if (!audioFile) {
      setError('No audio file selected');
      return;
    }

    setError(null);
    setTranscriptionStatus('preparing');
    setTranscriptionProgress(5);

    try {
      // Load audio file and get metadata
      const audioData = await loadAudioFile(audioFile);
      const duration = formatDuration(audioData.duration);
      
      setTranscriptionStatus('transcribing');
      setTranscriptionProgress(10);

      // Choose transcription method based on selected engine
      let transcriptionResult;
      if (selectedEngine === 'whisper') {
        transcriptionResult = await transcribeWithWhisper(
          audioFile,
          language,
          (progress) => setTranscriptionProgress(10 + progress * 0.6)
        );
      } else {
        transcriptionResult = await transcribeWithWebSpeech(
          audioFile,
          language,
          (progress) => setTranscriptionProgress(10 + progress * 0.6)
        );
      }

      setTranscriptionResult(transcriptionResult.text);
      setTranscriptionStatus('analyzing');
      setTranscriptionProgress(75);

      // Analyze transcript
      const analysisResult = analyzeTranscript(transcriptionResult.text);
      
      setTranscriptionStatus('generating');
      setTranscriptionProgress(85);

      // Generate minutes
      const minutesText = generateMinutes(analysisResult, {
        duration: duration,
        date: new Date().toLocaleString('ja-JP'),
        participants: '参加者リスト（自動検出）'
      });

      setMinutes(minutesText);
      setTranscriptionStatus('completed');
      setTranscriptionProgress(100);

    } catch (err) {
      console.error('Transcription error:', err);
      setError(err.message);
      setTranscriptionStatus('error');
      setTranscriptionProgress(0);
    }
  };

  return {
    transcribe,
    error
  };
};

export default useTranscription;