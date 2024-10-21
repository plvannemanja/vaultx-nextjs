'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PhoneInput from 'react-phone-input-2';
import { City, Country, State } from 'country-state-city';
import { useToast } from '@/hooks/use-toast';
import { CreateSellService } from '@/services/createSellService';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { useGlobalContext } from '../../Context/GlobalContext';
import { parseEther } from 'viem';
import { IListAsset, listAsset, resaleAsset } from '@/lib/helper';
import { useActiveAccount } from 'thirdweb/react';
import ConnectedCard from '../../Cards/ConnectedCard';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import ErrorModal from '../create/ErrorModal';
import { CurationType, INFTVoucher, PaymentSplitType } from '@/types';
import { CreateNftServices } from '@/services/createNftService';
import { z } from 'zod';

const addressSchema = z.object({
  username: z.string().nonempty('User name is invalid'),
  email: z.string().email({ message: 'Email is invalid' }),
  description: z.string(),
  accepted: z.boolean().refine((val) => val === true, {
    message: 'The value must be true.',
  }),
  country: z.object({
    name: z.string().nonempty('country name is invalid'),
  }),
  city: z.object({
    name: z.string().nonempty('city name is invalid'),
  }),
  state: z.object({
    name: z.string().nonempty('state name is invalid'),
  }),
  address1: z.string().nonempty('address 1 is invalid'),
  postalCode: z.string(),
  phoneNumber: z.string().nonempty(),
});

interface addressErrorType {
  username?: string;
  email?: string;
  description?: string;
  accepted?: string;
  country?: string;
  state?: string;
  city?: string;
  address1?: string;
  postalCode?: string;
  phoneNumber?: string;
}

export default function PutSaleModal({
  onClose,
  fetchNftData,
  parentStep,
  parentSetStep, // Function to update step from parent
}: {
  onClose: () => void;
  fetchNftData: () => void;
  parentStep: number; // Accept step as a prop
  parentSetStep: (value: number) => void;
}) {
  const { nftId, NFTDetail: nft } = useNFTDetail();
  const { fee } = useGlobalContext();
  const activeAccount = useActiveAccount();
  const [countryCode, setCountryCode] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);

  const countries = Country.getAllCountries();
  const { toast } = useToast();
  const salesService = new CreateSellService();
  const nftService = new CreateNftServices();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: null,
    email: null,
    description: null,
    accepted: true,
    price: nft.price,
  });
  const [sellerInfo, setSellerInfo] = useState({
    country: null,
    address1: '',
    address2: '',
    state: null,
    city: null,
    postalCode: '',
    phoneNumber: '',
  });

  const [addressError, setAddressError] = useState<addressErrorType>({});
  const handleUpdateSeller = (e: any) => {
    const { name, value } = e.target;

    if (name === 'country') {
      setSelectedCountry(value);
      const parsedVal = JSON.parse(value);
      const countryStates = State.getStatesOfCountry(parsedVal.isoCode);

      // @ts-ignore
      setStates(countryStates);
      setCountryCode(parsedVal.isoCode);
      setSellerInfo({
        ...sellerInfo,
        [name]: parsedVal,
      });
      return null;
    } else if (name === 'state') {
      const parsedVal = JSON.parse(value);
      const stateCities = City.getCitiesOfState(countryCode, parsedVal.isoCode);

      // @ts-ignore
      setCities(stateCities);
      setSellerInfo({
        ...sellerInfo,
        [name]: parsedVal,
      });
      return null;
    } else if (name === 'city') {
      const parsedVal = JSON.parse(value);
      setSellerInfo({
        ...sellerInfo,
        [name]: parsedVal,
      });
      return null;
    }
    setSellerInfo({
      ...sellerInfo,
      [name]: value,
    });
  };

  const resellNft = async () => {
    if (!formData.accepted) {
      toast({
        title: 'Please agree to the terms and conditions',
        variant: 'destructive',
      });
      return;
    }

    try {
      const price = parseEther(formData.price.toString());
      const transactionHash = await resaleAsset(
        nft.tokenId,
        price,
        activeAccount,
      );
      const data = {
        nftId: nftId,
        name: formData.username,
        email: formData.email,
        country: sellerInfo.country ? sellerInfo.country.name : '',
        address: {
          line1: sellerInfo.address1,
          line2: sellerInfo.address2,
          city: sellerInfo.city ? sellerInfo.city.name : '',
          state: sellerInfo.state ? sellerInfo.state.name : '',
          postalCode: sellerInfo.postalCode,
        },
        phoneNumber: sellerInfo.phoneNumber,
        contactInformation: formData.description,
        concent: formData.accepted,
        saleHash: transactionHash,
        price: formData.price,
      };

      await salesService.resellItem(data);
      await fetchNftData();
      onClose();
    } catch (error) {
      setError(JSON.stringify(error));
      onClose();
      console.log(error);
    }
  };

  const handleMint = async () => {
    try {
      setStep(3);
      parentSetStep(3);
      let splitPayments = [];
      // blockchain logic
      const price = parseEther(formData.price.toString());
      let nftPayload = {};
      if (nft?.voucher) {
        const voucher: INFTVoucher = JSON.parse(nft.voucher, (key, value) => {
          // Check if the value is a number and can be safely converted to BigInt
          if (typeof value === 'number' && Number.isSafeInteger(value)) {
            return BigInt(value);
          }
          return value;
        });
        let paymentSplits: PaymentSplitType[] = [];
        if (voucher.paymentPercentages.length !== voucher.paymentWallets.length)
          throw new Error('Free minted Voucher information is incorrect.');

        voucher.paymentPercentages.forEach((percentage, index) => {
          paymentSplits.push({
            paymentWallet: voucher.paymentWallets[index],
            paymentPercentage: percentage,
          });
        });

        nftPayload = {
          curationId: Number(voucher.curationId),
          tokenURI: voucher.tokenURI,
          price,
          royaltyWallet: voucher.royaltyWallet,
          royaltyPercentage: voucher.royaltyPercentage,
          paymentSplits,
          account: activeAccount,
        } as IListAsset;
      } else {
        throw new Error('Only free minted NFT can list in resale progress.');
      }
      const { tokenId, transactionHash } = await listAsset(
        nftPayload as IListAsset,
      );
      await nftService.mintAndSale({
        nftId,
        mintHash: transactionHash,
        tokenId: Number(tokenId),
      });
      await fetchNftData();

      setStep(3);
    } catch (error) {
      setError(JSON.stringify(error));
      onClose();
      console.log(error);
    }
  };

  const submit = async () => {
    //TODO validate Form Data
    const result = addressSchema.safeParse({
      ...formData,
      ...sellerInfo,
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
      setStep(3);
      try {
        if (nft?.minted) await resellNft();
        else await handleMint();
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      {error ? (
        <ErrorModal title="Error" data={error} close={() => onClose()} />
      ) : (
        <>
          {step === 1 && (
            <div className="flex flex-col gap-y-4">
              <p className="font-extrabold text-[30px] leading-[40px]">
                List item for sale
              </p>
              <ConnectedCard />

              {/* Blockchain card  */}

              <div className="flex flex-col gap-y-2">
                <p className="text-[#ffffff] text-[16px] azeret-mono-font">
                  Price
                </p>
                <div className="flex justify-between items-center border border-gray-400 rounded-md p-3 my-1 azeret-mono-font">
                  <span>{nft.price}</span>
                  <div className="flex items-center gap-x-2">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 54 54"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_717_11946)">
                        <path
                          d="M35.5928 21.4194C34.9702 21.0566 34.1618 21.0566 33.4767 21.4194L28.6184 24.2106L25.3193 26.0297L20.461 28.8191C19.8383 29.1836 19.03 29.1836 18.3449 28.8191L14.4839 26.6355C13.8612 26.2727 13.4258 25.6061 13.4258 24.8771V20.5706C13.4258 19.8433 13.7988 19.1767 14.4839 18.8122L18.2808 16.6894C18.9052 16.3249 19.7152 16.3249 20.4003 16.6894L24.1972 18.8122C24.8215 19.1767 25.2569 19.8433 25.2569 20.5706V23.3617L28.556 21.4802V18.6907C28.5596 18.3284 28.4626 17.9722 28.2758 17.6618C28.089 17.3513 27.8197 17.0988 27.4979 16.9324L20.461 12.9296C19.8383 12.5651 19.03 12.5651 18.3449 12.9296L11.1832 16.9324C10.8613 17.0988 10.592 17.3513 10.4052 17.6618C10.2184 17.9722 10.1215 18.3284 10.1251 18.6907V26.757C10.1251 27.486 10.498 28.1526 11.1832 28.5171L18.3449 32.5198C18.9676 32.8826 19.7776 32.8826 20.461 32.5198L25.3193 29.7894L28.6184 27.9096L33.4767 25.1809C34.0994 24.8164 34.9077 24.8164 35.5928 25.1809L39.3914 27.3037C40.0158 27.6666 40.4495 28.3331 40.4495 29.0621V33.3686C40.4495 34.0959 40.0782 34.7625 39.3914 35.127L35.5945 37.3106C34.9702 37.6751 34.1602 37.6751 33.4767 37.3106L29.6782 35.1877C29.0538 34.8232 28.6184 34.1567 28.6184 33.4294V30.6382L25.3193 32.5198V35.3092C25.3193 36.0366 25.6923 36.7048 26.3774 37.0676L33.5392 41.0704C34.1618 41.4349 34.9702 41.4349 35.6553 41.0704L42.817 37.0676C43.4397 36.7048 43.8751 36.0382 43.8751 35.3092V27.243C43.8787 26.8807 43.7818 26.5245 43.595 26.214C43.4082 25.9036 43.1388 25.6511 42.817 25.4846L35.5945 21.4194H35.5928Z"
                          fill="white"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_717_11946">
                          <rect width="54" height="54" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <hr />

                <div className="flex justify-between py-3 items-center azeret-mono-font">
                  <span>Royalties</span>
                  <span>{nft.royalty}%</span>
                </div>
                <hr />

                <div className="flex justify-between py-3 items-center azeret-mono-font">
                  <span>Marketplace fee</span>
                  <span>{fee}%</span>
                </div>
                <hr />
                <div className="flex justify-between py-3 items-center azeret-mono-font font-bold">
                  <span>You will get</span>
                  <span>{Number(nft.price).toFixed(2)} $</span>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
                  <button
                    className="w-full h-full"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Discard
                  </button>
                </div>
                <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
                  <button
                    className="w-full h-full"
                    onClick={async () => {
                      setStep(2);
                      parentSetStep(2);
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <>
              <div className="flex flex-col gap-y-5 w-full lg:min-w-[700px]">
                <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
                  <Disclosure as="div" defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                          <span>
                            Give a new price to put this asset for sale.
                          </span>
                          <ChevronUpIcon
                            className={`${
                              open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-white`}
                          />
                        </DisclosureButton>
                        <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                          <div className="flex justify-between">
                            <Input
                              type="number"
                              placeholder="Enter The Price"
                              className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                              value={formData.price.toString()}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  price: (e.target as any).value as number,
                                });
                              }}
                            />
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </div>
                <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
                  <Disclosure as="div" defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                          <span>Buyer Information</span>
                          <ChevronUpIcon
                            className={`${
                              open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-white`}
                          />
                        </DisclosureButton>
                        <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                          <div className="flex justify-between">
                            <div className="flex flex-col gap-y-2 w-[32%]">
                              <Label className="text-lg font-medium">
                                Name*
                              </Label>
                              <Input
                                value={
                                  formData.username ? formData.username : ''
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    username: (e.target as any).value,
                                  })
                                }
                                className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                                type="text"
                                placeholder="Enter your username"
                              />
                              {addressError?.username && (
                                <p className="text-red-500 text-sm">
                                  {addressError.username}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-y-2 w-[32%]">
                              <Label className="text-lg font-medium">
                                Email*
                              </Label>
                              <Input
                                value={formData.email ? formData.email : ''}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    email: (e.target as HTMLInputElement).value,
                                  })
                                }
                                className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                                type="text"
                                placeholder="Enter your email"
                              />
                              {addressError?.email && (
                                <p className="text-red-500 text-sm">
                                  {addressError.email}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col gap-y-2 w-[32%]">
                              <Label className="text-lg font-medium">
                                Country*
                              </Label>
                              <select
                                aria-label="select curation"
                                className="rounded-md px-2 bg-[#161616] text-white border-none h-[52px]"
                                name="country"
                                value={JSON.stringify(sellerInfo.country)}
                                onChange={handleUpdateSeller}
                              >
                                <option value="">Select</option>
                                {countries.map((item: any) => (
                                  <option
                                    key={item.isoCode}
                                    value={JSON.stringify(item)}
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                              {addressError?.country && (
                                <p className="text-red-500 text-sm">
                                  {addressError.country}
                                </p>
                              )}
                            </div>
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </div>

                <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
                  <Disclosure as="div" defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                          <span>Shipping Address*</span>
                          <ChevronUpIcon
                            className={`${
                              open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-white`}
                          />
                        </DisclosureButton>
                        <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                          <div className="flex flex-wrap mb-4 justify-between ">
                            <div className="flex flex-col gap-y-2 lg:w-[48%]">
                              <h2 className="font-bold text-[#fff] text-[14px]">
                                Address 1*
                              </h2>

                              <Input
                                value={
                                  sellerInfo.address1 ? sellerInfo.address1 : ''
                                }
                                className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                                type="text"
                                placeholder="Enter address"
                              />
                              {addressError?.address1 && (
                                <p className="text-red-500 text-sm">
                                  {addressError.address1}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-y-2 lg:w-[48%]">
                              <h2 className="font-bold text-[#fff] text-[14px]">
                                Address 2*
                              </h2>

                              <Input
                                value={
                                  sellerInfo.address2 ? sellerInfo.address2 : ''
                                }
                                onChange={(e) =>
                                  setSellerInfo({
                                    ...sellerInfo,
                                    address2: e.target.value,
                                  })
                                }
                                className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                                type="text"
                                placeholder="Enter address"
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap mb-4 justify-between">
                            <div className="flex flex-col gap-y-2 lg:w-[32%]">
                              <h2 className="font-bold text-[#fff] text-[14px]">
                                State*
                              </h2>

                              <select
                                aria-label="select curation"
                                className="rounded-md px-2 bg-[#161616] text-white border-none h-[52px]"
                                name="state"
                                value={
                                  sellerInfo.state
                                    ? JSON.stringify(sellerInfo.state)
                                    : ''
                                }
                                onChange={handleUpdateSeller}
                              >
                                <option value="">Select</option>
                                {states.map((item: any) => (
                                  <option
                                    key={item.isoCode}
                                    value={JSON.stringify(item)}
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                              {addressError?.state && (
                                <p className="text-red-500 text-sm">
                                  {addressError.state}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-y-2 lg:w-[32%]">
                              <h2 className="font-bold text-[#fff] text-[14px]">
                                City*
                              </h2>

                              <select
                                aria-label="select curation"
                                className="rounded-md px-2 bg-[#161616] text-white border-none h-[52px]"
                                name="city"
                                value={
                                  sellerInfo.city
                                    ? JSON.stringify(sellerInfo.city)
                                    : ''
                                }
                                onChange={handleUpdateSeller}
                              >
                                <option value="">Select</option>
                                {cities.map((item: any) => (
                                  <option
                                    key={item.isoCode}
                                    value={JSON.stringify(item)}
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                              {addressError?.city && (
                                <p className="text-red-500 text-sm">
                                  {addressError.city}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-y-2 lg:w-[32%]">
                              <h2 className="font-bold text-[#fff] text-[14px]">
                                Postal Code*
                              </h2>

                              <Input
                                value={
                                  sellerInfo.postalCode
                                    ? sellerInfo.postalCode
                                    : ''
                                }
                                onChange={(e) =>
                                  setSellerInfo({
                                    ...sellerInfo,
                                    postalCode: e.target.value,
                                  })
                                }
                                className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                                type="text"
                                placeholder="Enter postcode"
                              />
                              {addressError?.postalCode && (
                                <p className="text-red-500 text-sm">
                                  {addressError.postalCode}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col mb-4 gap-y-3">
                            <PhoneInput
                              enableLongNumbers={true}
                              containerClass="phone-container"
                              buttonClass="phone-dropdown"
                              inputClass="phone-control"
                              country={'us'}
                              value={
                                sellerInfo.phoneNumber
                                  ? sellerInfo.phoneNumber
                                  : ''
                              }
                              inputStyle={{
                                width: '100%',
                                height: '2.5rem',
                                borderRadius: '0.375rem',
                                padding: '0.5rem',
                                marginTop: '0.5rem',
                                color: '#fff',
                                backgroundColor: '#161616',
                              }}
                              onChange={(e) =>
                                setSellerInfo({ ...sellerInfo, phoneNumber: e })
                              }
                            />
                            {addressError?.phoneNumber && (
                              <p className="text-red-500 text-sm">
                                {addressError.phoneNumber}
                              </p>
                            )}
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </div>
                <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
                  <Disclosure as="div" defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                          <span>Contact Information For Seller</span>
                          <ChevronUpIcon
                            className={`${
                              open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-white`}
                          />
                        </DisclosureButton>
                        <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                          <Textarea
                            value={
                              formData.description ? formData.description : ''
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: (e.target as any).value,
                              })
                            }
                            className="w-full border-none bg-[#161616] h-[240px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] p-4 rounded-md"
                            placeholder="Please describe your product"
                          />
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </div>

                <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
                  <Disclosure as="div" defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                          <div className="flex w-full justify-between">
                            <span>
                              Consent for collection and usage of personal
                              information
                            </span>
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-white`}
                            />
                          </div>
                          <p className="text-[#ffffff53] text-[16px] azeret-mono-font">
                            Please read the following and check the appropriate
                            boxes to indicate your consent:
                          </p>
                        </DisclosureButton>

                        <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                          <div className="text-white/50 text-base font-normal font-['Azeret Mono'] leading-relaxed">
                            We collect two types of information from you:
                            <br />
                            1. Personal Information: This includes your
                            individual information such as Email, Phone Number,
                            Username, Avatar, Profile Picture, Date of Birth,
                            and more.
                            <br />
                            2. Non-Personal Information: This includes
                            information that does not identify you as an
                            individual, such as your device type, browser type,
                            operating system, IP address, browsing history, and
                            clickstream data.
                            <br />
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </div>

                <div className="flex flex-col space-y-2 p-4">
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
                      className="text-[14px] azeret-mono-font font-medium leading-none text-[#FFFFFF87]"
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

                <div className="flex justify-between">
                  <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
                    <button
                      className="w-full h-full"
                      onClick={() => {
                        onClose();
                        parentSetStep(1);
                      }}
                    >
                      Discard
                    </button>
                  </div>
                  <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
                    <button
                      className="w-full h-full"
                      onClick={async () => await submit()}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-y-9 items-center text-center">
              <img src="/icons/refresh.svg" className="w-20 mx-auto" />
              <p className="text-[30px] font-medium leading-[40px]">
                Please wait while we put
                <br /> it on sale
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
