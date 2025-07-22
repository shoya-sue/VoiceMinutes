import { create } from 'zustand';

const useStore = create((set) => ({
  audioFile: null,
  transcriptionStatus: 'idle',
  transcriptionProgress: 0,
  transcriptionResult: '',
  minutes: null,
  selectedEngine: 'whisper',
  language: 'ja',
  
  setAudioFile: (file) => set({ audioFile: file }),
  setTranscriptionStatus: (status) => set({ transcriptionStatus: status }),
  setTranscriptionProgress: (progress) => set({ transcriptionProgress: progress }),
  setTranscriptionResult: (result) => set({ transcriptionResult: result }),
  setMinutes: (minutes) => set({ minutes: minutes }),
  setSelectedEngine: (engine) => set({ selectedEngine: engine }),
  setLanguage: (language) => set({ language: language }),
  
  resetState: () => set({
    audioFile: null,
    transcriptionStatus: 'idle',
    transcriptionProgress: 0,
    transcriptionResult: '',
    minutes: null,
  }),
}));

export default useStore;