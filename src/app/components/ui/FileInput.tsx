'use client';

import {
  acceptedFormats as acceptedFileFormats,
  maxFileSize,
} from '@/utils/helpers';
import { useEffect, useRef, useState } from 'react';
import BaseButton from './BaseButton';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface IFileInputProps {
  title?: string;
  subtitle?: string;
  onFileSelect: any;
  deSelect?: any;
  maxSizeInBytes?: number;
  acceptedFormats?: string[];
  editMode?: any;
  titleStyles?: any;
  showIcon?: boolean;
  onPressIcon?: () => void;
}

export default function FileInput({
  title,
  subtitle,
  onFileSelect,
  deSelect,
  maxSizeInBytes = maxFileSize,
  acceptedFormats = acceptedFileFormats,
  editMode,
  titleStyles,
  showIcon,
  onPressIcon,
}: IFileInputProps) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState<any>(null);

  const handleFileChange = (event: any) => {
    event.preventDefault();
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
    console.log(fileInputRef, fileInputRef.current);
    if (fileInputRef.current) {
      (fileInputRef.current as any).click();
    }
  };

  useEffect(() => {
    if (deSelect) {
      setFileName(null);
    }
  }, [deSelect]);

  /*
  <div class="h-[52px] py-[15px] ">
    <div class="px-10 py-3.5 bg-[#dee8e8] rounded-[14px] justify-center items-center gap-2.5 flex">
        <div class="text-[#161616] text-sm font-extrabold font-['Manrope'] capitalize">Upload</div>
    </div>
    <div class="grow shrink basis-0 text-white/50 text-sm font-normal font-['Azeret Mono'] leading-snug">Choose File</div>
</div> */
  return (
    <div className="flex flex-col gap-y-2">
      {title && <p className={`text-sm font-medium ${titleStyles}`}>{title}</p>}
      <input
        type="file"
        className="file-input hidden "
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className={cn("relative file-upload !p-0 !bg-[#161616]  !w-full !rounded-xl justify-start items-center gap-[30px] inline-flex",
        showIcon && 'pr-10',
      )}>
        <BaseButton
          title="Upload"
          variant="secondary"
          onClick={handleButtonClick}
          displayIcon
          iconPath={'/icons/uploadBlack.svg'}
          className={'w-[30%] p-0'}
          iconStyles={'stroke-black'}
        />{' '}
        <p className="azeret-mono-font !text-sm">
          {fileName ? fileName : editMode ? 'File Selected' : 'Choose File'}
        </p>
        {showIcon && (
          <button onClick={onPressIcon}>
            <Image
              src="/icons/trash.svg"
              alt="image"
              width={20}
              height={20}
              className="absolute top-3 right-3 w-5 h-5"
            />
          </button>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
