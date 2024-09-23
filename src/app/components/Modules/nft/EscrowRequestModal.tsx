'use client';

import React, { useState,useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import PhoneInput from 'react-phone-input-2';
import { City, Country, State } from 'country-state-city';
import FileInput from '../../ui/FileInput';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import BaseButton from '../../ui/BaseButton';
export default function EscrowRequestModal({onClose}) {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countries = Country.getAllCountries();
  const [advancedDetails, setAdvancedDetails] =  useState({ certificates: [] });


  const [formData, setFormData] = useState({
    username: null,
    email: null,
    description: null,
    accepted: true,
  });
  const [sellerInfo, setSellerInfo] = useState({
    country: '',
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
      [name]: value
    });
  };
  
  const [unlockableFiles, setUnlockableFiles] = useState([]);

  useEffect(() => {
    setAdvancedDetails({
      ...advancedDetails,
      certificates: unlockableFiles,
    });
  }, [unlockableFiles]);


  const releseEscrowRequest = async () => {
    // API call
    try {
      setStep(2);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFileChange = (file: any, index: number) => {
    const newFiles = unlockableFiles.map((item: any, i: number) => {
      if (i === index) {
        return file;
      }
      return item;
    });

    setUnlockableFiles(newFiles);
    setAdvancedDetails({
      ...advancedDetails,
      certificates: newFiles,
    });
  };
  const removeUnlockable = (index: number) => {
    const newFiles = unlockableFiles.filter(
      (item: any, i: number) => i !== index,
    );

    setUnlockableFiles(newFiles);
    setAdvancedDetails({
      ...advancedDetails,
      certificates: newFiles,
    });
  };


  return (
    <div className="">
      {step === 1 && (
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex items-center gap-x-3">
            <img src="/icons/receipt.svg" className="w-12" />
            <p className="text-[30px] font-extrabold azeret-mono-font ">Escrow Release Request</p>
          </div>

          <p className="text-[16px] azeret-mono-font text-[#FFFFFF53] mb-6">
            We are sad to see your Escrow Release request! However, please be
            informed that cancellations due to a change of mind are not in our
            terms and conditions. But if you have other reasons like shipping
            delays, product defects, and more, your cancellation request may be
            approved.
            <br />
            <br />
            Kindly explain the reasons for your cancellation in the field down
            below. After careful review, we will contact you with further
            details through the email and messenger ID that you provided. We
            value your feedback as it helps us deliver the best possible
            service. Thank You!
          </p>
            <div className="flex flex-col gap-y-2 w-[100%]">
                <Label className="text-lg font-medium">Email*</Label>
                <Input
                  value={formData.email ? formData.email : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: (e.target as HTMLInputElement).value,
                    })
                  }
                  className="w-full border border-[#3A3A3A] bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                  type="text"
                  placeholder="Enter your email"
                />
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
                    height: '3.25rem',
                    borderRadius: '0.375rem',
                    padding: '0.5rem',
                    marginTop: '0.5rem',
                    color: '#fff',
                    backgroundColor: '#161616',
                    border:'1px solid #3A3A3A'
                  }}
                  onChange={(e) =>
                    setSellerInfo({ ...sellerInfo, phoneNumber: e })
                  }
                />
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">

                <Label className="text-lg font-medium">Describe*</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-none bg-[#161616] border border-[#3A3A3A] h-[240px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] p-4 rounded-md"
                  placeholder="Please describe your product"
                />

              </div>
            </div>
            <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                    <div className="flex w-full justify-between">
                      <span>
                      Attachment
                      </span>
                      <div className="flex items-center">
                      <div
                        className="flex gap-x-2 px-4 h-[52px] py-1 rounded-md items-center border-2 border-neon cursor-pointer me-5"
                    onClick={() => {
                      setUnlockableFiles([...unlockableFiles, null]);
                      setAdvancedDetails({
                        ...advancedDetails,
                        certificates: [...unlockableFiles, null],
                      });
                    }}
                  >
                    <img src="/icons/add-new.svg" alt="plus" className="w-4 h-4" />
                    <p className="text-neon">Add</p>
                  </div>
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white`}
                      />

                      </div>
                     
                    </div>
                   
                  </DisclosureButton>

                  <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                  <div className="flex gap-x-4 items-center">
              <FileInput
                onFileSelect={(file: any) => handleFileChange(file, 0)}
                maxSizeInBytes={1024 * 1024}
              />
              <img
                src="/icons/trash.svg"
                alt="trash"
                className="w-6 h-6 cursor-pointer"
                onClick={() => removeUnlockable(0)}
              />
            
            </div>
            {advancedDetails.certificates.map((item: any, index: number) => {
              return (
                <div className="flex gap-x-4 items-center" key={index}>
                  <FileInput
                    onFileSelect={(file: any) => handleFileChange(file, index)}
                    maxSizeInBytes={1024 * 1024}
                  />
                  <img
                    src="/icons/trash.svg"
                    alt="trash"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => removeUnlockable(index)}
                  />
                </div>
              );
            })}
                   
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>

            <div className="flex justify-between">
              <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
                <button className="w-full h-full" onClick={() => {}}>
                  Cancel
                </button>
              </div>
              <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
                <button
                  className="w-full h-full"
                  onClick={async () => await releseEscrowRequest()}
                >
                  Submit
                </button>
              </div>
            </div>
           
              </div>
            )}

      {step === 2 && (
        <div className="flex w-full justify-center flex-col gap-y-4 text-center">
          <img src="/icons/success.svg" className="w-16 mx-auto" />
          <p className="text-[30px] font-extrabold">Application Success</p>
          <p className=" text-[16px] azeret-mono-font text-[#ffffff53]">
            Your Request to release escrow request has been successfully<br/>
            received. We will carefully review it and contact<br/> you as soon as
            possible. Thank you for your patience.
          </p>
          <BaseButton
              title="Close"
              variant="primary"
              onClick={() => {
                
              }}
              className="w-full"
            />
          
        </div>
      )}
    </div>
  );
}
