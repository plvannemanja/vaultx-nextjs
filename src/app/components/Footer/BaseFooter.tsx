'use client';

import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import Logo from '@/components/Icon/Logo';

export default function BaseFooter() {
  const [imageHovered, setImageHovered] = useState({
    instagram: '/icons/insta_white.svg',
    X: '/icons/X_white.svg',
    monsterx: '/icons/monsterx_white.svg',
  });

  return (
    <div className="flex flex-col gap-y-6 text-white justify-around my-10">
      <div className="flex flex-wrap justify-between px-20 gap-10 container">
        <Link href="/dashboard?appreciate">Appreciate</Link>
        <Link href="/dashboard?curation">Curation</Link>
        <Link href="https://artistvaultx.wpcomstaging.com/" target="_blank">
          Magazine
        </Link>
        <Link href="https://www.monsterx.io" target="_blank">
          Who We Are
        </Link>

        <div className="flex flex-col gap-y-2 justify-center mx-auto lg:m-0">
          <p className="text-center">Join Us Today!</p>
          <div className="flex gap-x-3">
            <Link
              target="_blank"
              href="https://www.instagram.com/magazinex_rwa/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
            >
              <Image
                alt="instagram"
                src={imageHovered.instagram}
                height={40}
                width={40}
                onMouseEnter={() =>
                  setImageHovered({
                    ...imageHovered,
                    instagram: '/icons/insta_yellow.svg',
                  })
                }
                onMouseLeave={() =>
                  setImageHovered({
                    ...imageHovered,
                    instagram: '/icons/insta_white.svg',
                  })
                }
              />
            </Link>

            <Link target="_blank" href="https://x.com/MonsterX_RWA">
              <Image
                alt="instagram"
                src={imageHovered.X}
                height={40}
                width={40}
                onMouseEnter={() =>
                  setImageHovered({ ...imageHovered, X: '/icons/X_yellow.svg' })
                }
                onMouseLeave={() =>
                  setImageHovered({ ...imageHovered, X: '/icons/X_white.svg' })
                }
              />
            </Link>

            <Link target="_blank" href="https://www.monsterx.io/">
              <Image
                alt="instagram"
                src={imageHovered.monsterx}
                height={40}
                width={40}
                onMouseEnter={() =>
                  setImageHovered({
                    ...imageHovered,
                    monsterx: '/icons/monsterx_yellow.svg',
                  })
                }
                onMouseLeave={() =>
                  setImageHovered({
                    ...imageHovered,
                    monsterx: '/icons/monsterx_white.svg',
                  })
                }
              />
            </Link>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex flex-col gap-y-4 justify-center items-center relative px-20 container">
        <Link href="/">
          <Logo />
        </Link>
        <div className="md:flex gap-x-4 flex-wrap gap-y-2">
          <Label className="text-sm block text-center text-gray-500">
            2024 VaultX. All right reserved.
          </Label>
          <Label className="text-sm block text-center text-gray-500">
            Privacy Policy
          </Label>
          <Label className="text-sm block text-center text-gray-500">
            Terms of Service
          </Label>
        </div>

        <div className="md:absolute right-20 bottom-0">
          <a className="text-gray-500 text-sm" href="mailto:info@monsterx.io">
            info@monsterx.io
          </a>
        </div>
      </div>
    </div>
  );
}
