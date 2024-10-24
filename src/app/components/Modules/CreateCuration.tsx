'use client';

import { Input, LinkInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createCollection } from '@/lib/helper';
import { cn } from '@/lib/utils';
import { collectionServices } from '@/services/supplier';
import { acceptedFormats, ensureValidUrl, maxFileSize } from '@/utils/helpers';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { z } from 'zod';
import ConnectedCard from '../Cards/ConnectedCard';
import AddNew from '../Icons/AddNew';
import BaseButton from '../ui/BaseButton';
import { BaseDialog } from '../ui/BaseDialog';
import FileInput from '../ui/FileInput';
import CurationLoader from './create/CurationLoader';
import ErrorModal from './create/ErrorModal';

const createCurationSchema = z.object({
  name: z.string().nonempty('Name is invalid'),
  symbol: z.string().nonempty('Symbol is invalid'),
  description: z.string().nonempty('Descriptoin is invalid'),
});

export default function CreateCuration({ editMode }: { editMode?: any }) {
  const { toast } = useToast();
  const router = useRouter();
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
  const [successId, setSuccessId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    name: '',
    symbol: '',
    logo: null,
    bannerImage: null,
    descriptionImage: null,
    description: '',
    website: '',
    twitter: '',
    facebook: '',
    instagram: '',
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

  const handleDescriptionImage = (file: any, index: number) => {
    if (descriptionImages.length >= index + 1) {
      descriptionImages[index] = file;
      setDescriptionImages(descriptionImages);
    }
  };
  const cancelChanges = () => {
    setFormData({
      name: '',
      symbol: '',
      logo: null,
      bannerImage: null,
      descriptionImage: null,
      description: '',
      website: '',
      twitter: '',
      facebook: '',
      instagram: '',
    });
  };

  const [youtube, setYoutube] = useState([
    {
      title: '',
      url: '',
    },
  ]);

  const [descriptionImages, setDescriptionImages] = useState<any[]>([null]);

  const create = async () => {
    try {
      const result = createCurationSchema.safeParse(formData);
      if (!result.success || !formData.logo) {
        let data = [];
        if (!result.success) data = JSON.parse(result.error.message);

        if (!formData.logo) {
          data.unshift({
            path: ['Logo'],
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
      data.append('name', formData.name ?? '');
      data.append('symbol', formData.symbol ?? '');
      data.append('discription', formData.description ?? '');
      data.append('logo', formData.logo);
      data.append('bannerImage', formData.bannerImage);
      data.append('website', ensureValidUrl(formData.website ?? ''));
      data.append('twitter', ensureValidUrl(formData.twitter ?? ''));
      data.append('facebook', ensureValidUrl(formData.facebook ?? ''));
      data.append('instagram', ensureValidUrl(formData.instagram ?? ''));
      data.append('youtube', JSON.stringify(youtube));

      let descriptionImageUrls = [];
      descriptionImages.forEach((image) => {
        if (typeof image === 'string') {
          descriptionImageUrls.push(image);
        } else {
          data.append('descriptionImage', image);
        }
      });
      data.append('descriptionImageUrls', JSON.stringify(descriptionImageUrls));

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
      if (activeAccount && !editMode) {
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
            setSuccessId(response?.data?.data._id);
          }
        } catch (error) {
          setStatus({ error: true, loading: true, active: true });
          console.log('error:', error);
          throw error;
        }
      } else if (!editMode) {
        throw 'no active account';
      }

      if (editMode) {
        try {
          let response;
          data.append('curationId', editMode?._id);
          if (editMode) {
            response = await collectionServices.update(data);
          }

          if (response) {
            setSuccessId(editMode?._id);
            setStatus({ error: false, loading: false, active: true });
          }
        } catch (error) {
          setStatus({ error: true, loading: true, active: true });
        }
      }
    } catch (error) {
      setStatus({ error: true, loading: true, active: true });
    }
  };

  useEffect(() => {
    if (successId && !status.active) {
      toast({
        title: 'Redirectiong...',
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/dashboard/curation/${successId}`);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successId, status]);

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
        description: editMode.description,
        website: editMode.website,
        twitter: editMode.twitter,
        facebook: editMode.facebook,
        instagram: editMode.instagram,
      });
      setYoutube(editMode.youtube);
      setDescriptionImages(editMode.descriptionImage);
      setFile(editMode.logo);
      setImageSrc(editMode.logo);
    }
  }, [editMode]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <p className="text-[32px] text-white font-extrabold">Create Curation</p>
      <ConnectedCard />
      {status.active && (
        <BaseDialog
          isOpen={status.active}
          onClose={(val) => setStatus({ ...status, active: val })}
          className="bg-[#161616] max-h-[80%] min-w-[617px] max-w-[617px] mx-auto overflow-y-auto overflow-x-hidden border-0"
          modal={status.loading}
        >
          <CurationLoader status={status} edit={editMode ? true : false} />
        </BaseDialog>
      )}
      {errors.active && (
        <BaseDialog
          isOpen={errors.active}
          onClose={(val) => setErrors({ active: val, data: [] })}
          className="bg-[#161616] max-h-[80%] min-w-[617px] max-w-[617px] mx-auto overflow-y-auto overflow-x-hidden border-0"
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

      <div className="flex gap-[40px] gap-y-5 flex-col lg:flex-row lg:justify-between">
        <div className="col-span-12 lg:col-span-5 lg:w-full bg-[#232323] border-dashed rounded-[30px] border-2 border-[#3a3a3a] flex-col justify-center items-center gap-y-[23px] inline-flex self-start px-10 py-[222px]">
          {file ? (
            <div className="flex flex-col text-center gap-y-[23px]  ">
              {imageSrc && (
                <Image
                  src={imageSrc}
                  alt="logo"
                  className="w-[90%] object-cover mx-auto"
                  width={200}
                  height={200}
                />
              )}
              {file ? file.name : 'No files selected'}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-y-[23px]">
              <Image
                src="/icons/upload.svg"
                alt="upload"
                className="w-[66px] h-[66px]"
                width={66}
                height={66}
              />
              <div className="flex flex-col gap-y-1 font-manrope">
                <p className="text-center text-white text-lg font-extrabold">
                  Upload Thumbnail file
                </p>
                <div>
                  <p className="mt-2 text-white/[53%] mb-[4px] font-normal text-center text-sm azeret-mono-font">
                    Drag or choose your file to upload
                  </p>
                  <p className="text-center text-white/30 text-xs azeret-mono-font">
                    PNG, GIF, WEBP, MP4 or MP3.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-y-2 font-manrope">
            <button
              className="py-3 w-[20rem] h-[50px] text-black font-semibold bg-[#dee8e8] p-2.5 rounded-[14px] justify-center items-center gap-2.5"
              onClick={handleButtonClick}
            >
              <span className="flex gap-x-[10px] items-center justify-center">
                <p className="text-[#161616] text-sm font-extrabold capitalize font-manrope">
                  Browse file
                </p>
                <Image
                  src="/icons/arrow_ico.svg"
                  alt="icon-arrow"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px]"
                />
              </span>
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
                className={'rounded-[14px] font-manrope'}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col col-span-12 lg:col-span-7 gap-y-[30px] lg:w-full">
          <div className="w-full rounded-md flex flex-col gap-y-2">
            <div className="flex gap-x-3">
              <div className="flex flex-col gap-y-[16px] basis-1/2">
                <Label className="font-semibold text-sm text-white manrope-font">
                  Curation Title*
                </Label>
                <Input
                  value={formData.name ? formData.name : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: (e.target as any).value })
                  }
                  className="w-full border-none  h-[52px] px-[26px] placeholder:text-xs py-[15px] bg-[#232323] azeret-mono-font rounded-xl justify-start items-center gap-[30px] inline-flex"
                  type="text"
                  placeholder="Enter Collection Name"
                />
              </div>
              <div className="flex flex-col gap-y-[16px] basis-1/2">
                <Label className="font-semibold text-sm text-white manrope-font">
                  Symbol*
                </Label>
                <Input
                  value={formData.symbol ? formData.symbol : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symbol: (e.target as any).value,
                    })
                  }
                  disabled={editMode ? true : false}
                  className="w-full border-none h-[48px] placeholder:text-xs azeret-mono-font bg-[#232323] gap-[30px] inline-flex"
                  type="text"
                  placeholder="i.e TAT"
                />
              </div>
            </div>
          </div>
          <div className="w-full rounded-[20px] px-5 py-3 bg-[#232323] flex flex-col gap-y-[16px]">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton
                    className={cn(
                      'flex w-full flex-col justify-between py-2 pb-3 text-left   text-lg font-medium text-white text-[18px]',
                      open ? 'border-b border-white/[8%]' : '',
                    )}
                  >
                    <div className="flex w-full justify-between items-center">
                      <Label className="font-extrabold text-lg text-white">
                        Banner Image
                      </Label>
                      <div className="flex justify-center">
                        {/* {formData.bannerImage && (
                          <span
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, bannerImage: null });
                            }}
                          >
                            Remove
                          </span>
                        )} */}
                        <ChevronUpIcon
                          className={`${
                            open ? 'rotate-180 transform' : ''
                          } h-5 w-5 text-white/[53%]`}
                        />
                      </div>
                    </div>
                  </DisclosureButton>
                  <DisclosurePanel className="pt-4 pb-2 text-sm  text-white  rounded-b-lg">
                    <div className="my-5 mb-0 w-full">
                      <FileInput
                        title="PNG, GIF, WEBP, JPG, or JPEG. Max 1Gb."
                        titleStyles={
                          'text-[#979797] text-sm font-normal azeret-mono-font'
                        }
                        acceptedFormats={acceptedFormats}
                        maxSizeInBytes={maxFileSize}
                        onFileSelect={(file: any) =>
                          handleFileChange(file, 'banner')
                        }
                        deSelect={!formData.bannerImage}
                        editMode={!!formData.bannerImage}
                      />
                    </div>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
            {/* <div className="flex justify-between items-center">
              <Label className="text-[20px] font-extrabold">Banner Image</Label>
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
            <hr className="border-white opacity-[0.2]" />
            <div className="flex gap-x-4 items-center my-5 mb-0">
              <FileInput
                title="PNG, GIF, WEBP, JPG, or JPEG. Max 1Gb."
                titleStyles={
                  "text-[#979797] text-sm font-normal azeret-mono-font leading-snug"
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
            </div> */}
          </div>
          <div className="flex flex-col gap-y-[16px]">
            <Label className="font-semibold text-sm text-white manrope-font">
              Description*
            </Label>
            <Textarea
              value={formData.description ? formData.description : ''}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  description: (e.target as any).value,
                });
              }}
              className="w-full border-none bg-[#232323] azeret-mono-font rounded-[20px] placeholder:text-white/[53%] h-[180px] resize-none py-[15px] px-[26px] placeholder:text-sm placeholder:font-normal"
              placeholder="Please describe your curation"
            />
          </div>
          <div className="w-full rounded-[20px] px-[20px] py-[20px] bg-dark flex flex-col gap-y-[16px]">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton
                    className={cn(
                      'flex w-full flex-col justify-between py-2 pb-5 text-left text-lg font-medium text-white text-[18px]',
                      open ? 'border-b border-white/[8%]' : '',
                    )}
                  >
                    <div className="flex w-full justify-between items-center">
                      <Label className="font-extrabold text-lg text-white">
                        Your links
                      </Label>
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </DisclosureButton>
                  <DisclosurePanel className="pt-5 pb-2 text-sm  text-white  rounded-b-lg">
                    <div className=" mb-5 flex gap-x-3">
                      <div className="flex flex-col gap-y-3 basis-1/2">
                        <Label className="font-semibold text-sm text-white manrope-font">
                          Website
                        </Label>
                        <LinkInput
                          value={formData.website ? formData.website : ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              website: (e.target as any).value,
                            })
                          }
                          className="w-full border-none bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs px-1 focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
                          type="text"
                          placeholder="Enter your website link"
                        />
                      </div>
                      <div className="flex flex-col gap-y-3 basis-1/2">
                        <Label className="font-semibold text-sm text-white manrope-font">
                          X(Twitter)
                        </Label>
                        <LinkInput
                          value={formData.twitter ? formData.twitter : ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              twitter: (e.target as any).value,
                            })
                          }
                          className="w-full border-none bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs px-1 focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
                          type="text"
                          placeholder="Enter your twitter link"
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex gap-x-3">
                      <div className="flex flex-col gap-y-3 basis-1/2">
                        <Label className="font-semibold text-sm text-white manrope-font">
                          Facebook
                        </Label>
                        <LinkInput
                          value={formData.facebook ? formData.facebook : ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              facebook: (e.target as any).value,
                            })
                          }
                          className="w-full border-none bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs px-1 focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
                          type="text"
                          placeholder="Enter your facebook link"
                        />
                      </div>
                      <div className="flex flex-col gap-y-3 basis-1/2">
                        <Label className="font-semibold text-sm text-white manrope-font">
                          Instagram
                        </Label>
                        <LinkInput
                          value={formData.instagram ? formData.instagram : ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instagram: (e.target as any).value,
                            })
                          }
                          className="w-full border-none bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs px-1 focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
                          type="text"
                          placeholder="Enter your instagram link"
                        />
                      </div>
                    </div>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="w-full rounded-[20px] px-[20px] py-[20px] bg-dark flex flex-col gap-y-2">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton
                    className={cn(
                      'flex w-full flex-col justify-between py-2 pb-5 text-left   text-lg font-medium text-white text-[18px]',
                      open ? 'border-b border-white/[8%]' : '',
                    )}
                  >
                    <div className="flex w-full justify-between items-center">
                      <Label className="font-extrabold text-lg text-white">
                        Youtube Video Link
                      </Label>
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents closing the disclosure
                        }}
                      >
                        <div
                          className="flex gap-x-2 items-center"
                          onClick={() => {
                            if (youtube.length < 2) {
                              setYoutube([...youtube, { title: '', url: '' }]);
                            }
                          }}
                        >
                          <div className="h-6 w-6 cursor-pointer">
                            <AddNew />
                          </div>
                          <p className="text-sm">Add New</p>
                        </div>
                        <ChevronUpIcon
                          className={`${
                            open ? 'rotate-180 transform' : ''
                          } h-5 w-5 text-white/[53%]`}
                        />
                      </div>
                    </div>
                    <p className="text-[#949494] text-xs azeret-mono-font mt-1">
                      You can add new fields by clicking the Add New button (up
                      to 2 total)
                    </p>
                  </DisclosureButton>
                  <DisclosurePanel className="pt-5 pb-2 text-sm  text-white  rounded-b-lg">
                    {youtube.map((item, index) => {
                      return (
                        <div key={index} className="flex gap-x-3">
                          <div className="flex flex-col gap-y-3 basis-1/2">
                            <Label className="font-semibold text-sm text-white manrope-font">
                              Title
                            </Label>
                            <Input
                              value={item.title ? item.title : ''}
                              onChange={(e) => handleVideo(index, e, 'title')}
                              className="w-full border-none bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0 h-[48px]"
                              type="text"
                              placeholder="Enter video title"
                              showIcon={index > 0}
                              onPressIcon={() => {
                                if (youtube.length > 1) {
                                  setYoutube(
                                    youtube.slice(0, youtube.length - 1),
                                  );
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-y-3 basis-1/2">
                            <Label className="font-semibold text-sm text-white manrope-font">
                              Video Link
                            </Label>
                            <LinkInput
                              value={item.url ? item.url : ''}
                              onChange={(e) => handleVideo(index, e, 'link')}
                              className="w-full border-none bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs px-1 focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
                              type="text"
                              placeholder="Enter video link"
                              showIcon={index > 0}
                              onPressIcon={() => {
                                if (youtube.length > 1) {
                                  setYoutube(
                                    youtube.slice(0, youtube.length - 1),
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="w-full rounded-[20px] px-[20px] py-[20px]  bg-dark flex flex-col gap-y-2">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton
                    className={cn(
                      'flex w-full flex-col justify-between py-2 pb-5 text-left   text-lg font-medium text-white text-[18px]',
                      open ? 'border-b border-white/[8%]' : '',
                    )}
                  >
                    <div className="flex w-full justify-between items-center">
                      <Label className="font-extrabold text-lg text-white">
                        Custom Description Image
                      </Label>
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div
                          className="flex gap-x-2 items-center"
                          onClick={() => {
                            if (descriptionImages.length < 2) {
                              setDescriptionImages([
                                ...descriptionImages,
                                null,
                              ]);
                            }
                          }}
                        >
                          <div className="h-6 w-6 cursor-pointer">
                            <AddNew />
                          </div>
                          <p className="text-sm">Add New</p>
                        </div>
                        <ChevronUpIcon
                          className={`${
                            open ? 'rotate-180 transform' : ''
                          } h-5 w-5 text-white/[53%]`}
                        />
                      </div>
                    </div>
                    <p className="text-[#949494] text-xs azeret-mono-font mt-1">
                      You can add new fields by clicking the Add New button (up
                      to 2 total)
                    </p>
                  </DisclosureButton>
                  <DisclosurePanel className="pb-2 pt-5 text-sm text-white  rounded-b-lg">
                    {descriptionImages.map((image, index) => (
                      <div className="w-full mb-5" key={index}>
                        <FileInput
                          title="PNG, GIF, WEBP, JPG, or JPEG. Max 1Gb."
                          titleStyles={
                            'text-[#979797] text-sm font-normal azeret-mono-font'
                          }
                          acceptedFormats={acceptedFormats}
                          maxSizeInBytes={maxFileSize}
                          onFileSelect={(file: any) =>
                            handleDescriptionImage(file, index)
                          }
                          editMode={!!image}
                          showIcon={index > 0}
                          onPressIcon={() => {
                            if (descriptionImages.length > 1) {
                              setDescriptionImages(
                                descriptionImages.slice(
                                  0,
                                  descriptionImages.length - 1,
                                ),
                              );
                            }
                          }}
                        />
                      </div>
                    ))}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
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
