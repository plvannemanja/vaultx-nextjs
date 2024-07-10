import Image from 'next/image';
import React from 'react';

interface INewsCardProps {
  heading: React.ReactNode;
  description: string;
  data: Array<{
    image: string;
    title: string;
  }>;
}

export default function NewsCard({
  heading,
  description,
  data,
}: INewsCardProps) {
  return (
    <div className="flex flex-col gap-y-10 text-white">
      <div className="flex flex-col gap-y-5 text-center">
        {heading}
        <p className="text-center text-xl">{description}</p>
      </div>

      <div className="flex gap-3 lg:gap-6 w-full flex-wrap mx-auto justify-center">
        <div className='lg:w-[45%]'>
          <Image
            src="/pic.webp"
            alt="news"
            width={200}
            height={200}
            className="rounded aspect-square w-full h-full"
          />
        </div>
        <div className="lg:w-[45%] grid grid-cols-2 grid-rows-3 gap-3 lg:gap-6">
          {data.slice(1).map((item, index) => (
            <div key={index} className='w-full h-full relative'>
              <Image
                src={item.image}
                alt="news"
                width={100}
                height={100}
                className="rounded aspect-square w-full h-full"
              />
              <p className='text-lg text-light-gray p-5 absolute bottom-0 font-bold'>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
