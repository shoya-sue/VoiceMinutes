import styled from 'styled-components';
import useStore from '../store/useStore';

const SettingsContainer = styled.div`
  padding: 0;
`;

const SettingsTitle = styled.h3`
  margin: 0 0 1rem;
  color: #2c3e50;
  font-size: 1.1rem;
`;

const SettingGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const InfoText = styled.p`
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.3rem;
  line-height: 1.3;
`;

const SettingsPanel = () => {
  const { selectedEngine, setSelectedEngine, language, setLanguage } = useStore();

  return (
    <SettingsContainer>
      <SettingsTitle>設定</SettingsTitle>
      
      <SettingGroup>
        <SettingLabel>音声認識エンジン</SettingLabel>
        <Select value={selectedEngine} onChange={(e) => setSelectedEngine(e.target.value)}>
          <option value="whisper">Whisper.js（推奨）</option>
          <option value="webspeech">Web Speech API</option>
        </Select>
        <InfoText>
          Whisper.js：最大10分・高精度
        </InfoText>
      </SettingGroup>
      
      <SettingGroup>
        <SettingLabel>言語</SettingLabel>
        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="ja">日本語</option>
          <option value="en">英語</option>
        </Select>
      </SettingGroup>
    </SettingsContainer>
  );
};

export default SettingsPanel;