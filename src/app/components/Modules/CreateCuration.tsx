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
import TriggerModal from '../ui/TriggerModal';
import ErrorModal from './create/ErrorModal';
import CurationLoader from './create/CurationLoader';
import AddNew from '../Icons/AddNew';
import Upload from '../Icons/Upload';
import { pinataGateway, uploadFile, uploadMetaData } from '@/utils/uploadData';
import { removeEmptyStrings } from '@/utils/helpers';
import { useActiveAccount } from 'thirdweb/react';
import { createCollection } from '@/lib/helper';
import { useToast } from '@/hooks/use-toast';
// 1GB file size
const maxFileSize = 1 * 1024 * 1024 * 1024; // 1GB in bytes
const acceptedFormats = ['.png', '.gif', '.webp', '.mp4', '.mp3'];

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
    active: false,
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

  const handleFileChange = (file: any, type: string) => {
    console.log('file', file);
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
    toast({
      title: 'Processing Transaction',
      description: 'Please wait...',
    });
    try {
      const result = createCurationSchema.safeParse(formData);
      if (
        !result.success &&
        !formData.logo &&
        !formData.bannerImage &&
        !formData.descriptionImage
      ) {
        setErrors({
          active: true,
          data: JSON.parse(result.error.message),
        });
        return null;
      }

      const logoUri = formData.logo ? await uploadFile(formData.logo) : '';
      const bannerUri = formData.bannerImage
        ? await uploadFile(formData.bannerImage)
        : '';
      const desUri = formData.descriptionImage
        ? await uploadFile(formData.descriptionImage)
        : '';

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

      let metaData = {
        name: formData.name,
        symbol: formData.symbol,
        discription: formData.discription,
        website: formData.website,
        twitter: formData.twitter,
        facebook: formData.facebook,
        instagram: formData.instagram,
        youtube: formData.youtube,
        logo: logoUri,
        banner: bannerUri,
        description: desUri,
      };
      metaData = removeEmptyStrings(metaData);
      const metaUri = await uploadMetaData(metaData);

      if (activeAccount) {
        try {
          const result = await createCollection(
            metaData.name,
            metaUri,
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
          setStatus({ error: false, loading: true, active: true });
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

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <p className="text-xl font-medium">Edit Your Collection</p>

      {status.active && (
        <TriggerModal
          isOpen={status.loading || status.error}
          close={() =>
            setStatus({ error: false, loading: false, active: false })
          }
        >
          <CurationLoader status={status} edit={editMode ? true : false} />
        </TriggerModal>
      )}

      {errors.active && (
        <TriggerModal
          isOpen={errors.active}
          close={() => setErrors({ active: false, data: [] })}
        >
          <ErrorModal data={errors.data} />
        </TriggerModal>
      )}

      <div className="flex gap-y-5 flex-col lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center gap-y-2 justify-center py-24 lg:w-[49%] bg-dark rounded-lg self-start">
          {file ? (
            <div className="flex flex-col gap-y-5 text-center">
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="logo"
                  className="w-[90%] object-cover mx-auto"
                />
              )}
              {editMode ? '' : file.name ? file.name : 'No files selected'}
            </div>
          ) : (
            <>
              <div className="w-10 h-10">
                <Upload />
              </div>
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
                onClick={() => setFile(null)}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-5 lg:w-[49%]">
          <div className="w-full rounded-md py-3 flex flex-col gap-y-2">
            <div className="flex gap-x-3">
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Name*</Label>
                <Input
                  value={formData.name ? formData.name : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: (e.target as any).value })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter Collection Name"
                />
              </div>
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Symbol*</Label>
                <Input
                  value={formData.symbol ? formData.symbol : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symbol: (e.target as any).value,
                    })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="i.e TAT"
                />
              </div>
            </div>
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">Banner Image</Label>
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
            <hr className="bg-white" />
            <div className="flex gap-x-4 items-center my-5">
              <FileInput
                title="PNG, GIF, WEBP, JPG, or JPEG. Max 1Gb."
                acceptedFormats={acceptedFormats}
                maxSizeInBytes={maxFileSize}
                onFileSelect={(file: any) => handleFileChange(file, 'banner')}
                deSelect={!formData.bannerImage}
                editMode={
                  formData.bannerImage != '' && formData.bannerImage != null
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label className="font-medium">Description*</Label>
            <Textarea
              value={formData.description ? formData.description : ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: (e.target as any).value,
                })
              }
              className="w-full border-none bg-[#161616]"
              placeholder="Please describe your product"
            />
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <Label className="text-lg font-medium">Your links</Label>
            <hr className="bg-white" />
            <div className="mt-5 flex gap-x-3">
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Website</Label>
                <Input
                  value={formData.website ? formData.website : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      website: (e.target as any).value,
                    })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter your website link"
                />
              </div>
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">X(Twitter)</Label>
                <Input
                  value={formData.twitter ? formData.twitter : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      twitter: (e.target as any).value,
                    })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter your twitter link"
                />
              </div>
            </div>
            <div className="mt-2 flex gap-x-3">
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Facebook</Label>
                <Input
                  value={formData.facebook ? formData.facebook : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facebook: (e.target as any).value,
                    })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter your facebook link"
                />
              </div>
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Instagram</Label>
                <Input
                  value={formData.instagram ? formData.instagram : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instagram: (e.target as any).value,
                    })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter your instagram link"
                />
              </div>
            </div>
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">Youtube Video Link</Label>
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
            <hr className="bg-white" />
            {youtube.map((item, index) => {
              return (
                <div key={index} className="mt-5 flex gap-x-3">
                  <div className="flex flex-col gap-y-2 basis-1/2">
                    <Label className="font-medium">Title</Label>
                    <Input
                      value={item.title ? item.title : ''}
                      onChange={(e) => handleVideo(index, e, 'title')}
                      className="w-full border-none bg-[#161616]"
                      type="text"
                      placeholder="Enter video title"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 basis-1/2">
                    <Label className="font-medium">Video Link</Label>
                    <Input
                      value={item.url ? item.url : ''}
                      onChange={(e) => handleVideo(index, e, 'link')}
                      className="w-full border-none bg-[#161616]"
                      type="text"
                      placeholder="Enter video link"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">
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
            <hr className="bg-white" />
            <div className="flex gap-x-4 items-center my-5">
              <FileInput
                title="PNG, GIF, WEBP, JPG, or JPEG. Max 1Gb."
                acceptedFormats={acceptedFormats}
                maxSizeInBytes={maxFileSize}
                onFileSelect={(file: any) =>
                  handleFileChange(file, 'description')
                }
                editMode={
                  formData.bannerImage != '' && formData.bannerImage != null
                }
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
