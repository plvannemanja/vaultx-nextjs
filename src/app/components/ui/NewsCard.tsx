import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface INewsCardProps {
  heading: React.ReactNode;
  description: string;
  data: Array<{
    image: string;
    title: string;
    subtitle2: string;
  }>;
}

export default function NewsCard({
  heading,
  description,
  data,
}: INewsCardProps) {
  return (
    <div className="flex flex-col gap-y-10 text-white relative">
      <div className="flex flex-col gap-y-5 text-center">
        {heading}
        <p className="text-center manrope-font px-10 text-white md:text-xl">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-12 gap-4 container justify-center">
        <div className="relative col-span-12 xl:col-span-7 min-h-[934px] group">
          <div className="group-hover:cursor-pointer group-hover:opacity-100 transition-opacity duration-300 ease-in-out opacity-0 absolute z-10 top-0 left-0 h-full w-full bg-gradient-to-b from-[#666666]/0 via-[#131313]/[48%] to-black flex items-end">
            <p className="text-white p-5 font-extrabold text-[22px] w-10/12 mx-auto">
              {data?.[0]?.title}
            </p>
          </div>
          <Link href={data?.[0]?.subtitle2} target="_blank">
            <Image
              src={data?.[0]?.image}
              alt="news"
              layout="fill"
              objectFit="cover"
              className="rounded w-full md:aspect-auto aspect-square object-cover"
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 grid-rows-3 gap-4 col-span-12 xl:col-span-5">
          {data.slice(1).map((item, index) => (
            <div key={index} className="min-h-[298px] relative group">
              <div className="group-hover:cursor-pointer group-hover:opacity-100 transition-opacity duration-300 ease-in-out opacity-0 absolute z-10 top-0 left-0 h-full w-full bg-gradient-to-b from-[#666666]/0 via-[#131313]/[48%] to-black flex items-end">
                <p className="text-white p-5 font-extrabold text-[22px]">
                  {item.title}
                </p>
              </div>
              <Link href={item.subtitle2} target="_blank" className="h-full">
                <Image
                  src={item.image}
                  alt="news"
                  // width={298}
                  // height={298}
                  layout="fill"
                  objectFit="cover"
                  className="aspect-square object-cover rounded w-ful"
                />
              </Link>
              {/* <p className="text-light-gray p-5 absolute bottom-0 font-semibold">
                {item.title}
              </p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
