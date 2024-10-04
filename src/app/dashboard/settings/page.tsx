'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FileInput from '@/app/components/ui/FileInput';
import { useEffect, useState } from 'react';
import { userServices } from '@/services/supplier';
import BaseButton from '@/app/components/ui/BaseButton';
import ContactInfo from '@/app/components/Modules/ContactInfo';
import ShippingInfo from '@/app/components/Modules/ShippingInfo';
import PropertiesInfo from '@/app/components/Modules/Properties';
import { useToast } from '@/hooks/use-toast';
import { checkUrl } from '@/utils/helpers';
import { CreateNFTProvider } from '@/app/components/Context/CreateNFTContext';
import { ChevronUpIcon } from 'lucide-react';
import PropertiesTemplate from '@/app/components/Modules/create/PropertiesTemplate';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import UserArtistSetting from '@/app/components/Modules/create/UserArtistSetting';

export default function Page() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    avatar: null,
    cover: null,
    username: null,
    email: null,
    bio: null,
    facebook: null,
    twitter: null,
    instagram: null,
    website: null,
  });

  const handleFileChange = (file: any, type: string) => {
    if (type === 'avatar') setFormData({ ...formData, avatar: file });
    if (type === 'cover') setFormData({ ...formData, cover: file });
  };

  const validateProfile = (data: any) => {
    const err = [];

    if (data?.website && !checkUrl(data.website, 'website')) {
      err.push('Website');
    }
    if (data?.twitter && !checkUrl(data.twitter, 'twitter')) {
      err.push('Twitter');
    }
    if (data?.facebook && !checkUrl(data.facebook, 'facebook')) {
      err.push('Facebook');
    }
    if (data?.instagram && !checkUrl(data.instagram, 'instagram')) {
      err.push('Instagram');
    }

    return err;
  };

  const update = async () => {
    toast({
      title: 'Updating Profile',
      description: 'Please wait...',
      duration: 2000,
    });

    const json = {
      ...formData,
      userImage: formData.avatar,
      bannerImage: formData.cover,
    };

    try {
      const err = validateProfile(json);
      if (err.length > 0) {
        let str = '';
        for (let i = 0; i < err.length; i++) {
          str = str + err[i] + ', ';
        }
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `${str} is not a valid URL`,
        });
        return;
      }

      const formDataForm = new FormData();
      formDataForm.append('userImage', formData.avatar);
      formDataForm.append('bannerImage', formData.cover);
      formDataForm.append('username', formData.username);
      formDataForm.append('email', formData.email);
      formDataForm.append('bio', formData.bio);
      formDataForm.append('facebook', formData.facebook);
      formDataForm.append('twitter', formData.twitter);
      formDataForm.append('instagram', formData.instagram);
      formDataForm.append('website', formData.website);

      const response = await userServices.updateProfile(formDataForm as any);

      if (response) {
        toast({
          title: 'Profile Updated',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while updating your profile',
        duration: 2000,
      });
    }
  };

  const fetchUserDetails = async () => {
    const response = await userServices.getSingleUser();

    if (response.data) {
      const user = response.data.user;
      setFormData({
        website: user.website,
        bio: user.bio,
        email: user.email,
        username: user.username,
        instagram: user.instagram,
        twitter: user.twitter,
        facebook: user.facebook,
        avatar: user.avatar ? user.avatar.url : null,
        cover: user.banner ? user.banner.url : null,
      });
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <CreateNFTProvider>
      <div className="flex flex-col gap-y-4 px-4">
        <div className="w-full justify-center items-center">
          <p className="text text-[32px] font-extrabold">Edit Profile</p>
        </div>
        <div className="flex flex-col gap-y-6 w-full">
          <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                    <span>Edit your avatar</span>
                    <ChevronUpIcon
                      className={`${open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                    <div className="flex gap-x-4 items-center my-5">
                      {formData.avatar ? (
                        <img
                          src={
                            typeof formData.avatar === 'string'
                              ? formData.avatar
                              : URL.createObjectURL(formData.avatar)
                          }
                          alt="cover"
                          className="w-28 h-28 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-black"></div>
                      )}
                      <FileInput
                        title="Upload a new avatar"
                        subtitle="JPEG 100x100"
                        onFileSelect={(file: any) =>
                          handleFileChange(file, 'avatar')
                        }
                      />
                    </div>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        </div>

        <div className="w-full flex flex-col gap-y-5 mt-5">
          <div className="flex flex-col gap-y-6 w-full">
            <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
              <Disclosure as="div" defaultOpen={true}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                      <span>Edit your cover image</span>
                      <ChevronUpIcon
                        className={`${open ? 'rotate-180 transform' : ''
                          } h-5 w-5 text-white`}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                      <div className="flex gap-x-4 items-center my-5">
                        {formData.cover ? (
                          <img
                            src={
                              typeof formData.cover === 'string'
                                ? formData.cover
                                : URL.createObjectURL(formData.cover)
                            }
                            alt="cover"
                            className="w-28 h-28 object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-black"></div>
                        )}
                        <FileInput
                          title="Upload a new banner"
                          subtitle="JPEG 100x100"
                          onFileSelect={(file: any) =>
                            handleFileChange(file, 'cover')
                          }
                        />
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>

          <div className="flex flex-col gap-y-6 w-full">
            <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
              <Disclosure as="div" defaultOpen={true}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                      <span>Basic Information</span>
                      <ChevronUpIcon
                        className={`${open ? 'rotate-180 transform' : ''
                          } h-5 w-5 text-white`}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                      <div className="mt-5 flex gap-x-3">
                        <div className="flex flex-col gap-y-2 basis-1/2 mb-4">
                          <Label className="fo mb-4 font-bold">Username</Label>
                          <Input
                            value={formData.username ? formData.username : ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                username: (e.target as any).value,
                              })
                            }
                            className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53]"
                            type="text"
                            placeholder="Enter your username"
                          />
                        </div>
                        <div className="flex flex-col gap-y-2 basis-1/2 mb-4">
                          <Label className="font-medium mb-4">
                            Email Address
                          </Label>
                          <Input
                            value={formData.email ? formData.email : ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: (e.target as any).value,
                              })
                            }
                            className="w-full border-none bg-[#161616] h-[52px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] "
                            type="text"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-2 mt-2">
                        <Label className="font-medium mb-4">Your Bio</Label>
                        <Textarea
                          value={formData.bio ? formData.bio : ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bio: (e.target as any).value,
                            })
                          }
                          className="w-full border-none bg-[#161616] h-[240px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] p-4 rounded-md"
                          placeholder="Say something about yourself"
                        />
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>

          <div className="flex flex-col gap-y-6 w-full">
            <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
              <Disclosure as="div" defaultOpen={true}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                      <span>Your links</span>
                      <ChevronUpIcon
                        className={`${open ? 'rotate-180 transform' : ''
                          } h-5 w-5 text-white`}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                      <div className="mt-5 flex gap-x-3">
                        <div className="flex flex-col gap-y-2 basis-1/2">
                          <Label className="font-medium text-[14px]">
                            Website
                          </Label>
                          <Input
                            value={formData.website ? formData.website : ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                website: (e.target as any).value,
                              })
                            }
                            className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex placeholder:text-[#ffffff53]"
                            type="text"
                            placeholder="Enter your website link"
                            showIcon
                          />
                        </div>
                        <div className="flex flex-col gap-y-2 basis-1/2">
                          <Label className="font-medium text-[14px]">
                            X(Twitter)
                          </Label>
                          <Input
                            value={formData.twitter ? formData.twitter : ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                twitter: (e.target as any).value,
                              })
                            }
                            className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex placeholder:text-[#ffffff53]"
                            type="text"
                            placeholder="Enter your twitter link"
                            showIcon
                          />
                        </div>
                      </div>
                      <div className="mt-2 flex gap-x-3">
                        <div className="flex flex-col gap-y-2 basis-1/2">
                          <Label className="font-medium text-[14px]">
                            Facebook
                          </Label>
                          <Input
                            value={formData.facebook ? formData.facebook : ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                facebook: (e.target as any).value,
                              })
                            }
                            className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex placeholder:text-[#ffffff53]"
                            type="text"
                            placeholder="Enter your facebook link"
                            showIcon
                          />
                        </div>
                        <div className="flex flex-col gap-y-2 basis-1/2">
                          <Label className="font-medium text-[14px]">
                            Instagram
                          </Label>
                          <Input
                            value={formData.instagram ? formData.instagram : ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                instagram: (e.target as any).value,
                              })
                            }
                            className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex placeholder:text-[#ffffff53]"
                            type="text"
                            placeholder="Enter your instagram link"
                            showIcon
                          />
                        </div>
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>

          <ShippingInfo />
          <ContactInfo />
          <PropertiesTemplate />
          <UserArtistSetting />
          <div className="flex gap-x-4 justify-center my-10">
            <BaseButton
              title="Cancel"
              variant="secondary"
              onClick={fetchUserDetails}
            />
            <BaseButton title="Save" variant="primary" onClick={update} />
          </div>
        </div>
      </div>
    </CreateNFTProvider>
  );
}
