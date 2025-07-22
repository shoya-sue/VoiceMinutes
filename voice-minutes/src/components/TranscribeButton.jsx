import styled from 'styled-components';
import useStore from '../store/useStore';

const ButtonContainer = styled.div`
  text-align: center;
  margin: 2rem auto;
`;

const Button = styled.button`
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: ${props => props.disabled ? '#95a5a6' : '#27ae60'};
  border: none;
  border-radius: 50px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover:not(:disabled) {
    background-color: #229954;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const TranscribeButton = ({ onTranscribe }) => {
  const { audioFile, transcriptionStatus } = useStore();
  const isDisabled = !audioFile || transcriptionStatus !== 'idle';
  
  const getButtonText = () => {
    if (transcriptionStatus === 'idle') {
      return '議事録を生成';
    }
    return '処理中...';
  };

  return (
    <ButtonContainer>
      <Button 
        onClick={onTranscribe} 
        disabled={isDisabled}
      >
        {getButtonText()}
      </Button>
    </ButtonContainer>
  );
};

export default TranscribeButton;