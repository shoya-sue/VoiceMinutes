import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import useStore from '../store/useStore';

const DropzoneContainer = styled.div`
  margin: 0;
  padding: 2rem 1.5rem;
  border: 2px dashed #3498db;
  border-radius: 8px;
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
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #3498db;
`;

const UploadText = styled.p`
  font-size: 0.95rem;
  color: #2c3e50;
  margin: 0.25rem 0;
`;

const SupportedFormats = styled.p`
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
`;

const FileInfo = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #e8f5e9;
  border-radius: 5px;
  text-align: left;
  
  p {
    margin: 0.25rem 0;
    color: #2e7d32;
    font-size: 0.85rem;
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
        <UploadText>ファイルをドロップ...</UploadText>
      ) : (
        <>
          <UploadText>ドラッグ＆ドロップまたはクリック</UploadText>
          <SupportedFormats>MP3, WAV, M4A, OGG（最大10分）</SupportedFormats>
        </>
      )}
      
      {audioFile && (
        <FileInfo>
          <p><strong>{audioFile.name}</strong></p>
          <p>{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </FileInfo>
      )}
    </DropzoneContainer>
  );
};

export default FileUpload;