'use client';

import React, { useState } from 'react';
import ShippingInfo from '../ShippingInfo';
import ContactInfo from '../ContactInfo';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@headlessui/react';
import BaseButton from '../../ui/BaseButton';
import { BaseDialog } from '../../ui/BaseDialog';
import MintLoader from './MintLoader';
import { useCreateNFT } from '../../Context/CreateNFTContext';

export default function SellerInformation({
  handler,
  nextStep
}: {
  handler: (data: any, error: any) => void;
  nextStep: (next?: boolean) => void;
}) {
  const { sellerInfo, setSellerInfo } = useCreateNFT();

  const handleShip = (data: any) => {
    setSellerInfo({
      ...sellerInfo,
      shipping: data,
    });
  };

  const handleContact = (data: any) => {
    setSellerInfo({
      ...sellerInfo,
      contact: data,
    });
  };

  const cancelChanges = () => {
    setSellerInfo({
      shipping: null,
      contact: null,
    })
    nextStep(false);
  };

  const create = () => {
    const err = [];
    if (!sellerInfo.shipping) {
      err.push({ path: ['Shipping Information'] });
    }

    if (!sellerInfo.contact) {
      err.push({ path: ['Contact Information'] });
    }

    if (!sellerInfo.accepted) {
      err.push({
        path: ['Consent for collection and usage of personal information'],
      });
    }

    if (err.length > 0) {
      handler(null, JSON.stringify(err));
      return;
    }

    handler(sellerInfo, null);
    nextStep(true);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ShippingInfo handler={handleShip} />
      <ContactInfo handler={handleContact} />

      <div className="bg-dark p-4 gap-y-4 rounded-lg flex flex-col">
        <p>Shipment Information</p>
        <hr />
        <div className="flex gap-3">
          <div className="flex flex-col gap-y-2 max-w-[20rem]">
            <Label>Length(cm)</Label>
            <Input
            value={sellerInfo.length}
            type="number" placeholder="--" onChange={(e) => {
              setSellerInfo({
                ...sellerInfo,
                length: (e.target as any).value
              })
            }} />
          </div>
          <div className="flex flex-col gap-y-2 max-w-[20rem]">
            <Label>Width(cm)</Label>
            <Input 
            value={sellerInfo.width}
            type="number" placeholder="--" onChange={(e) => {
              setSellerInfo({
                ...sellerInfo,
                width: (e.target as any).value
              })
            }} />
          </div>
          <div className="flex flex-col gap-y-2 max-w-[20rem]">
            <Label>Height(cm)</Label>
            <Input 
            value={sellerInfo.height}
            type="number" placeholder="--" onChange={(e) => {
              setSellerInfo({
                ...sellerInfo,
                height: (e.target as any).value
              })
            }} />
          </div>
          <div className="flex flex-col gap-y-2 max-w-[20rem]">
            <Label>Weight(kg)</Label>
            <Input
            value={sellerInfo.weight}
            type="number" placeholder="--" onChange={(e) => {
              setSellerInfo({
                ...sellerInfo,
                weight: (e.target as any).value
              })
            }} />
          </div>
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
          disabled={true}
          className="p-4 rounded-md"
          rows={4}
          placeholder="faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. "
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          checked={sellerInfo.accepted}
          onChange={() =>
            setSellerInfo({
              ...sellerInfo,
              accepted: !sellerInfo.accepted,
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

      <div className="flex gap-x-4 justify-center my-5">
        <BaseButton
          title="Previous"
          variant="secondary"
          onClick={cancelChanges}
        />

        <BaseDialog 
        trigger={
          <BaseButton
          title="Proceed To Create NFT"
          variant="primary"
          onClick={create}
          />
        }
        children={<MintLoader />}
        className="bg-dark max-h-[80%] w-[27rem] overflow-y-auto overflow-x-hidden"
        />
      </div>
    </div>
  );
}
