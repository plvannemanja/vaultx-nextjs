'use client';

import NftCard from '@/app/components/Cards/NftCard';
import { useGlobalContext } from '@/app/components/Context/GlobalContext';
import Filters from '@/app/components/ui/Filters';
import { useToast } from '@/hooks/use-toast';
import NftServices from '@/services/nftService';
import { ensureValidUrl } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Page() {
  const nftService = new NftServices();
  const [data, setData] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const { mediaImages } = useGlobalContext();
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
          data.category.label === 'Category' ? null : data.category.label,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      toast({
        title: 'Fetching RWAs...',
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

  return (
    <div className="flex flex-col gap-y-4 px-4">
      {mediaImages?.appreciateTop?.image && mediaImages?.appreciateTop.link ? (
        <a
          href={ensureValidUrl(mediaImages?.appreciateTop.link)}
          target="_blank"
        >
          <div className="w-full max-w-[1582px] h-[300px] sm:h-[350px] md:h-[370px] mx-auto relative">
            <Image
              src={mediaImages?.appreciateTop.image}
              alt="hero"
              layout="fill"
              objectFit="cover"
              className="rounded-lg mb-3.5"
            ></Image>
          </div>
        </a>
      ) : null}
      <Filters setState={handleFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {nfts.length > 0
          ? nfts.map((nft: any, index: number) => {
              return (
                <Link key={index} href={`/nft/${nft._id}`}>
                  <NftCard data={nft} />
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
}
