'use client';

import { useState } from "react"
import { collectionServices } from "@/services/supplier"
import { z } from "zod"
import BasicDetails from "./create/BasicDetails"
import AdvanceDetails from "./create/AdvanceDetails"
import SellerInformation from "./create/SellerInformation"
import ErrorModal from "./create/ErrorModal"
import { error } from "console"
import TriggerModal from "../ui/TriggerModal"
import { CreateNftServices } from "@/services/createNftService"
import { useActiveAccount } from 'thirdweb/react';
import CurationLoader from "./create/CurationLoader"
import { pinataGateway, uploadFile, uploadMetaData } from '@/utils/uploadData';
import { useCreateNFT } from "../Context/CreateNFTContext";
import { IListAsset, listAsset } from "@/lib/helper";
import { parseEther, zeroAddress } from "viem";
import { Address, isAddress } from "thirdweb";
export enum StepType {
  basic,
  advanced,
}
export default function CreateNft({ editMode }: { editMode?: any }) {
  const nftService = new CreateNftServices();

  const [status, setStatus] = useState({
    error: false,
    loading: false
  });
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState({
    basic: 0,
    advance: 0,
    seller: 0,
  });
  const [basicDetails, setBasicDetails] = useState<any>({
    data: null,
    error: null,
  });
  const [advanceDetails, setAdvanceDetails] = useState<any>({
    data: null,
    error: null,
  });
  const [sellerInfo, setSellerInfo] = useState<any>({
    data: null,
    error: null,
  });

  const { advancedOptions, basicDetail, advancedDetails: advancedFormData, paymentSplits } = useCreateNFT();

  const activeAccount = useActiveAccount();
  const [nftId, setNftId] = useState(null);

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
      error: error,
    });
  };

  const createBasicDetails = async () => {
    try {
      if (basicDetails.data) {
        const response = await nftService.createBasicDetails(basicDetails.data)

        if (response.data?.data?._id) {
          setNftId(response.data.data._id)
          return response.data.data._id
        }

        return null
      }

      return null
    } catch (error) {
      return null
    }
  }

  const createAdvanceDetails = async (id: string) => {
    try {
      if (advanceDetails.data) {
        await nftService.createAdvancedDetails({
          ...advanceDetails.data,
          nftId: id,
        });
      }
    } catch (error) { }
  };

  const createNFT = async () => {
    try {
      debugger;
      const nftId = await createBasicDetails()

      if (!nftId) {
        throw new Error('Failed to create NFT')
      }

      if (!sellerInfo.data) {
        throw new Error('Seller Information')
      }

      await createAdvanceDetails(nftId)

      const selectedSeller = sellerInfo.data.shipping

      if (!selectedSeller.address) {
        throw new Error('Address is required')
      }

      const data = {
        name: selectedSeller.name,
        email: selectedSeller.email,
        country: selectedSeller.country,
        address: {
          line1: selectedSeller.address.line1,
          line2: selectedSeller.address.line2,
          city: selectedSeller.address.city,
          state: selectedSeller.address.state,
          postalCode: selectedSeller.address.postalCode,
        },
        phoneNumber: selectedSeller.phoneNumber,
        shippingInformation: {
          lengths: sellerInfo.lengths,
          width: sellerInfo.width,
          height: sellerInfo.height,
          weight: sellerInfo.weight,
        },
      };

      const { data: { uri } } = await nftService.createSellerDetails(data)

      if (!uri) {
        throw new Error('Failed to create NFT')
      }

      await handleMint(uri, nftId)
    } catch (error) {

    }
  }

  // Add your logic here
  const handleMint = async (uri: string, nftId: string) => {
    debugger;
    try {
      // check free mint
      if (advancedOptions.freeMint || !activeAccount)
        return;

      let price = parseEther(basicDetail.price);
      let curationPayload = JSON.parse(basicDetail.curation);
      let nftPayload: IListAsset = {
        collectionId: curationPayload?.tokenId,
        tokenURI: uri,
        price,
        royaltyWallet: "",
        royaltyPercentage: BigInt(0),
        paymentSplits: [],
        account: activeAccount
      }

      if (advancedOptions.royalties) {
        nftPayload.royaltyWallet = isAddress(advancedFormData.royaltyAddress) ? advanceDetails.royaltyAddress : zeroAddress;
        nftPayload.royaltyPercentage = BigInt(advancedFormData.royalty * 100);
      }

      if (advancedOptions.split) {
        nftPayload.paymentSplits = paymentSplits.map(split => ({
          paymentWallet: split.paymentWallet,
          paymentPercentage: split.paymentPercentage * BigInt(100)
        }))
      }

      let { tokenId } = await listAsset(nftPayload);
    } catch (error) {
      console.log(error);
    }
  };

  const nextStep = async (next?: boolean) => {
    debugger;
    if (next && step == 3) {
      await createNFT()
    }

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
        basicDetails.error &&
        <TriggerModal
          isOpen={basicDetails.error ? true : false}
          children={<ErrorModal data={JSON.parse(basicDetails.error)} />}
          close={() => setBasicDetails({ ...basicDetails, error: null })}
        />
      }

      {
        advanceDetails.error &&
        <TriggerModal
          isOpen={advanceDetails.error ? true : false}
          children={<ErrorModal data={JSON.parse(advanceDetails.error)} />}
          close={() => setAdvanceDetails({ ...advanceDetails, error: null })}
        />
      }

      {
        sellerInfo.error &&
        <TriggerModal
          isOpen={sellerInfo.error ? true : false}
          children={<ErrorModal data={JSON.parse(sellerInfo.error)} />}
          close={() => setSellerInfo({ ...sellerInfo, error: null })}
        />
      }

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