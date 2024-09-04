"use client";

import { FavoriteService } from '@/services/FavoriteService';
import { useEffect, useState } from 'react';
import NftCard from '@/app/components/Cards/NftCard';
import CurationCard from '@/app/components/Cards/CurationCard';
import ArtistsCard from '@/app/components/Cards/ArtistsCard';
import { collectionServices } from '@/services/supplier';
import CurationSearch from '@/app/components/Filters/CurationSearch';
import SearchWithDropDown from '@/app/components/Filters/SearchWithDropDown';

const menu = [
    {
        label: 'NFTS',
        value: 'nfts'
    },
    {
        label: 'Curation',
        value: 'curation'
    },
    {
        label: 'Artist',
        value: 'artist'
    }
]

export default function Favourite() {
    const favouriteService = new FavoriteService();

    const [tab, setTab] = useState('nfts');
    const [data, setData] = useState<any>({
        nfts: [],
        curation: [],
        artist: []
    })
    const [filters, setFilters] = useState({
        searchInput: "",
        filters: null
    });

    useEffect(() => {
        const fetchData = async () => {
            let artist = await favouriteService.getUserLikedArtists(filters);
            let nfts = await favouriteService.getUserLikedNfts(filters);
            let curation: any = await favouriteService.getUserLikedCollections(filters);

            nfts = nfts.data.nfts.map((item: any) => {
                return item.nftId;
            })

            curation = await Promise.all(curation.data.curations.map(async (item: any) => {
                const info = await collectionServices.getCollectionById(item.collectionId._id);

                const extra = {
                    nftCount: info.data.collection.nftCount,
                    totalVolume: info.data.collection.totalVolume,
                    artistCount: info.data.collection.artistCount
                }
                return {
                    ...extra,
                    name: item.collectionId.name,
                    image: item.collectionId.logo
                }
            }))

            artist = artist.data.artists.map((item: any) => {
                return {
                    image: item?.artistId?.avatar?.url,
                    title: item?.artistId.username,
                    subtitle2: window.location.origin + '/user/' + item?.artistId?._id
                };
            })

            setData({
                artist: artist,
                nfts: nfts,
                curation: curation
            })
        }

        fetchData();

    }, [])
    return (
        <div className="flex flex-col gap-y-4 px-4">

            <div className="flex gap-x-4 my-4">
                <SearchWithDropDown setState={(e) => setFilters({...filters, filters: e})} />
            </div>

            <div className='flex gap-x-5 mb-4'>
                {
                    menu.map((item, index) => (
                        <span
                            key={index}
                            onClick={() => setTab(item.value)}
                            className={`font-medium text-white cursor-pointer underline-offset-2 ${tab === item.value ? 'border-b-2 text-neon pb-2 border-[#ddf247]' : ''}`}
                        >
                            {item.label}
                        </span>
                    ))
                }
            </div>

            {
                tab === 'nfts' && (
                    <div className='flex gap-4 flex-wrap my-4 justify-center md:justify-between'>
                        {
                            data.nfts.map((nft: any, index: number) => {
                                return (
                                    <div className="w-[17rem]" key={index}>
                                        <NftCard data={nft} />
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }

            {
                tab === 'curation' && (
                    <div className='flex gap-4 flex-wrap my-4 justify-center md:justify-start'>
                        {
                            data.curation.length > 0 ? data.curation.map((collection: any, index: number) => {
                                return (
                                    <div className="w-[23rem]" key={index} >
                                        <CurationCard data={collection} />
                                    </div>
                                )
                            }) : null
                        }
                    </div>
                )
            }

            {
                tab === 'artist' && (
                    <div className='flex gap-4 flex-wrap my-4 justify-center md:justify-start'>
                        {
                            data.artist.length > 0 ? data.artist.map((item: any, index: number) => {
                                return (
                                    <div className="w-[23rem]" key={index}>
                                        <ArtistsCard
                                            image={item.image}
                                            title={item.title}
                                            subtitle2={item.subtitle2}
                                        />
                                    </div>
                                )
                            }) : null
                        }
                    </div>
                )
            }
        </div>
    )
}
