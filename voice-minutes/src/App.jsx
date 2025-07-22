import './App.css'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import SettingsPanel from './components/SettingsPanel'
import TranscribeButton from './components/TranscribeButton'
import ProcessingStatus from './components/ProcessingStatus'
import MinutesDisplay from './components/MinutesDisplay'
import useTranscription from './hooks/useTranscription'

function App() {
  const { transcribe, error } = useTranscription();

  return (
    <div className="App">
      <Header />
      <FileUpload />
      <SettingsPanel />
      <TranscribeButton onTranscribe={transcribe} />
      <ProcessingStatus />
      {error && (
        <div style={{ 
          maxWidth: '600px', 
          margin: '1rem auto', 
          padding: '1rem', 
          backgroundColor: '#fee', 
          color: '#c00',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          エラー: {error}
        </div>
      )}
      <MinutesDisplay />
    </div>
  )
}

export default App