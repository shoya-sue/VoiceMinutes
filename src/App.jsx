import './App.css'
import Header from './components/Header'
import MainLayout from './components/MainLayout'
import useTranscription from './hooks/useTranscription'

function App() {
  const { transcribe, error } = useTranscription();

  return (
    <div className="App">
      <Header />
      <MainLayout onTranscribe={transcribe} error={error} />
    </div>
  )
}

export default App