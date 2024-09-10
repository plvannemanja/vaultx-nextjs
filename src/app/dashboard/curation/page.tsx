'use client';

import CurationCard from '@/app/components/Cards/CurationCard';
import { useEffect, useState } from 'react';
import CurationSearch from '@/app/components/Filters/CurationSearch';
import { collectionServices, getMedia } from '@/services/supplier';
import { useToast } from '@/hooks/use-toast';

export default function page() {
  const { toast } = useToast();
  const [collections, setCollection] = useState([]);
  const [filters, setFilters] = useState({
    filter: {
      price: 1,
    },
    limit: 0,
    searchInput: '',
    skip: 0,
    curationFilter: null,
  });
  const [hero, setHero] = useState<any>(null);

  const handleState = (e: any) => {
    let obj = {
      search: e.search,
    };

    if (e.filter) {
      obj['filter'] = e.filter;
    }

    handleFilter(obj);
  };

  const handleFilter = (e) => {
    if (typeof e === 'object') {
      setFilters({
        ...filters,
        searchInput: e.search,
        curationFilter: e.filter,
      });
    }
  };

  useEffect(() => {
    toast({
      title: 'Loading...',
      duration: 2000,
    });

    const fetchCollection = async () => {
      const response = await collectionServices.getAllCollections({
        searchInput: '',
      });

      const collections = response.data.curations;
      let detailedInfo = await Promise.all(
        collections
          .filter((item: any) => !item?.active && !item?.owner?.active)
          .map(async (collection: any) => {
            const info = await collectionServices.getCollectionInfo(
              collection._id,
            );

            const extra = {
              nftCount: info.data.collection.nftCount,
              totalVolume: info.data.collection.totalVolume,
              artistCount: info.data.collection.artistCount,
            };

            return {
              ...extra,
              name: collection.name,
              image: collection.bannerImage,
            };
          }),
      );

      setCollection(detailedInfo);
    };

    const fetchMedia = async () => {
      const response = await getMedia();

      if (response) {
        setHero(response ? response.curationTop : null);
      }
    };

    fetchCollection();
    fetchMedia();
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
