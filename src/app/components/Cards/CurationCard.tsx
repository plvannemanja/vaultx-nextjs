'use client';
import { Card, CardContent } from '@/components/ui/card';
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
      <Card className="text-white border-none max-w-[100%] rounded-none bg-[#232323]">
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
          <div className="flex flex-col">
            <p className="text-[24px] py-5 font-bold text-center">
              {data.name}
            </p>
            <div className="flex justify-between gap-x-2">
              <div className="flex flex-col gap-y-1 bg-white/[7%] py-2 justify-center w-1/3">
                <p className="text-center text-white/30 azeret-mono-font">
                  Artworks
                </p>
                <p className="text-center font-extrabold">{data.nftCount}</p>
              </div>
              <div className="flex flex-col gap-y-1 bg-white/[7%] py-2 justify-center w-1/3">
                <p className="text-center text-white/30 azeret-mono-font">
                  Artists
                </p>
                <p className="text-center font-extrabold">{data.artistCount}</p>
              </div>
              <div className="flex flex-col gap-y-1 bg-white/[7%] py-2 justify-center w-1/3">
                <p className="text-center text-white/30 azeret-mono-font">
                  Volume
                </p>
                <p className="text-center font-extrabold">
                  ${data.totalVolume}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
