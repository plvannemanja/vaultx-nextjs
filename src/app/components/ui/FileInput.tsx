'use client';

import React, { useEffect, useRef, useState } from 'react';

interface IFileInputProps {
  title?: string;
  subtitle?: string;
  onFileSelect: any;
  deSelect?: any;
  maxSizeInBytes?: number;
  acceptedFormats?: string[];
  editMode?: any;
}

export default function FileInput({
  title,
  subtitle,
  onFileSelect,
  deSelect,
  maxSizeInBytes = 10 * 1024 * 1024,
  acceptedFormats = ['.png', 'jpeg'],
  editMode,
}: IFileInputProps) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState<any>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (
      file.size < maxSizeInBytes &&
      acceptedFormats.includes(`.${fileExtension}`)
    ) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleButtonClick = (e) => {
    console.log(fileInputRef, fileInputRef.current)
    if (fileInputRef.current) {
      (fileInputRef.current as any).click();
    }
  };

  useEffect(() => {
    if (deSelect) {
      setFileName(null);
    }
  }, [deSelect]);

  return (
    <div className="flex flex-col gap-y-2">
      {title && <p className="text-sm font-medium">{title}</p>}
      <input
        type="file"
        className="file-input hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button className="file-upload" onClick={handleButtonClick}>
        <span>
          <img src="images/image_ico.svg" alt="" /> Choose file
        </span>{' '}
        {editMode ? 'File Selected' : fileName ? fileName : 'No files selected'}
      </button>
      {subtitle && (
        <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
