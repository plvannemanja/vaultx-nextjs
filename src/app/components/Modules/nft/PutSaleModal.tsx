'use client';

import React, { useMemo, useState } from 'react';
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
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import ConnectedCard from '../../Cards/ConnectedCard';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import ErrorModal from '../create/ErrorModal';
import { CurationType, INFTVoucher, ISellerInfo, PaymentSplitType } from '@/types';
import { CreateNftServices } from '@/services/createNftService';
import { z } from 'zod';
import { formatNumberWithCommas } from '@/lib/utils';
import { trimString } from '@/utils/helpers';
import moment from 'moment';
import Image from 'next/image';

const addressSchema = z.object({
  username: z.string().nonempty('User name is invalid'),
  email: z.string().email({ message: 'Email is invalid' }),
  accepted: z.boolean().refine((val) => val === true, {
    message: 'The value must be true.',
  }),
  country: z.object({
    name: z.string().nonempty('country name is invalid'),
  }),
  // city: z.object({
  //   name: z.string().nonempty('city name is invalid'),
  // }),
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
  // city?: string;
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
  const activeChain = useActiveWalletChain();
  const [countryCode, setCountryCode] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);

  const countries = Country.getAllCountries();
  const { toast } = useToast();
  const salesService = new CreateSellService();
  const nftService = new CreateNftServices();

  const [shipInfo, setShipInfo] = useState<Partial<ISellerInfo> | null>(null);
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

  const expectedAmount = useMemo(
    () => {
      let value = 0;
      if (nft?.saleTime) {
        value = (formData.price * (100 - fee) / 100) * (100 - nft?.royalty) / 100;
      } else {
        const filterSplit = nft?.walletAddresses.filter(split => (split.address.toLowerCase() === activeAccount?.address.toLowerCase()));
        if (filterSplit.length) {
          value = (formData.price * (100 - fee) / 100) * filterSplit[0].percentage / 100;
        }
      }
      return value;
    },
    [formData.price, nft]
  );
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

  const checkListModal = async () => {
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
      setStep(2);
      parentSetStep(2);
    }
  }

  const submit = async () => {
    setStep(3);
    try {
      if (nft?.minted) await resellNft();
      else await handleMint();
      setStep(4);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {error ? (
        <ErrorModal title="Error" data={error} close={() => onClose()} />
      ) : (
        <>
          {step === 1 && (
            <>
              <div className="flex flex-col gap-y-5 w-full lg:min-w-[700px]">
                <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
                  <Disclosure as="div" defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                          <span>
                            List Price
                          </span>
                          <ChevronUpIcon
                            className={`${open ? 'rotate-180 transform' : ''
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
                            className={`${open ? 'rotate-180 transform' : ''
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
                          <span>Shipping Information</span>
                          <ChevronUpIcon
                            className={`${open ? 'rotate-180 transform' : ''
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
                                onChange={(e) =>
                                  setSellerInfo({
                                    ...sellerInfo,
                                    address1: e.target.value,
                                  })
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
                              {/* {addressError?.city && (
                                <p className="text-red-500 text-sm">
                                  {addressError.city}
                                </p>
                              )} */}
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
                  <p>Shipment Information</p>
                  <hr />
                  <div className="grid grid-cols-12 gap-3">
                    <div className="flex col-span-3 flex-col gap-y-2 max-w-[20rem]">
                      <Label className="font-medium">Length(cm)</Label>
                      <Input
                        value={shipInfo?.length ?? ""}
                        type="number"
                        placeholder="--"
                        className="bg-[#161616] border border-none h-[52px]"
                        onChange={(e) => {
                          setShipInfo({
                            ...shipInfo,
                            length: (e.target as any).value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex col-span-3 flex-col gap-y-2 max-w-[20rem]">
                      <Label className="font-medium">Width(cm)</Label>
                      <Input
                        value={shipInfo?.width ?? ""}
                        type="number"
                        placeholder="--"
                        className="bg-[#161616] border border-none h-[52px]"
                        onChange={(e) => {
                          setShipInfo({
                            ...shipInfo,
                            width: (e.target as any).value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex col-span-3 flex-col gap-y-2 max-w-[20rem]">
                      <Label className="font-medium">Height(cm)</Label>
                      <Input
                        value={shipInfo?.height ?? ""}
                        type="number"
                        placeholder="--"
                        className="bg-[#161616] border border-none h-[52px]"
                        onChange={(e) => {
                          setShipInfo({
                            ...shipInfo,
                            height: (e.target as any).value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex col-span-3 flex-col gap-y-2 max-w-[20rem]">
                      <Label className="font-medium">Weight(kg)</Label>
                      <Input
                        value={shipInfo?.weight ?? ""}
                        type="number"
                        placeholder="--"
                        className="bg-[#161616] border border-none h-[52px]"
                        onChange={(e) => {
                          setShipInfo({
                            ...shipInfo,
                            weight: (e.target as any).value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
                  <Disclosure as="div" defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                          <span>Contact Information For Seller</span>
                          <ChevronUpIcon
                            className={`${open ? 'rotate-180 transform' : ''
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
                              className={`${open ? 'rotate-180 transform' : ''
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
                      }}
                    >
                      Discard
                    </button>
                  </div>
                  <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
                    <button
                      className="w-full h-full"
                      onClick={async () => {
                        checkListModal();
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
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
                <div className="flex justify-start items-center border border-gray-400 rounded-md p-3 my-1 azeret-mono-font">
                  <span className="gap-x-2 mx-2">$</span>
                  <span>{formatNumberWithCommas(nft.price)}</span>
                </div>

                {
                  nft?.saleTime && (
                    <div className="flex justify-between py-3 items-center azeret-mono-font">
                      <span>Royalties</span>
                      <span>{nft.royalty}%</span>
                    </div>
                  )
                }

                {
                  !nft?.saleTime && nft?.walletAddresses.map((split, index) => (
                    <div className="flex justify-between py-3 items-center azeret-mono-font" key="index">
                      <span>Split payment</span>
                      <span>{split.percentage}%</span>
                    </div>
                  ))
                }
                <div className="flex justify-between py-3 items-center azeret-mono-font">
                  <span>Marketplace fee</span>
                  <span>{fee}%</span>
                </div>
                <div className="flex justify-between py-3 items-center azeret-mono-font font-bold">
                  <span>You will get</span>
                  <span>{Number(expectedAmount).toFixed(2)} $</span>
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
                    onClick={async () => await submit()}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
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
          {step === 4 && (
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-5 justify-center text-center mb-[40px]">
                <img
                  src="/icons/success.svg"
                  className="w-[115px] h-[115px] mx-auto"
                />
                <p className="text-[30px] text-[#fff] font-extrabold ">
                  List Success!
                </p>
                <div className='flex h-36 justify-between bg-neutral-800 rounded-2xl p-5 items-center'>
                  <div className='flex gap-6 items-center'>
                    <div className='w-28 h-28 rounded-2xl relative'>
                      <Image
                        quality={100}
                        src={nft.cloudinaryUrl}
                        alt="bottom-banner"
                        layout="fill"
                        objectFit="cover"
                      ></Image>
                    </div>
                    <p className="azeret-mono-font">
                      {nft?.name}
                    </p>
                  </div>
                  <p className="azeret-mono-font">
                    $ {formatNumberWithCommas(nft.price)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-y-3 mb-[20px]">
                <div className="flex justify-between">
                  <div className="w-[48%] p-4 rounded-md border border-[#FFFFFF24]">
                    <p className=" azeret-mono-font text-[#FFFFFF87]">From</p>
                    <p className="text-neon azeret-mono-font">
                      {trimString(activeAccount?.address)}
                    </p>
                  </div>
                  <div className="w-[48%] p-4 rounded-md border border-[#FFFFFF24]">
                    <p className=" azeret-mono-font text-[#FFFFFF87]">To</p>
                    <p className="text-neon azeret-mono-font">
                      {trimString(activeAccount.address)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-[48%] p-4 rounded-md border border-[#FFFFFF24]">
                    <p className=" azeret-mono-font text-[#FFFFFF87]">
                      Payment Network
                    </p>
                    <p className="text-neon azeret-mono-font">
                      {activeChain.name}
                    </p>
                  </div>
                  <div className="w-[48%] p-4 rounded-md border border-[#FFFFFF24]">
                    <p className=" azeret-mono-font text-[#FFFFFF87]">
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
                  className="w-full h-full bg-[#DEE8E8]"
                  onClick={() => onClose()}
                >
                  close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
