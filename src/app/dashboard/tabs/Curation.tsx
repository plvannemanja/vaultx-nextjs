import Filters from '@/app/components/ui/Filters';
import Image from 'next/image';
import CurationCard from '@/app/components/Cards/CurationCard';
import { useEffect } from 'react';

export default function Curation({
  hero,
  collections,
}: {
  hero: { link: string; image: string } | null;
  collections: any[];
}) {
  useEffect(() => {
    console.log(hero, collections);
  }, []);

  return (
    <div className="flex flex-col gap-y-4 px-4">
      {hero?.image && hero.link ? (
        <Image
          src={hero.image}
          alt="hero"
          width={100}
          height={100}
          quality={100}
          className="w-full rounded-xl object-fill"
          onClick={() => window.open(hero.link, '_blank')}
        />
      ) : null}
      <Filters />

      <div className="flex gap-4 flex-wrap my-4 justify-center md:justify-start">
        {collections.map((collection: any, index: number) => {
          return (
            <div className="w-[23rem]" key={index}>
              <CurationCard key={index} data={collection} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
