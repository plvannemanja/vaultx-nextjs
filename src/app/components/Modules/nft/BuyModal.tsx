'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { City, Country, State } from 'country-state-city';
import PhoneInput from 'react-phone-input-2';
import { Textarea } from '@headlessui/react';
import { Checkbox } from '@/components/ui/checkbox';
import BaseButton from '../../ui/BaseButton';
import { CreateSellService } from '@/services/createSellService';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import {
  getTokenAmount,
  purchaseAsset,
  purchaseAssetBeforeMint,
} from '@/lib/helper';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { roundToDecimals, trimString } from '@/utils/helpers';
import BasicLoadingModal from './BasicLoadingModal';
import { nftServices } from '@/services/supplier';
import moment from 'moment';
import { INFTVoucher } from '@/types';
import { CreateNftServices } from '@/services/createNftService';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import ConnectedCard from '../../Cards/ConnectedCard';

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
    city: null,
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
      setStep(4);
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
          line1: sellerInfo.line1,
          line2: sellerInfo.line2,
          city: sellerInfo.city ? sellerInfo.city.name : '',
          state: sellerInfo.state ? sellerInfo.state.name : '',
          postalCode: sellerInfo.postalCode,
        },
        phoneNumber: sellerInfo.phoneNumber,
        contactInformation: formData.description,
        concent: formData.accepted,
        buyHash: transactionHash,
      };

      const saleService = new CreateSellService();
      await saleService.buyItem(data);
      await fetchNftData();
      setStep(5);
    } catch (error) {
      console.log(error);
      onClose();
    }
  };

  const buyFreeMint = async () => {
    try {
      setStep(4);
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
          line1: sellerInfo.line1,
          line2: sellerInfo.line2,
          city: sellerInfo.city ? sellerInfo.city.name : '',
          state: sellerInfo.state ? sellerInfo.state.name : '',
          postalCode: sellerInfo.postalCode,
        },
        phoneNumber: sellerInfo.phoneNumber,
        contactInformation: formData.description,
        concent: formData.accepted,
        buyHash: transactionHash,
      };
      const createNftService = new CreateNftServices();
      await createNftService.mintAndSale({
        nftId: NFTDetail?._id,
        mintHash: transactionHash,
        tokenId: Number(tokenId),
      });
      const saleService = new CreateSellService();
      await saleService.buyItem(data);
      await fetchNftData();
      setStep(5);
    } catch (error) {
      onClose();
    }
  };

  const purchase = async () => {
    if (NFTDetail.minted) await buyNFT();
    else await buyFreeMint();
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
  }, []);
  useEffect(() => {
    console.log(step);
  }, [step]);

  return (
    <>
      {step === 1 && (
        <div className="flex flex-col gap-y-6 w-full">
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
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white`}
                      />
                    </div>
                    <p className="text-[#ffffff53] text-[16px] azeret-mono-font">
                      Please read the following and check the appropriate boxes
                      to indicate your consent:
                    </p>
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
                      className="w-full border-none bg-[#161616] rounded-md h-[240px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] p-4"
                      placeholder="Please describe your product"
                    />
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>

          <div className="flex items-center space-x-2 p-4 ">
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
              Payment You will pay the purchase amount in cryptocurrency based
              on the real-time CoinMarketCap exchange rate at the current
              moment.
              <br />
              If the bidding is not successful, all cryptocurrency used in the
              purchase price, excluding gas fees, will be refunded.
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
                setStep(2);
              }}
              className="w-full"
              displayIcon
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex gap-x-3 items-center">
            <img src="/icons/info.svg" className="w-12" />
            <p className="text-[30px] text-[#fff] font-extrabold">Caution</p>
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
            information should remain confidential to sellers. Be cautious to
            prevent any external disclosures.
            <br />
            <br />
            2. Tips for Safe Transactions: Handle buyer shipping information
            securely to sustain safe and transparent transactions.
            <br />
            <br />
            3. Protection of Personal Information: As a seller, it is imperative
            to treat buyer personal information with utmost care. Avoid
            disclosing it to third parties.We kindly request your strict
            adherence to these guidelines to uphold transparency and trust in
            your transactions. Ensuring a secure transaction environment
            benefits everyone involved.
            <br />
            <br />
            <br />
            <span className="text-[#fff] font-extrabold">Thank You</span>
          </p>

          <div className="py-3 w-full rounded-lg text-black font-semibold bg-neon">
            <button className="w-full h-full" onClick={() => setStep(3)}>
              I Agree
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
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
          </div>

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
              <button className="w-full h-full" onClick={purchase}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="flex flex-col gap-y-4 items-center text-center">
          <img src="/icons/refresh.svg" className="w-20 mx-auto" />
          <p className="text-lg font-medium">
            Please wait while we purchasing NFT
          </p>
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-5 justify-center text-center mb-[40px]">
            <img
              src="/icons/success.svg"
              className="w-[115px] h-[115px] mx-auto"
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
                <p className="text-neon azeret-mono-font">{activeChain.name}</p>
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

      {step === 6 && (
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex gap-x-3 items-center">
            <img src="/icons/info.svg" className="w-12" />
            <p className="text-[30px] text-[#fff] font-extrabold">
              Bid Information
            </p>
          </div>

          <p className="text-[16px] azeret-mono-font font-extrabold text-[#FFFFFF87]">
            Bid Success
            <br />
            If a seller accepts your bid, this bid will be converted to the
            BuyNow stage.
            <br />
            <br />
            Bid Cancellation
            <br />
            If the seller does not accept the bid request within the period set
            by the buyer in the place bid, the bid will be canceled.
            Alternatively, if the buyer who applied for a bid cancels the bid
            application, the transaction will be cancelled.
            <br />
            <br />
            <br />
            If you have any questions regarding Bid, please contact us.
            <br />
            <br />
            <span className="text-[#fff] font-extrabold"> Thank You</span>
          </p>
        </div>
      )}
    </>
  );
}
