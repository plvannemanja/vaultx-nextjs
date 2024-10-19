'use client';

import NftServices from '@/services/nftService';
import { useEffect, useState } from 'react';
import { BaseCarousel } from '../Carousels/BaseCarousel';

export default function NFTList() {
  const [nfts, setNfts] = useState([]);
  const getNfts = async () => {
    try {
      const nftService = new NftServices();
      const {
        data: { nfts },
      } = await nftService.getAllNfts({ limit: 0, skip: 0, searchInput: '' });
      const filterNFTs = nfts[0]?.data
        // .filter(
        //   (nft: any) =>
        //     !nft?.active &&
        //     !nft.ownerInfo?.[0]?.active &&
        //     !nft.curationInfo?.[0].active,
        // )
        ?.slice(0, 4)
        ;
      setNfts(filterNFTs);
    } catch (error) {
      setNfts([]);
      console.log(error);
    }
  };

  useEffect(() => {
    getNfts();
  }, []);

  const heading = <h3 className="m-0">Appreciate & Explore</h3>;

  return <BaseCarousel heading={heading} data={nfts} />;
}
