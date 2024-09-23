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
          <p className="text-center text-3xl font-medium">Edit Profile</p>
        </div>

        <div className="w-full flex flex-col gap-y-5 mt-5">
          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <div className="self-stretch justify-between items-center inline-flex">
              <Label className="text-lg font-medium">Edit your avatar</Label>
              <ChevronUpIcon className="ml-2 h-4 w-4 opacity-50" />
            </div>
            <hr className="border-gray-400 opacity-10" />
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
                <div className="w-28 h-28 rounded-full bg-[#2d2d2d]"></div>
              )}
              <FileInput
                title="Upload a new avatar"
                subtitle="JPEG 100x100"
                onFileSelect={(file: any) => handleFileChange(file, 'avatar')}
              />
            </div>
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <div className="self-stretch justify-between items-center inline-flex">
              <Label className="text-lg font-medium">
                Edit your cover image
              </Label>
              <ChevronUpIcon className="ml-2 h-4 w-4 opacity-50" />
            </div>
            <hr className="border-gray-400 opacity-10" />
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
                <div className="w-28 h-28 rounded-full bg-[#2d2d2d]"></div>
              )}
              <FileInput
                title="Upload a new banner"
                subtitle="JPEG 100x100"
                onFileSelect={(file: any) => handleFileChange(file, 'cover')}
              />
            </div>
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <div className="self-stretch justify-between items-center inline-flex">
              <Label className="text-lg font-medium">Basic Information</Label>
              <ChevronUpIcon className="ml-2 h-4 w-4 opacity-50" />
            </div>
            <hr className="border-gray-400 opacity-10" />
            <div className="mt-5 flex gap-x-3">
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Username</Label>
                <Input
                  value={formData.username ? formData.username : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: (e.target as any).value,
                    })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter your username"
                />
              </div>
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Email Address</Label>
                <Input
                  value={formData.email ? formData.email : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: (e.target as any).value })
                  }
                  className="w-full border-none bg-[#161616]"
                  type="text"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 mt-2">
              <Label className="font-medium">Your Bio</Label>
              <Textarea
                value={formData.bio ? formData.bio : ''}
                onChange={(e) =>
                  setFormData({ ...formData, bio: (e.target as any).value })
                }
                className="w-full border-none bg-[#161616]"
                placeholder="Say something about yourself"
              />
            </div>
          </div>

          <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
            <div className="self-stretch justify-between items-center inline-flex">
              <Label className="text-lg font-medium">Your links</Label>
              <div className="flex cursor-pointer h-[52px] justify-center relative gap-y-1 items-center px-[14px] py-[16px]">
                <img src="/icons/add-new.svg" className="w-6 h-6" />
                <p className="text-center text-sm text-[#DDF247]">Add New</p>
                <ChevronUpIcon className="ml-2 h-4 w-4 opacity-50" />
              </div>
            </div>
            <hr className="border-gray-400 opacity-10" />
            <div className="mt-5 flex gap-x-3">
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Website</Label>
                <div className="self-stretch w-full border-none bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex">
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
                  <div className="w-[26px] h-[26px] relative">
                    <img
                      src="/icons/trash.svg"
                      alt="trash"
                      className="w-6 h-6 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">X(Twitter)</Label>
                <div className="self-stretch w-full border-none bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex">
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
                  <div className="w-[26px] h-[26px] relative">
                    <img
                      src="/icons/trash.svg"
                      alt="trash"
                      className="w-6 h-6 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-x-3">
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Facebook</Label>
                <div className="self-stretch w-full border-none bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex">
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
                  <div className="w-[26px] h-[26px] relative">
                    <img
                      src="/icons/trash.svg"
                      alt="trash"
                      className="w-6 h-6 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 basis-1/2">
                <Label className="font-medium">Instagram</Label>
                <div className="self-stretch w-full border-none bg-[#161616] rounded-xl justify-start items-center gap-[30px] inline-flex">
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
                  <div className="w-[26px] h-[26px] relative">
                    <img
                      src="/icons/trash.svg"
                      alt="trash"
                      className="w-6 h-6 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ShippingInfo />
          <ContactInfo />
          <PropertiesTemplate />
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
