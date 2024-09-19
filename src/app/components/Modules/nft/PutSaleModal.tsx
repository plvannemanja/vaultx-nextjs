'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import PhoneInput from 'react-phone-input-2';
import { City, Country, State } from 'country-state-city';
import { useToast } from '@/hooks/use-toast';
import { CreateSellService } from '@/services/createSellService';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { useGlobalContext } from '../../Context/GlobalContext';
import { parseEther } from 'viem';
import { resaleAsset } from '@/lib/helper';
import { useActiveAccount } from 'thirdweb/react';

export default function PutSaleModal({
  onClose,
  fetchNftData,
}: {
  onClose: () => void;
  fetchNftData: () => void;
}) {
  const { nftId, NFTDetail: nft } = useNFTDetail();
  const { fee } = useGlobalContext();
  const activeAccount = useActiveAccount();
  const [countryCode, setCountryCode] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countries = Country.getAllCountries();
  const { toast } = useToast();
  const salesService = new CreateSellService();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: null,
    email: null,
    description: null,
    accepted: true,
    price: nft.price,
  });
  const [sellerInfo, setSellerInfo] = useState({
    country: '',
    address1: '',
    address2: '',
    state: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
  });

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
    debugger;
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
        name: nft.saleId.sellerShippingId.name,
        email: nft.saleId.sellerShippingId.email,
        country: nft.saleId.sellerShippingId.country,
        address: nft.saleId.sellerShippingId.address,
        phoneNumber: nft.saleId.sellerShippingId.phoneNumber,
        contactInformation: nft.saleId.sellerShippingId.contactInformation,
        concent: nft.saleId.sellerShippingId.concent,
        saleHash: transactionHash,
        price: formData.price,
      };

      await salesService.resellItem(data);
      await fetchNftData();
      onClose();
    } catch (error) {
      onClose();
      console.log(error);
    }
  };

  const handleMint = async () => {
    try {
      setStep(3);
      let splitPayments = [];
      // blockchain logic
      // const result = await listNf(
      //   nft?.uri,
      //   price,
      //   nft?.royalties ? nft.royalty : 0,
      //   address,
      //   splitPayments,
      //   address
      // )

      setStep(3);
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async () => {
    //TODO validate Form Data
    setStep(3);
    try {
      if (nft?.minted) await resellNft();
      else await handleMint();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {step === 1 && (
        <div className="flex flex-col gap-y-4">
          <p className="text-lg font-medium">List item for sale</p>

          {/* Blockchain card  */}

          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between items-center border border-gray-400 rounded-md p-3 my-1">
              <span>Price</span>
              <div className="flex items-center gap-x-2">{nft.price}$</div>
            </div>
            <div className="flex justify-between items-center">
              <span>Royalties</span>
              <span>{nft.royalty}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Marketplace fee</span>
              <span>{fee}%</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span>You will get</span>
              <span>{Number(nft.price).toFixed(2)} $</span>
            </div>
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
                  setStep(2);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col gap-y-5 w-full">
          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <Label className="text-lg font-medium">
              Give a new price to put this asset for sale.
            </Label>
            <hr className="bg-white" />
            <div className="flex justify-between">
              <Input
                type="number"
                placeholder="Enter The Price"
                className="w-full rounded bg-[#161616]"
                value={formData.price.toString()}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    price: (e.target as any).value as number,
                  });
                }}
              />
            </div>
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <Label className="text-lg font-medium">Buyer Information</Label>
            <hr className="bg-white" />
            <div className="flex justify-between">
              <div className="flex flex-col gap-y-2 w-[32%]">
                <Label className="text-lg font-medium">Name*</Label>
                <Input
                  value={formData.username ? formData.username : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: (e.target as any).value,
                    })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter your username"
                />
              </div>
              <div className="flex flex-col gap-y-2 w-[32%]">
                <Label className="text-lg font-medium">Email*</Label>
                <Input
                  value={formData.email ? formData.email : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: (e.target as HTMLInputElement).value,
                    })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex flex-col gap-y-2 w-[32%]">
                <Label className="text-lg font-medium">Country*</Label>
                <select
                  aria-label="select curation"
                  className="h-10 rounded-md px-2"
                  name="country"
                  value={JSON.stringify(sellerInfo.country)}
                  onChange={handleUpdateSeller}
                >
                  <option value="">Select</option>
                  {countries.map((item: any) => (
                    <option key={item.isoCode} value={JSON.stringify(item)}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-3">
              <Label className="text-lg font-medium">Shipping Address</Label>
              <hr />
              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col gap-y-2 lg:w-[49%]">
                  <Label className="text-lg font-medium">Address 1*</Label>
                  <Input
                    value={sellerInfo.address1 ? sellerInfo.address1 : ''}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, address1: e.target.value })
                    }
                    className="w-full border-none bg-[#161616]"
                    type="text"
                    placeholder="Enter name"
                  />
                </div>
                <div className="flex flex-col gap-y-2 lg:w-[49%]">
                  <Label className="text-lg font-medium">Address 2*</Label>
                  <Input
                    value={sellerInfo.address2 ? sellerInfo.address2 : ''}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, address2: e.target.value })
                    }
                    className="w-full border-none bg-[#161616]"
                    type="text"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col gap-y-2 lg:w-[32%]">
                  <Label className="text-lg font-medium">State*</Label>
                  <select
                    aria-label="select curation"
                    className="h-10 rounded-md px-2"
                    name="state"
                    value={
                      sellerInfo.state ? JSON.stringify(sellerInfo.state) : ''
                    }
                    onChange={handleUpdateSeller}
                  >
                    <option value="">Select</option>
                    {states.map((item: any) => (
                      <option key={item.isoCode} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-y-2 lg:w-[32%]">
                  <Label className="text-lg font-medium">City*</Label>
                  <select
                    aria-label="select curation"
                    className="h-10 rounded-md px-2"
                    name="city"
                    value={
                      sellerInfo.city ? JSON.stringify(sellerInfo.city) : ''
                    }
                    onChange={handleUpdateSeller}
                  >
                    <option value="">Select</option>
                    {cities.map((item: any) => (
                      <option key={item.isoCode} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-y-2 lg:w-[32%]">
                  <Label className="text-lg font-medium">Postal Code*</Label>
                  <Input
                    value={sellerInfo.postalCode ? sellerInfo.postalCode : ''}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full border-none bg-[#161616]"
                    type="text"
                    placeholder="Enter postcode"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-3">
              <PhoneInput
                enableLongNumbers={true}
                containerClass="phone-container"
                buttonClass="phone-dropdown"
                inputClass="phone-control"
                country={'us'}
                value={sellerInfo.phoneNumber ? sellerInfo.phoneNumber : ''}
                inputStyle={{
                  width: '100%',
                  height: '2.5rem',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  marginTop: '0.5rem',
                }}
                onChange={(e) =>
                  setSellerInfo({ ...sellerInfo, phoneNumber: e })
                }
              />
            </div>
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-3">
              <Label className="text-lg font-medium">
                Contact Information For Seller
              </Label>
              <hr />
              <Textarea
                value={formData.description ? formData.description : ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: (e.target as any).value,
                  })
                }
                className="w-full border-none bg-[#161616] p-4 rounded"
                placeholder="Please describe your product"
              />
            </div>
          </div>

          <div className="bg-dark p-4 gap-y-4 rounded-lg flex flex-col">
            <p>Consent for collection and usage of personal information</p>
            <p className="text-gray-500">
              Please read the following and check the appropriate boxes to
              indicate your consent:
            </p>
            <hr />
            <Textarea
              onClick={(e) =>
                setFormData({
                  ...formData,
                  description: (e.target as any).value,
                })
              }
              className="p-4 rounded-md bg-[#161616]"
              rows={4}
              placeholder="VaultX utilizes an agreed-upon shipping method between sellers and buyers for secure delivery tailored to the characteristics of each artwork. Buyers will review the message you have written in this field and will contact you. Please leave a friendly message to make it convenient for buyers to reach out to you."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.accepted}
              onChange={(e) => {
                debugger;
                setFormData({
                  ...formData,
                  accepted: (e.target as any).checked,
                });
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to all terms, privacy policy and fees
            </label>
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
                onClick={async () => await submit()}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col gap-y-4 items-center text-center">
          <img src="/icons/refresh.svg" className="w-20 mx-auto" />
          <p className="text-lg font-medium">
            Please wait while we put it on sale
          </p>
        </div>
      )}
    </>
  );
}
