import { Card, CardContent } from '@/components/ui/card';
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
          <Image
            src={data.cloudinaryUrl ? data.cloudinaryUrl : ''}
            placeholder="blur"
            blurDataURL="/images/image_placeholder.png"
            height={100}
            width={100}
            className="rounded w-full aspect-[4/3] object-cover hover:scale-110 transition-transform duration-300"
            alt="nft-image"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-y-4 my-2">
          <p className="text-lg">{data.name}</p>
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
