"use client";

import { ComboboxDemo, prices } from '@/app/components/ui/Filters'
import { FavoriteService } from '@/services/FavoriteService';
import { useEffect, useState } from 'react';
import NftCard from '@/app/components/Cards/NftCard';
import CurationCard from '@/app/components/Cards/CurationCard';
import ArtistsCard from '@/app/components/Cards/ArtistsCard';
import { collectionServices } from '@/services/supplier';

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
                <div className="flex gap-x-2 items-center border-2 rounded-xl px-2 w-full">
                    <svg width="20px" height="20px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M17 17L21 21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>

                    <input placeholder="Search by name or trait..." className="w-full bg-transparent border-none outline-none focus:outline-none" />
                </div>
                <ComboboxDemo data={prices} title="category" />
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
                                    <div className="w-[17rem]">
                                        <NftCard key={index} data={nft} />
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
                                    <div className="w-[23rem]">
                                        <CurationCard key={index} data={collection} />
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
                                    <div className="w-[23rem]">
                                        <ArtistsCard
                                            key={index}
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
