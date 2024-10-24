import { Card, CardContent } from '@/components/ui/card';
import { formatNumberWithCommas } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface INftCardProps {
  _id: string;
  name: string;
  cloudinaryUrl: string;
  curation: {
    name: string;
  };
  curationInfo?: any[];
  price: string;
  artist?: string;
}

export default function NftCard({ data }: { data: INftCardProps }) {
  if (data.curationInfo?.length) {
    data.curation = data.curationInfo[0];
  }
  return (
    <Card className="bg-transparent text-white border-none w-full bg-[#232323]">
      <CardContent className="rounded-[20px] p-0">
        <div className="w-full overflow-hidden rounded-[8px] p-5">
          <Image
            width={296}
            height={296}
            src={data.cloudinaryUrl ? data.cloudinaryUrl : ''}
            className="w-full !aspect-[4/3] !object-cover hover:scale-110 transition-transform duration-300"
            alt="nft-image"
            // quality={100}
            blurDataURL={data.cloudinaryUrl ? data.cloudinaryUrl : ''}
            placeholder="blur"
          />
        </div>
        <div className="flex flex-col px-5 py-3 gap-y-2.5 rounded-b-[20px]">
          <p className="font-extrabold">
            {data.name.length > 24 ? `${data.name.slice(0, 24)}...` : data.name}
          </p>
          <div className="flex justify-between">
            <span className="text-xs text-white/30  azeret-mono-font">
              Created by:{' '}
            </span>
            <span className="text-[12px] leading-[160%] azeret-mono-font">
              {data.curation.name ? data.curation.name : data.artist}
            </span>
          </div>
          {data.curation?.name && (
            <p className="text-[13px] text-[#fff] font-bold azeret-mono-font italic underline">
              <Link className="italic " href={`/nft/${data._id}`}>
                {data.curation?.name}
              </Link>
            </p>
          )}
          <hr className={'border-white/10 my-[6px]'} />
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/30 azeret-mono-font">
              Price{' '}
            </span>
            <div className="flex gap-x-2 items-center font-extrabold">
              <Image
                src="/icons/Base.svg"
                height={20}
                width={20}
                alt="matic"
                loading="lazy"
                blurDataURL={'/images/image_placeholder.png'}
                quality={100}
              />
              ${formatNumberWithCommas(data.price)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
