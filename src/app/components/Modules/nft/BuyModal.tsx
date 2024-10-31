/* eslint-disable @next/next/no-img-element */
'use client';

import { Label } from '@/components/ui/label';
import {
  getTokenAmount,
  purchaseAsset,
  purchaseAssetBeforeMint,
} from '@/lib/helper';
import { cn, formatNumberWithCommas } from '@/lib/utils';
import { CreateNftServices } from '@/services/createNftService';
import { CreateSellService } from '@/services/createSellService';
import { INFTVoucher } from '@/types';
import { roundToDecimals, trimString } from '@/utils/helpers';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { z } from 'zod';
import ConnectedCard from '../../Cards/ConnectedCard';
import { useCreateNFT } from '../../Context/CreateNFTContext';
import { useGlobalContext } from '../../Context/GlobalContext';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import BaseButton from '../../ui/BaseButton';
import ContactInfo from '../ContactInfo';
import ErrorModal from '../create/ErrorModal';
import ShippingInfo from '../ShippingInfo';

const addressSchema = z.object({
  accepted: z.boolean().refine((val) => val === true, {
    message: 'The value must be true.',
  }),
  shippingId: z.string().nonempty('Shipping information is invalid'),
  contactId: z.string().nonempty('Contact information is invalid.'),
});

interface addressErrorType {
  accepted?: string;
  shippingId?: string;
  contactId?: string;
}

export default function BuyModal({
  onClose,
  fetchNftData,
  step,
  setStep,
}: {
  onClose: () => void;
  fetchNftData: () => void;
  step: number;
  setStep: (value: number) => void;
}) {
  const { NFTDetail, nftId: id } = useNFTDetail();
  const { fee } = useGlobalContext();
  const [tokenAmount, setTokenAmount] = useState<string | null>(null);
  const [expectedAmount, setExpectedAmount] = useState<number | null>(null);
  const [error, setError] = useState(null);
  const [addressError, setAddressError] = useState<addressErrorType>({});
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const {
    sellerInfo: { shipping, shippingId, contact, contactId },
  } = useCreateNFT();

  const [formData, setFormData] = useState({
    accepted: false,
  });

  const address = activeAccount?.address
    ? activeAccount?.address.slice(0, 6) +
      '...' +
      activeAccount?.address.slice(-4)
    : 'Connect Wallet';

  const cancelChanges = () => {
    setFormData({
      accepted: false,
    });
  };

  const buyNFT = async () => {
    try {
      setStep(3);
      const tokenAmount = await getTokenAmount(
        NFTDetail.price.toString(),
        'Wei',
      );
      const { transactionHash } = await purchaseAsset(
        BigInt(NFTDetail?.tokenId),
        tokenAmount as bigint,
        activeAccount,
      );

      const data = {
        nftId: id,
        name: shipping?.name,
        email: shipping?.email,
        country: shipping?.country,
        address: shipping?.address,
        phoneNumber: shipping?.phoneNumber,
        contactInformation: contact?.contactInfo,
        concent: formData.accepted,
        buyHash: transactionHash,
        lastPrice: Number(tokenAmount),
      };

      const saleService = new CreateSellService();
      await saleService.buyItem(data);
      setStep(4);
    } catch (error) {
      console.log(error);
      setError(JSON.stringify(error));
      // onClose();
    }
  };

  const buyFreeMint = async () => {
    try {
      setStep(3);
      const voucher: INFTVoucher = JSON.parse(
        NFTDetail.voucher,
        (key, value) => {
          // Check if the value is a number and can be safely converted to BigInt
          if (typeof value === 'number' && Number.isSafeInteger(value)) {
            return BigInt(value);
          }
          return value;
        },
      );

      const tokenAmount = await getTokenAmount(
        NFTDetail.price.toString(),
        'Wei',
      );

      const { tokenId, transactionHash } = await purchaseAssetBeforeMint(
        voucher as Omit<INFTVoucher, 'signature'> & {
          signature: `0x${string}`;
        },
        tokenAmount as bigint,
        activeAccount,
      );
      const data = {
        nftId: id,
        name: shipping?.name,
        email: shipping?.email,
        country: shipping?.country,
        address: shipping?.address,
        phoneNumber: shipping?.phoneNumber,
        contactInformation: contact?.contactInfo,
        concent: formData.accepted,
        buyHash: transactionHash,
        lastPrice: Number(tokenAmount),
      };
      const createNftService = new CreateNftServices();
      await createNftService.mintAndSale({
        nftId: NFTDetail?._id,
        mintHash: transactionHash,
        tokenId: Number(tokenId),
      });
      const saleService = new CreateSellService();
      await saleService.buyItem(data);
      setStep(4);
    } catch (error) {
      setError(JSON.stringify(error));
      // onClose();
    }
  };

  const purchase = async () => {
    if (NFTDetail.minted) await buyNFT();
    else await buyFreeMint();
  };

  const handleAddress = async () => {
    const result = addressSchema.safeParse({
      ...formData,
      shippingId,
      contactId,
    });

    if (!result.success) {
      const addressErrors = result.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});

      setAddressError(addressErrors);
    } else {
      setAddressError({});
      // Handle valid submission
      setStep(2);
    }
  };

  const checkAmount = async () => {
    const tokenAmount = await getTokenAmount(NFTDetail.price.toString());
    setTokenAmount(tokenAmount as string);
    const expectedAmount = (Number(tokenAmount) * 100) / (100 - fee);
    setExpectedAmount(roundToDecimals(expectedAmount ?? null, 5));
  };

  useEffect(() => {
    checkAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[#161616]">
      {error ? (
        <ErrorModal
          title="Error"
          data={error}
          close={() => {
            onClose();
          }}
        />
      ) : (
        <>
          {step === 1 && (
            <div className="flex flex-col gap-y-6 w-full">
              <div className="flex items-center gap-x-2">
                <Image
                  src={'/icons/alert.svg'}
                  width={49}
                  height={50}
                  className="w-8 h-8"
                  quality={100}
                  alt="alert"
                />
                <h1 className="font-extrabold text-[30px]">
                  {"Buyer's Information"}
                </h1>
              </div>
              <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
                <Disclosure as="div" defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <DisclosureButton
                        className={cn(
                          'flex w-full flex-col justify-between py-2 pb-3 text-left   text-lg font-medium text-white text-[18px]',
                          open ? 'border-b border-white/[8%]' : '',
                        )}
                      >
                        <div className="flex w-full justify-between items-center">
                          <Label className="font-extrabold text-lg text-white">
                            Shipping Information
                          </Label>
                          <div className="flex justify-center">
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-white/[53%]`}
                            />
                          </div>
                        </div>
                      </DisclosureButton>
                      <DisclosurePanel className="pt-4 pb-2 text-sm  text-white  rounded-b-lg">
                        <ShippingInfo isSetting />
                        {addressError?.shippingId && (
                          <p className="text-red-500 text-sm">
                            {addressError.shippingId}
                          </p>
                        )}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>

              <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
                <Disclosure as="div" defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <DisclosureButton
                        className={cn(
                          'flex w-full flex-col justify-between py-2 pb-3 text-left   text-lg font-medium text-white text-[18px]',
                          open ? 'border-b border-white/[8%]' : '',
                        )}
                      >
                        <div className="flex w-full justify-between items-center">
                          <Label className="font-extrabold text-lg text-white">
                            Contact Information
                          </Label>
                          <div className="flex justify-center">
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-white/[53%]`}
                            />
                          </div>
                        </div>
                      </DisclosureButton>
                      <DisclosurePanel className="pt-4 pb-2 text-sm  text-white  rounded-b-lg">
                        <ContactInfo isSetting />
                        {addressError?.contactId && (
                          <p className="text-red-500 text-sm">
                            {addressError.contactId}
                          </p>
                        )}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>

              <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
                <Disclosure as="div" defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <DisclosureButton
                        className={cn(
                          'flex w-full flex-col justify-between py-2 pb-3 text-left',
                          open ? 'border-b border-white/[8%]' : '',
                        )}
                      >
                        <div className="flex w-full justify-between items-center mb-1">
                          <Label className="font-extrabold text-white text-lg">
                            Consent for collection and Usage of Personal
                            Information
                          </Label>
                        </div>
                        <p className="text-white/[53%] text-base azeret-mono-font">
                          Please read the following and check the appropriate
                          boxes to indicate your consent:
                        </p>
                      </DisclosureButton>
                      <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                        <div className="text-white/50 rounded-[24px] bg-[#161616] py-[15px] px-[26px] text-base font-normal azeret-mono-font">
                          We collect two types of information from you:
                          <br />
                          1. Personal Information: This includes your individual
                          information such as Email, Phone Number, Username,
                          Avatar, Profile Picture, Date of Birth, and more.
                          <br />
                          2. Non-Personal Information: This includes information
                          that does not identify you as an individual, such as
                          your device type, browser type, operating system, IP
                          address, browsing history, and clickstream data. 
                          <br />
                        </div>
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.accepted}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        accepted: !formData.accepted,
                      })
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm azeret-mono-font text-[#FFFFFF53]"
                  >
                    I agree to all terms, privacy policy and fees
                  </label>
                </div>

                {addressError?.accepted && (
                  <p className="text-red-500 text-sm">
                    {addressError.accepted}
                  </p>
                )}
              </div>

              <div className="flex w-full gap-x-4 justify-center">
                <BaseButton
                  title="Discard"
                  variant="secondary"
                  onClick={cancelChanges}
                  className="w-full"
                />
                <BaseButton
                  title="Submit"
                  variant="primary"
                  onClick={() => {
                    handleAddress();
                  }}
                  className="w-full"
                  displayIcon
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-y-6 w-full text-[#fff]">
              <p className="text-[30px] font-extrabold">Checkout</p>
              <p className="text-[16px] azeret-mono-font text-[#858585]">
                You are about to purchase {NFTDetail?.name} from {address}
              </p>

              <div className="flex h-36 justify-between bg-neutral-800 rounded-2xl p-5 items-center">
                <div className="flex gap-6 items-center">
                  <div className="w-28 h-28 rounded-2xl relative">
                    <Image
                      quality={100}
                      src={NFTDetail.cloudinaryUrl}
                      alt="bottom-banner"
                      layout="fill"
                      objectFit="cover"
                    ></Image>
                  </div>
                  <p className="azeret-mono-font">{NFTDetail?.name}</p>
                </div>
                <p className="azeret-mono-font">
                  $ {formatNumberWithCommas(NFTDetail.price)}
                </p>
              </div>

              <ConnectedCard />

              {/* Wallet Connection - Blockchain */}

              <div className="flex flex-col gap-y-6 mt-5">
                <div className="flex justify-between items-center text-[16px] azeret-mono-font text-[#FFFFFF]">
                  <span className="text-[16px] azeret-mono-font text-[#FFFFFF]">
                    Price
                  </span>
                  <span>{tokenAmount} ETH</span>
                </div>
                {NFTDetail?.saleTime && (
                  <div className="flex justify-between py-3 items-center azeret-mono-font">
                    <span>Royalties</span>
                    <span>{NFTDetail.royalty}%</span>
                  </div>
                )}

                {!NFTDetail?.saleTime &&
                  NFTDetail?.walletAddresses.map((split, index) => (
                    <div
                      className="flex justify-between py-3 items-center azeret-mono-font"
                      key="index"
                    >
                      <span>Split payment</span>
                      <span>{split.percentage}%</span>
                    </div>
                  ))}
                <div className="flex justify-between items-center text-[16px] azeret-mono-font text-[#FFFFFF]">
                  <span>VaultX Fee</span>
                  <span>{fee} %</span>
                </div>
                <hr />
                <div className="flex justify-between items-center text-[16px] azeret-mono-font text-[#FFFFFF]">
                  <span>You will pay</span>
                  <span>{expectedAmount} ETH</span>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
                  <button
                    className="w-full h-full"
                    onClick={() => {
                      setStep(1);
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <div className="py-3 w-[48%] rounded-lg text-black bg-neon font-extrabold text-sm">
                  <button className="w-full h-full" onClick={purchase}>
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-y-4 items-center text-center">
              <img
                src="/icons/refresh.svg"
                alt="refresh"
                className="w-20 mx-auto"
              />
              <p className="text-lg font-medium">
                Please wait while we purchasing NFT
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-5 justify-center text-center mb-5">
                <Image
                  src="/icons/success.svg"
                  className="w-[115px] h-[115px] mx-auto"
                  alt="success"
                  quality={100}
                  width={115}
                  height={115}
                />
                <p className="text-[30px] text-[#fff] font-extrabold">
                  Payment Success
                </p>
                <p className=" azeret-mono-font text-[#FFFFFF53]">
                  Your payment is completed successfully.
                </p>
              </div>
              <div className="flex flex-col gap-y-3 mb-[20px]">
                <div className="flex justify-between">
                  <div className="w-[48%] p-4 rounded-[9px] border flex flex-col gap-y-2 border-[#FFFFFF14]">
                    <p className=" azeret-mono-font text-[#858585]">From</p>
                    <p className="text-neon azeret-mono-font">
                      {trimString(NFTDetail.owner.wallet)}
                    </p>
                  </div>
                  <div className="w-[48%] p-4 rounded-[9px] border flex flex-col gap-y-2 border-[#FFFFFF14]">
                    <p className=" azeret-mono-font text-[#858585]">From</p>
                    <p className="text-neon azeret-mono-font">
                      {trimString(activeAccount.address)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-[48%] p-4 rounded-[9px] border flex flex-col gap-y-2 border-[#FFFFFF14]">
                    <p className=" azeret-mono-font text-[#858585]">
                      Payment Method
                    </p>
                    <p className="text-neon azeret-mono-font">
                      {activeChain.name}
                    </p>
                  </div>
                  <div className="w-[48%] p-4 rounded-[9px] border flex flex-col gap-y-2 border-[#FFFFFF14]">
                    <p className=" azeret-mono-font text-[#858585]">
                      Payment Time
                    </p>
                    <p className="text-neon azeret-mono-font">
                      {moment().format('DD MMM, YY')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-3 w-full rounded-lg text-black font-semibold bg-[#DEE8E8]">
                <button
                  className="w-full h-full bg-[#DEE8E8] font-extrabold text-sm"
                  onClick={() => {
                    setStep(5);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-y-5 w-full">
              <div className="flex gap-x-3 items-center justify-center mb-5">
                <img
                  alt="info"
                  src="/icons/triangle-alert.svg"
                  className="w-24"
                />
              </div>
              <p className="text-xl azeret-mono-font font-extrabold text-center">
                Do not disclose buyer shipping information to third parties!
              </p>
              <p className="azeret-mono-font text-[#858585]">
                To maintain the confidentiality of buyer information and ensure
                smooth transactions, please pay close attention to the following
                points:
                <ol className="list-decimal ml-10 mt-5">
                  <li className="mb-3">
                    Confidentiality of Shipping Information: Buyer shipping
                    information should remain confidential to sellers. Be
                    cautious to prevent any external disclosures.
                  </li>
                  <li className="mb-3">
                    Tips for Safe Transactions: Handle buyer shipping
                    information securely to sustain safe and transparent
                    transactions.
                  </li>
                  <li className="mb-3">
                    Protection of Personal Information: As a seller, it is
                    imperative to treat buyer personal information with utmost
                    care. Avoid disclosing it to third parties.We kindly request
                    your strict adherence to these guidelines to uphold
                    transparency and trust in your transactions. Ensuring a
                    secure transaction environment benefits everyone involved.
                  </li>
                </ol>
              </p>

              <p className="text-white azeret-mono-font text-[18px] font-extrabold text-center">
                Thank You !
              </p>

              <div className="py-3 w-full rounded-lg text-black font-semibold bg-neon">
                <button
                  className="w-full h-full font-extrabold text-sm"
                  onClick={() => {
                    fetchNftData();
                    onClose();
                  }}
                >
                  I Agree
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
