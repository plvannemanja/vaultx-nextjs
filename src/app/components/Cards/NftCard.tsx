import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface INftCardProps {
  name: string;
  cloudinaryUrl: string;
  curation: {
    name: string;
  };
  price: string;
}

export default function NftCard({ data }: { data: INftCardProps }) {
  return (
    <Card className="bg-dark text-white border-none">
      <CardContent className="aspect-square p-3">
        <Image
          src={data.cloudinaryUrl ? data.cloudinaryUrl : ''}
          height={100}
          width={100}
          className="rounded w-full aspect-[4/3] object-cover"
          alt="nft-image"
          loading="lazy"
        />
        <div className="flex flex-col gap-y-4 my-2">
          <p className="text-lg">{data.name}</p>
          <div className="flex justify-between">
            <span className="text-xs text-dark">Created by: </span>
            <span className="text-sm">{data.curation.name}</span>
          </div>
          <hr />
          <div className="flex justify-between">
            <span className="text-xs text-dark">Price </span>
            <div className="flex gap-x-2 items-center">
              <Image
                src="/icons/matic.png"
                height={20}
                width={20}
                alt="matic"
              />
              ${data.price}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
