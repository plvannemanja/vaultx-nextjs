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

const icon = (
  <svg
    width="177"
    height="424"
    viewBox="0 0 177 424"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.2">
      <rect
        x="-39.7812"
        y="103.727"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="10.0195"
        y="45.6094"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="28.0156"
        y="173.387"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="77.8164"
        y="0.5"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="-6.68359"
        y="217.613"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="-6.68359"
        y="21.6094"
        width="98.6027"
        height="126.227"
        stroke="#DDF247"
      />
    </g>
  </svg>
);

const icon2 = (
  <svg
    width="137"
    height="425"
    viewBox="0 0 137 425"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.2">
      <rect
        x="0.986328"
        y="104.227"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="50.7871"
        y="46.1094"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="68.7832"
        y="173.885"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="118.584"
        y="1"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="34.0859"
        y="218.113"
        width="98.6027"
        height="205.454"
        stroke="#DDF247"
      />
      <rect
        x="34.0859"
        y="22.1094"
        width="98.6027"
        height="126.227"
        stroke="#DDF247"
      />
    </g>
  </svg>
);

export default function NewsCard({
  heading,
  description,
  data,
}: INewsCardProps) {
  return (
    <div className="flex flex-col gap-y-10 text-white relative">
      <div className="absolute hidden lg:block top-[-9rem] left-0">{icon}</div>
      <div className="absolute hidden lg:block bottom-[-9rem] right-0">
        {icon2}
      </div>
      <div className="flex flex-col gap-y-5 text-center">
        {heading}
        <p className="text-center manrope-font px-10 text-white md:text-xl">
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
              <Link href={item.subtitle2} target="_blank">
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
