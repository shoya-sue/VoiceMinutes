import { useState } from 'react';
import styled from 'styled-components';
import useStore from '../store/useStore';

const DisplayContainer = styled.div`
  height: 100%;
  display: ${props => props.$isVisible ? 'flex' : 'flex'};
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 1.1rem;
  text-align: center;
  padding: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  font-size: 0.9rem;
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
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: white;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 300px;
  padding: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: monospace;
  resize: none;
`;

const PreviewArea = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  font-size: 0.9rem;
  
  h1, h2, h3 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.3rem; }
  h3 { font-size: 1.1rem; }
  
  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  strong {
    font-weight: 600;
  }
  
  p {
    margin: 0.5rem 0;
  }
`;

const ActionButtons = styled.div`
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
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
    if (!markdown) return '';
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

  if (!isVisible) {
    return (
      <DisplayContainer $isVisible={false}>
        <EmptyState>
          音声ファイルをアップロードして<br />
          議事録を生成してください
        </EmptyState>
      </DisplayContainer>
    );
  }

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
          コピー
        </ActionButton>
        <ActionButton className="secondary" onClick={handleDownload}>
          ダウンロード
        </ActionButton>
      </ActionButtons>
    </DisplayContainer>
  );
};

export default MinutesDisplay;