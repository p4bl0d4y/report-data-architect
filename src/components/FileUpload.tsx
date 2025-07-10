
import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidExcelFile(file)) {
        setSelectedFile(file);
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidExcelFile(file)) {
        setSelectedFile(file);
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const isValidExcelFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    return validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
  };

  return (
    <Card className="p-8 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
      <div
        className={`relative ${dragActive ? 'bg-blue-50' : ''} transition-colors rounded-lg`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          accept=".xlsx,.xls,.csv"
          disabled={isProcessing}
        />
        
        <div className="text-center py-12">
          <div className="mb-4">
            {selectedFile ? (
              <FileSpreadsheet className="mx-auto h-16 w-16 text-green-500" />
            ) : (
              <Upload className="mx-auto h-16 w-16 text-blue-500" />
            )}
          </div>
          
          {selectedFile ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">File Selected</p>
              <p className="text-sm text-gray-600">{selectedFile.name}</p>
              <p className="text-xs text-gray-400">
                {Math.round(selectedFile.size / 1024)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drop your Excel file here
              </p>
              <p className="text-gray-600">
                or <span className="text-blue-600 font-medium">browse files</span>
              </p>
              <p className="text-sm text-gray-400">
                Supports .xlsx, .xls, and .csv files
              </p>
            </div>
          )}
        </div>
        
        {!selectedFile && (
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              disabled={isProcessing}
            >
              Choose File
            </Button>
          </div>
        )}
        
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-700">Processing file...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Ensure your Excel file contains financial data with proper headers for accurate EBITDA and DCF calculations.
        </p>
      </div>
    </Card>
  );
};

export default FileUpload;
