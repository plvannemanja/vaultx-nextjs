import React, { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import BaseButton from '../../ui/BaseButton';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { City, Country, State } from 'country-state-city';
import { getTokenAmount, placeBid, placeBidBeforeMint } from '@/lib/helper';
import { CreateSellService } from '@/services/createSellService';
import { CurationType, INFTVoucher } from '@/types';
import ErrorModal from '../create/ErrorModal';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import ConnectedCard from '../../Cards/ConnectedCard';
import { useGlobalContext } from '../../Context/GlobalContext';
import { roundToDecimals, trimString } from '@/utils/helpers';
import moment from 'moment';
import { CreateNftServices } from '@/services/createNftService';
import { z } from 'zod';

const addressSchema = z.object({
  username: z.string().nonempty('User name is invalid'),
  email: z.string().email({ message: 'Email is invalid' }),
  accepted: z.boolean().refine((val) => val === true, {
    message: 'The value must be true.',
  }),
  country: z.object({
    name: z.string().nonempty('country name is invalid'),
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
  // city?: string;
  address1?: string;
  postalCode?: string;
  phoneNumber?: string;
}

export default function BidModal({
  title,
  update,
  onClose,
  fetchNftData,
}: {
  title: string;
  update: (data: number) => void;
  onClose: () => void;
  fetchNftData: () => void;
}) {
  const [value, setValue] = useState<number>(0);
  const { fee } = useGlobalContext();
  const { NFTDetail, nftId: id } = useNFTDetail();
  const [tokenAmount, setTokenAmount] = useState<string | null>(null);
  const [expectedAmount, setExpectedAmount] = useState<number | null>(null);
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const [error, setError] = useState(null);
  const [addressError, setAddressError] = useState<addressErrorType>({});
  const [formData, setFormData] = useState({
    username: null,
    email: null,
    description: null,
    accepted: false,
  });

  const [step, setStep] = useState(1);

  const [sellerInfo, setSellerInfo] = useState({
    country: null,
    state: null,
    city: null,
    address1: null,
    address2: null,
    postalCode: null,
    phoneNumber: null,
  });
  const [countryCode, setCountryCode] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const address = useMemo(() => {
    if (activeAccount?.address)
      return (
        activeAccount?.address.slice(0, 6) +
        '...' +
        activeAccount?.address.slice(-4)
      );
    return 'Connect Wallet';
  }, [activeAccount]);
  const countries = Country.getAllCountries();
  const saleService = new CreateSellService();

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
      checkAmount();
      setStep(3);
    }
  };

  const cancelChanges = () => {
    onClose();
  };

  const bidAsset = async () => {
    try {
      setStep(5);
      const tokenAmount = await getTokenAmount(value.toString(), 'Wei');
      const { transactionHash, bidId } = await placeBid(
        NFTDetail.tokenId,
        tokenAmount as bigint,
        activeAccount,
      );
      await saleService.placeBid({
        nftId: NFTDetail._id,
        bidValue: value,
        bidHash: transactionHash,
        tokenId: NFTDetail.tokenId,
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
        bidId: bidId,
      });
      setStep(6);
    } catch (error) {
      console.log(error);
      setError(JSON.stringify(error));
      onClose();
    }
  };

  const bidFreeMint = async () => {
    try {
      setStep(5);
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

      const tokenAmount = await getTokenAmount(value.toString(), 'Wei');

      const { transactionHash, bidId, tokenId } = await placeBidBeforeMint(
        voucher as Omit<INFTVoucher, 'signature'> & {
          signature: `0x${string}`;
        },
        tokenAmount as bigint,
        activeAccount,
      );

      const createNftService = new CreateNftServices();
      await createNftService.mintAndSale({
        nftId: NFTDetail?._id,
        mintHash: transactionHash,
        tokenId: Number(tokenId),
      });

      await saleService.placeBid({
        nftId: NFTDetail._id,
        bidValue: value,
        bidHash: transactionHash,
        tokenId: NFTDetail.tokenId,
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
        bidId: bidId,
      });

      await fetchNftData();
      setStep(6);
    } catch (error) {
      console.log(error);
      setError(JSON.stringify(error));
      onClose();
    }
  };

  const purchase = async () => {
    if (NFTDetail.minted) await bidAsset();
    else await bidFreeMint();
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
    const tokenAmount = await getTokenAmount(value.toString());
    setTokenAmount(tokenAmount as string);
    const expectedAmount = (Number(tokenAmount) * 100) / (100 - fee);
    setExpectedAmount(roundToDecimals(expectedAmount ?? null, 5));
  };

  useEffect(() => {
    checkAmount();
  }, []);

  // view logic
  if (error)
    return <ErrorModal title="Error" data={error} close={() => onClose()} />;

  if (step == 1)
    return (
      <div className="flex flex-col gap-y-5 w-full">
        <Label className="text-lg font-medium">Place a bid</Label>
        <ConnectedCard />


        {/* Wallet part */}

        <div className="flex flex-col gap-y-2">
          <Label>Price</Label>
          <Input
            placeholder="Price"
            className="w-full"
            type="number"
            value={value.toString()}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </div>

        <div className="flex gap-x-4 justify-center my-3 px-4">
          <BaseButton
            title="Cancel"
            variant="secondary"
            onClick={cancelChanges}
          />
          <BaseButton
            title="Next"
            variant="primary"
            onClick={() => {
              setStep(2);
            }}
          />
        </div>
      </div>
    );

  if (step == 2)
    return (
      <div className="flex flex-col gap-y-6 w-full">
        <div className="self-stretch justify-start items-center gap-[25px] inline-flex">
          <div className="w-[49px] h-[49px] relative">
            <Image
              className="relative"
              src="/icons/alert.svg"
              width={48}
              height={48}
              alt="alert"
            />
          </div>
          <div className="text-white text-3xl font-extrabold font-['Manrope']">
            Review & Checkout{' '}
          </div>
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
                      <h2 className="font-bold text-[#ffffff] text-[14px]">
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
                      <h2 className="font-bold text-[#fff] text-[14px]">
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
                      <h2 className="font-bold text-[#fff] text-[14px]">
                        Country*
                      </h2>

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
                        value={sellerInfo.address1 ? sellerInfo.address1 : ''}
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
                        value={sellerInfo.address2 ? sellerInfo.address2 : ''}
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
                          sellerInfo.city ? JSON.stringify(sellerInfo.city) : ''
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
                    <div className="flex flex-col gap-y-2 lg:w-[32%]">
                      <h2 className="font-bold text-[#fff] text-[14px]">
                        Postal Code*
                      </h2>

                      <Input
                        value={
                          sellerInfo.postalCode ? sellerInfo.postalCode : ''
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
                    </div>
                    {addressError?.postalCode && (
                      <p className="text-red-500 text-sm">
                        {addressError.postalCode}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col mb-4 gap-y-3">
                    <PhoneInput
                      enableLongNumbers={true}
                      containerClass="phone-container"
                      buttonClass="phone-dropdown"
                      inputClass="phone-control"
                      country={'us'}
                      value={
                        sellerInfo.phoneNumber ? sellerInfo.phoneNumber : ''
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
                    className={`${open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-white`}
                  />
                </DisclosureButton>
                <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                  <Textarea
                    value={formData.description ? formData.description : ''}
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
                      Consent for collection and usage of personal information
                    </span>
                    <ChevronUpIcon
                      className={`${open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white`}
                    />
                  </div>
                  <p className="text-[#ffffff53] text-[16px] azeret-mono-font">
                    Please read the following and check the appropriate boxes to
                    indicate your consent:
                  </p>
                </DisclosureButton>

                <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                  <div className="text-white/50 text-base font-normal font-['Azeret Mono'] leading-relaxed">
                    We collect two types of information from you:
                    <br />
                    1. Personal Information: This includes your individual
                    information such as Email, Phone Number, Username, Avatar,
                    Profile Picture, Date of Birth, and more.
                    <br />
                    2. Non-Personal Information: This includes information that
                    does not identify you as an individual, such as your device
                    type, browser type, operating system, IP address, browsing
                    history, and clickstream data.
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
            Payment You will pay the purchase amount in cryptocurrency based on
            the real-time CoinMarketCap exchange rate at the current moment.
            <br />
            If the bidding is not successful, all cryptocurrency used in the
            purchase price, excluding gas fees, will be refunded.
          </p>
        </div>

        <div className="flex w-full gap-x-4 justify-center my-3 px-4">
          <BaseButton
            title="Discard"
            variant="secondary"
            onClick={() => {
              setStep(1);
            }}
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
    );

  if (step == 3)
    return (
      <div className="flex flex-col gap-y-4 w-full">
        <div className="flex gap-x-3 items-center">
          <img src="/icons/info.svg" className="w-12" />
          <p className="text-[30px] text-[#fff] font-extrabold">Bid Information</p>
        </div>

        <p className="text-[16px] azeret-mono-font font-extrabold text-[#FFFFFF87]">
          Bid Success
          <br />
          <br />
        </p>

        <p className="text-[16px] azeret-mono-font text-[#FFFFFF87]">
          {`If the seller accepts your bid, the transaction will automatically proceed to the purchase stage. Once the purchase is confirmed, you will be granted access to the seller's contact information, allowing you to directly communicate with the seller to discuss shipping details`}
          <br />
          <br />
          Bid Cancellation
          <br />
          <br />
          Your bid will be automatically cancelled if the seller does not accept your bid within the period set during the bid registration, or if another bidder offers a higher amount for the item than your bid. Additionally, you may cancel your bid at any time before the seller accepts it. In the event of a cancellation, the amount you deposited at the time of bidding will be fully refunded, excluding the Gas fee.
          <br />
          <br />
          If you have any questions regarding Bid, please contact us.
          <br />
          <br />
          <br />
          <span className="text-[#fff] font-extrabold">Thank You</span>
        </p>

        <div className="flex justify-between">
          <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
            <button
              className="w-full h-full"
              onClick={() => {
                setStep(2);
              }}
            >
              Cancel
            </button>
          </div>
          <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
            <button className="w-full h-full" onClick={() => setStep(4)}>
              Next
            </button>
          </div>
        </div>
      </div>
    );

  if (step == 4)
    return (
      <div className="flex flex-col gap-y-6 w-full text-[#fff]">
        <p className="text-[30px] font-extrabold">Checkout</p>
        <p className="text-[16px] azeret-mono-font text-[#FFFFFF87]">
          You are about to purchase Dhruv from ${address}
        </p>

        <ConnectedCard />

        {/* Wallet Connection - Blockchain */}

        <div className="flex flex-col gap-y-6 mt-5">
          <div className="flex justify-between items-center text-[16px] azeret-mono-font text-[#FFFFFF]">
            <span className="text-[16px] azeret-mono-font text-[#FFFFFF]">
              Price
            </span>
            <span>{tokenAmount} ETH</span>
          </div>
          <div className="flex justify-between items-center text-[16px] azeret-mono-font text-[#FFFFFF]">
            <span>VaultX Fee</span>
            <span>{fee} %</span>
          </div>
          <hr />
          <div className="flex justify-between items-center text-[16px] azeret-mono-font text-[#FFFFFF]">
            <span>You will pay</span>
            <span>{expectedAmount} ETH</span>
          </div>
          <div className="flex justify-between items-center text-[14px] azeret-mono-font text-[#FFFFFF]">
            <p>Gas fee is not included in this statement.</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
            <button
              className="w-full h-full"
              onClick={() => {
                setStep(3);
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
    );

  if (step == 5)
    return (
      <div className="flex flex-col gap-y-4 items-center text-center">
        <img src="/icons/refresh.svg" className="w-20 mx-auto" />
        <p className="text-lg font-medium">Please wait while we place bid</p>
      </div>
    );

  if (step == 6)
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-5 justify-center text-center mb-[40px]">
          <img
            src="/icons/success.svg"
            className="w-[115px] h-[115px] mx-auto"
          />
          <p className="text-[30px] text-[#fff] font-extrabold ">Bid Deposit Success</p>
          <p className=" azeret-mono-font text-[#FFFFFF87]">
            Your bid amount has been successfully deposited.
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
              <p className="text-neon azeret-mono-font">{activeChain.name}</p>
            </div>
            <div className="w-[48%] p-4 rounded-md border border-[#FFFFFF24]">
              <p className=" azeret-mono-font text-[#FFFFFF87]">Payment Time</p>
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
              setStep(7);
            }}
          >
            close
          </button>
        </div>
      </div>
    );

  if (step == 7) {
    return (<div className="flex flex-col gap-y-4 w-full">
      <div className="flex flex-col items-center justify-center text-center">
        <img src="/icons/triangle-alert.svg" className="w-28" />

        <p className="text-[30px] text-[#fff] font-extrabold mt-4">
          Do not disclose buyer shipping information to third parties!
        </p>
      </div>


      <p className="text-[16px] azeret-mono-font font-extrabold text-[#FFFFFF87]">
        To maintain the confidentiality of buyer information and ensure smooth transactions, please pay close attention to the following points:
        <br />
        <br />
        1. Confidentiality of Shipping Information: Buyer shipping information should remain confidential to sellers. Be cautious to prevent any external disclosures.
        <br />
        <br />
        2. Tips for Safe Transactions: Handle buyer shipping information securely to sustain safe and transparent transactions.
        <br />
        <br />
        3. Protection of Personal Information: As a seller, it is imperative to treat buyer personal information with utmost care. Avoid disclosing it to third parties. We kindly request your strict adherence to these guidelines to uphold transparency and trust in your transactions. Ensuring a secure transaction environment benefits everyone involved.
        <br />
        <br />
        <br />
        <span className="text-[#fff] font-extrabold"> Thank You</span>
      </p>
      <div className="py-3 w-full rounded-lg text-black font-semibold bg-neon px-20">
        <button
          className="w-full h-full bg-neon"
          onClick={() => {
            onClose();
          }}
        >
          I Agree
        </button>
      </div>
    </div>);
  }

  return null;
}
