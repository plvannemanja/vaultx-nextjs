'use client';

import { useState } from 'react';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { Label } from '@radix-ui/react-label';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export default function NFTDescription() {
  const { NFTDetail: data, setMainImage } = useNFTDetail();

  return (
    <>
      <div className="w-full flex gap-5 flex-wrap">
        {[data.cloudinaryUrl, ...data.attachments].map((item, index) => {
          return (
            <img
              key={index}
              onClick={() => {
                setMainImage(item);
              }}
              src={item}
              className="w-[16rem] opacity-60 hover:opacity-100 tra rounded aspect-square object-cover"
            />
          );
        })}
      </div>
      <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                    <div className="flex w-full justify-between">
                      <span>
                      Properties
                      </span>
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white`}
                      />
                    </div>
                  </DisclosureButton>
                  <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                  <div className="flex gap-4 flex-wrap">
                    {data.attributes.map((attr, index) => {
                      return (
                        <div
                          key={index}
                          className="w-[18rem] py-4 rounded-lg flex justify-center flex-col gap-y-2 border-2 border-gray-400"
                        >
                          <p className="text-lg font-medium text-center">{attr.type}</p>
                          <p className="font-medium text-center">{attr.value}</p>
                        </div>
                      );
                    })}
                    {data.attributes.length === 0 && <p>No properties available</p>}
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
                  <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                    <div className="flex w-full justify-between">
                      <span>
                      Description
                      </span>
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white`}
                      />
                    </div>
                  </DisclosureButton>
                  <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                  <p className="text-[#ffffff53] text-[16px] azeret-mono-font">{data.description}</p>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
      </div>
    </>
  );
}
