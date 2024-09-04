'use client';

import { useEffect, useState } from 'react';
import { collectionServices } from '@/services/supplier';
import { z } from 'zod';
import BasicDetails from './create/BasicDetails';
import AdvanceDetails from './create/AdvanceDetails';
import SellerInformation from './create/SellerInformation';
import ErrorModal from './create/ErrorModal';
import TriggerModal from '../ui/TriggerModal';
import { CreateNftServices } from '@/services/createNftService';
import { useActiveAccount } from 'thirdweb/react';
import CurationLoader from "./create/CurationLoader"
import { contract } from '@/lib/contract';
import {
  prepareContractCall,
  sendTransaction,
  readContract,
  resolveMethod,
  prepareEvent,
  getContractEvents,
} from 'thirdweb';
import { pinataGateway, uploadFile, uploadMetaData } from '@/utils/uploadData';
export enum StepType {
  basic,
  advanced,
}
export default function CreateNft() {
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

  const activeAccount = useActiveAccount();
  const [nftId, setNftId] = useState(null);

  //   const handleBasicDetails = (data: any, error: any) => {
  //     setBasicDetails({
  //       data: data,
  //       error: error,
  //     });
  //   };

  //   const handleAdvanceDetails = (data: any, error: any) => {
  //     setAdvanceDetails({
  //       data: data,
  //       error: error,
  //     });
  //   };

  const handleSellerInfo = (data: any, error: any) => {
    setSellerInfo({
      data: data,
      error: error,
    });
  };

  const createBasicDetails = async () => {
    try {
      if (basicDetails.data) {
        const response = await nftService.createBasicDetails(basicDetails.data);

        if (response.data?.data?._id) {
          setNftId(response.data.data._id);
          return response.data.data._id;
        }

        return null;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

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

  const createNFT = async (data: any) => {
    try {
      console.log('create NFT');
      console.log('base Details', basicDetails.data);
      console.log('data', data);
      setStatus({ error: false, loading: true });
      const imageUri = await uploadFile(basicDetails.data.file);
      console.log("imageUri", imageUri);
      let fileUris: string[] = [];
      for (let i = 0; i < basicDetails.data.files.length; i++) {
        let dataUri = await uploadFile(basicDetails.data.files[i]);
        fileUris = [...fileUris, dataUri];
      }
      console.log("fileUris", fileUris);
      const metaData = {
        productName: basicDetails.data.productName,
        productDescription: basicDetails.data.productDescription,
        curationId: basicDetails.data.curation.collectionId,
        artistName: basicDetails.data.artistName,
        image: imageUri,
        attachment: fileUris,
        attributes: data.attributes,
        unlockableContent: basicDetails.data.unlockableContent
      }

      console.log(metaData);
      let tokenUri = await uploadMetaData(metaData);
      console.log("tokenUri", tokenUri);
      setStatus({ error: false, loading: false });


      let collectionId = basicDetails.data.curation.collectionId;
      let price = BigInt(basicDetails.data.price * 1e18);
      let royaltyAddress = data.royalty.receiver;
      let royalPercentage = BigInt(data.royalty.percentage * 10);
      let paymentSplits = [];
      for (let i = 0; i < data.splits.length; i++) {
        paymentSplits.push({
          paymentWallet: data.splits[i].address,
          paymentPercentage: BigInt(data.splits[i].percentage * 10),
        })
      }
      console.log("payment", paymentSplits);
      console.log("royalty", data.royalty);

      const transaction = prepareContractCall({
        contract,
        method: 'listAsset',
        params: [
          collectionId, tokenUri, price, royaltyAddress, royalPercentage,
          paymentSplits

        ]
      });

      if (activeAccount) {
        try {
          const { transactionHash } = await sendTransaction({
            transaction,
            account: activeAccount,
          });
        } catch (error) {
          console.log("error:", error);
        }
      }

      // const signature = await signMessage(
      //   activeAccount,
      //   'This is my token URL',
      // );
      // try {
      //   let data = 'Hello world';
      //   const dataString: String = data.toString();
      //   let sig = activeAccount?.signMessage({ message: 'hello' });
      //   console.log('SIG', sig);
      // } catch (err) {
      //   console.log('err', err);
      // }

      //   const nftId = await createBasicDetails();
      //   console.log('nftId', nftId);
      //   if (!nftId) {
      //     throw new Error('Failed to create NFT');
      //   }
      //   if (!sellerInfo.data) {
      //     throw new Error('Seller Information');
      //   }
      //   await createAdvanceDetails(nftId);
      //   const selectedSeller = sellerInfo.data.shipping;
      //   if (!selectedSeller.address) {
      //     throw new Error('Address is required');
      //   }
      //   const data = {
      //     name: selectedSeller.name,
      //     email: selectedSeller.email,
      //     country: selectedSeller.country,
      //     address: {
      //       line1: selectedSeller.address.line1,
      //       line2: selectedSeller.address.line2,
      //       city: selectedSeller.address.city,
      //       state: selectedSeller.address.state,
      //       postalCode: selectedSeller.address.postalCode,
      //     },
      //     phoneNumber: selectedSeller.phoneNumber,
      //     shippingInformation: {
      //       lengths: sellerInfo.lengths,
      //       width: sellerInfo.width,
      //       height: sellerInfo.height,
      //       weight: sellerInfo.weight,
      //     },
      //   };
      //   console.log('data', data);
      //   const {
      //     data: { uri },
      //   } = await nftService.createSellerDetails(data);
      //   if (!uri) {
      //     throw new Error('Failed to create NFT');
      //   }
      //   await handleMint(uri, nftId);
    } catch (error) {
      console.log("error:", error);
    }
  };

  // Add your logic here
  const handleMint = async (uri: string, nftId: string) => {
    try {
    } catch (error) { }
  };

  const nextStep = async (
    next?: boolean,
    data?: any,
    error?: any,
    type?: StepType,
  ) => {
    if (type == StepType.basic) {
      setBasicDetails({
        data: data,
        error: error,
      });
    } else if ((type = StepType.advanced)) {
      setAdvanceDetails({
        data: data,
        error: error,
      });
    }

    if (next && step == 2) {
      await createNFT(data);
      return;
    }

    if (next) {
      setStep(step + 1);
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex flex-col gap-y-4 px-4">
      {
        status.loading &&
        <TriggerModal
          isOpen={status.loading || status.error}
          close={() => setStatus({ error: false, loading: false })}
        >
          <CurationLoader status={status} />
        </TriggerModal>

      }

      <p className="text-xl font-medium">Create New NFT</p>
      <div className="my-4 flex gap-x-7 flex-wrap items-center">
        <div className="flex gap-x-2 items-center">
          <div className="w-10 h-10 rounded-full relative bg-neon">
            <span className="absolute top-2 left-4">1</span>
          </div>
          <p>Basic Details</p>
        </div>

        <svg
          width="24px"
          height="24px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#fff"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>

        <div className="flex gap-x-2 items-center">
          <div className="w-10 h-10 rounded-full relative bg-neon">
            <span className="absolute top-2 left-4">2</span>
          </div>
          <p>Advance Details</p>
        </div>

        <svg
          width="24px"
          height="24px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#fff"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>

        {/* <div className="flex gap-x-2 items-center">
          <div className="w-10 h-10 rounded-full relative bg-neon">
            <span className="absolute top-2 left-4">3</span>
          </div>
          <p>Seller Information</p>
        </div> */}
      </div>

      {basicDetails.error && (
        <TriggerModal
          isOpen={basicDetails.error ? true : false}
          close={() => setBasicDetails({ ...basicDetails, error: null })}
        >
          <ErrorModal data={JSON.parse(basicDetails.error)} />
        </TriggerModal>
      )}

      {advanceDetails.error && (
        <TriggerModal
          isOpen={advanceDetails.error ? true : false}
          close={() => setAdvanceDetails({ ...advanceDetails, error: null })}
        >
          <ErrorModal data={JSON.parse(advanceDetails.error)} />
        </TriggerModal>

      )}

      {sellerInfo.error && (
        <TriggerModal
          isOpen={sellerInfo.error ? true : false}
          close={() => setSellerInfo({ ...sellerInfo, error: null })}
        >
          <ErrorModal data={JSON.parse(sellerInfo.error)} />
        </TriggerModal>
      )}

      {step === 1 && <BasicDetails nextStep={nextStep} />}
      {step === 2 && <AdvanceDetails nextStep={nextStep} />}
      {/* {step === 3 && (
        <SellerInformation handler={handleSellerInfo} nextStep={nextStep} />
      )} */}
    </div>
  );
}
