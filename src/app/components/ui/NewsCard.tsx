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
      <img
        src="/illustrations/news-1.png"
        alt="neon-grid"
        className="absolute hidden lg:block top-[-9rem] left-0 w-[14rem] h-[16rem]"
      />
      <img
        src="/illustrations/news-1.png"
        alt="neon-grid"
        className="absolute hidden lg:block bottom-[-9rem] right-0 w-[14rem] h-[16rem]"
      />

      <div className="flex flex-col gap-y-5 text-center">
        {heading}
        <p className="text-center px-10 text-gray-300 md:text-xl">
          {description}
        </p>
      </div>

      <div className="flex gap-3 lg:gap-6 max-w-[1582px] flex-wrap mx-auto justify-center">
        <div className="w-[800px] h-[753px] relative">
          <Link href={data?.[0].subtitle2} target="_blank">
            <Image
              src={data?.[0].image}
              alt="news"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </Link>

        </div>
        <div className="grid grid-cols-2 grid-rows-3 gap-3 lg:gap-6">
          {data.slice(1).map((item, index) => (
            <div key={index} className="w-[234px] h-[234px] relative">
              <Link href={item.subtitle2} target='_blank'>
                <Image
                  src={item.image}
                  alt="news"
                  width={100}
                  height={100}
                  className="rounded aspect-square w-full h-full object-cover"
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
