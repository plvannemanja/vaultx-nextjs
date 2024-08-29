"use client";

import Filters from "@/app/components/ui/Filters";
import Image from "next/image"
import NftCard from "@/app/components/Cards/NftCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Appreciate({ hero, nfts }: { hero: { link: string, image: string } | null, nfts: any[] }) {
    const router = useRouter();

    useEffect(() => {
        console.log(hero, nfts);
    }, [])
    
    return (
        <div className="flex flex-col gap-y-4 px-4">
            {
                hero?.image && hero.link ?
                    <Image src={hero.image} alt="hero" width={100} height={100} quality={100} className="w-full rounded-xl object-fill"
                        // onClick={() => window.open(hero.link, "_blank")}
                    /> : null
            }
            <Filters />

            <div className='flex gap-4 flex-wrap my-4 justify-center md:justify-between'>
                {
                    nfts.map((nft: any, index: number) => {
                        return (
                            <div className="w-[17rem]" key={index} onClick={() => {
                                router.push(`/nft/${nft.tokenId}`)
                            }}>
                                <NftCard data={nft} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
