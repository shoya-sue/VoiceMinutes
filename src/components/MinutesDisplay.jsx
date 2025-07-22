import { useState } from 'react';
import styled from 'styled-components';
import useStore from '../store/useStore';

const DisplayContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  display: ${props => props.$isVisible ? 'block' : 'none'};
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? '#2196f3' : '#666'};
  border-bottom: ${props => props.$active ? '2px solid #2196f3' : 'none'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #2196f3;
  }
`;

const ContentArea = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  min-height: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  font-family: monospace;
  resize: vertical;
`;

const PreviewArea = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  
  h1, h2, h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.2rem; }
  
  ul {
    margin: 0.5rem 0;
    padding-left: 2rem;
  }
  
  strong {
    font-weight: 600;
  }
`;

const ActionButtons = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: #2196f3;
    color: white;
    
    &:hover {
      background-color: #1976d2;
    }
  }
  
  &.secondary {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #e8e8e8;
    }
  }
`;

const MinutesDisplay = () => {
  const { minutes } = useStore();
  const [activeTab, setActiveTab] = useState('preview');
  const [editedContent, setEditedContent] = useState(minutes || '');
  
  const isVisible = minutes !== null;

  const handleCopy = () => {
    const textToCopy = activeTab === 'preview' ? minutes : editedContent;
    navigator.clipboard.writeText(textToCopy);
    alert('クリップボードにコピーしました！');
  };

  const handleDownload = () => {
    const textToDownload = activeTab === 'preview' ? minutes : editedContent;
    const blob = new Blob([textToDownload], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `議事録_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseMarkdown = (markdown) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\- \[ \] (.*$)/gim, '<li>☐ $1</li>')
      .replace(/^\- \[x\] (.*$)/gim, '<li>☑ $1</li>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/<li>(.*)<\/li>/g, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\n<ul>/g, '\n');
  };

  return (
    <DisplayContainer $isVisible={isVisible}>
      <TabContainer>
        <Tab 
          $active={activeTab === 'preview'} 
          onClick={() => setActiveTab('preview')}
        >
          プレビュー
        </Tab>
        <Tab 
          $active={activeTab === 'markdown'} 
          onClick={() => setActiveTab('markdown')}
        >
          Markdown編集
        </Tab>
      </TabContainer>
      
      <ContentArea>
        {activeTab === 'preview' ? (
          <PreviewArea 
            dangerouslySetInnerHTML={{ __html: parseMarkdown(minutes || '') }}
          />
        ) : (
          <TextArea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Markdownテキストを編集..."
          />
        )}
      </ContentArea>
      
      <ActionButtons>
        <ActionButton className="primary" onClick={handleCopy}>
          クリップボードにコピー
        </ActionButton>
        <ActionButton className="secondary" onClick={handleDownload}>
          ファイルをダウンロード
        </ActionButton>
      </ActionButtons>
    </DisplayContainer>
  );
};

export default MinutesDisplay;