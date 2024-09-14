import React, { useMemo } from 'react';

interface IBaseButtonProps {
  title: string;
  variant: 'primary' | 'secondary';
  onClick: any;
  className?: any,
  displayIcon?: boolean,
  iconPath?: any,
  iconStyles?: any
}

export default function BaseButton({
  title,
  variant,
  onClick,
  className,
  displayIcon,
  iconPath,
  iconStyles
}: IBaseButtonProps) {
  const isPrimary = useMemo(() => variant === 'primary', [variant]);

  return (
    <div
      className={`py-3 w-[20rem] rounded-lg text-black font-semibold  ${isPrimary ? 'bg-neon ' : 'bg-[#dee8e8]'} ${className}`}
    >
      <button className="w-full h-full gap-[10px] flex items-center justify-center" onClick={onClick}>
        {title}
        {displayIcon && (
          <img src={iconPath ?? '/icons/arrow_ico.svg'} alt="" className= {`w-[18px] h-[18px] ${iconStyles}`  }/>
        )}
      </button>
    </div>
  );
}