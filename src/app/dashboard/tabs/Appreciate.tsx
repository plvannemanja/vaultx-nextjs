"use client";

import Filters from "@/app/components/ui/Filters";
import Image from "next/image"
import NftCard from "@/app/components/Cards/NftCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NftServices from "@/services/nftService";

export default function Appreciate({ hero, nfts }: { hero: { link: string, image: string } | null, nfts: any[] }) {
    const nftService = new NftServices();
    const [data, setData] = useState<any[]>([]);

    const router = useRouter();
    const [filters, setFilters] = useState({
        searchInput: "",
        filter: {
            price: 1
        },
        category: "Fine Art"
    })

    const handleFilters = (data: any) => {
        if (data && typeof data === "object") {
            setFilters({
                searchInput: data.search,
                filter: {
                    price: data.price.value
                },
                category: data.category.label
            })
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await nftService.getAllNfts(filters)
            setData(response.data.nfts[0]?.data);
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
            <Filters setState={handleFilters} />

            <div className='flex gap-4 flex-wrap my-4 justify-center md:gap-6'>
                {
                    data.length > 0 ?
                        data.map((nft: any, index: number) => {
                            return (
                                <div className="w-[17rem]" onClick={() => {
                                    router.push(`/nft/${nft._id}`)
                                }}>
                                    <NftCard key={index} data={nft} />
                                </div>
                            )
                        })
                        :
                        nfts.map((nft: any, index: number) => {
                            return (
                                <div className="w-[17rem]" onClick={() => {
                                    router.push(`/nft/${nft._id}`)
                                }}>
                                    <NftCard key={index} data={nft} />
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}
