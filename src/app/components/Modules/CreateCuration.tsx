'use client';

import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FileInput from '../ui/FileInput';
import { Textarea } from '@/components/ui/textarea';
import BaseButton from '../ui/BaseButton';
import Image from 'next/image';
import { collectionServices } from '@/services/supplier';
import { z } from 'zod';
import ErrorModal from './create/ErrorModal';
import CurationLoader from './create/CurationLoader';
import AddNew from '../Icons/AddNew';
import Upload from '../Icons/Upload';
import { pinataGateway, uploadFile, uploadMetaData } from '@/utils/uploadData';
import {
  acceptedFormats,
  maxFileSize,
  removeEmptyStrings,
} from '@/utils/helpers';
import { useActiveAccount } from 'thirdweb/react';
import { createCollection } from '@/lib/helper';
import { useToast } from '@/hooks/use-toast';
import ConnectedCard from '../Cards/ConnectedCard';
import { BaseDialog } from '../ui/BaseDialog';
import { stat } from 'fs';

const createCurationSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  description: z.string(),
});

export default function CreateCuration({ editMode }: { editMode?: any }) {
  const { toast } = useToast();
  const activeAccount = useActiveAccount();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [errors, setErrors] = useState({
    active: false,
    data: [],
  });
  const [status, setStatus] = useState({
    error: false,
    loading: false,
    active: true,
  });

  const [formData, setFormData] = useState<any>({
    name: null,
    symbol: null,
    logo: null,
    bannerImage: null,
    descriptionImage: null,
    description: null,
    website: null,
    twitter: null,
    facebook: null,
    instagram: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (file: any, type: string) => {
    console.log('file', file);
    console.log('type', type);
    if (type === 'banner') setFormData({ ...formData, bannerImage: file });
    if (type === 'description')
      setFormData({ ...formData, descriptionImage: file });
    if (type === 'logo') setFormData({ ...formData, logo: file });
  };

  const cancelChanges = () => {
    setFormData({
      name: null,
      symbol: null,
      logo: null,
      bannerImage: null,
      descriptionImage: null,
      description: null,
      website: null,
      twitter: null,
      facebook: null,
      instagram: null,
    });
  };

  const [youtube, setYoutube] = useState([
    {
      title: '',
      url: '',
    },
  ]);

  const create = async () => {
    try {
      const result = createCurationSchema.safeParse(formData);
      if (
        !result.success ||
        !formData.logo ||
        !formData.bannerImage ||
        !formData.descriptionImage
      ) {
        let data = [];
        if (!result.success) data = JSON.parse(result.error.message);

        if (!formData.logo) {
          data.push({
            path: ['Logo'],
          });
        }

        if (!formData.bannerImage) {
          data.push({
            path: ['Banner image'],
          });
        }

        if (!formData.descriptionImage) {
          data.push({
            path: ['Description image'],
          });
        }
        setErrors({
          active: true,
          data,
        });
        return null;
      }
      setStatus({ error: false, loading: true, active: true });
      // const logoUri = formData.logo ? await uploadFile(formData.logo) : '';
      // const bannerUri = formData.bannerImage
      //   ? await uploadFile(formData.bannerImage)
      //   : '';
      // const desUri = formData.descriptionImage
      //   ? await uploadFile(formData.descriptionImage)
      //   : '';

      const data = new FormData();
      data.append('name', formData.name);
      data.append('symbol', formData.symbol);
      data.append('discription', formData.description);
      data.append('logo', formData.logo);
      data.append('bannerImage', formData.bannerImage);
      data.append('descriptionImage', formData.descriptionImage);
      data.append('website', formData.website);
      data.append('twitter', formData.twitter);
      data.append('facebook', formData.facebook);
      data.append('instagram', formData.instagram);
      data.append('youtube', JSON.stringify(youtube));

      // let metaData = {
      //   name: formData.name,
      //   symbol: formData.symbol,
      //   discription: formData.discription,
      //   website: formData.website,
      //   twitter: formData.twitter,
      //   facebook: formData.facebook,
      //   instagram: formData.instagram,
      //   youtube: formData.youtube,
      //   logo: logoUri,
      //   banner: bannerUri,
      //   description: desUri,
      // };
      // metaData = removeEmptyStrings(metaData);
      // const metaUri = await uploadMetaData(metaData);

      // check cancel
      if (activeAccount) {
        try {
          const result = await createCollection(
            // metaData.name,
            // metaUri,
            activeAccount,
          );
          if (result === null) throw 'collection is not created!';
          setStatus({ error: false, loading: true, active: true });

          data.append('tokenId', result.tokenId);
          data.append('transactionHash', result.transactionHash);

          const response = await collectionServices.create(data);
          if (response) {
            setStatus({ error: false, loading: false, active: true });
          }
        } catch (error) {
          setStatus({ error: true, loading: true, active: true });
          console.log('error:', error);
          throw error;
        }
      } else {
        throw 'no active account';
      }

      if (editMode) {
        try {
          let response;

          if (editMode) {
            response = await collectionServices.update({
              ...data,
              curationId: editMode._id,
            });
          }

          if (response) {
            setStatus({ error: false, loading: false, active: true });
            cancelChanges();
          }
        } catch (error) {
          setStatus({ error: true, loading: true, active: true });
        }
      }
      setTimeout(() => {
        window && window.location.reload();
      }, 2000);
    } catch (error) {
      setStatus({ error: true, loading: true, active: true });
    }
  };

  const handleVideo = (index: number, e: any, type: string) => {
    let temp = [...youtube];
    if (type === 'title') {
      temp[index].title = e.target.value;
    }
    if (type === 'link') {
      temp[index].url = e.target.value;
    }
    setYoutube(temp);
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
      handleFileChange(file, 'logo');
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as any).click();
    }
  };

  useEffect(() => {
    if (editMode) {
      setFormData({
        name: editMode.name,
        symbol: editMode.symbol,
        logo: editMode.logo,
        bannerImage: editMode.bannerImage,
        descriptionImage: editMode.descriptionImage,
        description: editMode.description,
        website: editMode.website,
        twitter: editMode.twitter,
        facebook: editMode.facebook,
        instagram: editMode.instagram,
        youtube: editMode.youtube,
      });
      setFile(editMode.logo);
      setImageSrc(editMode.logo);
    }
  }, [editMode]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <p className="text-xl font-medium">Create Curation</p>

      <ConnectedCard />

      {status.active && (
        <BaseDialog
          isOpen={status.loading && !status.error}
          onClose={(val) => setStatus({ ...status, loading: val })}
          className="bg-black max-h-[80%] w-[617px] mx-auto overflow-y-auto overflow-x-hidden"
          modal={status.loading}
        >
          <CurationLoader status={status} edit={editMode ? true : false} />
        </BaseDialog>
      )}

      {errors.active && (
        <BaseDialog
          isOpen={errors.active}
          onClose={(val) => setErrors({ active: val, data: [] })}
          className="bg-black max-h-[80%] w-[617px] mx-auto overflow-y-auto overflow-x-hidden"
        >
          <ErrorModal
            title={'Error in creation found'}
            data={errors.data}
            close={() => {
              setErrors({ active: false, data: [] });
              handleCloseModal();
            }}
          />
        </BaseDialog>
      )}

      <div className=" grid grid-cols-12 flex gap-[50px] gap-y-5 flex-col lg:flex-row lg:justify-between">
        <div className="flex flex-col col-span-12 lg:col-span-5 items-center gap-y-2 justify-center py-24 lg:w-full bg-[#232323] border-dashed rounded-[30px] border-2 border-[#3a3a3a] flex-col justify-center items-center gap-y-[23px] inline-flex self-start px-10 py-[222px]">
          {file ? (
            <div className="flex flex-col text-center gap-y-[23px]  ">
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="logo"
                  className="w-[90%] object-cover mx-auto"
                />
              )}
              {file ? file.name : 'No files selected'}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-y-[23px] ">
              <img
                src="/icons/upload.svg"
                alt="upload"
                className="w-[66px] h-[66px]"
              />
              <div className="gap-y-[2px]">
                <p className="text-center text-white text-lg font-extrabold font-['Manrope']">
                  Upload original RWA File
                </p>
                <div>
                  <p className="mt-2 text-gray-400 mb-[4px]">
                    Drag or choose your file to IPFS upload
                  </p>
                  <p className="opacity-30 text-center text-white text-xs font-normal font-['Azeret Mono'] leading-tight">
                    PNG, GIF, WEBP, MP4 or MP3. Max 50mb.
                  </p>
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
                <p className="text-[#161616] text-sm font-extrabold font-['Manrope'] capitalize">
                  Browse file
                </p>
                <img
                  src="/icons/arrow_ico.svg"
                  alt=""
                  className="w-[18px] h-[18px] "
                />
              </span>{' '}
            </button>
            <input
              className="hidden"
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              title="file"
            />
            {file && (
              <BaseButton
                title="Reset"
                variant="secondary"
                onClick={() => {
                  setFile(null);
                }}
                className={'rounded-[14px]'}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col col-span-12 lg:col-span-7 gap-y-[26px] lg:w-full">
          <div className="w-full rounded-md pb-3 flex flex-col gap-y-2">
            <div className="flex gap-x-3">
              <div className="flex flex-col gap-y-[16px] basis-1/2">
                <Label className="font-medium text-[11px]">
                  Curation Title*
                </Label>
                <Input
                  value={formData.name ? formData.name : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: (e.target as any).value })
                  }
                  className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"
                  type="text"
                  placeholder="Enter Collection Name"
                />
              </div>
              <div className="flex flex-col gap-y-[16px] basis-1/2">
                <Label className="font-medium text-[11px]">Symbol*</Label>
                <Input
                  value={formData.symbol ? formData.symbol : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symbol: (e.target as any).value,
                    })
                  }
                  className="w-full border-none  h-[52px] px-[26px] py-[15px] font-['Azeret Mono'] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"
                  type="text"
                  placeholder="i.e TAT"
                />
              </div>
            </div>
          </div>

          <div className="w-full rounded-[20px] px-5 py-3 bg-[#232323] flex flex-col gap-y-[16px]">
            <div className="flex justify-between items-center">
              <Label className="text-[15px] font-medium">Banner Image</Label>
              {formData.bannerImage && (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setFormData({ ...formData, bannerImage: null });
                  }}
                >
                  Remove
                </span>
              )}
            </div>
            <hr className="border-white opacity-[0.2] mt-[15px] mb-[15px]" />
            <div className="flex gap-x-4 items-center my-5 mb-0">
              <FileInput
                title="PNG, GIF, WEBP, JPG, or JPEG. Max 1Gb."
                titleStyles={
                  "text-[#979797] text-sm font-normal font-['Azeret Mono'] leading-snug"
                }
                acceptedFormats={acceptedFormats}
                maxSizeInBytes={maxFileSize}
                onFileSelect={(file: any) => handleFileChange(file, 'banner')}
                deSelect={!formData.bannerImage}
                // editMode={
                //   formData.bannerImage != '' && formData.bannerImage != null
                // }
                editMode={!!formData.bannerImage}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-[16px]">
            <Label className="font-medium">Description*</Label>
            <Textarea
              value={formData.description ? formData.description : ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: (e.target as any).value,
                })
              }
              className="w-full border-none bg-[#232323] rounded-[20px] placeholder-[#fff] h-[180px] resize-none py-[15px] px-[26px]"
              placeholder="Please describe your product"
            />
          </div>

          <div className="w-full rounded-[20px] px-[20px] py-[20px] bg-dark flex flex-col gap-y-[16px]">
            <Label className="font-medium text-[15px]">Your links</Label>
            <hr className="border-white opacity-[0.2] " />
            <div className="mt-5 flex gap-x-3">
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium text-[11px]">Website</Label>
                <Input
                  value={formData.website ? formData.website : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      website: (e.target as any).value,
                    })
                  }
                  className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex"
                  type="text"
                  placeholder="Enter your website link"
                  showIcon
                />
              </div>
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium text-[11px]">X(Twitter)</Label>
                <Input
                  value={formData.twitter ? formData.twitter : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      twitter: (e.target as any).value,
                    })
                  }
                  className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex"
                  type="text"
                  placeholder="Enter your twitter link"
                  showIcon
                />
              </div>
            </div>
            <div className="mt-2 flex gap-x-3">
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium text-[11px]">Facebook</Label>
                <Input
                  value={formData.facebook ? formData.facebook : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facebook: (e.target as any).value,
                    })
                  }
                  className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex"
                  type="text"
                  placeholder="Enter your facebook link"
                  showIcon
                />
              </div>
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium text-[11px]">Instagram</Label>
                <Input
                  value={formData.instagram ? formData.instagram : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instagram: (e.target as any).value,
                    })
                  }
                  className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex"
                  type="text"
                  placeholder="Enter your instagram link"
                  showIcon
                />
              </div>
            </div>
          </div>

          <div className="w-full rounded-[20px] px-[20px] py-[20px] bg-dark flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-[15px] font-medium">
                Youtube Video Link
              </Label>
              {youtube.length == 2 ? (
                <p
                  className="text-sm cursor-pointer"
                  onClick={() => {
                    if (youtube.length > 1) {
                      setYoutube(youtube.slice(0, youtube.length - 1));
                    }
                  }}
                >
                  Delete
                </p>
              ) : (
                <div className="flex gap-x-2 items-center">
                  <div
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      if (youtube.length < 2) {
                        setYoutube([...youtube, { title: '', url: '' }]);
                      }
                    }}
                  >
                    <AddNew />
                  </div>
                  <p className="text-sm">Add New</p>
                </div>
              )}
            </div>
            <hr className="border-white opacity-[0.2] my-[10px]" />
            {youtube.map((item, index) => {
              return (
                <div key={index} className="mt-5 flex gap-x-3">
                  <div className="flex flex-col gap-y-2 basis-1/2">
                    <Label className="font-medium text-[11px]">Title</Label>
                    <Input
                      value={item.title ? item.title : ''}
                      onChange={(e) => handleVideo(index, e, 'title')}
                      className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex"
                      type="text"
                      placeholder="Enter video title"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 basis-1/2">
                    <Label className="font-medium text-[11px]">
                      Video Link
                    </Label>
                    <Input
                      value={item.url ? item.url : ''}
                      onChange={(e) => handleVideo(index, e, 'link')}
                      className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex"
                      type="text"
                      placeholder="Enter video link"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full rounded-[20px] px-[20px] py-[20px]  bg-dark flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-[15px] font-medium">
                Custom Description Image
              </Label>
              {formData.descriptionImage && (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setFormData({ ...formData, descriptionImage: null });
                  }}
                >
                  Remove
                </span>
              )}
            </div>
            <hr className="border-white opacity-[0.2] my-[10px]" />
            <div className="flex gap-x-4 items-center my-5">
              <FileInput
                title="PNG, GIF, WEBP, JPG, or JPEG. Max 1Gb."
                acceptedFormats={acceptedFormats}
                maxSizeInBytes={maxFileSize}
                onFileSelect={(file: any) =>
                  handleFileChange(file, 'description')
                }
                // editMode={
                //   formData.bannerImage != '' && formData.bannerImage != null
                // }
                editMode={!!formData.descriptionImage}
              />
            </div>
          </div>

          <div className="flex gap-x-4 justify-center my-5">
            <BaseButton
              title="Cancel"
              variant="secondary"
              onClick={cancelChanges}
            />
            <BaseButton title="Save" variant="primary" onClick={create} />
          </div>
        </div>
      </div>
    </div>
  );
}
