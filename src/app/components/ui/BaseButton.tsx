import React, { useMemo } from 'react';

interface IBaseButtonProps {
  title: string;
  variant: 'primary' | 'secondary' | 'secondaryOutline';
  onClick: any;
  className?: any;
  displayIcon?: boolean;
  iconPath?: any;
  iconStyles?: any;
  loading?: boolean;
}

export default function BaseButton({
  title,
  variant,
  onClick,
  className,
  displayIcon,
  iconPath,
  iconStyles,
  loading
}: IBaseButtonProps) {
  const isPrimary = useMemo(() => variant === 'primary', [variant]);
  const isSecondaryOutline = useMemo(
    () => variant === 'secondaryOutline',
    [variant],
  );

  return (
    <div
      className={`py-3 w-[20rem] rounded-lg text-black font-semibold 
         ${isPrimary ? 'bg-neon ' : 'bg-[#dee8e8]'} 
          ${isSecondaryOutline ? '!bg-[#DDF24733] border-2 border-[#ddf247] !text-[#DDF24799]' : 'bg-[#dee8e8]'} 
         ${className}`}
    >
      <button
        className="w-full h-full gap-[10px] flex items-center justify-center"
        onClick={onClick}
        disabled={loading}
      >
        {title}
        {displayIcon && (
          <img
            src={iconPath ?? '/icons/arrow_ico.svg'}
            alt=""
            className={`w-[18px] h-[18px] ${iconStyles}`}
          />
        )}
      </button>
    </div>
  );
}
