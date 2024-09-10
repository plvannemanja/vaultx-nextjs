'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { City, Country, State } from 'country-state-city';
import PhoneInput from 'react-phone-input-2';
import { Textarea } from '@headlessui/react';
import { Checkbox } from '@/components/ui/checkbox';
import BaseButton from '../../ui/BaseButton';
import { CreateSellService } from '@/services/createSellService';

export default function BuyModal({ id, price }: { id: string; price: number }) {
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

  const update = async () => {
    try {
      // blockchain logic here to get transaction hash

      const data = {
        nftId: id,
        name: formData.username,
        email: formData.email,
        country: JSON.parse(sellerInfo.country).name,
        address: {
          line1: sellerInfo.line1,
          line2: sellerInfo.line2,
          city: sellerInfo.city,
          state: JSON.parse(sellerInfo.state).name,
          postalCode: sellerInfo.postalCode,
        },
        phoneNumber: sellerInfo.phoneNumber,
        contactInformation: formData.description,
        concent: formData.accepted,
        buyHash: '',
      };

      const saleService = new CreateSellService();
      await saleService.buyItem(data);
    } catch (error) {
      console.log(error);
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

  return (
    <>
      {step === 1 && (
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
                      setFormData({
                        ...formData,
                        email: (e.target as any).value,
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
                  accepted: !formData.accepted,
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
              real-time CoinMarketCap exchange rate at the current moment. If
              the bidding is not successful, all cryptocurrency used in the
              purchase price, excluding gas fees, will be refunded.
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
      )}

      {step === 2 && (
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex gap-x-3 items-center">
            <img src="/icons/info.svg" className="w-12" />
            <p className="text-lg font-medium">Caution</p>
          </div>

          <p>
            Do not disclose buyer shipping information to third parties!
            <br />
            <br />
            To maintain the confidentiality of buyer information and ensure
            smooth transactions, please pay close attention to the following
            points:
            <br />
            <br />
            1. Confidentiality of Shipping Information: Buyer shipping
            information should remain confidential to sellers. Be cautious to
            prevent any external disclosures.
            <br />
            2. Tips for Safe Transactions: Handle buyer shipping information
            securely to sustain safe and transparent transactions.
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
            Thank You
          </p>

          <div className="py-3 w-full rounded-lg text-black font-semibold bg-neon">
            <button className="w-full h-full" onClick={() => setStep(3)}>
              I Agree
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-y-4 w-full">
          <p className="text-lg font-medium">Checkout</p>
          <p>You are about to purchase Dhruv from fjas3</p>

          {/* Wallet Connection - Blockchain */}

          <div className="flex flex-col gap-y-2 mt-5">
            <div className="flex justify-between items-center">
              <span>Price</span>
              <span>{price} MATIC</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span>VaultX Fee</span>
              <span>5 %</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span>You will pay</span>
              <span>{Number(price + 0.05 * price).toFixed(2)} MATIC</span>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
              <button className="w-full h-full" onClick={() => setStep(2)}>
                Cancel
              </button>
            </div>
            <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
              <button className="w-full h-full" onClick={() => setStep(4)}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2 justify-center text-center">
            <img src="/icons/success.svg" className="w-16 mx-auto" />
            <p className="text-lg font-medium">Payment Success</p>
            <p className="text-gray-500">
              Your payment is completed successfully
            </p>
          </div>

          <div className="flex flex-col gap-y-3">
            <div className="flex justify-between">
              <div className="w-[48%] p-4 rounded-md border border-gray-400">
                <p className="text-sm text-gray-500">From</p>
                <p className="text-neon">hhgkjhkjh#$34224</p>
              </div>
              <div className="w-[48%] p-4 rounded-md border border-gray-400">
                <p className="text-sm text-gray-500">From</p>
                <p className="text-neon">hhgkjhkjh#$34224</p>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-[48%] p-4 rounded-md border border-gray-400">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-neon">Polygon</p>
              </div>
              <div className="w-[48%] p-4 rounded-md border border-gray-400">
                <p className="text-sm text-gray-500">Payment Time</p>
                <p className="text-neon">11/19/2023, 11:49:57 PM</p>
              </div>
            </div>
          </div>

          <div className="py-3 w-full rounded-lg text-black font-semibold bg-neon">
            <button className="w-full h-full" onClick={() => setStep(5)}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex gap-x-3 items-center">
            <img src="/icons/info.svg" className="w-12" />
            <p className="text-lg font-medium">Bid Information</p>
          </div>

          <p>
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
            Thank You
          </p>
        </div>
      )}
    </>
  );
}
