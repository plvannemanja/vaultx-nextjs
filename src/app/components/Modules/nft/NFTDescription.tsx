'use client';

import { useState } from 'react';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { Label } from '@radix-ui/react-label';

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

      <div className="w-full flex flex-col gap-y-5 mt-5">
        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
          <Label className="text-lg font-medium">Properties</Label>
          <hr className="bg-white" />
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
        </div>
      </div>

      <div className="w-full flex flex-col gap-y-5 mt-5">
        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
          <Label className="text-lg font-medium">Description</Label>
          <hr className="bg-white" />
          <p className="text-gray-500">{data.description}</p>
        </div>
      </div>
    </>
  );
}
