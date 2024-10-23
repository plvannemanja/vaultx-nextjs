'use client';
import {
  CreateNFTProvider,
  useCreateNFT,
} from '@/app/components/Context/CreateNFTContext';
import ContactInfo from '@/app/components/Modules/ContactInfo';
import UserArtistSetting from '@/app/components/Modules/create/UserArtistSetting';
import ShippingInfo from '@/app/components/Modules/ShippingInfo';
import BaseButton from '@/app/components/ui/BaseButton';
import FileInput from '@/app/components/ui/FileInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  deleteProperty,
  getProperties,
  upsertProperty,
  userServices,
} from '@/services/supplier';
import { checkUrl } from '@/utils/helpers';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
const defaultAttributes = [
  { type: 'Type', value: 'Write it here' },
  { type: 'Medium', value: 'Write it here' },
  { type: 'Support', value: 'Write it here' },
  { type: 'Dimensions (cm)', value: 'Write it here' },
  { type: 'Signature', value: 'Write it here' },
  { type: 'Authentication', value: 'Write it here' },
];

export default function Page() {
  return (
    <CreateNFTProvider>
      <MainComponent />
    </CreateNFTProvider>
  );
}

const MainComponent = () => {
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

  const { advancedDetails, setAdvancedDetails } = useCreateNFT();
  const [data, setData] = useState(advancedDetails.attributes);
  const [isModalOpenTemplate, setIsModalOpenTemplate] = useState(false);
  const [editableProperties, setEditableProperties] = useState([]);

  useEffect(() => {
    setAdvancedDetails({
      ...advancedDetails,
      attributes: data,
    });
  }, [data]);

  useEffect(() => {
    fetchProperties();
    if (advancedDetails.propertyTemplateId) {
    }
    setAdvancedDetails({
      ...advancedDetails,
      propertyTemplateId: 'basic',
    });
  }, []);

  const updateTemplate = (updatedProperties) => {
    let updateData = data.map((item) => {
      if (item._id !== advancedDetails.propertyTemplateId) return item;
      return {
        ...item,
        attributes: updatedProperties,
      };
    });
    setData(updateData);
  };

  const fetchProperties = async () => {
    const response = await getProperties();
    setData(response);
  };

  const handleTemplateSelect = (template) => {
    setEditableProperties(template.attributes);
    setAdvancedDetails({
      ...advancedDetails,
      propertyTemplateId: template._id || null,
    });
  };

  const handleTemplateEdit = async (editedTemplate) => {
    try {
      const response = await upsertProperty({
        id: editedTemplate._id,
        name: editedTemplate.name,
        attributes: editedTemplate.attributes,
      });

      if (response) {
        toast({
          title: 'Properties Template',
          description: 'Edited successfully',
          duration: 2000,
        });

        await fetchProperties();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save template',
        duration: 2000,
      });
    }
  };

  const handleTemplateDelete = async (editedTemplate) => {
    try {
      const response = await deleteProperty({
        id: editedTemplate._id,
      });

      if (response) {
        toast({
          title: 'Properties Template',
          description: 'Deleted successfully',
          duration: 2000,
        });

        await fetchProperties();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col px-4">
      <div className="w-full justify-center items-center mb-[40px]">
        <p className="text-center text-[32px] font-extrabold">Edit Profile</p>
      </div>
      <div className="w-full flex flex-col gap-y-5">
        <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
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
                      Edit your avatar
                    </Label>
                    <div className="flex justify-center">
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </div>
                </DisclosureButton>
                <DisclosurePanel className=" pt-4 pb-2 text-sm text-white rounded-b-lg">
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
                    <div className="w-6/12">
                      <FileInput
                        title="Upload a new avatar"
                        subtitle="100*100 size is recommended"
                        isProfile
                        titleStyles={'text-sm font-extrabold'}
                        onFileSelect={(file: any) =>
                          handleFileChange(file, 'avatar')
                        }
                      />
                    </div>
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>

        <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
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
                      Edit your Cover Image
                    </Label>
                    <div className="flex justify-center">
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
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
                    <div className="w-6/12">
                      <FileInput
                        title="Upload a new banner"
                        subtitle="JPEG 100x100"
                        isProfile
                        onFileSelect={(file: any) =>
                          handleFileChange(file, 'cover')
                        }
                      />
                    </div>
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>

        {/* <span>Basic Information</span> */}
        <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
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
                      Basic Information
                    </Label>
                    <div className="flex justify-center">
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                  <div className="mt-5 flex gap-x-3">
                    <div className="flex flex-col gap-y-2 basis-1/2 mb-4">
                      <Label className="font-semibold text-sm text-white manrope-font">
                        Username
                      </Label>
                      <Input
                        value={formData.username ? formData.username : ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username: (e.target as any).value,
                          })
                        }
                        className="w-full border-none bg-[#161616] h-[52px] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
                        type="text"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div className="flex flex-col gap-y-2 basis-1/2 mb-4">
                      <Label className="font-semibold text-sm text-white manrope-font">
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
                        className="w-full border-none bg-[#161616] h-[52px] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
                        type="text"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 mt-2">
                    <Label className="font-semibold text-sm text-white manrope-font">
                      Your Bio
                    </Label>
                    <Textarea
                      value={formData.bio ? formData.bio : ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bio: (e.target as any).value,
                        })
                      }
                      className="h-[180px] resize-none py-4 px-3 border-none bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
                      placeholder="Say something about yourself"
                    />
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>

        {/* <span>Your links</span> */}
        <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
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
                      Your links
                    </Label>
                    <div className="flex justify-center">
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                  <div className="mt-5 flex gap-x-3">
                    <div className="flex flex-col gap-y-2 basis-1/2">
                      <Label className="font-medium text-[14px]">Website</Label>
                      <Input
                        value={formData.website ? formData.website : ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            website: (e.target as any).value,
                          })
                        }
                        className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
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
                        className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
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
                        className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
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
                        className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#161616] rounded-xl placeholder:text-white/[53%] azeret-mono-font placeholder:text-xs focus-within:border-0 shadow-none outline-0 border-0 focus-visible:shadow-none focus-visible:outline-0 focus-visible:border-0"
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

        <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
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
                      Shipping Information
                    </Label>
                    <div className="flex justify-center">
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                  <ShippingInfo isSetting />
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
        <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
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
                      Contact Information
                    </Label>
                    <div className="flex justify-center">
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                  <ContactInfo isSetting />
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
        <div className="rounded-[20px] px-5 py-3 bg-[#232323]">
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
                      Properties management
                    </Label>
                    <div className="flex justify-center">
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white/[53%]`}
                      />
                    </div>
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="pt-4 pb-2 text-sm text-white rounded-b-lg">
                  {/* <PropertiesTemplate addStatus={true} isSetting /> */}
                  <div className="flex flex-wrap gap-5 font-medium text-lg">
                    <div
                      onClick={() =>
                        handleTemplateSelect({
                          name: 'Basic Template',
                          attributes: defaultAttributes,
                          _id: 'basic',
                        })
                      }
                      className={`w-[18rem] h-[15rem] bg-[#161616] border-2 flex justify-center items-center rounded-md relative ${
                        advancedDetails.propertyTemplateId === 'basic'
                          ? 'border-neon'
                          : 'border-none'
                      }`}
                    >
                      <p>Basic Template</p>
                    </div>
                    {data.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleTemplateSelect(item)}
                        className={`w-[18rem] h-[15rem] bg-[#161616] border-2 flex justify-center items-center rounded-md relative font-medium text-lg ${
                          advancedDetails.propertyTemplateId === item._id
                            ? 'border-neon'
                            : 'border-none'
                        }`}
                      >
                        <p>{item.name}</p>
                        <button
                          className="absolute bottom-2 right-2 text-[#DDF247] border border-white/[20%] px-[10px] rounded py-1 text-[14px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateEdit(item);
                          }}
                        >
                          Edit
                        </button>
                        <div
                          className="absolute top-2 right-2 cursor-pointer w-[26px] h-[26px] flex items-center justify-center rounded-full border border-white/[20%]"
                          onClick={() => handleTemplateDelete(item)}
                        >
                          <img src="/icons/trash.svg" className="w-4 h-4" />
                        </div>
                      </div>
                    ))}

                    <div
                      onClick={() => setIsModalOpenTemplate(true)}
                      className="w-[18rem] h-[15rem] bg-[#161616] flex flex-col gap-y-2 justify-center items-center rounded-md relative"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#111] border border-white/[30%] flex items-center justify-center">
                        <img src="/icons/plus.svg" />
                      </div>
                      <p className="text-[#7C8282] font-medium text-lg">
                        Add new template
                      </p>
                    </div>
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
        <UserArtistSetting isSetting />

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
  );
};
