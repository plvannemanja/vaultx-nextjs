"use client"

import React, { useRef, useState } from 'react'

interface IFileInputProps {
  title: string;
  subtitle: string;
  onFileSelect: any;
}

export default function FileInput({ title, subtitle, onFileSelect }: IFileInputProps) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState<any>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      onFileSelect(file);
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as any).click();
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-sm font-medium">{title}</p>
      <button className="file-upload"
        onClick={handleButtonClick}
      >
        <input
          type="file"
          className="file-input"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <span>
          <img src="images/image_ico.svg" alt="" /> Choose file
        </span>{" "}
        {file ? file.name : "No files selected"}
        </button>
      <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
    </div>
  )
}
