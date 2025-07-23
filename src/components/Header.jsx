import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>VoiceMinutes</Title>
      <Subtitle>音声会議録自動生成ツール</Subtitle>
    </HeaderContainer>
  );
};

export default Header;