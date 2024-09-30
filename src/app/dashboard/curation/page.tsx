'use client';

import CurationCard from '@/app/components/Cards/CurationCard';
import { useEffect, useState } from 'react';
import CurationSearch from '@/app/components/Filters/CurationSearch';
import { collectionServices, getMedia } from '@/services/supplier';
import { useToast } from '@/hooks/use-toast';
import { SkeletonCard } from '@/app/components/Skelton/Skelton';
import { useDebounce } from 'use-debounce';
import Image from 'next/image';

export default function Page() {
  const { toast } = useToast();
  const [collections, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    filter: {
      price: 1,
    },
    limit: 0,
    searchInput: '',
    skip: 0,
    curationFilter: null,
  });

  const [debouncedFilter] = useDebounce(filters, 1000);
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


  const fetchCollection = async () => {
    setLoading(true);
    const response = await collectionServices.getAllCollections(filters);

    const collections = response.data.curations;
    let detailedInfo = await Promise.all(
      collections
        .filter((item: any) => item?.active)
        .map(async (collection: any) => {
          const info = await collectionServices.getCollectionInfo(
            collection._id,
          );

          console.log('info', info);

          const extra = {
            nftCount: info.data.collection.nftCount,
            totalVolume: info.data.collection.totalVolume,
            artistCount: info.data.collection.artistCount,
          };

          return {
            ...extra,
            name: collection.name,
            image: collection.bannerImage,
            id: collection._id,
          };
        }),
    );

    setCollection(detailedInfo);
    setLoading(false);
  };

  useEffect(() => {
    toast({
      title: 'Loading...',
      duration: 2000,
    });

    const fetchMedia = async () => {
      const response = await getMedia();

      if (response) {
        setHero(response ? response.curationTop : null);
      }
    };

    fetchCollection();
    fetchMedia();
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [debouncedFilter]);

  return (
    <div className="flex flex-col gap-y-4 px-4">
      {hero?.image && hero.link ? (
        <Image
          src={hero.image}
          alt="hero"
          width={1000}
          height={1000}
          className="w-full rounded-xl object-fill mb-[19px]"
          onClick={() => { window.open(hero.link, '_blank') }}
        />
      ) : null}
      <>
        <CurationSearch setState={handleState} />
        {loading ? (
          <SkeletonCard />
        ) : (
          <div className="grid grid-cols-12 gap-[24px] mt-[36px]">
            {collections.map((collection: any, index: number) => {
              return (
                <div className="col-span-4" key={index}>
                  <CurationCard key={index} data={collection} />
                </div>
              );
            })}

          </div>
        )}
      </>
    </div>
  );
}
