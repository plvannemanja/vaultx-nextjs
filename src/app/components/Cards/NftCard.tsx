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

  console.log("data",data)
  return (
    <>
   <Card className="bg-transparent text-white border-none max-w-[100%]">
      <CardContent className="aspect-square p-0 rounded-[20px]">
        <div className="w-full overflow-hidden p-[20px] bg-[#232323] rounded-t-[20px]">
          <img
            src={data.cloudinaryUrl ? data.cloudinaryUrl : ''}
            className="rounded w-full object-contain hover:scale-110 transition-transform duration-300 min-h-[296px] max-h-[296px]"
                        alt="nft-image"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-y-2.5 bg-[#333] px-5 py-3 rounded-b-[20px]">
          <p className="font-extrabold font-[16px] h-[22px]">
            {data.name.length > 24 ? `${data.name.slice(0, 24)}...` : data.name}
          </p>
          <div className="flex justify-between">
            <span className="text-xs text-dark  azeret-mono-font">
              Created by:{' '}
            </span>
            <span className="text-[12px] leading-[160%] azeret-mono-font">
              {data.curation.name ? data.curation.name : data.artist}
            </span>
          </div>
     <p className="text-[13px] text-[#fff] font-bold azeret-mono-font italic underline">            {' '}
            <Link className="italic " href={`/nft/${data._id}`}>
              Canvas Collection
            </Link>
          </p>
          <hr className={'border-[#ffffff10] my-[6px]'} />

          <div className="flex justify-between items-center">
            <span className="text-xs text-dark  azeret-mono-font">Price </span>
            <div className="flex gap-x-2 items-center font-extrabold text-[16px]">
              <Image
                 src="/icons/Base.svg"
                height={20}
                width={20}
                alt="matic"
                loading="lazy"
                blurDataURL={'/images/image_placeholder.png'}
                quality={100}
              />
               ${data.price}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
   
  );
}
