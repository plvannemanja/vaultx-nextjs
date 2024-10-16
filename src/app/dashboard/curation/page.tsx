'use client';
import CurationCard from '@/app/components/Cards/CurationCard';
import { useGlobalContext } from '@/app/components/Context/GlobalContext';
import CurationSearch from '@/app/components/Filters/CurationSearch';
import { SkeletonCard } from '@/app/components/Skelton/Skelton';
import { useToast } from '@/hooks/use-toast';
import { collectionServices } from '@/services/supplier';
import { ensureValidUrl } from '@/utils/helpers';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

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
  const { mediaImages } = useGlobalContext();

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
          // console.log('info', info);
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

    fetchCollection();
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [debouncedFilter]);

  return (
    <div className="flex flex-col gap-y-4 px-4">
      {mediaImages?.curationTop?.image && mediaImages?.curationTop.link ? (
        <a href={ensureValidUrl(mediaImages?.curationTop.link)} target="_blank">
          <div className="w-full max-w-[1550px] h-[300px] sm:h-[350px] md:h-[370px] mx-auto relative">
            <Image
              src={mediaImages?.curationTop.image}
              alt="hero"
              layout="fill"
              objectFit="cover"
              className="rounded-xl mb-4"
            ></Image>
          </div>
        </a>
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
