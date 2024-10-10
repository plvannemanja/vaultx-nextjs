'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ICurationCard {
  name: string;
  artistCount: number;
  nftCount: number;
  totalVolume: number;
  image: string;
  id: string;
}

export default function CurationCard({ data }: { data: ICurationCard }) {
  return (
    <Link href={`/dashboard/curation/${data.id}`}>
      <Card className="bg-dark text-white border-none max-w-[100%] rounded-none">
        <CardContent className="aspect-square p-3 pb-0">
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
          <div className="flex flex-col gap-y-6 mt-5 mb-1">
            <p className="text-[24px] font-bold text-center">{data.name}</p>
            <div className="flex justify-between gap-x-2 p-2.5">
              <div className="flex flex-col gap-y-1 bg-[#323232] py-2 justify-center w-1/3">
                <p className="text-center font-medium text-dark azeret-mono-font">
                  Artworks
                </p>
                <p className="text-center text-sm">{data.nftCount}</p>
              </div>

              <div className="flex flex-col gap-y-1 bg-[#323232] py-2 justify-center w-1/3">
                <p className="text-center font-medium text-dark azeret-mono-font">
                  Artists
                </p>
                <p className="text-center text-sm">{data.artistCount}</p>
              </div>

              <div className="flex flex-col gap-y-1 bg-[#323232] py-2 justify-center w-1/3">
                <p className="text-center font-medium text-dark azeret-mono-font">
                  Volume
                </p>
                <p className="text-center text-sm">${data.totalVolume}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
