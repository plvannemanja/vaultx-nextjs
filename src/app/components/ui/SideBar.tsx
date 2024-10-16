'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AppreciationIcon from '../Icons/appreciation';
import CarbonBoard from '../Icons/carbon-bord';
import CurationIcon from '../Icons/coration-icon';
import CreateIcon from '../Icons/create-icon';
import FavoriteIcon from '../Icons/favorite';
import HelpIcon from '../Icons/help';
import MyOrderIcon from '../Icons/my-order';
import PencilIcon from '../Icons/pencil';
import ProfileIcon from '../Icons/profile';
import SettingsIcon from '../Icons/settings';

const marketPlaceLinks = [
  {
    name: 'Appreciation',
    value: 'appreciate',
    icon: () => <AppreciationIcon />,
  },
  {
    name: 'Curation',
    value: 'curation',
    icon: () => <CurationIcon />,
  },
  {
    name: 'Magazine',
    value: 'news',
    icon: () => <PencilIcon />,
    link: 'https://magazinex.io/',
  },
  {
    name: 'How to work',
    value: 'howtowork',
    icon: () => <CarbonBoard />,
  },
];

const accountLinks = [
  {
    name: 'My Profile',
    value: 'profile',
    icon: () => <ProfileIcon />,
  },
  {
    name: 'My favorite',
    value: 'favourite',
    icon: () => <FavoriteIcon />,
  },
  {
    name: 'My Order',
    value: 'order',
    icon: () => <MyOrderIcon />,
  },
  {
    name: 'Settings',
    value: 'settings',
    icon: () => <SettingsIcon />,
  },
  {
    name: 'Help Center',
    value: 'helpCenter',
    icon: () => <HelpIcon />,
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
      <div className="px-10 flex items-center justify-center py-5 mx-auto ">
        <Image src="/logo.svg" width={164} height={32} alt="logo" />
      </div>
      <div className="w-[80%] mx-auto">
        <hr className="border-[#353535]" />
      </div>
      <Link
        className="flex items-center justify-center gap-x-2 my-7 py-3 px-3 bg-neon rounded-xl w-[80%] mx-auto"
        href="/dashboard/create"
      >
        <span className="font-bold text-[#141414] text-[16px]">Create</span>
        <CreateIcon />
      </Link>
      <div className="w-[80%] mx-auto">
        <hr className="border-[#353535]" />
      </div>
      <div className="flex flex-col gap-y-3 text-white py-5 sidebar_list max-h-[70vh] overflow-auto ">
        <p className="text-sm font-extrabold text-white/40 pl-7 font-Inter">
          Marketplace
        </p>
        {marketPlaceLinks.map((link, index) => {
          return (
            <Link
              href={`/dashboard/${link.value}`}
              key={index}
              className={cn(
                'flex items-center pl-7 gap-x-3 my-2 cursor-pointer hover:text-[#ddf247] relative transition-all duration-300',
                pathname === `/dashboard/${link.value}`
                  ? 'text-[#ddf247] before:absolute before:w-1 before:h-full before:bg-[#ddf247] before:top-0 before:left-0 before:rounded-r-lg'
                  : '',
              )}
            >
              {<link.icon />}
              {/* <Image
                src={link.icon}
                width={20}
                height={20}
                alt={link.name}
                // className="hover:stroke-[#ddf247] hover:fill-[#ddf247]"
                className={cn(
                  'hover:stroke-[#ddf247] hover:fill-[#ddf247]',
                  pathname === `/dashboard/${link.value}` && 'icon-svg',
                )}
              /> */}
              <span>{link.name}</span>
              {/* {hovered === link.value ? (
                <Image
                  src="/icons/line_shape.svg"
                  height={10}
                  width={5}
                  alt="line"
                  className="absolute -left-8"
                />
              ) : null} */}
            </Link>
          );
        })}
        <p className="text-sm font-extrabold text-white/40 pl-7 font-Inter">
          Account
        </p>
        {accountLinks.map((link, index) => {
          return (
            <Link
              key={index}
              className={cn(
                'flex items-center pl-7 gap-x-3 my-2 cursor-pointer hover:text-[#ddf247] relative transition-all duration-300',
                pathname === `/dashboard/${link.value}`
                  ? 'text-[#ddf247] before:absolute before:w-1 before:h-full before:bg-[#ddf247] before:top-0 before:left-0 before:rounded-r-lg'
                  : '',
              )}
              href={`/dashboard/${link.value}`}
              // onClick={() => {
              //   if (pathname !== `/dashboard/${link.value}`)
              //     window.location.href = `/dashboard/${link.value}`;
              // }}
            >
              {/* <Image
                src={link.icon}
                width={20}
                height={20}
                alt={link.name}
                className={cn(
                  'hover:stroke-[#ddf247]',
                  pathname === `/dashboard/${link.value}` && 'icon-svg',
                )}
              /> */}
              <link.icon />
              <span>{link.name}</span>

              {/* {hovered === link.value ? (
                <Image
                  src="/icons/line_shape.svg"
                  height={10}
                  width={5}
                  alt="line"
                  className="absolute -left-8"
                />
              ) : null} */}
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
