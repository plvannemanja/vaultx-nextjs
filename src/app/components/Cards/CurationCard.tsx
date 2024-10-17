'use client';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumberWithCommas } from '@/lib/utils';
import Image from 'next/image';
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
        <CardContent className="aspect-square p-3 flex flex-col gap-y-[20px]">
          <div className="w-full overflow-hidden">
            <Image
              src={data.image ? data.image : ''}
              height={368}
              width={482}
              className="w-full h-[368px] aspect-[4/3] object-cover hover:scale-110 transition-transform duration-300"
              alt="nft-image"
              blurDataURL={data.image ? data.image : ''}
              placeholder="blur"
            />
          </div>
          <p className="text-2xl manrope-font font-bold text-center">
            {data.name}
          </p>
          <div className="flex justify-between gap-x-[10px]">
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
                ${formatNumberWithCommas(data.totalVolume)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
