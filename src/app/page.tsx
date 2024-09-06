'use client';

import { BaseHeader } from './components/Header/BaseHeader';
import BaseFooter from './components/Footer/BaseFooter';
import NFTList from './components/Dashboard/NFTList';
import { collectionServices, getMedia } from '@/services/supplier';
import TrendingList from './components/Dashboard/TrendingList';
import axios from 'axios';
import NewsCard from './components/ui/NewsCard';
import ArtistsCard from './components/Cards/ArtistsCard';
import { Label } from '@/components/ui/label';
import ExceptionalCard from './components/Cards/ExceptionalCard';
import { useEffect, useState } from 'react';
import { AutoCarousel } from './components/Carousels/AutoCarousel';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

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

interface Iimages {
  homeAutority: Array<{ image: string; link: string }>;
  bottomBaner: { image: string; link: string };
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
    <h1 className="text-2xl font-medium lg:text-4xl lg:font-bold text-center">
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
  const [images, setImages] = useState<Iimages | null>(null);
  const [curations, setCurations] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const server_uri =
        process.env.NEXT_PUBLIC_APP_BACKEND_URL ||
        'https://tapi.vault-x.io/api/v1';
      const { data } = await axios.get(`${server_uri}/homepage/get-sections`);
      const images = await getMedia();
      const curationsList: any[] = [];

      if (data.section3 && data.section3.box.length > 0) {
        await data.section3.box.forEach(async (item: string) => {
          const {
            data: { collection },
          } = await collectionServices.getCollectionById(item.split('/')[5]);

          if (collection) {
            curationsList.push(collection);
          }
        });
      }

      setSection1(data.section1);
      setSection2(data.section2);
      setSection3(data.section3);
      setSection4(data.section4);
      setImages(images);
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
      <div className="py-20 w-full px-10 lg:px-20">
        {section1 ? (
          <>
            <div className="flex flex-col gap-y-2 justify-center text-center items-center my-10 text-white flex-wrap">
              {section1.title
                ? createTitleComp(section1.title, section1.color)
                : null}
              {section1.description ? (
                <Label className="text-sm md:text-lg">
                  {section1.description}
                </Label>
              ) : null}
            </div>
            <div className="flex md:gap-8 flex-wrap gap-5 justify-center">
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
              <div className="absolute top-[1rem] w-[68rem] lg:flex justify-center hidden">
                <img
                  src="/illustrations/neon-grid.png"
                  alt="neon-grid"
                  className="w-[60rem]"
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
      <div className="py-20">
        <div className="flex justify-center">
          <TrendingList data={section2} />
        </div>
        {section3 ? (
          <div className="py-20">
            <div className="flex flex-col gap-y-2 justify-center text-center items-center my-10 text-white flex-wrap relative">
              {section3.title
                ? createTitleComp(section3.title, section3.color)
                : null}
              {section3.description ? (
                <Label className="text-sm md:text-lg text-gray-300">
                  {section3.description}
                </Label>
              ) : null}

              <div className="absolute top-20 w-[36rem]">
                <img
                  height={100}
                  width={100}
                  src="/illustrations/important.png"
                  alt="neon-grid"
                  className="w-[36rem] pl-7 mt-4"
                />
              </div>
            </div>
            <div className="flex mt-20 md:gap-8 flex-wrap gap-5 justify-start container items-center self-center px-5 w-full max-md:flex-wrap max-md:max-w-full">
              {curations.length > 0
                ? curations.map((item: any, index: number) => {
                    return (
                      <ExceptionalCard
                        key={index}
                        logo={item.logo}
                        name={item.name}
                      />
                    );
                  })
                : null}
            </div>
          </div>
        ) : null}

        <div className="flex justify-center">
          <NFTList />
        </div>
      </div>
      {section4 ? (
        <div className="py-20">
          <NewsCard
            heading={createTitleComp(section4.title, section4.color)}
            description={section4.description}
            data={section4.box}
          />
        </div>
      ) : null}

      {images ? (
        <div className="py-10 flex justify-center items-center">
          <a
            target="_blank"
            href={images.bottomBaner ? images.bottomBaner.link : ''}
            className="w-full"
          >
            <img
              src={images.bottomBaner ? images.bottomBaner.image : ''}
              alt="newsletter"
              className="w-full"
            />
          </a>
        </div>
      ) : null}
      <BaseFooter />
    </main>
  );
}
