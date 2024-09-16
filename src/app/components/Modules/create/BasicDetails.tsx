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
  price: z.number().refine((value) => value % 1 !== 0 || value >= 0, {
    message: "Price must be a decimal number or zero",
  }),     curation: z.string(),
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
    });
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
    });

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
      });
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as any).click();
    }
  };

  // const handleAttachment = (file: any, index: number) => {
  //   const attachment = file.target.files[0];
  //   const fileExtension = attachment?.name.split('.').pop().toLowerCase();
  //   if (
  //     attachment &&
  //     attachment.size < maxFileSize &&
  //     acceptedFormats.includes(`.${fileExtension}`)
  //   ) {
  //     const newAttachments = [...attachments];
  //     newAttachments[index] = attachment;
  
  //     setAttachments(newAttachments);
  //     setBasicDetail({
  //       ...basicDetail,
  //       attachments: newAttachments,
  //     });
  
  //     // Add a new attachment box only after a file is selected
  //     if (newAttachments.length === index + 1) {
  //       const nextAttachments = [...newAttachments, null];
  //       setAttachments(nextAttachments);
  //       setBasicDetail({
  //         ...basicDetail,
  //         attachments: nextAttachments,
  //       });
  //     }
  //   }
  // };
  

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
      });
    }
  };
  // const addAttachment = () => {
  //   if (attachmentRef.current) {
  //     (attachmentRef.current as any).click();
  //   }
  // };

  const addAttachment = () => {
    if (attachmentRef.current) {
      (attachmentRef.current as any).click();
    }
    const newAttachments = [...attachments, null];
    console.log("attachment",newAttachments);
    console.log("attachment",newAttachments);

    setAttachments(newAttachments);
    setBasicDetail({
      ...basicDetail,
      attachments: newAttachments,
    });
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);

    setAttachments(newAttachments);
    setBasicDetail({
      ...basicDetail,
      attachments: newAttachments,
    });
  };

  const fetchUserCollections = async () => {
    try {
      const res = await collectionServices.getUserCollections({});
      setCurations(res.data.collection.length > 0 ? res.data.collection : []);
      setBasicDetail({
        ...basicDetail,
        curations: res.data.collection.length > 0 ? res.data.collection : [],
      });
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



        <div className="flex flex-col items-center gap-y-2 justify-center py-24 lg:w-[42%] bg-[#232323] border-dashed rounded-[30px] border-2 border-[#3a3a3a] flex-col justify-center items-center gap-y-[23px] inline-flex self-start px-10 py-[222px]">

          {basicDetail.file ? (
            <div className="flex flex-col text-center gap-y-[23px]  ">
              {basicDetail.imageSrc && (
                <img
                  src={basicDetail.imageSrc}
                  alt="logo"
                  className="w-[90%] object-cover mx-auto"
                />
              )}
              {basicDetail.file ? basicDetail.file.name : 'No files selected'}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center gap-y-[23px] '>
              <img src="/icons/upload.svg" alt="upload" className="w-[66px] h-[66px]" />
              <div className='gap-y-[2px]'>
                <p className="text-center text-white text-lg font-extrabold font-['Manrope']">Upload original RWA File</p>
                <div>
                  <p className="mt-2 text-gray-400 mb-[4px]">Drag or choose your file to IPFS upload</p>
                  <p className="opacity-30 text-center text-white text-xs font-normal font-['Azeret Mono'] leading-tight">PNG, GIF, WEBP, MP4 or MP3. Max 50mb.</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-y-2">

            <button
              className="py-3 w-[20rem] h-[50px] text-black font-semibold bg-[#dee8e8]  p-2.5 rounded-[14px] justify-center items-center gap-2.5"
              onClick={handleButtonClick}
            >
              <span className="flex gap-x-[10px] items-center justify-center">
                <p className="text-[#161616] text-sm font-extrabold font-['Manrope'] capitalize">Browse file</p>
                <img src="/icons/arrow_ico.svg" alt="" className='w-[18px] h-[18px] ' />
              </span>{' '}
            </button>
            <input
              className="hidden"
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              title='file'
            />
            {file && (
              <BaseButton
                title="Reset"
                variant="secondary"
                onClick={() => {
                  setFile(null);
                  setBasicDetail({
                    ...basicDetail,
                    file: null,
                    imageSrc: null,
                  });
                }}
                className={"rounded-[14px]"}
                
              />
            )}
          </div>
        </div>



        <div className="flex flex-col gap-y-5 lg:w-[55%]">
          <div className="flex flex-col gap-y-2">
            <Label className="font-medium text-[11px]">Product name*</Label>
            <Input
              value={basicDetail.productName ? basicDetail.productName : ''}
              onChange={(e) =>
                setBasicDetail({
                  ...basicDetail,
                  productName: (e.target as any).value,
                })
              }
              className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"

              // className="w-full border-none bg-[#232323] py-[15px]  px-[25px] rounded-xl font-['Azeret Mono'] text-[11px]"
              type="text"
              placeholder="Enter Product Name"
            />

          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="font-medium text-[11px]">Description*</Label>
            <Textarea
              value={
                basicDetail.productDescription
                  ? basicDetail.productDescription
                  : ''
              }
              onChange={(e) =>
                setBasicDetail({
                  ...basicDetail,
                  productDescription: (e.target as any).value,
                })
              }
              className="w-full border-none bg-[#232323] rounded-[20px] placeholder-[#fff] h-[180px] resize-none py-[15px] px-[26px]"

              // className="w-full border-none bg-[#232323] py-[15px]  px-[25px] rounded-xl text-[11px]"
              placeholder="Please describe your product"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="font-medium text-[11px]">Price(USD)*</Label>
            <Input
              value={basicDetail.price ? basicDetail.price : ''}
              onChange={(e) => {
                const value = e.target.value;
                // Validate the value to allow decimals and numbers only
                if (!isNaN(Number(value)) && Number(value) >= 0) {
                  setBasicDetail({
                    ...basicDetail,
                    price: value, // Keep the value as string to allow decimals
                  });
                }
              }}
              className="w-full border-none h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"
              type="text" // Change to 'text' to allow decimals
              placeholder="0.0000000004"
            />
          </div>

          <div className="w-full rounded-[17px] px-5 py-[12px] bg-dark flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-3">
              <div className="flex justify-between">
                <Label className="font-bold text-[14px]">Marketplace Fee</Label>
                <Label className='font-bold'>${fee}%</Label>
              </div>
              <hr className='border-t-[#ffffff] opacity-[0.3]' />
              <div className="flex justify-between">
                <Label className="font-bold text-[11px]">You will receive</Label>
                <Label className=''>${leftAmount}</Label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="font-medium text-[11px]">Artist name*</Label>
            <Input
              value={basicDetail.artistName ? basicDetail.artistName : ''}
              onChange={(e) =>
                setBasicDetail({
                  ...basicDetail,
                  artistName: (e.target as any).value,
                })
              }
              // className="w-full border-none bg-[#232323] py-[15px]  px-[25px] rounded-xl text-[11px]"
              className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"

              type="text"
              placeholder="Enter Artist Name"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="font-medium text-[11px]">Curation*</Label>
            <select
              aria-label="Select curation"
              // className="w-full border-none bg-[#232323] py-[15px]  px-[25px] rounded-xl appearance-none text-[11px]"
              className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"

              name="curation"
              onChange={(e) =>
                setBasicDetail({
                  ...basicDetail,
                  curation: (e.target as any).value,
                })
              }
              value={basicDetail.curation}

            >
              <option value="" className='text-[11px]'>You must choose Curation*</option>
              {basicDetail.curations.length > 0
                ? basicDetail?.curations?.map((item: any) => (
                  <option key={item.isoCode} value={JSON.stringify(item)}>
                    {item.name}
                  </option>
                ))
                : null}
            </select>
          </div>

          <div className="flex flex-col gap-y-2 bg-dark px-[20px] py-3 rounded-lg">
            <Label className="font-medium text-[15px]">Attachment</Label>
            <hr />
            <div className="flex gap-4 flex-wrap my-2">
              {basicDetail?.attachments?.map((attachment, index) => {
                return (
                  <div key={index} className="flex flex-col gap-y-2">
                    <input
                      type="file"
                      className="hidden"
                      title="file"
                      ref={attachmentRef}
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
                      <div
                        className="flex gap-x-2 justify-center items-center cursor-pointer"
                        onClick={() => removeAttachment(index)}
                      >
                        <span className="text-neon font-bold text-[13px]">Change</span>
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
                        <span className="text-neon  font-bold text-[13px]">Upload</span>
                        <img
                          src="/icons/upload.svg"
                          alt="attachment"
                          className="w-5 h-5"
                        />
                      </div>
                    )
                    }
                  </div>
                );
              })}
            </div>
          </div>



        </div>


      </div>
      <div className="flex w-full gap-x-4 justify-center  items-center my-5">
        <BaseDialog
          trigger={
            <BaseButton
              title="Cancel"
              variant="secondary"
              onClick={cancelChanges}
              className="w-[49%]"
            />
          }
          className="bg-dark max-h-[80%]  overflow-y-auto overflow-x-hidden items-center w-[35rem]"
        >
          <CancelModal />
        </BaseDialog>

        <BaseButton title="Next" variant="primary" onClick={create} className="w-[49%]"  displayIcon={true} iconPath={'/icons/arrow_ico.svg'}/>
      </div>
    </div >
  );
}
