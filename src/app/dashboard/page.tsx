"use client";

import { collectionServices, getMedia } from '@/services/supplier';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import NftServices from '@/services/nftService';
import Curation from './tabs/Curation';
import Appreciate from './tabs/Appreciate';
import Profile from './tabs/Profile';
import Favourite from './tabs/Favourite';
import Orders from './tabs/Orders';
import Settings from './tabs/Settings';
import Create from './tabs/Create';
import BaseModal from '../components/Modals/BaseModal';


interface IImage {
  appreciateTop: {
    link: string;
    image: string;
  },
  curationTop: {
    link: string;
    image: string;
  }
}

export default function page() {
  const nftService = new NftServices();

  const searchParams = useSearchParams();
  const [images, setImages] = useState<IImage | null>(null);
  const [nfts, setNfts] = useState<any>([]);
  const [collection, setCollection] = useState<any>([]);
  const [tab, setTab] = useState(searchParams.get('tab') || 'appreciate');
  const [modal, setModal] = useState({
    active: false,
    content: ''
  });

  const [filters, setFilters] = useState({
    filter: {
      price: 1,
    },
    limit: 0,
    searchInput: "",
    skip: 0,
  })

  const handleModalProcess = (type: string) => {
    const show = type != '';
    if (show) {
      const url = new URL(window.location.href);
      url.searchParams.set('show', show ? 'true' : 'false');
    }

    setModal({
      active: true,
      content: type
    })
  }
 
  useEffect(() => {
    if (tab == 'curation') {
      const fetchCollection = async () => {
        const response = await collectionServices.getAllCollections({
          searchInput: "",
        })

        const collections = response.data.curations;
        const detailedInfo = await Promise.all(collections.filter((item: any) => item.active).map(async (collection: any) => {
          const info = await collectionServices.getCollectionInfo(collection._id);

          const extra = {
            nftCount: info.data.collection.nftCount,
            totalVolume: info.data.collection.totalVolume,
            artistCount: info.data.collection.artistCount
          }

          return {
            ...extra,
            name: collection.name,
            image: collection.bannerImage
          }
        }))

        setCollection(detailedInfo);
      }

      fetchCollection();
    }

    if (tab == 'appreciate') {
      const fetchNfts = async () => {
        const response = await nftService.getAllNfts(filters);
        setNfts(response.data.nfts[0]?.data);
      }

      fetchNfts();
    }

    const modal = searchParams.get('show') == "true" ? true : false;
    setModal({
      active: modal,
      content: ''
    })

    if (!images) {
      const fetchMedia = async() => {
        const response = await getMedia();

        setImages(response);
      }

      fetchMedia();
    }
  }, [tab])
  return (
    <div>
      {
        tab === 'appreciate' ?
        <Appreciate hero={images ? images.appreciateTop : null} nfts={nfts} /> : null
      }
      {
        tab === 'curation' ?
        <Curation hero={images ? images.curationTop : null} collections={collection} /> : null 
      }
      {
        tab === 'work' ?
        <Profile /> : null
      }
      {
        tab === 'fav' ?
        <Favourite /> : null
      }
      {
        tab === 'order' ? 
        <Orders /> : null
      }
      {
        tab === 'settings' ? 
        <Settings /> : null
      }
      {
        tab === 'create' ? 
        <Create modalProcess={handleModalProcess} /> : null
      }
      {
        modal &&
        <BaseModal show={modal.active} type="curation" />
      }
    </div>
  )
}
