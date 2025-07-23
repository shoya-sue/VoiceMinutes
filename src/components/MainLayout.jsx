import styled from 'styled-components';
import FileUpload from './FileUpload';
import SettingsPanel from './SettingsPanel';
import TranscribeButton from './TranscribeButton';
import ProcessingStatus from './ProcessingStatus';
import MinutesDisplay from './MinutesDisplay';

const LayoutContainer = styled.div`
  display: flex;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  gap: 1rem;
  height: calc(100vh - 80px); // Header height subtracted
  
  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const RightPanel = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const UploadSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;

const SettingsSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MainLayout = ({ onTranscribe, error }) => {
  return (
    <LayoutContainer>
      <LeftPanel>
        <UploadSection>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>音声ファイルをアップロード</h3>
          <FileUpload />
        </UploadSection>
        
        <SettingsSection>
          <SettingsPanel />
        </SettingsSection>
        
        <ActionSection>
          <TranscribeButton onTranscribe={onTranscribe} />
          <ProcessingStatus />
          {error && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#fee', 
              color: '#c00',
              borderRadius: '6px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              エラー: {error}
            </div>
          )}
        </ActionSection>
      </LeftPanel>
      
      <RightPanel>
        <MinutesDisplay />
      </RightPanel>
    </LayoutContainer>
  );
};

export default MainLayout;