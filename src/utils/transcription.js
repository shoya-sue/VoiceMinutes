import { pipeline, env } from '@xenova/transformers';

// Configure Xenova/Transformers to use remote models
env.remote = true;
env.allowLocalModels = false;

let transcriber = null;

export const initializeWhisper = async (onProgress) => {
  if (!transcriber) {
    try {
      transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny',
        {
          progress_callback: (progress) => {
            if (onProgress) {
              onProgress(progress);
            }
          }
        }
      );
    } catch (error) {
      console.error('Failed to initialize Whisper:', error);
      throw error;
    }
  }
  return transcriber;
};

export const transcribeWithWhisper = async (audioFile, language = 'ja', onProgress) => {
  try {
    // Initialize transcriber if not already done
    const model = await initializeWhisper((progress) => {
      if (onProgress) {
        onProgress(Math.min(progress.progress * 0.3, 30)); // Model loading is 30% of progress
      }
    });

    // Create audio URL
    const audioUrl = URL.createObjectURL(audioFile);

    // Transcribe audio
    const result = await model(audioUrl, {
      language: language,
      task: 'transcribe',
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: true,
      callback_function: (beams) => {
        if (onProgress) {
          // Estimate progress based on processing
          onProgress(30 + Math.random() * 40); // 30-70% for transcription
        }
      }
    });

    // Clean up
    URL.revokeObjectURL(audioUrl);

    if (onProgress) {
      onProgress(70); // Transcription complete
    }

    return {
      text: result.text,
      chunks: result.chunks || []
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

export const transcribeWithWebSpeech = async (audioFile, language = 'ja', onProgress) => {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Web Speech API is not supported in this browser'));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'ja' ? 'ja-JP' : 'en-US';
    recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let startTime = Date.now();

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update progress based on time elapsed (rough estimate)
      const elapsed = Date.now() - startTime;
      const estimatedProgress = Math.min((elapsed / 30000) * 70, 70); // Assume ~30s for processing
      if (onProgress) {
        onProgress(estimatedProgress);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onend = () => {
      if (onProgress) {
        onProgress(70);
      }
      resolve({
        text: finalTranscript.trim(),
        chunks: []
      });
    };

    // Create audio element to play the file
    const audio = new Audio();
    audio.src = URL.createObjectURL(audioFile);
    
    audio.onloadedmetadata = () => {
      // Start recognition
      recognition.start();
      
      // Play audio
      audio.play();
      
      // Stop recognition when audio ends
      audio.onended = () => {
        recognition.stop();
        URL.revokeObjectURL(audio.src);
      };
    };

    audio.onerror = (error) => {
      reject(new Error('Failed to load audio file'));
      URL.revokeObjectURL(audio.src);
    };
  });
};