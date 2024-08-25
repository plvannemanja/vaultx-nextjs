"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { collectionServices, getAllUsersActivity, saleServices, userServices } from "@/services/supplier";
import { FavoriteService } from "@/services/FavoriteService";
import NftServices from "@/services/nftService";
import NftCard from "../../Cards/NftCard";
import CurationCard from "../../Cards/CurationCard";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { trimString } from "@/utils/helpers";
import { Label } from "@/components/ui/label";
import { CreateSellService } from "@/services/createSellService";
import Link from "next/link";
import ArtistsCard from "../../Cards/ArtistsCard";

const profileFilters = [
    {
        label: 'Price: Low To High',
        value: 1,
        param: 'price'
    },
    {
        label: 'Price: High To Low',
        value: -1,
        param: 'price'
    },
    {
        label: 'Recently Minted',
        value: -1,
        param: 'createdAt'
    },
    {
        label: 'Recently Listed',
        value: -1,
        param: 'updatedAt'
    },
    {
        label: 'Most Favorited',
        value: -1,
        param: 'likes'
    },
    {
        label: 'Highest Last Sale',
        value: -1,
        param: 'price'
    }
]

const earnFilters = [
    {
        label: 'All',
        value: ""
    },
    {
        label: "Royalties",
        value: "Royalty Received"
    },
    {
        label: "Split Payment",
        value: "Payment Received"
    }
]

enum ProfileTabs {
    All = "all",
    Own = "owned",
    Created = "created",
    Curation = "curation",
    Activity = "activity",
    Favorite = "fav",
    Order = "order",
    Earn = "earn"
}

export default function Tabs({ tab }: { tab: ProfileTabs }) {
    const favoriteService = new FavoriteService()
    const nftService = new NftServices()
    const createAndSellService = new CreateSellService()

    const [favType, setFavType] = useState<string>("nft")
    const [filters, setFilters] = useState<any>({
        searchInput: "",
        earnFilter: {
            label: earnFilters[0].label,
            value: earnFilters[0].value,
            active: false
        },
        filter: {
            value: profileFilters[0].value,
            label: profileFilters[0].label,
            param: profileFilters[0].param,
            active: false
        }
    })

    const [data, setData] = useState<any>({
        [ProfileTabs.All]: null,
        [ProfileTabs.Own]: null,
        [ProfileTabs.Created]: null,
        [ProfileTabs.Curation]: null,
        [ProfileTabs.Activity]: null,
        [ProfileTabs.Favorite]: null,
        [ProfileTabs.Order]: null,
        [ProfileTabs.Earn]: null
    })

    const isEarn = useMemo(() => {
        if (tab === ProfileTabs.Earn) {
            return true
        }

        return false
    }, [tab])

    const fetchUser = async () => {
        try {
            const nft = await nftService.getNftByUserId({
                searchInput: filters.searchInput,
                filter: {
                    [filters.filter.param]: filters.filter.value
                }
            })

            setData({
                ...data,
                [ProfileTabs.All]: nft.data.nfts
            })

        } catch (error) {
            console.log(error)
        }
    }

    const fetchOwn = async () => {
        try {
            const response = await nftService.getNftByUserId({
                searchInput: filters.searchInput,
                filter: {
                    [filters.filter.param]: filters.filter.value
                }
            })

            if (response.data) {
                setData({
                    ...data,
                    [ProfileTabs.Own]: response.data.nfts
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const fetchCreated = async () => {
        try {
            const response = await nftService.getNftMintedByUser({
                searchInput: filters.searchInput,
                filter: {
                    [filters.filter.param]: filters.filter.value
                }
            })

            if (response.data) {
                setData({
                    ...data,
                    [ProfileTabs.Created]: response.data.nfts ? response.data.nfts : []
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const fetchCuration = async () => {
        try {
            const response = await collectionServices.getUserCollections({
                searchInput: filters.searchInput,
                filter: {
                    [filters.filter.param]: filters.filter.value
                }
            })

            const collections = response.data.collection;
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

            setData({
                ...data,
                [ProfileTabs.Curation]: detailedInfo
            });

        } catch (error) {
            console.log(error)
        }

    }

    const fetchActivity = async () => {
        try {
            const response = await getAllUsersActivity()

            if (response.data) {
                setData({
                    ...data,
                    [ProfileTabs.Activity]: response.data.data ? response.data.data : []
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchFav = async () => {
        try {
            const likedNft = await favoriteService.getUserLikedNfts({
                searchInput: filters.searchInput,
                filter: {
                    [filters.filter.param]: filters.filter.value
                }
            })
            const likedArtist = await favoriteService.getUserLikedArtists({
                searchInput: filters.searchInput,
            })
            const likedCuration = await favoriteService.getUserLikedCollections({
                searchInput: filters.searchInput,
            })

            const nfts = likedNft.data ? likedNft.data.nfts.map((item: any) => {
                return {
                    ...item.nftId,
                }
            }) : []

            const artists = likedArtist.data ? likedArtist.data.artists.map((item: any) => {
                return {
                    ...item.artistId,
                }
            }) : []

            let collections = likedCuration.data ? likedCuration.data.curations.map((item: any) => {
                return {
                    ...item.collectionId,
                }
            }) : []

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
            setData({
                ...data,
                [ProfileTabs.Favorite]: {
                    likedNft: nfts,
                    likedArtist: artists,
                    likedCuration: detailedInfo
                }
            })
            console.log({
                likedNft: nfts,
                likedArtist: artists,
                likedCuration: collections
            })
        } catch (error) {
            console.log(error)
        }
    }

    const fetchOrders = async () => {
        try {
            const response = await createAndSellService.getOrders({
                filters: {
                    [filters.filter.param]: filters.filter.value
                }
            })

            if (response.data) {
                setData({
                    ...data,
                    [ProfileTabs.Order]: response.data.nfts
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const fetchEarnings = async () => {
        try {
            const response = await createAndSellService.getEarnings({
                filter: filters.filter.value
            })

            if (response.data) {
                setData({
                    ...data,
                    [ProfileTabs.Earn]: response.data.earnings
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (tab === ProfileTabs.All) {
            fetchUser()
        }

        if (tab === ProfileTabs.Own) {
            fetchOwn()
        }

        if (tab === ProfileTabs.Created) {
            fetchCreated()
        }

        if (tab === ProfileTabs.Curation) {
            fetchCuration()
        }

        if (tab === ProfileTabs.Activity) {
            fetchActivity()
        }

        if (tab === ProfileTabs.Favorite) {
            fetchFav()
        }

        if (tab === ProfileTabs.Order) {
            fetchOrders()
        }

        if (tab === ProfileTabs.Earn) {
            fetchEarnings()
        }

    }, [tab])
    return (
        <div className="flex flex-col gap-y-4">

            {/* Filters logic */}
            <div className="flex gap-4 my-4">
                <div className="flex gap-x-2 items-center border-2 rounded-xl px-2 w-full">
                    <svg width="20px" height="20px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M17 17L21 21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>

                    <input placeholder="Search by name or trait..." className="py-2 w-full bg-transparent border-none outline-none focus:outline-none" />
                </div>

                <div className="relative flex rounded min-w-[18rem] justify-between items-center px-3 py-2 bg-dark text-white">
                    <p className="text-sm w-[70%]">{isEarn ? filters.earnFilter.label : filters.filter.label}</p>

                    {
                        isEarn ?
                            <>
                                {
                                    filters.earnFilter.active ?
                                        <ChevronUpIcon className="h-7 w-7" onClick={() => {
                                            setFilters({ ...filters, earnFilter: { ...filters.earnFilter, active: !filters.earnFilter.active } })
                                        }} /> :
                                        <ChevronDownIcon className="h-7 w-7" onClick={() => {
                                            setFilters({ ...filters, earnFilter: { ...filters.earnFilter, active: !filters.earnFilter.active } })
                                        }} />
                                }

                                {
                                    filters.earnFilter.active &&
                                    <div className="absolute bg-dark p-3 rounded flex flex-col gap-y-3 min-w-[16rem] top-12 left-0 z-40">
                                        {
                                            earnFilters.map((item, index) => (
                                                <span key={index} onClick={() => {
                                                    setFilters({ ...filters, earnFilter: { label: item.label, value: item.value, active: false } })
                                                }} className="text-sm cursor-pointer">{item.label}</span>
                                            ))
                                        }
                                    </div>
                                }
                            </>
                            :
                            <>
                                {
                                    filters.filter.active ?
                                        <ChevronUpIcon className="h-7 w-7" onClick={() => {
                                            setFilters({ ...filters, filter: { ...filters.filter, active: !filters.filter.active } })
                                        }} /> :
                                        <ChevronDownIcon className="h-7 w-7" onClick={() => {
                                            setFilters({ ...filters, filter: { ...filters.filter, active: !filters.filter.active } })
                                        }} />
                                }

                                {
                                    filters.filter.active &&
                                    <div className="absolute bg-dark p-3 rounded flex flex-col gap-y-3 min-w-[16rem] top-12 left-0 z-40">
                                        {
                                            profileFilters.map((item, index) => (
                                                <span key={index} onClick={() => {
                                                    setFilters({ ...filters, filter: { label: item.label, value: item.value, active: false } })
                                                }} className="text-sm cursor-pointer">{item.label}</span>
                                            ))
                                        }
                                    </div>
                                }
                            </>
                    }

                </div>
            </div>

            {/* User section */}
            {
                tab === ProfileTabs.All && data[ProfileTabs.All] ?
                    <div className="flex gap-5 my-4">
                        {
                            data[ProfileTabs.All].map((item: any, index: number) => {
                                return (
                                    <NftCard key={index} data={item} />
                                )
                            })
                        }
                    </div> : null
            }


            {/* Owned Section */}
            {
                tab === ProfileTabs.Own && data[ProfileTabs.Own] ?
                    <div className="flex gap-5 my-4">
                        {

                            data[ProfileTabs.Own].map((item: any, index: number) => {
                                return (
                                    <NftCard key={index} data={item} />
                                )
                            })
                        }
                    </div> : null
            }

            {/* Created section */}
            {
                tab === ProfileTabs.Created && data[ProfileTabs.Created] ?
                    <div className="flex gap-5 my-4">
                        {
                            data[ProfileTabs.Created].map((item: any, index: number) => {
                                return (
                                    <NftCard key={index} data={item} />
                                )
                            })
                        }
                    </div> : null
            }

            {/* Curation section */}
            {
                tab === ProfileTabs.Curation && data[ProfileTabs.Curation] ?
                    <div className="flex gap-5 my-4">
                        {
                            data[ProfileTabs.Curation].map((item: any, index: number) => {
                                return (
                                    <CurationCard key={index} data={item} />
                                )
                            })
                        }
                    </div> : null
            }

            {/* Activity section */}
            {
                tab === ProfileTabs.Activity && data[ProfileTabs.Activity] ?
                    <div>
                        <Table>
                            <TableCaption>A list of your recent activity.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Event</TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.activity.map((item: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.state}</TableCell>
                                        <TableCell className="flex items-center gap-x-3">
                                            <img src={item.nftId.cloudinaryUrl} className="w-10 aspect-square rounded" />
                                            <span>{item.nftId.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            {item?.price ? item?.price : "-/-"}
                                        </TableCell>
                                        <TableCell>{item?.from?.username
                                            ? item.from.username
                                            : item?.from?.wallet
                                                ? trimString(item.from.wallet)
                                                : item?.fromWallet
                                                    ? trimString(item?.fromWallet)
                                                    : "-/-"}</TableCell>
                                        <TableCell>
                                            {item?.to?.username
                                                ? item?.to?.username
                                                : item?.to?.wallet
                                                    ? trimString(item.to.wallet)
                                                    : item?.toWallet
                                                        ? trimString(item?.toWallet)
                                                        : "-/-"}
                                        </TableCell>
                                        <TableCell>{item?.createdAt
                                            ? new Date(item.createdAt)
                                                .toLocaleString()
                                                .slice(0, 10)
                                            : "-/-"}</TableCell>
                                        <TableCell className="text-right">{item?.createdAt
                                            ? new Date(item.createdAt).toLocaleTimeString()
                                            : "-/-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div> : null
            }

            {/* Favorite section */}
            {
                tab === ProfileTabs.Favorite && data[ProfileTabs.Favorite] ?
                    <div className="flex flex-col gap-y-5">
                        <div className="flex gap-x-5 my-3">
                            <Label onClick={() => setFavType('nft')} className={`${favType === 'nft' ? 'text-neon' : ''} font-medium`}>NFTS</Label>
                            <Label onClick={() => setFavType('curation')} className={`${favType === 'curation' ? 'text-neon' : ''} font-medium`}>Curation</Label>
                            <Label onClick={() => setFavType('artist')} className={`${favType === 'artist' ? 'text-neon' : ''} font-medium`}>Artist</Label>
                        </div>

                        <div className="flex gap-5 flex-wrap">
                            {
                                favType === 'nft' && data[ProfileTabs.Favorite].likedNft ?
                                    data[ProfileTabs.Favorite].likedNft.map((item: any, index: number) => {
                                        return (
                                            <NftCard key={index} data={item} />
                                        )
                                    }) : null
                            }

                            {
                                favType === 'curation' && data[ProfileTabs.Favorite].likedCuration ?
                                    data[ProfileTabs.Favorite].likedCuration.map((item: any, index: number) => {
                                        return (
                                            <CurationCard key={index} data={item} />
                                        )
                                    }) : null
                            }

                            {
                                favType === 'artist' && data[ProfileTabs.Favorite] ?
                                data[ProfileTabs.Favorite].likedArtist.map((item: any, index: number) => {
                                    return (
                                        <ArtistsCard
                                            key={index}
                                            image={item.avatar ? item.avatar.url : ''}
                                            title={item.username}
                                        />
                                    )
                                }) : null
                            }

                        </div>
                    </div>
                    : null
            }

            {/* Orders section */}
            {
                tab === ProfileTabs.Order ?
                    <div>
                        <Table>
                            <TableCaption>A list of your recent Orders.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Id</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Escrow Period</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">View Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            {
                                data[ProfileTabs.Order] ?
                                    <TableBody>
                                        {data[ProfileTabs.Order].map((item: any, index: number) => {
                                            const day = new Date().getTime() - new Date(item?.saleId?.ItemPurchasedOn).getTime()

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">#{item._id}</TableCell>
                                                    <TableCell className="flex items-center gap-x-3">
                                                        <img src={item.nftId.cloudinaryUrl} className="w-10 aspect-square rounded" />
                                                        <span>{item.nftId.name}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item?.saleId?.ItemPurchasedOn
                                                            ? new Date(item?.saleId?.ItemPurchasedOn)
                                                                .toLocaleString()
                                                                .slice(0, 10)
                                                            : "-/-"}
                                                    </TableCell>
                                                    <TableCell>Day {Math.round(day / (1000 * 3600 * 24))}</TableCell>
                                                    <TableCell>In Escrow</TableCell>
                                                    <TableCell className="text-right">
                                                        <Link href={`/nft/${item._id}`}>
                                                            View
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody> : null
                            }

                        </Table>
                    </div> : null
            }

            {/* Earn section */}
            {
                tab === ProfileTabs.Earn ?
                    <div>
                        <Table>
                            <TableCaption>A list of your recent Orders.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Transaction Number (ID)</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Earnings</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">View Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            {
                                data[ProfileTabs.Earn] ?
                                    <TableBody>
                                        {data[ProfileTabs.Earn].map((item: any, index: number) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">#{item._id}</TableCell>
                                                    <TableCell className="flex items-center gap-x-3">
                                                        <img src={item.nftId.cloudinaryUrl} className="w-10 aspect-square rounded" />
                                                        <span>{item.nftId.name}</span>
                                                    </TableCell>
                                                    <TableCell>{item?.price} MATIC</TableCell>
                                                    <TableCell>{item?.createdAt
                                                        ? new Date(item?.createdAt)
                                                            .toLocaleString()
                                                            .slice(0, 10)
                                                        : "-/-"}</TableCell>
                                                    <TableCell>{item?.state}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Link href={`/nft/${item._id}`}>
                                                            View
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody> : null
                            }

                        </Table>
                    </div> : null
            }

        </div>
    )
}
