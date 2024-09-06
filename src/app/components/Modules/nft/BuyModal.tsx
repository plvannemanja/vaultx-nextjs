'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { City, Country, State } from 'country-state-city';
import PhoneInput from 'react-phone-input-2';
import { Textarea } from '@headlessui/react';
import { Checkbox } from '@/components/ui/checkbox';
import BaseButton from '../../ui/BaseButton';

export default function BuyModal({ price }: { price: number }) {
  const [formData, setFormData] = useState({
    username: null,
    email: null,
    description: null,
    accepted: false,
  });
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

  const update = () => {};

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

  return (
    <div className="flex flex-col gap-y-5 w-full">
      <div className="mt-5 flex gap-x-3">
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
                  setFormData({ ...formData, email: (e.target as any).value })
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
      </div>

      <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-3">
          <Label className="text-lg font-medium">Shipping Address</Label>
          <hr />
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col gap-y-2 lg:w-[48%]">
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
            <div className="flex flex-col gap-y-2 lg:w-[48%]">
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
                value={sellerInfo.state ? JSON.stringify(sellerInfo.state) : ''}
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
                value={sellerInfo.city ? JSON.stringify(sellerInfo.city) : ''}
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
                  setSellerInfo({ ...sellerInfo, postalCode: e.target.value })
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
            onChange={(e) => setSellerInfo({ ...sellerInfo, phoneNumber: e })}
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
              setFormData({ ...formData, description: (e.target as any).value })
            }
            className="w-full border-none bg-[#161616] p-4 rounded"
            placeholder="Please describe your product"
          />
        </div>
      </div>

      <div className="bg-dark p-4 gap-y-4 rounded-lg flex flex-col">
        <p>Consent for collection and usage of personal information</p>
        <p className="text-gray-500">
          Please read the following and check the appropriate boxes to indicate
          your consent:
        </p>
        <hr />
        <Textarea
          onClick={(e) =>
            setFormData({
              ...formData,
              description: (e.target as any).value,
            })
          }
          className="p-4 rounded-md"
          rows={4}
          placeholder="faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. "
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.accepted}
          onChange={() =>
            setFormData({
              ...formData,
              accepted: true,
            })
          }
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to all terms, privacy policy and fees
        </label>
      </div>

      <div className="bg-dark p-4 gap-y-4 rounded-lg flex flex-col">
        <p>Order Summary</p>
        <hr />
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Price</span>
          <span className="text-lg font-medium">${price}</span>
        </div>
        <hr />
        <p>
          You will pay the purchase amount in cryptocurrency based on the
          real-time CoinMarketCap exchange rate at the current moment. If the
          bidding is not successful, all cryptocurrency used in the purchase
          price, excluding gas fees, will be refunded.
        </p>
      </div>

      <div className="flex gap-x-4 justify-center my-3 px-4">
        <BaseButton
          title="Discard"
          variant="secondary"
          onClick={cancelChanges}
        />
        <BaseButton title="Submit" variant="primary" onClick={update} />
      </div>
    </div>
  );
}
