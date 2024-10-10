'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@headlessui/react';
import BaseButton from '../../ui/BaseButton';
import {
  CreateNFTProvider,
  useCreateNFT,
} from '../../Context/CreateNFTContext';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { CreateNftServices } from '@/services/createNftService';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import ShippingInfo from '../ShippingInfo';
import ContactInfo from '../ContactInfo';
import { acceptedFormats, maxFileSize } from '@/utils/helpers';
import { CategoryService } from '@/services/catergoryService';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { useToast } from '@/hooks/use-toast';

interface IEditNFT {
  category: any;
  description: string;
}

const Modal = ({
  onClose,
  fetchNftData,
}: {
  onClose: () => void;
  fetchNftData: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { NFTDetail, nftId } = useNFTDetail();
  const { toast } = useToast();
  const {
    sellerInfo: { shipping },
  } = useCreateNFT();
  const [formData, setFormData] = useState<IEditNFT>({
    category: null,
    description: '',
  });
  const [attachments, setAttachments] = useState<any[]>([null]);
  const attachmentRef = useRef(null);
  const [addAttachId, setAddAttachId] = useState(0);

  const nftServices = new CreateNftServices();

  const handleAttachment = (file: any) => {
    const attachment = file.target.files[0];
    const fileExtension = attachment.name.split('.').pop().toLowerCase();
    if (
      attachment.size < maxFileSize &&
      acceptedFormats.includes(`.${fileExtension}`)
    ) {
      const newAttachments = [...attachments];
      newAttachments[addAttachId] = attachment;
      setAttachments(newAttachments);
    }
  };

  const addAttachment = (index) => {
    if (attachmentRef.current) {
      (attachmentRef.current as any).click();
    }
    setAddAttachId(index);
    if (attachments.length - 1 > index) {
      return;
    }
    const newAttachments = [...attachments, null];

    setAttachments(newAttachments);
  };

  const getAttach = (obj) => {
    if (typeof obj === 'string') return obj;
    return URL.createObjectURL(obj);
  };
  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);

    setAttachments(newAttachments);
  };

  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const categoryService = new CategoryService();
      const {
        data: { categories },
      } = await categoryService.getAllCategories(0, 0);
      setCategories(categories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('description', formData.description);
      if (formData.category) data.append('category', formData.category);

      attachments.forEach((attachment) => {
        if (attachment && typeof attachment !== 'string') {
          data.append('files', attachment);
        }
      });

      data.append(
        'attachPrevs',
        JSON.stringify(
          attachments.filter((item) => typeof item === 'string' && item),
        ),
      );
      data.append('nftId', nftId);

      const shippingAddress = {
        name: shipping.name,
        email: shipping.email,
        country: shipping.country,
        address: {
          line1: shipping.address.line1,
          line2: shipping.address.line2,
          city: shipping.address.city,
          state: shipping.address.state,
          postalCode: shipping.address.postalCode,
        },
        phoneNumber: shipping.phoneNumber,
      };

      data.append('shippingAddress', JSON.stringify(shippingAddress));
      await nftServices.editNft(data);
      fetchNftData();
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Pleae check all input forms.',
        duration: 2000,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (NFTDetail) {
      setFormData({
        ...formData,

        category: NFTDetail.category?._id,
        description: NFTDetail.description,
      });
      setAttachments([...NFTDetail.attachments, null]);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-y-6 w-full p-[30px]">
        <h2 className="text-[30px] font-bold pb-[2px]"> Edit RWA </h2>
        <div className="w-full rounded-[20px] px-4 py-3 flex flex-col gap-y-2 bg-[#232323]">
          <Disclosure as="div" defaultOpen={true}>
            {({ open }) => (
              <>
                <DisclosureButton className="flex w-full justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                  <span>Attachment</span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-white`}
                  />
                </DisclosureButton>
                <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                  <div className="flex gap-4 flex-wrap my-2">
                    <input
                      type="file"
                      className="hidden"
                      title="file"
                      ref={attachmentRef}
                      onChange={(e) => handleAttachment(e)}
                    />
                    {attachments?.map((attachment, index) => {
                      return (
                        <div key={index} className="flex flex-col gap-y-2">
                          {!attachment ? (
                            <img
                              src="https://i.ibb.co/c8FMdw1/attachment-link.png"
                              alt="attachment"
                              className="w-[200px] mx-auto h-[200px] rounded-md object-cover"
                            />
                          ) : (
                            <img
                              src={getAttach(attachment)}
                              alt="attachment"
                              className="w-[200px] mx-auto h-[200px] rounded-md object-cover"
                            />
                          )}
                          {attachment ? (
                            <div className="flex gap-x-2 justify-center items-center cursor-pointer">
                              <span
                                className="text-neon font-bold text-[13px]"
                                onClick={() => addAttachment(index)}
                              >
                                Change
                              </span>
                              <img
                                src="/icons/trash.svg"
                                alt="attachment"
                                className="w-5 h-5"
                                onClick={() => removeAttachment(index)}
                              />
                            </div>
                          ) : (
                            <div
                              className="flex gap-x-2 justify-center items-center cursor-pointer"
                              onClick={() => addAttachment(index)}
                            >
                              <span className="text-neon  font-bold text-[13px]">
                                Upload
                              </span>
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
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
        <div className="flex flex-col gap-y-2">
          <Label className="text-lg font-medium">Category</Label>
          <select
            aria-label="Select category"
            // className="h-10 rounded-md px-2 w-full"
            className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"
            name="country"
            onChange={(e) => {
              setFormData({ ...formData, category: (e.target as any).value });
            }}
            value={formData.category}
          >
            <option value="">Select</option>
            {categories.map((item: any) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full flex-col">
          <h2 className="font-bold text-[#ffffff] text-[14px] mb-[15px]">
            Description
          </h2>

          <Textarea
            className="w-full border-none bg-[#232323] h-[240px] text-[#ffffff] azeret-mono-font placeholder:text-[#ffffff53] p-4 rounded-[24px] resize-none"
            placeholder="Please describe your product"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: (e.target as any).value,
              })
            }
          />
        </div>

        <ShippingInfo />
        <ContactInfo />
        <div className="flex w-full gap-x-4 justify-center my-3">
          <BaseButton
            title="Discard"
            variant="secondary"
            onClick={onClose}
            className="w-full"
          />
          <BaseButton
            title="Submit"
            variant="primary"
            onClick={handleEdit}
            loading={loading}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
};

export default function EditNFTMOdal({
  onClose,
  fetchNftData,
}: {
  onClose: () => void;
  fetchNftData: () => void;
}) {
  return (
    <CreateNFTProvider>
      <Modal onClose={onClose} fetchNftData={fetchNftData} />
    </CreateNFTProvider>
  );
}
