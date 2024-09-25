import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="bg-transparent text-white border-none max-w-[20rem]">
      <CardContent className="aspect-square p-0 rounded-[20px]">
        <div className="w-full overflow-hidden p-[20px] bg-[#232323] rounded-t-[20px]">
          <img
            src={data.cloudinaryUrl ? data.cloudinaryUrl : ''}
            className="rounded w-full object-contain hover:scale-110 transition-transform duration-300 min-h-[296px]"
            alt="nft-image"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-y-4 mb-2 p-[20px] bg-[#333333] rounded-b-[20px]">
          <p className="font-extrabold">
            {data.name.length > 24 ? `${data.name.slice(0, 24)}...` : data.name}
          </p>
          <div className="flex justify-between">
            <span className="text-xs text-dark  azeret-mono-font">Created by: </span>
            <span className="text-sm azeret-mono-font">
              {data.curation.name ? data.curation.name : data.artist}
            </span>
          </div>
          <p className="text-xs text-[#fff] font-bold azeret-mono-font italic underline"> <Link className='italic ' href={`/nft/${data.curation.name}`}>Canvas Collection</Link></p>
          <hr />
          <div className="flex justify-between items-center">
            <span className="text-xs text-dark  azeret-mono-font">Price </span>
            <div className="flex gap-x-2 items-center">
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
  );
}
