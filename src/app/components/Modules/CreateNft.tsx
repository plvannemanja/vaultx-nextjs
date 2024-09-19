'use client';

import { useState } from 'react';
import BasicDetails from './create/BasicDetails';
import AdvanceDetails from './create/AdvanceDetails';
import SellerInformation from './create/SellerInformation';
import ErrorModal from './create/ErrorModal';
import TriggerModal from '../ui/TriggerModal';
import { CreateNftServices } from '@/services/createNftService';
import { useActiveAccount } from 'thirdweb/react';
import { useCreateNFT } from '../Context/CreateNFTContext';
import { getVoucherSignature, IListAsset, listAsset } from '@/lib/helper';
import { parseEther, zeroAddress } from 'viem';
import { Address, isAddress } from 'thirdweb';
import { useToast } from '@/hooks/use-toast';
import MintLoader from './create/MintLoader';
import RestrictiveModal from '../Modals/RestrictiveModal';
import ConnectedCard from '../Cards/ConnectedCard';
import { INFTVoucher } from '@/types';

export enum StepType {
  basic,
  advanced,
}

export default function CreateNft({ editMode }: { editMode?: any }) {
  const nftService = new CreateNftServices();
  const nftContext = useCreateNFT();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [nftId, setNftId] = useState(null);
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

  const {
    advancedOptions,
    basicDetail,
    advancedDetails: advancedFormData,
    paymentSplits,
  } = useCreateNFT();

  const activeAccount = useActiveAccount();

  const handleBasicDetails = (data: any, error: any) => {
    setBasicDetails({
      data: data,
      error: error,
    });
  };

  const handleAdvanceDetails = (data: any, error: any) => {
    setAdvanceDetails({
      data: data,
      error: error,
    });
  };

  const handleSellerInfo = (data: any, error: any) => {
    setSellerInfo({
      data: data,
      error: error,
    });
  };

  const createBasicDetails = async () => {
    try {
      if (nftContext.basicDetail.artistName) {
        const data = new FormData();
        const curation = JSON.parse(nftContext.basicDetail.curation);
        data.append('name', nftContext.basicDetail.productName);
        data.append('description', nftContext.basicDetail.productDescription);
        data.append('artist', nftContext.basicDetail.artistName);
        data.append('price', nftContext.basicDetail.price);
        data.append('curation', curation?._id);

        const files = [
          nftContext.basicDetail.file,
          ...nftContext.basicDetail.attachments,
        ];
        files.forEach((file, index) => {
          if (file) {
            data.append(`files`, file);
          }
        });

        const response = await nftService.createBasicDetails(data);

        if (response.data?.data?._id) {
          return response.data.data._id;
        }

        return null;
      }

      return null;
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Failed to create NFT',
        variant: 'destructive',
      });
      return null;
    }
  };

  const createAdvanceDetails = async (id: string) => {
    try {
      if (nftContext.advancedDetails) {
        const data = new FormData();
        data.append('nftId', id);
        if (nftContext.advancedOptions.freeMint) {
          data.append(
            'freeMinting',
            nftContext.advancedOptions.freeMint as any,
          );
        }
        if (nftContext.advancedOptions.royalties) {
          if (!nftContext.advancedDetails.royalty) return;
          data.append('royalty', nftContext.advancedDetails.royalty as any);
        }
        if (nftContext.advancedDetails.category) {
          if (!nftContext.advancedDetails.category) return;
          data.append('category', nftContext.advancedDetails.category.category);
        }
        if (nftContext.advancedDetails.unlockable) {
          if (!nftContext.advancedDetails.category.unlockable) return;
          data.append(
            'unlockableContent',
            nftContext.advancedDetails.category.unlockable,
          );
          for (
            let i = 0;
            i < nftContext.advancedDetails.certificates.length;
            i++
          ) {
            data.append(
              'certificates',
              nftContext.advancedDetails.certificates[i],
            );
          }
        }
        data.append(
          'attributes',
          JSON.stringify(
            nftContext.advancedDetails.attributes
              ? nftContext.advancedDetails.attributes
              : [],
          ),
        );

        await nftService.createAdvancedDetails(data);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred',
        description: 'Failed to create NFT',
        variant: 'destructive',
      });
      return null;
    }
  };

  const createNFT = async () => {
    let nftId = null;
    try {
      nftId = await createBasicDetails();

      if (!nftId) {
        throw new Error('Failed to create NFT');
      }

      await createAdvanceDetails(nftId);
      setNftId(nftId);

      const selectedSeller = nftContext.sellerInfo.shipping;

      if (!selectedSeller.address) {
        throw new Error('Address is required');
      }

      // payment split
      let splitData = paymentSplits.map((item) => ({
        address: item.paymentWallet,
        percentage: Number(item.paymentPercentage),
      }));

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
        splitPayments: splitData,
        nftId,
      };

      const {
        data: { uri },
      } = await nftService.createSellerDetails(data);

      if (!uri) {
        throw new Error('Failed to create NFT');
      }

      await handleMint(uri, nftId);
      toast({
        title: 'NFT minted',
        description: 'Success to create NFT',
      });
      setMintLoaderStep(2);
      setTimeout(() => {
        setModal(false);
      }, 2000);
    } catch (error) {
      setModal(false);
      toast({
        title: 'An error occurred',
        description: 'Failed to create NFT, please try again',
        variant: 'destructive',
      });
      if (nftId) {
        await nftService.removeFromDb({
          nftId: nftId,
        });
      }
    }
  };

  // Add your logic here
  const handleMint = async (uri: string, nftId: string) => {
    try {
      if (!activeAccount) {
        throw new Error('You should login a wallet.');
      }

      let price = parseEther(String(basicDetail.price));
      let curationPayload = JSON.parse(basicDetail.curation);
      let nftPayload: IListAsset = {
        curationId: curationPayload?.tokenId,
        tokenURI: uri,
        price,
        royaltyWallet: '',
        royaltyPercentage: BigInt(0),
        paymentSplits: [],
        account: activeAccount,
      };

      if (advancedOptions.royalties) {
        nftPayload.royaltyWallet = isAddress(advancedFormData.royaltyAddress)
          ? advancedFormData.royaltyAddress
          : zeroAddress;
        nftPayload.royaltyPercentage = BigInt(advancedFormData.royalty * 100);
      } else {
        nftPayload.royaltyWallet = activeAccount?.address as Address;
        nftPayload.royaltyPercentage = BigInt(0);
      }

      if (advancedOptions.split) {
        let sum = BigInt(0);
        let splitArr = [];
        paymentSplits.forEach((split) => {
          splitArr.push({
            paymentWallet: split.paymentWallet,
            paymentPercentage: split.paymentPercentage * BigInt(100), // decimal 2
          });
          sum += split.paymentPercentage;
        });
        if (sum > BigInt(100)) {
          throw new Error('Total split percentage exceeds 100%.');
        }
        splitArr.push({
          paymentWallet: activeAccount?.address as Address,
          paymentPercentage: (BigInt(100) - sum) * BigInt(100),
        });
        nftPayload.paymentSplits = splitArr;
      } else {
        nftPayload.paymentSplits = [
          {
            paymentWallet: activeAccount?.address as Address,
            paymentPercentage: BigInt(100 * 100),
          },
        ];
      }
      // check free mint
      if (advancedOptions.freeMint) {
        let paymentWallets: Address[] = [];
        let paymentPercentages: bigint[] = [];
        nftPayload.paymentSplits.forEach((split) => {
          paymentWallets.push(split.paymentWallet as Address);
          paymentPercentages.push(split.paymentPercentage);
        });
        const NFTVoucher: INFTVoucher = {
          curationId: BigInt(nftPayload.curationId),
          tokenURI: nftPayload.tokenURI,
          price: nftPayload.price,
          royaltyWallet: nftPayload.royaltyWallet,
          royaltyPercentage: nftPayload.royaltyPercentage,
          paymentWallets,
          paymentPercentages,
        };

        const signature = await getVoucherSignature(NFTVoucher, activeAccount);

        const voucherString = JSON.stringify(
          { ...NFTVoucher, signature },
          (key, value) => (typeof value === 'bigint' ? Number(value) : value),
        );

        // update voucher
        await nftService.createVoucher({
          nftId,
          voucher: voucherString,
        });

        return;
      } else {
        let { tokenId, transactionHash } = await listAsset(nftPayload);
        await nftService.mintAndSale({
          nftId,
          mintHash: transactionHash,
          tokenId: Number(tokenId),
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const [modal, setModal] = useState(false);
  const [mintLoaderStep, setMintLoaderStep] = useState(1);

  const nextStep = async (next?: boolean) => {
    if (next && step == 3) {
      setModal(true);
      await createNFT();
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
      <RestrictiveModal open={modal} onClose={() => setModal(false)}>
        <MintLoader progress={mintLoaderStep} nftId={nftId} />
      </RestrictiveModal>

      <p className="text-xl font-medium">Create New NFT</p>
      <div className="my-4 flex gap-x-7 flex-wrap items-center">
        <div
          className={`flex gap-x-2 items-center ${step !== 1 ? 'opacity-60' : ''}`}
        >
          <div className="w-10 h-10 rounded-full relative bg-neon">
            <span className={`absolute top-2 left-4 text-black`}>1</span>
          </div>
          <p>Basic Details</p>
        </div>

        <svg
          className={`${step !== 1 ? 'opacity-60' : ''}`}
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

        <div
          className={`flex gap-x-2 items-center ${step !== 2 ? 'opacity-60' : ''}`}
        >
          <div className="w-10 h-10 rounded-full relative bg-neon">
            <span className={`absolute top-2 left-4 text-black`}>2</span>
          </div>
          <p>Advance Details</p>
        </div>

        <svg
          className={`${step !== 2 ? 'opacity-60' : ''}`}
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

        <div
          className={`flex gap-x-2 items-center ${step !== 3 ? 'opacity-60' : ''}`}
        >
          <div className="w-10 h-10 rounded-full relative bg-neon">
            <span className={`absolute top-2 left-4 text-black`}>3</span>
          </div>
          <p>Seller Information</p>
        </div>
      </div>

      {basicDetails.error && (
        <TriggerModal
          isOpen={basicDetails.error ? true : false}
          close={() => setBasicDetails({ ...basicDetails, error: null })}
        >
          <ErrorModal
            data={JSON.parse(basicDetails.error)}
            close={() => setBasicDetails({ ...basicDetails, error: null })}
          />
        </TriggerModal>
      )}

      {advanceDetails.error && (
        <TriggerModal
          isOpen={advanceDetails.error ? true : false}
          close={() => setAdvanceDetails({ ...advanceDetails, error: null })}
        >
          <ErrorModal
            data={JSON.parse(advanceDetails.error)}
            close={() => setAdvanceDetails({ ...advanceDetails, error: null })}
          />
        </TriggerModal>
      )}

      {sellerInfo.error && (
        <TriggerModal
          isOpen={sellerInfo.error ? true : false}
          close={() => setSellerInfo({ ...sellerInfo, error: null })}
        >
          <ErrorModal
            data={JSON.parse(sellerInfo.error)}
            close={() => setSellerInfo({ ...sellerInfo, error: null })}
          />
        </TriggerModal>
      )}
      <div className="flex mb-[30px]">
        <ConnectedCard />
      </div>

      {step === 1 && (
        <BasicDetails handler={handleBasicDetails} nextStep={nextStep} />
      )}

      {step === 2 && (
        <AdvanceDetails handler={handleAdvanceDetails} nextStep={nextStep} />
      )}
      
      {step === 3 && (
        <SellerInformation handler={handleSellerInfo} nextStep={nextStep} />
      )}
    </div>
  );
}
