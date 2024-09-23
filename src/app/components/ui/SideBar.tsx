'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const marketPlaceLinks = [
  {
    name: 'Appreciation',
    value: 'appreciate',
    icon: '/icons/sidebar_ico_1.svg',
  },
  {
    name: 'Curation',
    value: 'curation',
    icon: '/icons/sidebar_ico_3.svg',
  },
  {
    name: 'Magazine',
    value: 'news',
    icon: '/icons/sidebar_ico_4.svg',
    link: 'https://magazinex.io/',
  },
  {
    name: 'How to work',
    value: 'howtowork',
    icon: '/icons/sidebar_ico_5.svg',
  },
];

const accountLinks = [
  {
    name: 'My Profile',
    value: 'profile',
    icon: '/icons/sidebar_ico_6.svg',
  },
  {
    name: 'My favorite',
    value: 'favourite',
    icon: '/icons/sidebar_ico_7.svg',
  },
  {
    name: 'My Order',
    value: 'order',
    icon: '/icons/sidebar_ico_8.svg',
  },
  {
    name: 'Settings',
    value: 'settings',
    icon: '/icons/sidebar_ico_10.svg',
  },
  {
    name: 'Help Center',
    value: 'helpCenter',
    icon: '/icons/sidebar_ico_11.svg',
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
      className={`bg-black fixed left-0 top-0 h-[100vh] z-20 w-[16rem] ${className}`}
    >
      <div className="px-10 py-5 mt-4 border-b-2 border-b-gray-700">
        <Image src="/logo.svg" width={120} height={120} alt="logo" />
      </div>
      <button
        className="flex items-center justify-center gap-x-2 my-5 py-3 px-3 bg-neon rounded-xl w-[80%] mx-auto"
        onClick={() => {
          window.location.href = '/dashboard/create';
        }}
      >
        <span className="font-bold text-black">Create</span>
        <Image src="/icons/file_plus.svg" width={20} height={20} alt="create" />
      </button>
      <div className="flex flex-col gap-y-3 text-white py-5 pl-8 sidebar_list max-h-[70vh] overflow-auto border-t-2 border-t-gray-700">
        <p className="font-medium opacity-40">Marketplace</p>
        {marketPlaceLinks.map((link, index) => {
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-x-3 my-2 cursor-pointer hover:text-[#ddf247] relative",
                pathname === `/dashboard/${link.value}` ? 'text-[#ddf247]' : ""
              )}
              onMouseEnter={() => setHovered(link.value)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (link.link) {
                  window.open(link.link, '_blank');
                } else {
                  window.location.href = `/dashboard/${link.value}`;
                }
              }}
            >
              <Image
                src={link.icon}
                width={20}
                height={20}
                alt={link.name}
                className="hover:stroke-[#ddf247] hover:fill-[#ddf247]"
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
            </div>
          );
        })}

        <p className="font-medium opacity-40 mt-5">Account</p>
        {accountLinks.map((link, index) => {
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-x-3 my-2 cursor-pointer hover:text-[#ddf247] relative",
                pathname === `/dashboard/${link.value}` && 'text-[#ddf247]'
              )}
              onMouseEnter={() => setHovered(link.value)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (pathname !== `/dashboard/${link.value}`)
                  window.location.href = `/dashboard/${link.value}`;
              }}
            >
              <Image
                src={link.icon}
                width={20}
                height={20}
                alt={link.name}
                className="hover:stroke-[#ddf247]"
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
            </div>
          );
        })}
      </div>
      <p className="pl-8 text-white opacity-45 text-xs mt-5">
        © 2024 MonsterX
      </p>
    </div>
  );
}
