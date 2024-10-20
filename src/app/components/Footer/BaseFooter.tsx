'use client';

import Logo from '@/components/Icon/Logo';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function BaseFooter() {
  const [imageHovered, setImageHovered] = useState({
    instagram: '/icons/insta_white.svg',
    X: '/icons/X_white.svg',
    monsterx: '/icons/monsterx_white.svg',
  });

  return (
    <div className="flex flex-col gap-y-6 text-white justify-around my-10 mt-16">
      <div className="flex flex-wrap justify-between px-20 gap-10 container">
        <Link href="/dashboard/appreciate">Appreciate</Link>
        <Link href="/dashboard/curation">Curation</Link>
        <Link href="https://magazinex.io">Magazine</Link>
        <Link href="https://www.monsterx.io">Who We Are</Link>
        <div className="flex flex-col gap-y-2 justify-center mx-auto lg:m-0">
          <p className="text-center">Join Us Today!</p>
          <div className="flex gap-x-3 mt-3">
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
      <hr className="border-white/[13%] mt-[50px]" />
      <div className="flex flex-col gap-y-6 pt-4 pb-0 justify-center items-center relative px-20 container text-[#878787]">
        <Link href="/">
          <Logo />
        </Link>
        <div className="md:flex gap-x-4 flex-wrap gap-y-2 manrope-font font-medium">
          <Label className="text-sm block text-center">
            2024 VaultX. All right reserved.
          </Label>
          <Label className="text-sm block text-center">Privacy Policy</Label>
          <Label className="text-sm block text-center">Terms of Service</Label>
        </div>
        <div className="md:absolute right-20 bottom-0">
          <a className="text-sm font-medium" href="mailto:info@monsterx.io">
            info@monsterx.io
          </a>
        </div>
      </div>
    </div>
  );
}
