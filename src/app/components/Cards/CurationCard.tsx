'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface ICurationCard {
  name: string;
  artistCount: number;
  nftCount: number;
  totalVolume: number;
  image: string;
  id: string;
}

export default function CurationCard({ data }: { data: ICurationCard }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/curation/${data.id}`);
  };

  return (
    <Card
      className="bg-dark text-white border-none max-w-[100%] rounded-none"
      onClick={handleCardClick}
    >
      <CardContent className="aspect-square p-3">
        <div className="w-full overflow-hidden">
          <img
            src={data.image ? data.image : ''}
            height={100}
            width={100}
            className="w-full h-[368px] aspect-[4/3] object-cover hover:scale-110 transition-transform duration-300"
            alt="nft-image"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-y-4 my-2">
          <p className="text-lg text-center">{data.name}</p>
          <div className="flex justify-between gap-x-2">
            <div className="flex flex-col gap-y-1 bg-[#323232] py-2 justify-center w-1/3">
              <p className="text-center font-medium text-dark">Artworks</p>
              <p className="text-center text-sm">{data.nftCount}</p>
            </div>

            <div className="flex flex-col gap-y-1 bg-[#323232] py-2 justify-center w-1/3">
              <p className="text-center font-medium text-dark">Artists</p>
              <p className="text-center text-sm">{data.artistCount}</p>
            </div>

            <div className="flex flex-col gap-y-1 bg-[#323232] py-2 justify-center w-1/3">
              <p className="text-center font-medium text-dark">Volume</p>
              <p className="text-center text-sm">${data.totalVolume}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
