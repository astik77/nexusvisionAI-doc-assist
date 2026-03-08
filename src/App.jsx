import React, { useState } from 'react';
import axios from 'axios';
import UploadZone from './components/UploadZone';
import ChatInterface from './components/ChatInterface';
import { Eye } from 'lucide-react';

const API_URL = import.meta.env.PROD ? "" : "http://localhost:8001";

function App() {
  const [appState, setAppState] = useState('upload'); // 'upload' | 'chat'
  const [isUploading, setIsUploading] = useState(false);
  const [documentContext, setDocumentContext] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setIsUploading(true);
    setFileName(file.name);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDocumentContext(response.data.extracted_context);
      setAppState('chat');
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.response?.data?.detail || 'Failed to upload and analyze the document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (message) => {
    setIsTyping(true);
    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: message,
        document_context: documentContext,
      });
      return response.data.response;
    } catch (err) {
      console.error('Chat Error:', err);
      throw new Error('Failed to send message.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              NexusVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AI</span>
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload any document or image. Our advanced Vision AI will extract its contents and let you chat with it instantly.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center justify-center text-sm">
            {error}
          </div>
        )}

        {/* Main Content Area */}
        {appState === 'upload' ? (
          <UploadZone onUpload={handleUpload} isUploading={isUploading} />
        ) : (
          <div className="animate-fade-in-up">
            <button 
              onClick={() => {
                setAppState('upload');
                setDocumentContext(null);
                setFileName('');
              }}
              className="mb-4 text-sm text-slate-400 hover:text-white transition-colors flex items-center"
            >
              ← Upload a different document
            </button>
            <ChatInterface 
              fileName={fileName} 
              onSendMessage={handleSendMessage} 
              isTyping={isTyping} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
