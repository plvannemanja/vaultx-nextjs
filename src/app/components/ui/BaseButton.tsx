import React, { useMemo } from 'react'

interface IBaseButtonProps {
    title: string;
    variant: 'primary' | 'secondary';
    onClick: any;
}

export default function BaseButton({ title, variant, onClick }: IBaseButtonProps) {
    const isPrimary = useMemo(() => variant === 'primary', [variant]);

    return (
        <div className={`py-3 w-[20rem] rounded-lg text-black font-semibold ${isPrimary ? 'bg-neon ' : 'bg-[#dee8e8]'}`}>
            <button
                className="w-full h-full"
                onClick={onClick}
            >
                {title}
            </button>
        </div>
    )
}
