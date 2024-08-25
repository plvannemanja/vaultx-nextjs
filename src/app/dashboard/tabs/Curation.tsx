"use client";

import Filters from "@/app/components/ui/Filters";
import Image from "next/image"
import CurationCard from "@/app/components/Cards/CurationCard";
import { useEffect, useState } from "react";
import { collectionServices } from "@/services/supplier";
import CurationSearch from "@/app/components/Filters/CurationSearch";

export default function Curation({ hero, collections }: { hero: { link: string, image: string } | null, collections: any[] }) {
    const [data, setData] = useState<any[]>([]);
    const [filters, setFilters] = useState<any>({
        searchInput: "",
        filter: null
    })

    const handleFilters = (data: any) => {
        if (data && typeof data === "object") {
            setFilters({
                searchInput: data.search,
                filter: {
                    [data.filter]: -1
                }
            })
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await collectionServices.getAllCollections(filters)

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

            setData(detailedInfo);
        }

        fetchData()
    }, [filters])

    return (
        <div className="flex flex-col gap-y-4 px-4">
            {
                hero?.image && hero.link ?
                    <Image src={hero.image} alt="hero" width={100} height={100} quality={100} className="w-full rounded-xl object-fill"
                        onClick={() => window.open(hero.link, "_blank")}
                    /> : null
            }
            <CurationSearch setState={handleFilters} />

            <div className='flex gap-4 flex-wrap my-4 justify-center md:justify-start'>
                {
                    data.length > 0 ?
                        data.map((collection: any, index: number) => {
                            return (
                                <div className="w-[23rem]">
                                    <CurationCard key={index} data={collection} />
                                </div>
                            )
                        })
                        :
                        collections.map((collection: any, index: number) => {
                            return (
                                <div className="w-[23rem]">
                                    <CurationCard key={index} data={collection} />
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}
