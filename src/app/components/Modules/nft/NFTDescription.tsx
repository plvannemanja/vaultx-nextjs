'use client';

import { cn, truncate } from '@/lib/utils';
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
import PropertyIcon from '../../Icons/nft/property';

export default function NFTDescription() {
  const backendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL || 'https://api.vault-x.io/api/v2';
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
    180,
  );

  return (
    <>
      <div className="w-full grid gap-4 px-4 xss:px-1 sm:px-0 lg:grid-cols-4 xl:grid-cols-5 xs:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(242px,1fr))]">
        {[data.cloudinaryUrl, ...data.attachments.slice(0, maxAttachments)].map(
          (item, index) => {
            return (
              <div
                // className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 h-[242px] aspect-square relative w-full"
                className="h-[290px] xss:h-[260px] sm: md:h-[260px] lg:h-[242px] xl:h-[280px] relative w-full cursor-pointer"
                key={index}
              >
                <Image
                  quality={100}
                  alt={data.name}
                  // width={242}
                  // height={242}
                  fill
                  objectFit="cover"
                  key={index}
                  onClick={() => {
                    setMainImage(item);
                  }}
                  src={`${backendUrl}/nft/image?quality=10&url=${item}`}
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
              <DisclosureButton
                className={cn(
                  'flex w-full flex-col justify-between py-2 pb-4 text-left   text-lg font-medium text-white text-[18px]',
                  open ? 'border-b border-white/[8%]' : '',
                )}
              >
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
              <DisclosurePanel className="md:pt-2 lg:pt-4 pb-2 text-sm  text-white  rounded-b-lg">
                <span
                  className="text-white/[53%] text-sm sm:text-xs lg:text-sm font-normal azeret-mono-font"
                  dangerouslySetInnerHTML={{
                    __html: loadMore
                      ? data?.description?.replace(/\r\n|\n/g, '<br />')
                      : description,
                  }}
                ></span>
                {description?.length > 180 && (
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
                <Disclosure.Button
                  className={cn(
                    'flex w-full flex-col justify-between py-2 pb-4 text-left   text-lg font-medium text-white text-[18px]',
                    open ? 'border-b border-white/[8%]' : '',
                  )}
                >
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
                <Disclosure.Panel className="md:pt-2 lg:pt-4 pb-2 text-sm text-white rounded-b-lg">
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
                  <DisclosureButton
                    className={cn(
                      'flex w-full flex-col justify-between py-2 pb-4 text-left   text-lg font-medium text-white text-[18px]',
                      open ? 'border-b border-white/[8%]' : '',
                    )}
                  >
                    <div className="flex w-full justify-between">
                      <div className="text-sm font-extrabold text-white flex items-center gap-2">
                        <Image
                          quality={100}
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

                  <DisclosurePanel className="md:pt-2 lg:pt-4 pb-2 text-sm text-white rounded-b-lg">
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
                    <PropertyIcon />
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
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(155px,1fr))]">
                  {data.attributes.map((attr, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full h-[93px] py-4 px-2 rounded-[12px] flex justify-center flex-col gap-y-1 border border-white/[12%]"
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
