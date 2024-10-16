'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  deleteContactInfo,
  getContactsInfo,
  upsertContactInfo,
} from '@/services/supplier';
import { useEffect, useMemo, useState } from 'react';
import { useCreateNFT } from '../Context/CreateNFTContext';
import BaseButton from '../ui/BaseButton';
import { BaseDialog } from '../ui/BaseDialog';
export default function ContactInfo() {
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
    [selectedContact, nftContext.sellerInfo.contact],
  );

  useEffect(() => {
    nftContext.setSellerInfo({
      ...nftContext.sellerInfo,
      contactId: selectedContact?._id,
      contact: selectedContact,
    });
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
      <p className="text-lg font-semibold text-white font-manrope">
        Contact Information
      </p>
      <div className="flex flex-wrap gap-5">
        {data && data.length > 0
          ? data.map((item: any, index: number) => (
              <div
                key={index}
                className={`w-[18rem] h-[15rem] bg-[#232323] flex flex-col relative justify-between p-4 rounded-md ${isSelected(item) ? 'border-2 border-[#DDF247]' : ''}`}
                onClick={() => {
                  setSelectedContact(item);
                }}
              >
                <span>{item.name ? item.name : `#${index + 1}`}</span>
                <div>
                  <p className="text-[#A6A6A6] py-1 azeret-mono-font text-[12px]">
                    {item?.contactInfo?.length > 150
                      ? `${item.contactInfo.slice(0, 150)}...`
                      : item.contactInfo}
                    ...
                  </p>
                </div>

                <span
                  className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12] absolute bottom-2 right-10 text-[14px]"
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
                </span>
                <span
                  className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12] absolute bottom-2 right-2 text-[14px]"
                  onClick={() => {
                    handleDeleteContact(item);
                  }}
                >
                  <img src="/icons/trash.svg" className="w-4 h-4" />
                </span>

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
                          className="w-full border-none bg-[#161616]"
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
                          className="w-full border-none bg-[#161616]"
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
          className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col gap-y-2 justify-center items-center rounded-md relative"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex flex-col gap-y-6 items-center">
            <div className="w-14 h-14 rounded-full bg-[#111] border border-white/[30%] flex items-center justify-center">
              <img src="/icons/plus.svg" className="w-5 h-5" />
            </div>
            <p className="text-[#828282] font-medium text-lg">
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
                className="w-full border-none bg-[#161616]"
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
                className="w-full border-none bg-[#161616]"
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
