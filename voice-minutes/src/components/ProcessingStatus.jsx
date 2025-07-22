import styled from 'styled-components';
import useStore from '../store/useStore';

const StatusContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #e3f2fd;
  border-radius: 8px;
  display: ${props => props.$isVisible ? 'block' : 'none'};
`;

const StatusTitle = styled.h3`
  margin: 0 0 1rem;
  color: #1976d2;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #bbdefb;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #2196f3;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const StatusText = styled.p`
  margin: 0;
  color: #1565c0;
`;

const ProcessingStatus = () => {
  const { transcriptionStatus, transcriptionProgress } = useStore();
  const isVisible = transcriptionStatus !== 'idle';

  const getStatusText = () => {
    switch (transcriptionStatus) {
      case 'preparing':
        return '音声ファイルを準備中...';
      case 'transcribing':
        return '音声を認識中...';
      case 'analyzing':
        return 'テキストを解析中...';
      case 'generating':
        return '議事録を生成中...';
      case 'completed':
        return '処理が完了しました！';
      case 'error':
        return 'エラーが発生しました。';
      default:
        return '';
    }
  };

  return (
    <StatusContainer $isVisible={isVisible}>
      <StatusTitle>処理状況</StatusTitle>
      <ProgressBar>
        <ProgressFill $progress={transcriptionProgress} />
      </ProgressBar>
      <StatusText>{getStatusText()}</StatusText>
    </StatusContainer>
  );
};

export default ProcessingStatus;