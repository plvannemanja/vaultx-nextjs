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
import ErrorModal from '../create/ErrorModal';
import ShippingInfo from '../ShippingInfo';
import ContactInfo from '../ContactInfo';

export default function EditNFTModal({
  onClose,
  fetchNftData,
}: {
  onClose: () => void;
  fetchNftData: () => void;
}) {
  
 
  return (

     
        <>

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
                            
                              className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                              type="text"
                              placeholder="Enter your username"
                            />
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

                          
                          </div>
                          <div className="flex flex-col gap-y-2 lg:w-[48%]">
                            <h2 className="font-bold text-[#fff] text-[14px]">
                              Address 2*
                            </h2>

                            <Input
                            
                              className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                              type="text"
                              placeholder="Enter address"
                            />
                          </div>
                        </div>
                    
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>
              <div className="flex w-full">
                <h2 className="font-bold text-[#ffffff] text-[14px]">
                 Description
                </h2>

              <Textarea
                          
                          className="w-full border-none bg-[#161616] h-[240px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] p-4 rounded-md"
                          placeholder="Please describe your product"
                        />
        

              </div>
               <ShippingInfo/>
               <ContactInfo/>
             

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
                        <Textarea
                         
                          className="w-full border-none bg-[#161616] rounded-md h-[240px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] p-4"
                          placeholder="Please describe your product"
                        />
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>

              <div className="flex w-full gap-x-4 justify-center my-3 px-4">
                <BaseButton
                  title="Discard"
                  variant="secondary"
                  // onClick={cancelChanges}
                  className="w-full"
                />
                <BaseButton
                  title="Submit"
                  variant="primary"
                 
                
                  className="w-full"
                  displayIcon
                />
              </div>
            </div>
          
        
         
          </>
   
   
  );
}
