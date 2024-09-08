'use client';

import { collectionServices, getMedia } from '@/services/supplier';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';

import NftServices from '@/services/nftService';
import Curation from './tabs/Curation';
import Profile from './tabs/Profile';
import Favourite from './tabs/Favourite';
import Orders from './tabs/Orders';
import Settings from './tabs/Settings';
import Create from './tabs/Create';
import CreateCuration from '../components/Modules/CreateCuration';
import CreateNft from '../components/Modules/CreateNft';
import { contract } from '@/lib/contract';
import {
  prepareContractCall,
  sendTransaction,
  readContract,
  resolveMethod,
  prepareEvent,
  getContractEvents,
} from 'thirdweb';
import { getData } from '@/utils/uploadData';
import { getNftDataById } from '@/utils/nftutils';
import { useToast } from '@/hooks/use-toast';
import BaseButton from '../components/ui/BaseButton';

interface IImage {
  appreciateTop: {
    link: string;
    image: string;
  };
  curationTop: {
    link: string;
    image: string;
  };
}

export default function Page() {
  const { toast } = useToast();
  const nftService = new NftServices();

  const searchParams = useSearchParams();

  const router = useParams();

  const [images, setImages] = useState<IImage | null>(null);
  const [nfts, setNfts] = useState<any>([]);
  const [collection, setCollection] = useState<any>([]);
  const [tab, setTab] = useState(searchParams.get('tab') || 'appreciate');
  const [modal, setModal] = useState({
    active: false,
    content: '',
  });
  const [curationPage, setCurationPage] = useState(1)

  const [filters, setFilters] = useState({
    filter: {
      price: 1,
    },
    limit: 0,
    searchInput: '',
    skip: 0,
    curationFilter: null
  });


  const handleModalProcess = (type: string) => {
    const show = type != '';
    if (show) {
      const url = new URL(window.location.href);
      url.searchParams.set('show', show ? 'true' : 'false');
    }

    setModal({
      active: true,
      content: type,
    });
  };

  const handleCurationFilter = async (search, filter) => {
    try {
      const queryObject = {
        searchInput: search ? search : '',
      }

      if (filter) {
        queryObject["filter"] = {
          [filter]: -1
        }
      }

      const response = await collectionServices.getAllCollections(queryObject);

      const collections = response.data.curations;
      const detailedInfo = await Promise.all(
        collections
          .filter((item: any) => (!item?.active && !item?.owner?.active))
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while filtering',
        duration: 2000,
      });
      console.log('error', error);
    }
    
  }

  const updateCurationFilter = (e) => {
    console.log(e)
    if (typeof e === 'object') {
      setFilters({
        ...filters,
        searchInput: e.search,
        curationFilter: e.filter
      })
    }
  }

  useEffect(() => {
    toast({
      title: 'Loading...',
      duration: 2000,
    })

    if (tab == 'curation') {
      handleCurationFilter(filters.searchInput, filters.curationFilter)
    }
  }, [filters.searchInput, filters.curationFilter])

  useEffect(() => {
    toast({
      title: 'Loading...',
      duration: 2000,
    });

    if (tab == 'curation') {
      const fetchCollection = async () => {
        const response = await collectionServices.getAllCollections({
          searchInput: '',
        });

        const collections = response.data.curations;
        let detailedInfo = await Promise.all(
          collections
            .filter((item: any) => (!item?.active && !item?.owner?.active))
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

      fetchCollection();
    }

    const modal = searchParams.get('show') == 'true' ? true : false;
    setModal({
      active: modal,
      content: '',
    });

    if (!images) {
      const fetchMedia = async () => {
        const response = await getMedia();

        setImages(response);
      };

      fetchMedia();
    }
  }, [tab]);
  return (
    <div>
      {tab === 'curation' ? (
        <>
        <Curation
          handleFilter={updateCurationFilter}
          hero={images ? images.curationTop : null}
          collections={collection}
        />
        </>
      ) : null}
      {tab === 'work' ? <Profile /> : null}
      {tab === 'fav' ? <Favourite /> : null}
      {tab === 'order' ? <Orders /> : null}
      {tab === 'settings' ? <Settings /> : null}
      {tab === 'create' ? <Create modalProcess={handleModalProcess} /> : null}
      {/* {
        modal &&
        <BaseModal show={modal.active} type="curation" />
      } */}
    </div>
  );
}
