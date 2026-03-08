import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function UploadZone({ onUpload, isUploading }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div
        {...getRootProps()}
        className={`glass-panel border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform ${
          isDragActive
            ? 'border-primary bg-primary/10 scale-105'
            : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-medium text-slate-300">Analyzing Document...</p>
            <p className="text-sm text-slate-500 text-center">Vision AI is extracting text and structure</p>
          </div>
        ) : (
          <>
            <div className="bg-primary/20 p-4 rounded-full mb-6">
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
            
            {isDragActive ? (
              <p className="text-xl font-medium text-primary">Drop your document here...</p>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-xl font-medium text-slate-200">
                  Drag & drop your document
                </p>
                <p className="text-slate-400">or click to browse files</p>
              </div>
            )}
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <File className="w-4 h-4" />
                <span>PDFs</span>
              </div>
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Images (JPG, PNG)</span>
              </div>
            </div>
          </>
        )}
      </div>

      {!isUploading && acceptedFiles.length > 0 && (
        <div className="mt-4 p-4 glass-panel flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <File className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-slate-200">
              {acceptedFiles[0].name}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}
    </div>
  );
}
