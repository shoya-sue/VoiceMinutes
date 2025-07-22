import styled from 'styled-components';
import useStore from '../store/useStore';

const SettingsContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SettingsTitle = styled.h3`
  margin: 0 0 1.5rem;
  color: #2c3e50;
`;

const SettingGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const SettingLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.5rem;
`;

const SettingsPanel = () => {
  const { selectedEngine, setSelectedEngine, language, setLanguage } = useStore();

  return (
    <SettingsContainer>
      <SettingsTitle>設定</SettingsTitle>
      
      <SettingGroup>
        <SettingLabel>音声認識エンジン</SettingLabel>
        <Select value={selectedEngine} onChange={(e) => setSelectedEngine(e.target.value)}>
          <option value="whisper">Whisper.js（推奨・長時間対応）</option>
          <option value="webspeech">Web Speech API（高速・5分まで）</option>
        </Select>
        <InfoText>
          Whisper.jsは最大10分の音声に対応し、高精度な認識が可能です。
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