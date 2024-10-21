'use client';

import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { collectionServices } from '@/services/supplier';
import { extractIdFromURL } from '@/utils/helpers';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ArtistsCard from './components/Cards/ArtistsCard';
import ExceptionalCard from './components/Cards/ExceptionalCard';
import { AutoCarousel } from './components/Carousels/AutoCarousel';
import { useGlobalContext } from './components/Context/GlobalContext';
import NFTList from './components/Dashboard/NFTList';
import TrendingList from './components/Dashboard/TrendingList';
import BaseFooter from './components/Footer/BaseFooter';
import { BaseHeader } from './components/Header/BaseHeader';
import NewsCard from './components/ui/NewsCard';

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

interface Isection1 {
  title: string;
  description: string;
  color: Array<{ word: number; color: string }>;
  box: Array<{
    image: string;
    title: string;
    subtitle1: string;
    subtitle2: string;
  }>;
}

interface Isection2 {
  title: string;
  description: string;
  color: Array<{ word: number; color: string }>;
  box: Array<{
    image: string;
    title: string;
    subtitle1: string;
    subtitle2: string;
  }>;
}

interface Isection3 {
  title: string;
  description: string;
  color: Array<{ word: number; color: string }>;
  box: Array<string>;
}

interface Isection4 {
  title: string;
  description: string;
  color: Array<{ word: number; color: string }>;
  box: Array<{
    image: string;
    title: string;
    subtitle1: string;
    subtitle2: string;
  }>;
}

interface Icuration {
  logo: string;
  name: string;
}

const createTitleComp = (
  title: string,
  color: Array<{ word: number; color: string }>,
) => {
  return (
    <h1 className="text-[35px] font-extrabold manrope-font lg:text-[40px] lg:font-extrabold text-center">
      {title.split(' ').map((word, index) => {
        const colorIndex = color.findIndex((item) => item.word === index + 1);
        return (
          <span
            key={index}
            style={{
              color: colorIndex !== -1 ? color[colorIndex].color : 'white',
            }}
          >
            {word}{' '}
          </span>
        );
      })}
    </h1>
  );
};

export default function Home() {
  const [section1, setSection1] = useState<Isection1 | null>(null);
  const [section2, setSection2] = useState<Isection2 | null>(null);
  const [section3, setSection3] = useState<Isection3 | null>(null);
  const [section4, setSection4] = useState<Isection4 | null>(null);
  const { mediaImages: images } = useGlobalContext();
  const [curations, setCurations] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const server_uri =
        process.env.NEXT_PUBLIC_APP_BACKEND_URL ||
        'https://api.vault-x.io/api/v2';
      const { data } = await axios.get(`${server_uri}/homepage/get-sections`);

      let curationsList: any[] = [];

      setSection1(data.section1);
      setSection2(data.section2);
      setSection3(data.section3);
      setSection4(data.section4);

      if (data.section3 && data.section3.box.length > 0) {
        curationsList = await Promise.all(
          data.section3.box.map(async (item: string) => {
            const {
              data: { collection },
            } = await collectionServices.getCollectionById(
              extractIdFromURL(item),
            );

            return collection ? collection : null;
          }),
        );
      }
      curationsList = curationsList.filter(Boolean);
      setCurations(curationsList);
    };

    getData();
  }, []);
  return (
    <main className="flex flex-col bg-neutral-900">
      <BaseHeader />
      {images?.homeAutority ? (
        <AutoCarousel data={images.homeAutority} />
      ) : (
        <Skeleton className="w-full h-[400px]" />
      )}
      <div className="py-10 pt-[100px] w-full px-10 lg:px-20 lg:relative">
        <div className="w-8 h-8 border-2 rounded-full border-[#DDF247] border-l-transparent border-t-transparent -rotate-45 hidden lg:block absolute -left-4 top-[28.5rem]"></div>
        <div className="w-7 h-7 border-2 rounded-full border-[#DDF247] hidden lg:block absolute left-24"></div>
        <div className="w-4 h-4 rounded-full bg-[#DDF247] hidden lg:block absolute right-12 top-[10rem]"></div>
        <div className="w-8 h-8 border-2 rounded-full border-[#DDF247] hidden lg:block absolute right-16 bottom-[10rem]"></div>
        {section1 ? (
          <div className="container">
            <div className="flex flex-col gap-y-2 justify-center text-center items-center my-10 text-white flex-wrap">
              {section1.title
                ? createTitleComp(section1.title, section1.color)
                : null}
              {section1.description ? (
                <Label className="text-lg font-monserrat text-[#D2D2D2] font-normal">
                  {section1.description}
                </Label>
              ) : null}
            </div>
            <div className="grid grid-cols-12 md:gap-8 gap-5 justify-center">
              {section1.box.length > 0
                ? section1.box.map((item: any, index: number) => {
                    return (
                      <ArtistsCard
                        key={index}
                        image={item.image}
                        title={item.title}
                        subtitle1={item.subtitle1}
                        subtitle2={item.subtitle2}
                      />
                    );
                  })
                : null}
            </div>{' '}
            <div className="flex justify-center items-center mt-10 relative">
              <button className="px-8 py-2 rounded-xl text-neon border-neon font-medium hover:bg-[#ddf247] hover:text-black duration-300">
                Discover Artist
              </button>
              <div className="absolute -top-[2rem] w-[68rem] lg:flex justify-center hidden">
                <Image
                  src="/illustrations/neon-grid.png"
                  alt="neon-grid"
                  className="w-[60rem]"
                  width={960}
                  height={960}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="py-10">
        <TrendingList data={section2} />
        {section3 ? (
          <div className="py-[60px] lg:relative">
            <div className="hidden lg:block absolute left-0 top-[30rem]">
              <svg
                width="202"
                height="292"
                viewBox="0 0 202 292"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M134.42 89.3691L133.836 224.467L-1.26188 223.882"
                  stroke="#DDF247"
                />
                <path
                  d="M112.299 67.0547L111.715 202.152L-23.383 201.568"
                  stroke="#DDF247"
                />
                <path
                  d="M90.1758 44.7402L89.5915 179.838L-45.506 179.254"
                  stroke="#DDF247"
                />
                <path
                  d="M68.0547 22.4277L67.4705 157.525L-67.6271 156.941"
                  stroke="#DDF247"
                />
                <path
                  d="M45.9336 0.113281L45.3494 135.211L-89.7482 134.627"
                  stroke="#DDF247"
                />
              </svg>
            </div>
            <Image
              src="/illustrations/circle-half-translucent.png"
              className="hidden lg:block absolute w-24 right-0"
              alt="circle-half-translucent"
              width={10}
              height={10}
            />
            <div className="flex flex-col gap-y-2 justify-center text-center items-center my-10 text-white flex-wrap relative">
              {section3.title
                ? createTitleComp(section3.title, section3.color)
                : null}
              {section3.description ? (
                <Label className="text-sm md:text-lg text-gray-300">
                  {section3.description}
                </Label>
              ) : null}
              {/* <div className="absolute top-20 w-[36rem]">
                <Image
                  height={100}
                  width={100}
                  src="/illustrations/important.png"
                  alt="neon-grid"
                  className="w-[36rem] pl-7 mt-4"
                />
              </div> */}
            </div>
            <div className="flex mt-20 md:gap-8 flex-wrap gap-5 justify-start container items-center self-center px-5 w-full max-md:flex-wrap max-md:max-w-full">
              {curations.map((item: any, index: number) => {
                return (
                  <ExceptionalCard
                    key={index}
                    logo={item.logo}
                    name={item.name}
                    id={item._id}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="flex justify-center lg:relative lg:bg-[url('/illustrations/wave-top-left-bottom-right.png')]">
          <Image
            src="/illustrations/right-lines.png"
            alt="illustration"
            className="hidden lg:block absolute w-24 right-0 top-[15rem]"
            width={96}
            height={96}
          />
          <NFTList color={section2?.color} />
        </div>
      </div>
      {section4 ? (
        <div className="mt-[60px] lg:bg-[url('/illustrations/wave-top-right-bottom-left.png')] relative">
          <div className="absolute hidden lg:block top-[-9rem] left-0">
            {icon}
          </div>
          <div className="absolute hidden lg:block bottom-[-9rem] right-0">
            {icon2}
          </div>
          <div className="container">
            <NewsCard
              heading={createTitleComp(section4.title, section4.color)}
              description={section4.description}
              data={section4.box}
            />
          </div>
        </div>
      ) : null}
      <div className="pt-[120px]">
        <div className="w-full  max-w-[1204px] h-64 rounded-lg shadow p-4 flex flex-col justify-center items-center space-y-4 relative overflow-hidden mx-auto">
          {images?.bottomBaner && (
            <Link href={images?.bottomBaner.link} target="_blank">
              <Image
                src={images?.bottomBaner.image}
                alt="bottom-banner"
                layout="fill"
                objectFit="cover"
              ></Image>
            </Link>
          )}
          {/* MonsterX Heading */}
          {/* <div className="text-center text-black text-3xl sm:text-4xl font-extrabold font-['Montserrat'] leading-tight z-[1]">
          MonsterX
          </div> */}

          {/* Title Section */}
          {/* <div className="text-neutral-900 text-xl sm:text-3xl font-bold font-['Manrope'] text-center z-[1]">
          Click it to enter the Real World Asset Era
          </div> */}
          {/* 
        <Link
        href={ensureValidUrl(images?.bottomBaner?.link)}
        target="_blank"
        className="z-[1]"
        >
        <button className="w-full sm:w-40 h-14 px-5 py-3.5 bg-neutral-900 rounded-md border flex justify-center items-center text-white text-lg font-semibold font-['Manrope'] hover:bg-neutral-700 transition-colors duration-300">
        Join Us
        </button>
        </Link> */}
          {/* Rounded elements (half circles) */}
          {/* <div className="w-32 sm:w-48 h-32 sm:h-48 bg-white rounded-full absolute -left-16 sm:-left-24 top-6" />
        <div className="w-32 sm:w-48 h-32 sm:h-48 bg-white rounded-full absolute -right-16 sm:-right-24 top-6" /> */}
        </div>
      </div>
      <BaseFooter />
    </main>
  );
}
