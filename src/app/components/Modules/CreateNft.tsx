"use client"

import { useState } from "react"
import { collectionServices } from "@/services/supplier"
import { z } from "zod"
import BasicDetails from "./create/BasicDetails"
import AdvanceDetails from "./create/AdvanceDetails"
import SellerInformation from "./create/SellerInformation"

export default function CreateNft() {
    const [step, setStep] = useState(1)
    const [progress, setProgress] = useState({
        basic: 0,
        advance: 0,
        seller: 0
    })

    const [basicDetails, setBasicDetails] = useState<any>({
        data: null,
        error: null
    })

    const [advanceDetails, setAdvanceDetails] = useState<any>({
        data: null,
        error: null
    })

    const [sellerInfo, setSellerInfo] = useState<any>({
        data: null,
        error: null
    })

    const handleBasicDetails = (data: any, error: any) => {
        setBasicDetails({
            data: data,
            error: error
        })
    }

    const handleAdvanceDetails = (data: any, error: any) => {
        setAdvanceDetails({
            data: data,
            error: error
        })
    }

    const handleSellerInfo = (data: any, error: any) => {
        setSellerInfo({
            data: data,
            error: error
        })
    }

    const createCollection = async () => {
        if (basicDetails) {
            const response = await collectionServices.create(basicDetails)

            if (response) {
                setProgress({
                    ...progress,
                    basic: 1
                })
            }
        }
    }

    const nextStep = (next?: boolean) => {
        if (next) {
            setStep(step + 1)
        } else {
            setStep(step - 1)
        }
    }



    return (
        <div className="flex flex-col gap-y-4 px-4">
            <p className="text-xl font-medium">Create New NFT</p>
            <div className="my-4 flex gap-x-7 flex-wrap items-center">
                <div className="flex gap-x-2 items-center">
                    <div className="w-10 h-10 rounded-full relative bg-neon">
                        <span className="absolute top-2 left-4">1</span>
                    </div>
                    <p>Basic Details</p>
                </div>

                <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M9 6L15 12L9 18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>

                <div className="flex gap-x-2 items-center">
                    <div className="w-10 h-10 rounded-full relative bg-neon">
                        <span className="absolute top-2 left-4">2</span>
                    </div>
                    <p>Advance Details</p>
                </div>

                <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M9 6L15 12L9 18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>

                <div className="flex gap-x-2 items-center">
                    <div className="w-10 h-10 rounded-full relative bg-neon">
                        <span className="absolute top-2 left-4">3</span>
                    </div>
                    <p>Seller Information</p>
                </div>
            </div>

            {
                step === 1 && <BasicDetails handler={handleBasicDetails} nextStep={nextStep} />
            }
            {
                step === 2 && <AdvanceDetails handler={handleAdvanceDetails} nextStep={nextStep} />
            }
            {
                step === 3 && <SellerInformation handler={handleSellerInfo} nextStep={nextStep} />
            }
        </div>
    )
}
