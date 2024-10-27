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
      <div className="container">
        <div className="flex flex-wrap justify-between !px-5 sm:px-0 gap-5 md:gap-10">
          <Link href="/dashboard/appreciate text-xs lg:text-base sm:text-sm">
            Appreciate
          </Link>
          <Link href="/dashboard/curation text-xs lg:text-base sm:text-sm">
            Curation
          </Link>
          <Link href="https://magazinex.io text-xs lg:text-base sm:text-sm">
            Magazine
          </Link>
          <Link href="https://www.monsterx.io text-xs lg:text-base sm:text-sm">
            Who We Are
          </Link>
          <div className="flex-col sm:flex hidden gap-y-2 justify-center mx-auto lg:m-0">
            <p className="text-center">Join Us Today!</p>
            <div className="flex gap-x-3 mt-3">
              <Link
                target="_blank"
                className="w-[40px] h-[40px]"
                href="https://www.instagram.com/magazinex_rwa/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
              >
                <Image
                  quality={100}
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

              <Link
                target="_blank"
                className="w-[40px] h-[40px]"
                href="https://x.com/MonsterX_RWA"
              >
                <Image
                  quality={100}
                  alt="instagram"
                  src={imageHovered.X}
                  height={40}
                  width={40}
                  onMouseEnter={() =>
                    setImageHovered({
                      ...imageHovered,
                      X: '/icons/X_yellow.svg',
                    })
                  }
                  onMouseLeave={() =>
                    setImageHovered({
                      ...imageHovered,
                      X: '/icons/X_white.svg',
                    })
                  }
                />
              </Link>

              <Link
                target="_blank"
                className="w-[40px] h-[40px]"
                href="https://www.monsterx.io/"
              >
                <Image
                  quality={100}
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
        <div className="flex-col flex sm:hidden gap-y-2 justify-center mx-auto lg:m-0 w-full mt-5">
          <p className="text-center">Join Us Today!</p>
          <div className="flex gap-x-3 mt-3 justify-center">
            <Link
              target="_blank"
              className="w-[40px] h-[40px]"
              href="https://www.instagram.com/magazinex_rwa/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
            >
              <Image
                quality={100}
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

            <Link
              target="_blank"
              className="w-[40px] h-[40px]"
              href="https://x.com/MonsterX_RWA"
            >
              <Image
                quality={100}
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

            <Link
              target="_blank"
              className="w-[40px] h-[40px]"
              href="https://www.monsterx.io/"
            >
              <Image
                quality={100}
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
      <div className="!px-5 sm:px-0 container">
        <Link href="/" className="flex md:hidden justify-center">
          <Logo />
        </Link>
        <div className="flex flex-col gap-y-6 pt-4 pb-0 justify-center items-center relative text-[#878787] w-full">
          <Link href="/" className="md:flex hidden">
            <Logo />
          </Link>
          <div className="flex text-xs sm:text-sm gap-x-4 justify-center flex-wrap gap-y-2 manrope-font font-medium items-center w-full">
            <Label className="block text-center">
              2024 VaultX. All right reserved.
            </Label>
            <Label className="block text-center">Privacy Policy</Label>
            <Label className="block text-center">Terms of Service</Label>
            {/* <div className="lg:absolute lg:right-20 lg:bottom-0">
              <a className="text-sm font-medium" href="mailto:info@monsterx.io">
                info@monsterx.io
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
