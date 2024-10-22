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
        <div className="relative col-span-12 xl:col-span-7 min-h-[934px]">
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
            <div key={index} className="min-h-[298px] relative">
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
              <p className="text-light-gray p-5 absolute bottom-0 font-semibold">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
