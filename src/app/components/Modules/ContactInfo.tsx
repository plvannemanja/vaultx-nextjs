'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  deleteContactInfo,
  getContactsInfo,
  upsertContactInfo,
} from '@/services/supplier';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useCreateNFT } from '../Context/CreateNFTContext';
import BaseButton from '../ui/BaseButton';
import { BaseDialog } from '../ui/BaseDialog';

export default function ContactInfo({ isSetting }: any) {
  const { toast } = useToast();
  const [data, setData] = useState<null | any[]>(null);
  const [newContact, setNewContact] = useState({
    id: null,
    contactInfo: '',
    name: '',
  });
  const nftContext = useCreateNFT();
  const [selectedContact, setSelectedContact] = useState(
    nftContext.sellerInfo.contact,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const update = async (id?: string) => {
    let response = null;
    if (id) {
      response = await upsertContactInfo({ ...newContact, id: id ? id : null });
    } else {
      response = await upsertContactInfo(newContact);
    }

    if (response) {
      await fetchContacts();
    }
  };

  const cancelChanges = () => {
    setNewContact({
      id: null,
      contactInfo: '',
      name: '',
    });
    setIsModalOpen(false);
    setIsUpdateModalOpen(false);
  };

  const isSelected = useMemo(
    () => (item: any) => {
      const id = nftContext.sellerInfo.contactId;

      if (id !== null && item !== null) {
        return id == item._id;
      }

      if (selectedContact !== null && item !== null) {
        return selectedContact._id == item._id;
      }

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedContact, nftContext.sellerInfo.contact],
  );

  useEffect(() => {
    nftContext.setSellerInfo({
      ...nftContext.sellerInfo,
      contactId: selectedContact?._id,
      contact: selectedContact,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await getContactsInfo();

    setData(response);
  };

  const handleDeleteContact = async (item: any) => {
    try {
      const response = await deleteContactInfo({
        id: item._id,
      });

      if (response) {
        toast({
          title: 'Properties Template',
          description: 'Delete contact information successfully',
          duration: 2000,
        });
      }
      await fetchContacts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact information',
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-y-5">
      {isSetting ? null : (
        <p className="text-lg font-semibold text-white font-manrope">
          Contact Information
        </p>
      )}
      <div className="flex flex-wrap gap-5">
        {data && data.length > 0
          ? data.map((item: any, index: number) => (
              <div
                key={index}
                className={cn(
                  `w-[18rem] cursor-pointer h-[15rem] bg-[#232323] flex flex-col relative justify-between p-4 rounded-md ${isSelected(item) ? 'border-2 border-[#DDF247]' : ''}`,
                  isSetting ? ' bg-[#161616]' : '',
                )}
                onClick={() => setSelectedContact(item)}
              >
                <span className="text-xl font-semibold">
                  {item.name ? item.name : `#${index + 1}`}
                </span>
                <div>
                  <p className="text-[#A6A6A6] py-1 font-AzeretMono text-[12px]">
                    {item?.contactInfo?.length > 150
                      ? `${item.contactInfo.slice(0, 150)}...`
                      : item.contactInfo}
                    ...
                  </p>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <div
                    className="text-[#DDF247] text-xs h-full cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12]  text-[14px]"
                    onClick={() => {
                      setIsUpdateModalOpen(true);
                      setNewContact({
                        ...newContact,
                        id: item._id,
                        name: item.name,
                        contactInfo: item.contactInfo,
                      });
                    }}
                  >
                    Edit
                  </div>
                  <div
                    className="text-[#DDF247] h-full cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12]  text-[14px]"
                    onClick={() => {
                      handleDeleteContact(item);
                    }}
                  >
                    <Image
                      width={16}
                      height={16}
                      alt="delete"
                      src="/icons/trash.svg"
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <BaseDialog
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                  >
                    <div className="flex flex-col gap-y-5">
                      <div className="flex flex-col gap-y-4">
                        <Label className="text-lg font-medium">
                          Contact Information Name
                        </Label>
                        <Input
                          value={newContact.name ? newContact.name : item.name}
                          onChange={(e) =>
                            setNewContact({
                              ...newContact,
                              name: e.target.value,
                            })
                          }
                          className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                          type="text"
                          placeholder="Enter contact name"
                        />
                      </div>

                      <div className="flex flex-col gap-y-4">
                        <Label className="text-lg font-medium">
                          Contact Information For Seller
                        </Label>
                        <Textarea
                          value={
                            newContact.contactInfo
                              ? newContact.contactInfo
                              : item.contactInfo
                          }
                          onChange={(e) =>
                            setNewContact({
                              ...newContact,
                              contactInfo: e.target.value,
                            })
                          }
                          className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                          placeholder="Please describe your product"
                        />
                      </div>

                      <div className="flex gap-x-4 justify-center my-3">
                        <BaseButton
                          title="Cancel"
                          variant="secondary"
                          onClick={cancelChanges}
                        />
                        <BaseButton
                          title="Save"
                          variant="primary"
                          onClick={async () => {
                            await update(item._id);
                            setIsUpdateModalOpen(false);
                          }}
                        />
                      </div>
                    </div>
                  </BaseDialog>
                </div>
              </div>
            ))
          : null}
        <div
          className={cn(
            'w-[18rem] h-[15rem] bg-[#232323] flex flex-col gap-y-2 justify-center items-center rounded-md relative',
            isSetting ? 'bg-[#161616]' : '',
          )}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex flex-col gap-y-6 items-center">
            <div className="w-14 h-14 rounded-full bg-[#111] border border-white/[30%] flex items-center justify-center">
              <Image
                src="/icons/plus.svg"
                className="w-5 h-5"
                alt="plus"
                width={20}
                height={20}
              />
            </div>
            <p
              className={cn(
                'text-[#828282] font-medium text-lg',
                isSetting ? 'text-[#7C8282]' : '',
              )}
            >
              Add New Information
            </p>
          </div>
        </div>
        <BaseDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
        >
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-4">
              <Label className="text-lg font-medium">
                Contact Information Name
              </Label>
              <Input
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                type="text"
                placeholder="Enter contact name"
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <Label className="text-lg font-medium">
                Contact Information For Seller
              </Label>
              <Textarea
                onChange={(e) =>
                  setNewContact({ ...newContact, contactInfo: e.target.value })
                }
                className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                placeholder="Please describe your product"
              />
            </div>

            <div className="flex gap-x-4 justify-center my-3">
              <BaseButton
                title="Cancel"
                variant="secondary"
                onClick={cancelChanges}
              />
              <BaseButton
                title="Save"
                variant="primary"
                onClick={async () => {
                  await update();
                  setIsModalOpen(false);
                }}
              />
            </div>
          </div>
        </BaseDialog>
      </div>
    </div>
  );
}
