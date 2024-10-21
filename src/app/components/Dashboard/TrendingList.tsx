'use client';

import NftServices from '@/services/nftService';
import { extractIdFromURL } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { BaseCarousel } from '../Carousels/BaseCarousel';

interface TrendingProps {
  data: any;
}

const createTitleComp = (
  title: string,
  color: Array<{ word: number; color: string }>,
) => {
  if (!title) return null;
  return (
    <h3 className="m-0">
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
    </h3>
  );
};

export default function TrendingList({ data }: TrendingProps) {
  const [icafNfts, setICAFNfts] = useState<any[]>([]);

  const getTrendingNfts = async () => {
    if (!data) return;
    const tempNfts = [];
    for (let i = 0; i < data?.box?.length; i++) {
      try {
        const nftService = new NftServices();
        const {
          data: { nft },
        } = await nftService.getNftById(extractIdFromURL(data?.box[i]));
        tempNfts.push(nft);
      } catch (error) {
        console.log({ error });
      }
    }
    setICAFNfts(tempNfts);
  };

  useEffect(() => {
    getTrendingNfts();
  }, [data]);

  return (
    <BaseCarousel
      heading={createTitleComp(data?.title, data?.color)}
      data={icafNfts}
    />
  );
}
