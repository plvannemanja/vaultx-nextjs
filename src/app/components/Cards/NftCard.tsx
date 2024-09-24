import { Card, CardContent } from '@/components/ui/card';
import { TokenIcon } from '@web3icons/react';
import Image from 'next/image';

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
    <Card className="bg-dark text-white border-none max-w-[20rem]">
      <CardContent className="aspect-square p-3">
        <div className="w-full overflow-hidden">
          <img
            src={data.cloudinaryUrl ? data.cloudinaryUrl : ''}
            className="rounded w-full aspect-[4/3] object-cover hover:scale-110 transition-transform duration-300"
            alt="nft-image"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-y-4 my-2">
          <p className="text-lg">
            {data.name.length > 24 ? `${data.name.slice(0, 24)}...` : data.name}
          </p>
          <div className="flex justify-between">
            <span className="text-xs text-dark">Created by: </span>
            <span className="text-sm">
              {data.curation.name ? data.curation.name : data.artist}
            </span>
          </div>
          <hr />
          <div className="flex justify-between items-center">
            <span className="text-xs text-dark">Price </span>
            <div className="flex gap-x-2 items-center">
              <TokenIcon symbol="base" className="text-white"></TokenIcon>
              ${data.price}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
