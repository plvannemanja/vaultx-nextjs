/* eslint-disable @next/next/no-img-element */
'use client';
import { Input } from '@/components/ui/input';
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
  Textarea,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { City, Country, State } from 'country-state-city';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { z } from 'zod';
import ConnectedCard from '../../Cards/ConnectedCard';
import { useGlobalContext } from '../../Context/GlobalContext';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import BaseButton from '../../ui/BaseButton';
import ErrorModal from '../create/ErrorModal';

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

export default function BuyModal({
  onClose,
  fetchNftData,
}: {
  onClose: () => void;
  fetchNftData: () => void;
}) {
  const { NFTDetail, nftId: id } = useNFTDetail();
  const { fee } = useGlobalContext();
  const [tokenAmount, setTokenAmount] = useState<string | null>(null);
  const [expectedAmount, setExpectedAmount] = useState<number | null>(null);
  const [error, setError] = useState(null);
  const [addressError, setAddressError] = useState<addressErrorType>({});
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const [formData, setFormData] = useState({
    username: null,
    email: null,
    description: null,
    accepted: false,
  });
  const [step, setStep] = useState(1);
  const [sellerInfo, setSellerInfo] = useState<any>({
    country: null,
    state: null,
    // city: null,
    address1: null,
    address2: null,
    postalCode: null,
    phoneNumber: null,
  });
  const [countryCode, setCountryCode] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const address = activeAccount?.address
    ? activeAccount?.address.slice(0, 6) +
      '...' +
      activeAccount?.address.slice(-4)
    : 'Connect Wallet';

  const countries = Country.getAllCountries();

  const cancelChanges = () => {
    setFormData({
      username: null,
      email: null,
      description: null,
      accepted: false,
    });

    setSellerInfo({
      country: null,
      state: null,
      city: null,
      address1: null,
      address2: null,
      postalCode: null,
      phoneNumber: null,
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
    }
  };

  const handleUpdateSeller = (e: any) => {
    const { name, value } = e.target;
    if (name === 'country') {
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
        <ErrorModal title="Error" data={error} close={() => onClose()} />
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
              <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
                {/* <span>Buyer Information</span> */}
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
                            Buyer Information
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
                      <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-y-2 w-[32%]">
                            <h2 className="font-semibold text-sm text-white manrope-font">
                              Name*
                            </h2>
                            <Input
                              value={formData.username ? formData.username : ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  username: (e.target as any).value,
                                })
                              }
                              className="w-full border-none  h-[52px] px-[26px] placeholder:text-xs py-[15px] bg-[#161616] azeret-mono-font rounded-xl justify-start items-center gap-[30px] inline-flex"
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
                            <h2 className="font-semibold text-sm text-white manrope-font">
                              Email*
                            </h2>

                            <Input
                              value={formData.email ? formData.email : ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: (e.target as any).value,
                                })
                              }
                              className="w-full border-none  h-[52px] px-[26px] placeholder:text-xs py-[15px] bg-[#161616] azeret-mono-font rounded-xl justify-start items-center gap-[30px] inline-flex"
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
                            <h2 className="font-semibold text-sm text-white manrope-font">
                              Country*
                            </h2>

                            <div className="bg-[#161616] rounded-xl pr-4">
                              <select
                                aria-label="Select Country"
                                className="w-full border-none bg-[#161616] h-[52px] px-[15px] py-[15px] rounded-xl placeholder:text-xs azeret-mono-font justify-start items-center gap-[30px] inline-flex text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
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
                            </div>
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
                {/* <span>Shipping Address*</span> */}
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
                            Shipping Address*
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
                      <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                        <div className="flex flex-wrap mb-4 justify-between ">
                          <div className="flex flex-col gap-y-2 lg:w-[48%]">
                            <h2 className="font-semibold text-sm text-white manrope-font">
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
                              className="w-full border-none  h-[52px] px-[26px] placeholder:text-xs py-[15px] bg-[#161616] azeret-mono-font rounded-xl justify-start items-center gap-[30px] inline-flex"
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
                            <h2 className="font-semibold text-sm text-white manrope-font">
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
                              className="w-full border-none  h-[52px] px-[26px] placeholder:text-xs py-[15px] bg-[#161616] azeret-mono-font rounded-xl justify-start items-center gap-[30px] inline-flex"
                              type="text"
                              placeholder="Enter address"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap mb-4 justify-between">
                          <div className="flex flex-col gap-y-2 lg:w-[32%]">
                            <h2 className="font-semibold text-sm text-white manrope-font">
                              State*
                            </h2>

                            <div className="bg-[#161616] rounded-xl pr-4">
                              <select
                                aria-label="Select state"
                                className="w-full border-none bg-[#161616] h-[52px] px-[15px] py-[15px] rounded-xl placeholder:text-xs azeret-mono-font justify-start items-center gap-[30px] inline-flex text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
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
                            </div>
                            {addressError?.state && (
                              <p className="text-red-500 text-sm">
                                {addressError.state}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-y-2 lg:w-[32%]">
                            <h2 className="font-semibold text-sm text-white manrope-font">
                              City*
                            </h2>

                            <div className="bg-[#161616] rounded-xl pr-4">
                              <select
                                aria-label="Select city"
                                className="w-full border-none bg-[#161616] h-[52px] px-[15px] py-[15px] rounded-xl placeholder:text-xs azeret-mono-font justify-start items-center gap-[30px] inline-flex text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
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
                            </div>
                            {/* {addressError?.city && (
                              <p className="text-red-500 text-sm">
                                {addressError.city}
                              </p>
                            )} */}
                          </div>
                          <div className="flex flex-col gap-y-2 lg:w-[32%]">
                            <h2 className="font-semibold text-sm text-white manrope-font">
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
                              className="w-full border-none h-[52px] px-[26px] placeholder:text-xs py-[15px] bg-[#161616] azeret-mono-font rounded-xl justify-start items-center gap-[30px] inline-flex"
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
                            containerClass="phone-container [&>div.special-label]:font-semibold [&>div.special-label]:text-sm [&>div.special-label]:text-white manrope-font"
                            buttonClass="phone-dropdown"
                            inputClass="phone-control !rounded-xl !h-[52px] !px-[26px] placeholder:text-xs !py-[15px] placeholder:text-xs bg-[#161616] azeret-mono-font text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
                            specialLabel="Phone Number*"
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
                {/* <span>Contact Information For Seller</span> */}
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
                            Contact Information For Seller
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
                      <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
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
                          className="w-full border-none bg-[#161616] azeret-mono-font rounded-[20px] placeholder:text-white/[53%] h-[180px] resize-none py-[15px] px-[26px] placeholder:text-sm placeholder:font-normal"
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
                      <DisclosureButton
                        className={cn(
                          'flex w-full flex-col justify-between py-2 pb-3 text-left',
                          open ? 'border-b border-white/[8%]' : '',
                        )}
                      >
                        <div className="flex w-full justify-between items-center mb-1">
                          <Label className="font-extrabold text-white text-lg">
                            Contact Information For Seller
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

              <div className="bg-dark p-5 gap-y-4 rounded-lg flex flex-col ">
                <p className="text-[20px] font-extrabold text-[#fff] ">
                  Order Summary
                </p>
                <hr />
                <div className="flex items-center justify-between">
                  <span className="text-lg text-[#FFFFFF] azeret-mono-font">
                    Price
                  </span>
                  <span className="text-lg font-medium text-[#DDF247]">
                    ${NFTDetail?.price}
                  </span>
                </div>
                <hr />

                <p className="text-[16px] azeret-mono-font text-[#fff] az ">
                  Payment You will pay the purchase amount in cryptocurrency
                  based on the real-time CoinMarketCap exchange rate at the
                  current moment.
                  <br />
                  If the bidding is not successful, all cryptocurrency used in
                  the purchase price, excluding gas fees, will be refunded.
                </p>
              </div>

              <div className="flex w-full gap-x-4 justify-center my-3 px-4">
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
              <p className="text-[16px] azeret-mono-font text-[#FFFFFF87]">
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
                <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
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
              <div className="flex flex-col gap-y-5 justify-center text-center mb-[40px]">
                <Image
                  src="/icons/success.svg"
                  className="w-[115px] h-[115px] mx-auto"
                  alt="success"
                  quality={100}
                  width={115}
                  height={115}
                />
                <p className="text-[30px] text-[#fff] font-extrabold ">
                  Payment Success
                </p>
                <p className=" azeret-mono-font text-[#FFFFFF87]">
                  Your payment is completed successfully.
                </p>
              </div>

              <div className="flex flex-col gap-y-3 mb-[20px]">
                <div className="flex justify-between">
                  <div className="w-[48%] p-4 rounded-md border border-[#FFFFFF24]">
                    <p className=" azeret-mono-font text-[#FFFFFF87]">From</p>
                    <p className="text-neon azeret-mono-font">
                      {trimString(NFTDetail.owner.wallet)}
                    </p>
                  </div>
                  <div className="w-[48%] p-4 rounded-md border border-[#FFFFFF24]">
                    <p className=" azeret-mono-font text-[#FFFFFF87]">From</p>
                    <p className="text-neon azeret-mono-font">
                      {trimString(activeAccount.address)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-[48%] p-4 rounded-md border border-[#FFFFFF24]">
                    <p className=" azeret-mono-font text-[#FFFFFF87]">
                      Payment Method
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
            <div className="flex flex-col gap-y-4 w-full">
              <div className="flex gap-x-3 items-center">
                <img alt="info" src="/icons/info.svg" className="w-12" />
              </div>

              <p className="text-[16px] azeret-mono-font font-extrabold text-[#FFFFFF87]">
                Do not disclose buyer shipping information to third parties!
                <br />
                <br />
              </p>

              <p className="text-[16px] azeret-mono-font text-[#FFFFFF87]">
                To maintain the confidentiality of buyer information and ensure
                smooth transactions, please pay close attention to the following
                points:
                <br />
                <br />
                1. Confidentiality of Shipping Information: Buyer shipping
                information should remain confidential to sellers. Be cautious
                to prevent any external disclosures.
                <br />
                <br />
                2. Tips for Safe Transactions: Handle buyer shipping information
                securely to sustain safe and transparent transactions.
                <br />
                <br />
                3. Protection of Personal Information: As a seller, it is
                imperative to treat buyer personal information with utmost care.
                Avoid disclosing it to third parties.We kindly request your
                strict adherence to these guidelines to uphold transparency and
                trust in your transactions. Ensuring a secure transaction
                environment benefits everyone involved.
                <br />
                <br />
                <br />
                <span className="text-[#fff] font-extrabold">Thank You</span>
              </p>

              <div className="py-3 w-full rounded-lg text-black font-semibold bg-neon">
                <button
                  className="w-full h-full"
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
