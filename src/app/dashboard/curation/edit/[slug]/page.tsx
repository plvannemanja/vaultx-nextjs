"use client"

import { useEffect, useState } from "react"
import { collectionServices } from "@/services/supplier"
import CreateCuration from "@/app/components/Modules/CreateCuration"
import { useRouter } from "next/navigation"


export default function page({ params } : { params: { slug: string } }) {
    const curationId = params.slug
    const router = useRouter()

    const [formData, setFormData] = useState(null)


    useEffect(() => {
        if (!formData) {
            const fetchData = async () => {
                const collection = await collectionServices.getCollectionById(curationId)

                if (collection.data.collection) {
                    if (collection.data.collection._id !== '') {
                        router.push("/")
                        return
                    }

                    setFormData(collection.data.collection)
                }
            }

            fetchData()
        }

    }, [])
  return (
    <div>
        <CreateCuration editMode={formData} />
    </div>
  )
}
