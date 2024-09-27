import { Card, CardContent } from '@/components/ui/card';
import { TokenIcon } from '@web3icons/react';
import Image from 'next/image';
import Link from 'next/link';

interface INftCardProps {
  name: string;
  cloudinaryUrl: string;
  curation: {
    name: string;
  };
  price: string;
  artist?: string;
}

export default function NftCard({ data }: { data: INftCardProps }) {
  return (
    <>
     <Card className="bg-transparent text-white border-none max-w-[100%] bg-[#232323] px-3 pt-[11px] pb-[30.85px] rounded-[20px] gap-[17px]">
      <CardContent className="aspect-square p-0">
        <div className="w-full overflow-hidden mb-[17px]">
          <img
            src={data.cloudinaryUrl ? data.cloudinaryUrl : ''}
            className="w-full object-cover hover:scale-110 transition-transform duration-300 min-h-[244px] max-h-[244px] rounded-[20px]"
            alt="nft-image"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-y-2.5  ">
          <p className="font-extrabold font-[18px]">
            {data.name.length > 24 ? `${data.name.slice(0, 24)}...` : data.name}
          </p>
          <div className="flex justify-between">
            <span className="text-xs text-dark  azeret-mono-font">
              Created by:{' '}
            </span>
            <span className="text-sm azeret-mono-font">
              {data.curation.name ? data.curation.name : data.artist}
            </span>
          </div>
     <p className="text-xs text-[#fff] font-bold azeret-mono-font italic underline">            {' '}
            <Link className="italic " href={`/nft/${data.curation.name}`}>
              Canvas Collection
            </Link>
          </p>
          <hr className={'border-[#ffffff10] '} />

          <div className="flex items-center">
            <span className="text-xs text-dark  azeret-mono-font">Price </span>
            <div className="flex gap-x-2 items-center gap-[5px]">
              <Image
                src="/icons/newmatic.svg"
                height={20}
                width={20}
                alt="matic"
                loading="lazy"
                blurDataURL={'/images/image_placeholder.png'}
                quality={100}
              />
              <span className="text-[12px] font-extrabold">{data.price} MATIC</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
   
  );
}
