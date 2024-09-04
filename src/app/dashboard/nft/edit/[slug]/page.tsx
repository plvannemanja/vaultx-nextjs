"use client"

import { useEffect, useState } from "react"
import NftServices from "@/services/nftService";
import CreateNft from "@/app/components/Modules/CreateNft";

export default function Page({ params }: { params: { slug: string } }) {
    const nftId = params.slug;
    const nftService = new NftServices();

    const [formData, setFormData] = useState(null)

    useEffect(() => {
        if (!formData) {
            const fetchData = async () => {
                const response = await nftService.getNftById(nftId)

                if (response.data && response.data.nft) {
                    console.log(response.data.nft)
                    setFormData(response.data.nft)
                }
            }

            fetchData()
        }
    }, [params.slug])
    return (
        <div>
            <CreateNft editMode={formData} />
        </div>
    )
}
