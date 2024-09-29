'use client';

import React, { useEffect, useState,useRef } from 'react';
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
import { useCreateNFT } from '../../Context/CreateNFTContext';
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
import ErrorModal from '../create/ErrorModal';
import ShippingInfo from '../ShippingInfo';
import ContactInfo from '../ContactInfo';
import SellerInformation from '../create/SellerInformation';
import { BaseDialog } from '../../ui/BaseDialog';
import { acceptedFormats, maxFileSize } from '@/utils/helpers';


export default function EditNFTModal({
  onClose,
  fetchNftData,
}: {
  onClose: () => void;
  fetchNftData: () => void;
}) {
  const [data, setData] = useState([
    {
      _id: '1',
      name: 'John Doe',
      phoneNumber: '+1234567890',
      shippingAddr: 'Home',
      address: {
        line1: '123 Main St',
        line2: 'Apt 4',
        state: 'California',
        city: 'Los Angeles',
        postalCode: '90001'
      },
      country: 'United States'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      phoneNumber: '+0987654321',
      shippingAddr: 'Office',
      address: {
        line1: '456 Oak Ave',
        line2: 'Suite 7',
        state: 'New York',
        city: 'New York City',
        postalCode: '10001'
      },
      country: 'United States'
    }
  ]);
  const [basicDetail, setBasicDetail ] = useState({ attachments: [null]});
  const attachmentRef = useRef(null);
  const [addAttachId, setAddAttachId] = useState(0);

  const handleAttachment = (file: any, index: number) => {
    const attachment = file.target.files[0];
    const fileExtension = attachment.name.split('.').pop().toLowerCase();
    if (
      attachment.size < maxFileSize &&
      acceptedFormats.includes(`.${fileExtension}`)
    ) {
      const newAttachments = [...basicDetail?.attachments];
      newAttachments[addAttachId] = attachment;

      setBasicDetail({
        ...basicDetail,
        attachments: newAttachments,
      });
    }
  };

  const addAttachment = (index) => {
    if (attachmentRef.current) {
      (attachmentRef.current as any).click();
    }
    setAddAttachId(index);
    if (basicDetail?.attachments.length - 1 > index) {
      return;
    }
    const newAttachments = [...basicDetail?.attachments, null];

    setBasicDetail({
      ...basicDetail,
      attachments: newAttachments,
    });
  };


  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleDeleteSeller = (item) => {
    setData(data.filter(d => d._id !== item._id));
  };

  const [sellerInfo, setSellerInfo] = useState<any>({
    data: null,
    error: null,
  });

  const handleSellerInfo = (data: any, error: any) => {
    setSellerInfo({
      data: data,
      error: error,
    });
  };

  const removeAttachment = (index: number) => {
    const newAttachments = basicDetail?.attachments.filter(
      (_, i) => i !== index,
    );

    setBasicDetail({
      ...basicDetail,
      attachments: newAttachments,
    });
  };
 
  return (

     
        <>

            <div className="flex flex-col gap-y-6 w-full">
              <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
                <Disclosure as="div" defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                        <span>Attachment</span>
                        <ChevronUpIcon
                          className={`${
                            open ? 'rotate-180 transform' : ''
                          } h-5 w-5 text-white`}
                        />
                      </DisclosureButton>
                      <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                      <div className="flex gap-4 flex-wrap my-2">
              {basicDetail?.attachments?.map((attachment, index) => {
                return (
                  <div key={index} className="flex flex-col gap-y-2">
                    <input
                      type="file"
                      className="hidden"
                      title="file"
                      ref={
                        index === basicDetail?.attachments.length - 1
                          ? attachmentRef
                          : null
                      }
                      onChange={(e) => handleAttachment(e, index)}
                    />
                    {!attachment ? (
                      <img
                        src="https://i.ibb.co/c8FMdw1/attachment-link.png"
                        alt="attachment"
                        className="w-[200px] mx-auto h-[200px] rounded-md object-cover"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(attachment)}
                        alt="attachment"
                        className="w-[200px] mx-auto h-[200px] rounded-md object-cover"
                      />
                    )}
                    {attachment ? (
                      <div className="flex gap-x-2 justify-center items-center cursor-pointer">
                        <span
                          className="text-neon font-bold text-[13px]"
                          onClick={() => addAttachment(index)}
                        >
                          Change
                        </span>
                        <img
                          src="/icons/trash.svg"
                          alt="attachment"
                          className="w-5 h-5"
                          onClick={() => removeAttachment(index)}
                        />
                      </div>
                    ) : (
                      <div
                        className="flex gap-x-2 justify-center items-center cursor-pointer"
                        onClick={() => addAttachment(index)}
                      >
                        <span className="text-neon  font-bold text-[13px]">
                          Upload
                        </span>
                        <img
                          src="/icons/upload.svg"
                          alt="attachment"
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
                       
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>

            
              <div className="flex flex-col gap-y-2 w-full">
                            <h2 className="font-bold text-[#fff] text-[14px]">
                              Category
                            </h2>

                            <select
                              aria-label="select curation"
                              className="rounded-[24px] px-6 bg-[#232323] text-white border-none h-[52px]"
                              name="country"
                            >
                              <option value="">Select</option>
                             
                            </select>
                          </div>
              <div className="flex w-full flex-col">
                <h2 className="font-bold text-[#ffffff] text-[14px] mb-[15px]">
                 Description
                </h2>

                  <Textarea
                              
                  className="w-full border-none bg-[#232323] h-[240px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] p-4 rounded-[24px] resize-none"
                  placeholder="Please describe your product"
                />
        

              </div>
              <div className="flex flex-col gap-y-5">
                <p className="text-lg font-medium">Shipping Information</p>
                <div className="flex flex-wrap gap-5">
                  {data.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedShipping(item)}
                      className={`w-[18rem] h-[15rem] bg-[#232323] relative flex flex-col justify-between p-6 rounded-md ${
                        selectedShipping?._id === item._id ? 'border-neon' : 'border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-y-2">
                          <span>{item.name}</span>
                          <span className="text-[#A6A6A6]">{item.phoneNumber}</span>
                        </div>
                        <div className="text-[#A6A6A6]">{item.shippingAddr}</div>
                      </div>
                      <div>
                        <p className="text-[#A6A6A6] azeret-mono-font text-[12px]">
                          {`${item.address.line1} ${item.address.line2} ${item.address.state} ${item.address.city} ${item.country}`.slice(0, 150)}
                        </p>
                        <span
                          onClick={() => setIsUpdateModalOpen(true)}
                          className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12] absolute bottom-5 right-10 text-[14px]"
                        >
                          Edit
                        </span>
                        <span
                          onClick={() => handleDeleteSeller(item)}
                          className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12] absolute bottom-5 right-2 text-[14px]"
                        >
                          <img src="/icons/trash.svg" className="w-4 h-4" alt="Delete" />
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div
                    className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col relative justify-center cursor-pointer items-center rounded-md"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className="flex flex-col gap-y-6 items-center">
                      <div className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#FFFFFF4D] flex justify-center items-center">
                        <img src="/icons/plus.svg" className="w-5 h-5" alt="Add" />
                      </div>
                      <p className="text-[#828282]">Add New Address</p>
                    </div>
                  </div>

                  <BaseDialog
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                  >
                    {/* Add Address Form */}
                    <div className="flex flex-col gap-y-5">
                      {/* Form fields here */}
                      <div className="flex gap-x-4 justify-center my-3 px-4">
                        <BaseButton
                          title="Cancel"
                          variant="secondary"
                          onClick={() => setIsModalOpen(false)}
                        />
                        <BaseButton
                          title="Save"
                          variant="primary"
                          onClick={() => setIsModalOpen(false)}
                        />
                      </div>
                    </div>
                  </BaseDialog>

                  <BaseDialog
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                  >
                    {/* Update Address Form */}
                    <div className="flex flex-col gap-y-5">
                      {/* Form fields here */}
                      <div className="flex gap-x-4 justify-center my-3 px-4">
                        <BaseButton
                          title="Cancel"
                          variant="secondary"
                          onClick={() => setIsUpdateModalOpen(false)}
                        />
                        <BaseButton
                          title="Save"
                          variant="primary"
                          onClick={() => setIsUpdateModalOpen(false)}
                        />
                      </div>
                    </div>
                  </BaseDialog>
                </div>
              </div>             
              <div className="flex flex-col gap-y-5">
                <p className="text-lg font-medium">Contact Information</p>
                <div className="flex flex-wrap gap-5">
                  {data.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedShipping(item)}
                      className={`w-[18rem] h-[15rem] bg-[#232323] relative flex flex-col justify-between p-4 rounded-md ${
                        selectedShipping?._id === item._id ? 'border-neon' : 'border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-y-2">
                          <span>{item.name}</span>
                          <span className="text-[#A6A6A6]">{item.phoneNumber}</span>
                        </div>
                        <div className="text-[#A6A6A6]">{item.shippingAddr}</div>
                      </div>
                      <div>
                        <p className="text-[#A6A6A6] azeret-mono-font text-[12px]">
                          {`${item.address.line1} ${item.address.line2} ${item.address.state} ${item.address.city} ${item.country}`.slice(0, 150)}
                        </p>
                        <span
                          onClick={() => setIsUpdateModalOpen(true)}
                          className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12] absolute bottom-2 right-10 text-[14px]"
                        >
                          Edit
                        </span>
                        <span
                          onClick={() => handleDeleteSeller(item)}
                          className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12] absolute bottom-2 right-2 text-[14px]"
                        >
                          <img src="/icons/trash.svg" className="w-4 h-4" alt="Delete" />
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div
                    className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col relative justify-center cursor-pointer items-center rounded-md"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className="flex flex-col gap-y-6 items-center">
                      <div className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#FFFFFF4D] flex justify-center items-center">
                        <img src="/icons/plus.svg" className="w-5 h-5" alt="Add" />
                      </div>
                      <p className="text-[#828282]">Add New Address</p>
                    </div>
                  </div>

                  <BaseDialog
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                  >
                    {/* Add Address Form */}
                    <div className="flex flex-col gap-y-5">
                      {/* Form fields here */}
                      <div className="flex gap-x-4 justify-center my-3 px-4">
                        <BaseButton
                          title="Cancel"
                          variant="secondary"
                          onClick={() => setIsModalOpen(false)}
                        />
                        <BaseButton
                          title="Save"
                          variant="primary"
                          onClick={() => setIsModalOpen(false)}
                        />
                      </div>
                    </div>
                  </BaseDialog>

                  <BaseDialog
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                  >
                    {/* Update Address Form */}
                    <div className="flex flex-col gap-y-5">
                      {/* Form fields here */}
                      <div className="flex gap-x-4 justify-center my-3 px-4">
                        <BaseButton
                          title="Cancel"
                          variant="secondary"
                          onClick={() => setIsUpdateModalOpen(false)}
                        />
                        <BaseButton
                          title="Save"
                          variant="primary"
                          onClick={() => setIsUpdateModalOpen(false)}
                        />
                      </div>
                    </div>
                  </BaseDialog>
                </div>
              </div>         
              <div className="flex w-full gap-x-4 justify-center my-3 px-4">
                <BaseButton
                  title="Discard"
                  variant="secondary"
                   onClick={onClose}
                  className="w-full"
                />
                <BaseButton
                  title="Submit"
                  variant="primary"
                  onClick={onClose}
                  className="w-full"
                />
              </div>
            </div>
          </>
   
   
  );
}
