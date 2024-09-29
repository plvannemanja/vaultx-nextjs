'use client';

import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PhoneInput from 'react-phone-input-2';
import FileInput from '../../ui/FileInput';

const validateSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  request: z.string(),
});

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import BaseButton from '../../ui/BaseButton';
import { z } from 'zod';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { CreateSellService } from '@/services/createSellService';
import BasicLoadingModal from './BasicLoadingModal';
export default function EscrowRequestModal({ onClose, fetchNftData }: { onClose: () => void, fetchNftData: () => void, }) {
  const { nftId } = useNFTDetail();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [unlockableFiles, setUnlockableFiles] = useState([null]);

  const salesService = new CreateSellService();

  const releseEscrowRequest = async () => {
    try {
      debugger;
      setStep(2);
      const result = validateSchema.safeParse({
        email,
        phoneNumber,
        request: description,
      });

      if (!result.success)
        throw new Error(result.error.message);

      const formData = new FormData();
      formData.append('nftId', nftId);
      formData.append('request', description);
      formData.append('email', email);
      formData.append('phoneNumber', phoneNumber);

      for (const file of unlockableFiles) {
        if (file !== null)
          formData.append('files', file);
      }

      await salesService.releaseRequest(formData);
      await fetchNftData();
      setStep(3);
    } catch (error) {
      console.log(error);
      onClose();
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
  };
  const removeUnlockable = (index: number) => {
    if (index === 0) {
      setUnlockableFiles(unlockableFiles.map((file, i) => (i === 0 ? null : file)))
      return;
    }

    const newFiles = unlockableFiles.filter(
      (item: any, i: number) => i !== index,
    );

    setUnlockableFiles(newFiles);
  };

  const addUnlockable: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (unlockableFiles.length === 0) {
      setUnlockableFiles([null, null]);
    } else {
      setUnlockableFiles([...unlockableFiles, null]);
    }
  }

  return (
    <div className="">
      {step === 1 && (
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex items-center gap-x-3">
            <img src="/icons/receipt.svg" className="w-12" />
            <p className="text-[30px] font-extrabold azeret-mono-font ">
              Escrow Release Request
            </p>
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
              value={email}
              onChange={(e) =>
                setEmail((e.target as HTMLInputElement).value)
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
              value={phoneNumber}
              inputStyle={{
                width: '100%',
                height: '3.25rem',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                marginTop: '0.5rem',
                color: '#fff',
                backgroundColor: '#161616',
                border: '1px solid #3A3A3A',
              }}
              onChange={(val) =>
                setPhoneNumber(val)
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
                placeholder="Please describe your Request*"
              />
            </div>
          </div>
          <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                    <div className="flex w-full justify-between">
                      <span>Attachment</span>
                      <div className="flex items-center">
                        <div
                          className="flex gap-x-2 px-4 h-[52px] py-1 rounded-md items-center border-2 border-neon cursor-pointer"
                          onClick={addUnlockable}
                        >
                          <img
                            src="/icons/add-new.svg"
                            alt="plus"
                            className="w-4 h-4"
                          />
                          <p className="text-neon">Add</p>
                        </div>
                        <ChevronUpIcon
                          className={`${open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-white`}
                        />
                      </div>
                    </div>
                  </DisclosureButton>

                  <DisclosurePanel className="flex flex-wrap gap-3 justify-between">
                    {unlockableFiles.length == 0 && (
                      <div className="flex gap-x-4 items-center">
                        <FileInput
                          onFileSelect={(file: any) => handleFileChange(file, 0)}
                          maxSizeInBytes={1024 * 1024}
                          deSelect={true}
                        />
                        <img
                          src="/icons/trash.svg"
                          alt="trash"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => removeUnlockable(0)}
                        />

                      </div>
                    )}
                    {unlockableFiles.map((item: any, index: number) => {
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
              <button className="w-full h-full" onClick={() => { onClose() }}>
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
        <BasicLoadingModal message="Please wait while we are accepting NFT Realease Request" />
      )}
      {step === 3 && (
        <div className="flex w-full justify-center flex-col gap-y-4 text-center">
          <img src="/icons/success.svg" className="w-16 mx-auto" />
          <p className="text-[30px] font-extrabold">Application Success</p>
          <p className=" text-[16px] azeret-mono-font text-[#ffffff53]">
            Your Request to release escrow request has been successfully
            <br />
            received. We will carefully review it and contact
            <br /> you as soon as possible. Thank you for your patience.
          </p>
          <BaseButton
            title="Close"
            variant="primary"
            onClick={() => { onClose() }}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
