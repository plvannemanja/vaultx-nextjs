import CurationCard from '@/app/components/Cards/CurationCard';
import { useEffect } from 'react';
import CurationSearch from '@/app/components/Filters/CurationSearch';

export default function Curation({
  hero,
  collections,
  handleFilter
}: {
  hero: { link: string; image: string } | null;
  collections: any[];
  handleFilter: any;
}) {
  const handleState = (e: any) => {
    handleFilter(e);
  }

  useEffect(() => {
    console.log(hero, collections);
  }, []);

  return (
    <div className="flex flex-col gap-y-4 px-4">
      {hero?.image && hero.link ? (
        <img
          src={hero.image}
          alt="hero"
          width={100}
          height={100}
          className="w-full rounded-xl object-fill"
          onClick={() => window.open(hero.link, '_blank')}
        />
      ) : null}
      <CurationSearch setState={handleState} />

      <div className="flex gap-4 lg:justify-between flex-wrap my-4 justify-center md:justify-start">
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
