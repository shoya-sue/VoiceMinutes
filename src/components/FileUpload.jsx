import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import useStore from '../store/useStore';

const DropzoneContainer = styled.div`
  margin: 2rem auto;
  max-width: 600px;
  padding: 3rem;
  border: 2px dashed #3498db;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.$isDragActive ? '#e3f2fd' : '#f8f9fa'};
  
  &:hover {
    border-color: #2980b9;
    background-color: #e3f2fd;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #3498db;
`;

const UploadText = styled.p`
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const SupportedFormats = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const FileInfo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #e8f5e9;
  border-radius: 5px;
  
  p {
    margin: 0.5rem 0;
    color: #2e7d32;
  }
`;

const FileUpload = () => {
  const { audioFile, setAudioFile } = useStore();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setAudioFile(file);
    }
  }, [setAudioFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    },
    maxFiles: 1
  });

  return (
    <DropzoneContainer {...getRootProps()} $isDragActive={isDragActive}>
      <input {...getInputProps()} />
      <UploadIcon>📁</UploadIcon>
      {isDragActive ? (
        <UploadText>ファイルをドロップしてください...</UploadText>
      ) : (
        <>
          <UploadText>音声ファイルをドラッグ＆ドロップ</UploadText>
          <UploadText>または、クリックして選択</UploadText>
          <SupportedFormats>対応形式: MP3, WAV, M4A, OGG（最大10分）</SupportedFormats>
        </>
      )}
      
      {audioFile && (
        <FileInfo>
          <p><strong>選択されたファイル:</strong> {audioFile.name}</p>
          <p><strong>サイズ:</strong> {(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </FileInfo>
      )}
    </DropzoneContainer>
  );
};

export default FileUpload;