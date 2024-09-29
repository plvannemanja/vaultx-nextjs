'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const marketPlaceLinks = [
  {
    name: 'Appreciation',
    value: 'appreciate',
    icon: '/icons/Appriciation_star_rate_.svg',
  },
  {
    name: 'Curation',
    value: 'curation',
    icon: '/icons/curation_filter.svg',
  },
  {
    name: 'Magazine',
    value: 'news',
    icon: '/icons/magzine_newsmode_.svg',
    link: 'https://magazinex.io/',
  },
  {
    name: 'How to work',
    value: 'howtowork',
    icon: '/icons/help_.svg',
  },
];

const accountLinks = [
  {
    name: 'My Profile',
    value: 'profile',
    icon: '/icons/user.svg',
  },
  {
    name: 'My favorite',
    value: 'favourite',
    icon: '/icons/Heart_favorite.svg',
  },
  {
    name: 'My Order',
    value: 'order',
    icon: '/icons/my_orders_shopping_.svg',
  },
  {
    name: 'Settings',
    value: 'settings',
    icon: '/icons/settings_.svg',
  },
  {
    name: 'Help Center',
    value: 'helpCenter',
    icon: '/icons/help_center.svg',
  },
];

export default function SideBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tab, setTab] = useState('appreciate');
  const changeTab = (tab: string) => {
    setTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div
      className={`bg-[#161616] fixed left-0 top-0 h-[100vh] z-20 w-[310px] ${className}`}
    >
      <div className="px-10 flex items-center justify-center py-5 mt-4 mx-auto ">
        <Image src="/logo.svg" width={164} height={32} alt="logo" />
      </div>
      <div className='w-[80%] mx-auto'>
        <hr className='border-[#ffffff80]'/>
      </div>
      <button
        className="flex items-center justify-center gap-x-2 my-7 py-3 px-3 bg-neon rounded-xl w-[80%] mx-auto"
        onClick={() => {
          window.location.href = '/dashboard/create';
        }}
      >
        <span className="font-bold text-[#141414] text-[16px]">Create</span>
        {/* <Image src="/icons/file_plus.svg" width={20} height={20} alt="create" /> */}
        {/* <Image src="/icons/plus.svg" width={20} height={20} alt="create" className='fill-[#141414]' style={{filter: "brightness(0) invert(0)"}} /> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
          <path d="M9.66797 10.8337H5.5013C5.26519 10.8337 5.06727 10.7538 4.90755 10.5941C4.74783 10.4344 4.66797 10.2364 4.66797 10.0003C4.66797 9.76421 4.74783 9.5663 4.90755 9.40658C5.06727 9.24685 5.26519 9.16699 5.5013 9.16699H9.66797V5.00033C9.66797 4.76421 9.74783 4.5663 9.90755 4.40658C10.0673 4.24685 10.2652 4.16699 10.5013 4.16699C10.7374 4.16699 10.9353 4.24685 11.0951 4.40658C11.2548 4.5663 11.3346 4.76421 11.3346 5.00033V9.16699H15.5013C15.7374 9.16699 15.9353 9.24685 16.0951 9.40658C16.2548 9.5663 16.3346 9.76421 16.3346 10.0003C16.3346 10.2364 16.2548 10.4344 16.0951 10.5941C15.9353 10.7538 15.7374 10.8337 15.5013 10.8337H11.3346V15.0003C11.3346 15.2364 11.2548 15.4344 11.0951 15.5941C10.9353 15.7538 10.7374 15.8337 10.5013 15.8337C10.2652 15.8337 10.0673 15.7538 9.90755 15.5941C9.74783 15.4344 9.66797 15.2364 9.66797 15.0003V10.8337Z" fill="#141414"/>
        </svg>
      </button>
      <div className='w-[80%] mx-auto'>
        <hr className='border-[#ffffff80]'/>
      </div>
      <div className="flex flex-col gap-y-3 text-white py-5 pl-7 sidebar_list max-h-[70vh] overflow-auto ">
        <p className="text-[14px] text-[#A3A3A3] font-Inter">Marketplace</p>
        {marketPlaceLinks.map((link, index) => {
          return (
            <Link
            href={`/dashboard/${link.value}`}
              key={index}
              className={cn(
                'flex items-center gap-x-3 my-2 cursor-pointer hover:text-[#ddf247] relative',
                pathname === `/dashboard/${link.value}` ? 'text-[#ddf247]' : '',
              )}
              onMouseEnter={() => setHovered(link.value)}
              onMouseLeave={() => setHovered(null)}
             
            >
              <Image
                src={link.icon}
                width={20}
                height={20}
                alt={link.name}
                // className="hover:stroke-[#ddf247] hover:fill-[#ddf247]"
                className={cn("hover:stroke-[#ddf247] hover:fill-[#ddf247]",pathname === `/dashboard/${link.value}` && 'icon-svg')}

              />
              <span>{link.name}</span>

              {hovered === link.value ? (
                <Image
                  src="/icons/line_shape.svg"
                  height={10}
                  width={5}
                  alt="line"
                  className="absolute -left-8"
                />
              ) : null}
            </Link>
          );
        })}

        <p className="text-[14px] text-[#A3A3A3] font-Inter">Account</p>
        {accountLinks.map((link, index) => {
          return (
            <Link
              key={index}
              className={cn(
                'flex items-center gap-x-3 my-2 cursor-pointer hover:text-[#ddf247] relative',
                pathname === `/dashboard/${link.value}` && 'text-[#ddf247]',
              )}
              onMouseEnter={() => setHovered(link.value)}
              onMouseLeave={() => setHovered(null)}
              href={`/dashboard/${link.value}`}
              // onClick={() => {
              //   if (pathname !== `/dashboard/${link.value}`)
              //     window.location.href = `/dashboard/${link.value}`;
              // }}
            >
              <Image
                src={link.icon}
                width={20}
                height={20}
                alt={link.name}
                className={cn("hover:stroke-[#ddf247]",pathname === `/dashboard/${link.value}` && 'icon-svg')}
              />
              <span>{link.name}</span>

              {hovered === link.value ? (
                <Image
                  src="/icons/line_shape.svg"
                  height={10}
                  width={5}
                  alt="line"
                  className="absolute -left-8"
                />
              ) : null}
            </Link>
          );
        })}
      </div>
      <p className="pl-8 text-[#ffffff53] text-xs mt-5 leading-[20px]">
        © 2024 MonsterX
      </p>
    </div>
  );
}
