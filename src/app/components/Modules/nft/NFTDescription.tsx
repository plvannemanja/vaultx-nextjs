'use client';

import { truncate } from '@/lib/utils';
import { ShippingAddressType } from '@/types';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { DownloadIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import DescriptionIcon from '../../Icons/description-icon';

export default function NFTDescription() {
  const [loadMore, setLoadMore] = useState(false);
  const { user } = useGlobalContext();
  const { NFTDetail: data, setMainImage, type } = useNFTDetail();
  const [shippingData, setShippingData] = useState<Omit<
    ShippingAddressType,
    'nftId'
  > | null>(null);
  const maxAttachments = 4;

  useEffect(() => {
    if (type === 'inEscrow') {
      setShippingData(data.saleId?.buyerShippingId);
    } else if (type === 'release') {
      setShippingData(data.saleId?.sellerShippingId);
    } else {
      setShippingData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleDownload = async (url: string, fileName: string) => {
    try {
      // Make an API request to download the file
      const response = await fetch(url); // Change to your API route
      const blob = await response.blob();

      // // Extract the original file name from the response headers (if available)
      // const contentDisposition = response.headers.get('content-disposition');

      // if (contentDisposition) {
      //   const matches = /filename="(.+)"/.exec(contentDisposition);
      //   if (matches != null && matches[1]) {
      //     fileName = matches[1]; // Extract original file name from headers
      //   }
      // }

      // Create a link element, set the href to the blob URL, and trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Use the original file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const description = truncate(
    data?.description?.replace(/\r\n|\n/g, '<br />'),
    320,
  );

  return (
    <>
      <div className="w-full flex gap-[27px] flex-wrap">
        {[data.cloudinaryUrl, ...data.attachments.slice(0, maxAttachments)].map(
          (item, index) => {
            return (
              <div
                className="w-[242px] h-[242px] aspect-square relative"
                key={index}
              >
                <Image
                  alt={data.name}
                  // width={242}
                  // height={242}
                  layout="fill"
                  objectFit="cover"
                  key={index}
                  onClick={() => {
                    setMainImage(item);
                  }}
                  src={item}
                  className="opacity-60 hover:opacity-100 rounded"
                />
              </div>
            );
          },
        )}
      </div>
      <div className="w-full rounded-[20px] p-5 flex flex-col gap-y-6 bg-[#232323]">
        <Disclosure as="div" defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full flex-col justify-between py-2 pb-4 text-left   text-lg font-medium text-white text-[18px] border-b border-white/[8%]">
                <div className="flex w-full justify-between">
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <DescriptionIcon />
                    <span>Description</span>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-white/[53%]`}
                  />
                </div>
              </DisclosureButton>
              <DisclosurePanel className="pt-4 pb-2 text-sm  text-white  rounded-b-lg">
                <span
                  className="text-white/[53%] text-sm font-normal azeret-mono-font"
                  dangerouslySetInnerHTML={{
                    // data.description.replace(/\r\n|\n/g, '<br />'),
                    __html: loadMore
                      ? data?.description?.replace(/\r\n|\n/g, '<br />')
                      : description,
                  }}
                ></span>
                {description?.length > 320 && (
                  <span
                    className="text-[#DDF247] inline-block ml-2 cursor-pointer font-normal azeret-mono-font"
                    onClick={() => setLoadMore((prev) => !prev)}
                  >
                    {loadMore ? 'View less' : 'View More'}
                  </span>
                )}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
      {shippingData && (
        <div className="w-full rounded-[20px] p-5 flex flex-col gap-y-6 bg-[#232323]">
          <Disclosure as="div" defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full flex-col justify-between py-2 pb-4 text-left text-lg font-medium text-white text-[18px] border-b border-white/[8%]">
                  <div className="flex w-full justify-between">
                    <div className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>
                        {type === 'inEscrow' ? 'Buyer' : 'Seller'} Information
                      </span>
                    </div>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-white/[53%]`}
                    />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                  {/* Buyer Information */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="text-sm text-white font-['Azeret Mono']">
                        Name
                      </div>
                      <div className="text-right text-yellow-300 font-['Azeret Mono']">
                        {shippingData.name}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-white font-['Azeret Mono']">
                        Email
                      </div>
                      <div className="text-right text-yellow-300 font-['Azeret Mono']">
                        {shippingData.email}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-white font-['Azeret Mono']">
                        Phone
                      </div>
                      <div className="text-right text-white font-['Azeret Mono']">
                        {shippingData.phoneNumber}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-white font-['Azeret Mono']">
                        Street Address
                      </div>
                      <div className="text-right text-white font-['Azeret Mono']">
                        {shippingData.address.line1}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-white font-['Azeret Mono']">
                        Postal Address
                      </div>
                      <div className="text-right text-white font-['Azeret Mono']">
                        {shippingData.address.postalCode}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-white font-['Azeret Mono']">
                        City
                      </div>
                      <div className="text-right text-white font-['Azeret Mono']">
                        {shippingData.address.city}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-white font-['Azeret Mono']">
                        State
                      </div>
                      <div className="text-right text-white font-['Azeret Mono']">
                        {shippingData.address.state}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-white font-['Azeret Mono']">
                        Country
                      </div>
                      <div className="text-right text-white font-['Azeret Mono']">
                        {shippingData.country}
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          {/* Buyer’s Message Section */}
          <div className="w-full flex justify-between pt-4 text-white border-t border-white/[8%]">
            <span className="text-yellow-300 text-sm font-extrabold capitalize">
              {type === 'inEscrow' ? 'Buyer' : 'Seller'}’s message
            </span>
          </div>
          <div className="pt-4 text-white/[53%] text-sm font-normal azeret-mono-font">
            <span
              dangerouslySetInnerHTML={{
                __html: truncate(shippingData.contactInformation, 450),
              }}
            ></span>
            {description.length > 450 && (
              <span className="text-[#DDF247] inline-block ml-2 text-sm cursor-pointer hover:underline">
                See more
              </span>
            )}
          </div>
        </div>
      )}
      {(data?.owner?.wallet?.toLowerCase() === user?.wallet?.toLowerCase() ||
        type === 'release') &&
        data.unlockableContent && (
          <div className="w-full rounded-[20px] p-5 flex flex-col gap-y-6 bg-[#232323]">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full flex-col justify-between py-2 pb-4 text-left text-lg font-medium text-white text-[18px] border-b border-white/[8%]">
                    <div className="flex w-full justify-between">
                      <div className="text-sm font-extrabold text-white flex items-center gap-2">
                        <Image
                          src="/icons/lockable.svg"
                          width={16}
                          height={16}
                          alt="lockable"
                        />
                        <span>Unlockable Content</span>
                      </div>
                      <ChevronUpIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </DisclosureButton>

                  <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                    <div className="text-white/[53%] text-sm font-normal mb-4">
                      {data.unlockableContent}
                    </div>

                    <div className="flex justify-start items-center gap-6">
                      {data.certificates.map((item, index) => (
                        <div
                          className="flex items-center gap-4 border-r border-white/20 pr-6"
                          key="item"
                        >
                          <span className="text-white">
                            {data.certificateNames?.[index]}
                          </span>
                          <a
                            href={item}
                            download={data.certificateNames?.[index]}
                          >
                            <DownloadIcon className="w-4 h-4 text-yellow-400" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        )}

      <div className="w-full rounded-[20px] p-5 bg-[#232323]">
        <Disclosure as="div" defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full flex-col justify-between py-2 pb-4 text-left text-lg font-semibold text-white text-[18px] border-b border-white/[8%]">
                <div className="flex w-full justify-between">
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_1164_25121)">
                          <path
                            d="M6.1875 10.125V9C6.1875 8.85082 6.24676 8.70774 6.35225 8.60225C6.45774 8.49676 6.60082 8.4375 6.75 8.4375C6.89918 8.4375 7.04226 8.49676 7.14775 8.60225C7.25324 8.70774 7.3125 8.85082 7.3125 9V10.125C7.3125 10.2742 7.25324 10.4173 7.14775 10.5227C7.04226 10.6282 6.89918 10.6875 6.75 10.6875C6.60082 10.6875 6.45774 10.6282 6.35225 10.5227C6.24676 10.4173 6.1875 10.2742 6.1875 10.125ZM9 10.6875C9.14918 10.6875 9.29226 10.6282 9.39775 10.5227C9.50324 10.4173 9.5625 10.2742 9.5625 10.125V8.4375C9.5625 8.28832 9.50324 8.14524 9.39775 8.03975C9.29226 7.93426 9.14918 7.875 9 7.875C8.85082 7.875 8.70774 7.93426 8.60225 8.03975C8.49676 8.14524 8.4375 8.28832 8.4375 8.4375V10.125C8.4375 10.2742 8.49676 10.4173 8.60225 10.5227C8.70774 10.6282 8.85082 10.6875 9 10.6875ZM11.25 10.6875C11.3992 10.6875 11.5423 10.6282 11.6477 10.5227C11.7532 10.4173 11.8125 10.2742 11.8125 10.125V7.875C11.8125 7.72582 11.7532 7.58274 11.6477 7.47725C11.5423 7.37176 11.3992 7.3125 11.25 7.3125C11.1008 7.3125 10.9577 7.37176 10.8523 7.47725C10.7468 7.58274 10.6875 7.72582 10.6875 7.875V10.125C10.6875 10.2742 10.7468 10.4173 10.8523 10.5227C10.9577 10.6282 11.1008 10.6875 11.25 10.6875ZM15.1875 5.625V12.375H15.75C15.8992 12.375 16.0423 12.4343 16.1477 12.5398C16.2532 12.6452 16.3125 12.7883 16.3125 12.9375C16.3125 13.0867 16.2532 13.2298 16.1477 13.3352C16.0423 13.4407 15.8992 13.5 15.75 13.5H9.5625V14.722C9.93781 14.8547 10.2541 15.1158 10.4555 15.4592C10.657 15.8025 10.7305 16.206 10.6632 16.5984C10.5959 16.9907 10.392 17.3466 10.0877 17.6032C9.78333 17.8598 9.39807 18.0005 9 18.0005C8.60193 18.0005 8.21667 17.8598 7.91232 17.6032C7.60797 17.3466 7.40412 16.9907 7.3368 16.5984C7.26949 16.206 7.34304 15.8025 7.54446 15.4592C7.74588 15.1158 8.06219 14.8547 8.4375 14.722V13.5H2.25C2.10082 13.5 1.95774 13.4407 1.85225 13.3352C1.74676 13.2298 1.6875 13.0867 1.6875 12.9375C1.6875 12.7883 1.74676 12.6452 1.85225 12.5398C1.95774 12.4343 2.10082 12.375 2.25 12.375H2.8125V5.625C2.51413 5.625 2.22798 5.50647 2.017 5.2955C1.80603 5.08452 1.6875 4.79837 1.6875 4.5V3.375C1.6875 3.07663 1.80603 2.79048 2.017 2.5795C2.22798 2.36853 2.51413 2.25 2.8125 2.25H15.1875C15.4859 2.25 15.772 2.36853 15.983 2.5795C16.194 2.79048 16.3125 3.07663 16.3125 3.375V4.5C16.3125 4.79837 16.194 5.08452 15.983 5.2955C15.772 5.50647 15.4859 5.625 15.1875 5.625ZM9.5625 16.3125C9.5625 16.2012 9.52951 16.0925 9.4677 16C9.40589 15.9075 9.31804 15.8354 9.21526 15.7928C9.11248 15.7502 8.99938 15.7391 8.89026 15.7608C8.78115 15.7825 8.68092 15.8361 8.60225 15.9148C8.52359 15.9934 8.47001 16.0936 8.44831 16.2028C8.4266 16.3119 8.43774 16.425 8.48032 16.5278C8.52289 16.6305 8.59499 16.7184 8.68749 16.7802C8.77999 16.842 8.88875 16.875 9 16.875C9.14918 16.875 9.29226 16.8157 9.39775 16.7102C9.50324 16.6048 9.5625 16.4617 9.5625 16.3125ZM2.8125 4.5H15.1875V3.375H2.8125V4.5ZM14.0625 5.625H3.9375V12.375H14.0625V5.625Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1164_25121">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>{' '}
                    Properties
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-white/[53%]`}
                  />
                </div>
              </DisclosureButton>
              <DisclosurePanel className="pt-3 pb-2 text-sm text-white rounded-b-lg">
                <div className="flex gap-4 flex-wrap">
                  {data.attributes.map((attr, index) => {
                    return (
                      <div
                        key={index}
                        className="w-[155px] h-[93px] py-4 px-2 rounded-[12px] flex justify-center flex-col gap-y-1 border border-white/[12%]"
                      >
                        <p className="text-xs capitalize font-medium text-center text-[#888888]">
                          {attr.type}
                        </p>
                        <p className="font-medium text-white azeret-mono-font text-sm text-center break-words">
                          {attr.value}
                        </p>
                      </div>
                    );
                  })}
                  {data.attributes.length === 0 && (
                    <p>No properties available</p>
                  )}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
