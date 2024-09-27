'use client';

import Filters from '@/app/components/ui/Filters';
import Image from 'next/image';
import NftCard from '@/app/components/Cards/NftCard';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import NftServices from '@/services/nftService';
import { getMedia } from '@/services/supplier';
import { useDebounce } from 'use-debounce';
import { useToast } from '@/hooks/use-toast';

export default function Page() {
  const nftService = new NftServices();
  const [data, setData] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [hero, setHero] = useState<any>({});

  const router = useRouter();
  const [filters, setFilters] = useState({
    searchInput: '',
    filter: {
      price: 1,
    },
    category: null,
  });
  const [debounceFilter] = useDebounce(filters, 2000);
  const { toast } = useToast();

  const handleFilters = (data: any) => {
    if (data && typeof data === 'object') {
      setFilters({
        searchInput: data.search,
        filter: {
          price: data.price.value,
        },
        category:
          data.category.label === 'Test Category' ? null : data.category.label,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      toast({
        title: 'Fetching NFTs...',
        duration: 2000,
      });

      const queryObject = {
        skip: 0,
        limit: 0,
        searchInput: filters.searchInput,
        filter: {
          price: filters.filter.price,
        },
      };
      if (filters.category) {
        queryObject['category'] = filters.category;
      }

      const response = await nftService.getAllNfts(queryObject);

      if (response.data.nfts && response.data.nfts.length > 0) {
        const nfts = response.data.nfts[0]?.data;
        setNfts(nfts);
      }
    };

    fetchData();
  }, [debounceFilter]);

  useEffect(() => {
    const fetchMedia = async () => {
      const response = await getMedia();

      if (response) {
        setHero(response.appreciateTop);
      }
    };

    fetchMedia();
  }, []);

  return (
    <div className="flex flex-col gap-y-4 px-4 ">
      {hero?.image && hero.link ? (
        <img
          src={hero.image}
          alt="hero"
          width={100}
          height={100}
          className="w-full object-fill max-h-[370px] mb-[14px]"
          onClick={() => window.open(hero.link, '_blank')}
        />
      ) : null}
      <Filters setState={handleFilters} />

      <div className="flex gap-x-[52px] gap-y-[52px] flex-wrap my-4 justify-center ">
        {nfts.length > 0
          ? nfts.map((nft: any, index: number) => {
            return (
              <div
                className="w-[306px]"
                key={index}
                onClick={() => {
                  router.push(`/nft/${nft._id}`);
                }}
              >
                <NftCard data={nft} />
                this is test
              </div>
            );
          })
          : null}
      </div>
    </div>
  );
}
