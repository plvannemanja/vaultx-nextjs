'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BaseButton from '../../ui/BaseButton';
import Image from 'next/image';
import { collectionServices } from '@/services/supplier';
import { z } from 'zod';
import { protocolFee } from '@/lib/helper';
import { useCreateNFT } from '../../Context/CreateNFTContext';
import { BaseDialog } from '../../ui/BaseDialog';
import CancelModal from './CancelModal';

// 1GB file size
const maxFileSize = 1 * 1024 * 1024 * 1024; // 1GB in bytes
const acceptedFormats = ['.png', '.gif', '.webp', '.mp4', '.mp3'];

const basicDetailsSchema = z.object({
  productName: z.string(),
  productDescription: z.string(),
  price: z.number().gt(0),
  curation: z.string(),
});

export default function BasicDetails({
  handler,
  nextStep,
}: {
  handler: (data: any, error: any) => void;
  nextStep: (next?: boolean) => void;
}) {
  const { basicDetail, setBasicDetail } = useCreateNFT();

  const [fee, setFee] = useState<number>(0);
  const fileInputRef = useRef(null);
  const attachmentRef = useRef(null);

  const [file, setFile] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [curations, setCurations] = useState([]);
  const [attachments, setAttachments] = useState([null]);

  const cancelChanges = () => {
    setBasicDetail({
      productName: null,
      productDescription: null,
      artistName: null,
      price: 0,
      curation: null,
      file: null,
      imageSrc: null,
      attachments: null,
    })
  };

  const leftAmount = useMemo(() => {
    if (!z.isValid(basicDetail.price)) return 0;
    return Number(basicDetail.price) - (Number(basicDetail.price) * fee) / 100;
  }, [basicDetail.price]);

  const create = async () => {
    const result = basicDetailsSchema.safeParse(basicDetail);
    if (!result.success && !basicDetail.file) {
      handler(null, result.error.message);
      console.log(result.error.message);
      return;
    }

    setBasicDetail({
      ...basicDetail,
      file: file,
      imageSrc: imageSrc,
      attachments: attachments,
    })

    handler({}, null);
    nextStep(true);
  };

  const handleLogoChange = (event: any) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (
      file.size < maxFileSize &&
      acceptedFormats.includes(`.${fileExtension}`)
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
      setFile(file);
      setBasicDetail({
        ...basicDetail,
        file: file,
        imageSrc: URL.createObjectURL(file),
      })
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as any).click();
    }
  };

  const handleAttachment = (file: any, index: number) => {
    const attachment = file.target.files[0];
    const fileExtension = attachment.name.split('.').pop().toLowerCase();
    if (
      attachment.size < maxFileSize &&
      acceptedFormats.includes(`.${fileExtension}`)
    ) {
      const newAttachments = [...attachments];
      newAttachments[index] = attachment;

      setAttachments(newAttachments);
      setBasicDetail({
        ...basicDetail,
        attachments: newAttachments,
      })
    }
  };

  const addAttachment = () => {
    if (attachmentRef.current) {
      (attachmentRef.current as any).click();
    }
    const newAttachments = [...attachments, null];

    setAttachments(newAttachments);
    setBasicDetail({
      ...basicDetail,
      attachments: newAttachments,
    })
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);

    setAttachments(newAttachments);
    setBasicDetail({
      ...basicDetail,
      attachments: newAttachments,
    })
  };

  const fetchUserCollections = async () => {
    try {
      const res = await collectionServices.getUserCollections({});
      setCurations(res.data.collection.length > 0 ? res.data.collection : []);
      setBasicDetail({
        ...basicDetail,
        curations: res.data.collection.length > 0 ? res.data.collection : [],
      })
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProtocolFee = async () => {
    let fee = await protocolFee();
    setFee(Number(fee) / 100);
  };
  useEffect(() => {
    if (curations.length === 0) {
      fetchUserCollections();
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-y-5 flex-col lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center gap-y-2 justify-center py-24 lg:w-[42%] bg-dark rounded-lg self-start">
          {basicDetail.file ? (
            <div className="flex flex-col gap-y-5 text-center">
              {(basicDetail.imageSrc) && (
                <img
                  src={basicDetail.imageSrc}
                  alt="logo"
                  className="w-[90%] object-cover mx-auto"
                />
              )}
              {
                (basicDetail.file ? basicDetail.file.name : 'No files selected')
              }
            </div>
          ) : (
            <>
              <img
                src="/icons/upload.svg"
                alt="upload"
                className="w-10 h-10"
              />
              <p className="text-lg font-medium">Upload File</p>
              <p className="mt-2 text-gray-400">
                Drag or choose your file to upload
              </p>
              <p className="text-gray-500">
                PNG, GIF, WEBP, MP4, or MP3. Max 1GB.
              </p>
            </>
          )}

          <div className="flex flex-col gap-y-2">
            <button
              className="py-3 w-[20rem] rounded-lg text-black font-semibold bg-[#dee8e8]"
              onClick={handleButtonClick}
            >
              <span className="flex gap-x-2 items-center justify-center">
                Browse file
                <img src="/icons/arrow_ico.svg" alt="" />
              </span>{' '}
            </button>
            <input
              className="hidden"
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
            />
            {file && (
              <BaseButton
                title="Reset"
                variant="secondary"
                onClick={() => {
                  setFile(null)
                  setBasicDetail({
                    ...basicDetail,
                    file: null,
                    imageSrc: null,
                  })
                }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-5 lg:w-[55%]">
          <div className="flex flex-col gap-y-2">
            <Label className="font-medium">Product name*</Label>
            <Input
              value={basicDetail.productName ? basicDetail.productName : ''}
              onChange={(e) =>
                setBasicDetail({
                  ...basicDetail,
                  productName: (e.target as any).value,
                })
              }
              className="w-full border-none bg-[#161616]"
              type="text"
              placeholder="Enter Product Name"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="font-medium">Description*</Label>
            <Textarea
              value={
                basicDetail.productDescription ? basicDetail.productDescription : ''
              }
              onChange={(e) =>
                setBasicDetail({
                  ...basicDetail,
                  productDescription: (e.target as any).value,
                })
              }
              className="w-full border-none bg-[#161616]"
              placeholder="Please describe your product"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="font-medium">Price(USD)*</Label>
            <Input
              value={basicDetail.price ? basicDetail.price : ''}
              onChange={(e) =>
                setBasicDetail({
                  ...basicDetail,
                  price: parseInt((e.target as any).value),
                })
              }
              className="w-full border-none bg-[#161616]"
              type="number"
              placeholder="0"
            />
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-3">
              <div className="flex justify-between">
                <Label className="font-medium">Platform Fee</Label>
                <Label>${fee}%</Label>
              </div>
              <hr />
              <div className="flex justify-between">
                <Label className="font-medium">You will receive</Label>
                <Label>${leftAmount}</Label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="font-medium">Artist name*</Label>
            <Input
              value={basicDetail.artistName ? basicDetail.artistName : ''}
              onChange={(e) =>
                setBasicDetail({
                  ...basicDetail,
                  artistName: (e.target as any).value,
                })
              }
              className="w-full border-none bg-[#161616]"
              type="text"
              placeholder="Enter Artist Name"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="text-lg font-medium">Curation*</Label>
            <select
              aria-label="Select curation"
              className="h-10 rounded-md px-2 w-full"
              name="country"
              onChange={(e) =>
                setBasicDetail({ ...basicDetail, curation: (e.target as any).value })
              }
              value={basicDetail.curation}
            >
              <option value="">Select</option>
              {basicDetail.curations.length > 0 ? basicDetail.curations.map((item: any) => (
                <option key={item.isoCode} value={JSON.stringify(item)}>
                  {item.name}
                </option>
              )) : null}
            </select>
          </div>

          <div className="flex flex-col gap-y-2 bg-dark px-4 py-3 rounded-lg">
            <Label className="font-medium text-lg">Attachment</Label>
            <hr />
            <div className="flex gap-4 flex-wrap my-2">
              {(basicDetail.attachments).map((attachment, index) => {
                return (
                  <div key={index} className="flex flex-col gap-y-2">
                    <input
                      type="file"
                      className="hidden"
                      ref={attachmentRef}
                      onChange={(e) => handleAttachment(e, index)}
                    />
                    {!attachment ? (
                      <img
                        src="https://i.ibb.co/c8FMdw1/attachment-link.png"
                        alt="attachment"
                        className="w-28 mx-auto h-36 rounded-md object-cover"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(attachment)}
                        alt="attachment"
                        className="w-28 mx-auto h-36 rounded-md object-cover"
                      />
                    )}
                    {attachment ? (
                      <div
                        className="flex gap-x-2 justify-center items-center cursor-pointer"
                        onClick={() => removeAttachment(index)}
                      >
                        <span className="text-neon">Delete</span>
                        <img
                          src="/icons/trash.svg"
                          alt="attachment"
                          className="w-5 h-5"
                        />
                      </div>
                    ) : (
                      <div
                        className="flex gap-x-2 justify-center items-center cursor-pointer"
                        onClick={() => addAttachment()}
                      >
                        <span className="text-neon">Upload</span>
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
          </div>

          <div className="flex gap-x-4 justify-center my-5">
            <BaseDialog 
            trigger={
              <BaseButton
                title="Cancel"
                variant="secondary"
                onClick={cancelChanges}
              />
            }
            children={<CancelModal />}
            className="bg-dark max-h-[80%] w-[36rem] overflow-y-auto overflow-x-hidden"
            />
            
            <BaseButton title="Next" variant="primary" onClick={create} />
          </div>
        </div>
      </div>
    </div>
  );
}
