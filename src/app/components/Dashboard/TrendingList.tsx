'use client';

import NftServices from '@/services/nftService';
import { useEffect, useState } from 'react';
import { BaseCarousel } from '../Carousels/BaseCarousel';

interface TrendingProps {
  data: any;
}
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
        } = await nftService.getNftById(data?.box[i]?.split('/')[5]);
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

  const heading = <h3 className="m-0">Weekly Trending</h3>;

  return <BaseCarousel heading={heading} data={icafNfts} />;
}
