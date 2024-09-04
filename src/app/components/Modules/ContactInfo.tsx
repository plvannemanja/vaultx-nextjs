"use client"

import { getContactsInfo, upsertContactInfo } from "@/services/supplier";
import { useEffect, useState } from "react";
import { BaseDialog } from "../ui/BaseDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BaseButton from "../ui/BaseButton";
import Image from 'next/image';
export default function ContactInfo({ handler } : { handler?: (data: any) => void }) {
    const [data, setData] = useState<null | any[]>(null);
    const [newContact, setNewContact] = useState({
        id: null,
        contactInfo: "",
        name: ""
    })
    const [selectedContact, setSelectedContact] = useState(null);

    const update = async (id?: string) => {
        
        let response = null;
        if (id) {
            response = await upsertContactInfo({ ...newContact, id: id ? id : null });
        } else {
            response = await upsertContactInfo(newContact);
        }

        if (response) {
            if (data) {
                setData([...data, response]);
                setNewContact({
                    id: null,
                    contactInfo: "",
                    name: ""
                });
            }
        }
    }

    const cancelChanges = () => {
        setNewContact({
            id: null,
            contactInfo: "",
            name: ""
        })
    }

    useEffect(() => {
        if (handler) {
            handler(selectedContact);
        }
    }, [selectedContact]);

    useEffect(() => {
        const fetchContacts = async () => {
            const response = await getContactsInfo();

            if (response.length > 0) {
                setData(response);
            }
        }

        fetchContacts();
    }, []);

    return (
        <div className="flex flex-col gap-y-5">
            <p className="text-lg font-medium">Contact Information</p>
            <div className="flex flex-wrap gap-5">
                {data && data.length > 0 ? (
                    data.map((item: any, index: number) => (
                        <div key={index} className={`w-[18rem] h-[15rem] bg-[#232323] flex flex-col justify-between p-4 rounded-md ${selectedContact == item ? 'border-neon' : 'border-gray-400'}`}
                        onClick={() => setSelectedContact(item)}
                        >
                            <span>{item.name ? item.name : `#${index + 1}`}</span>
                            <div>
                                <p className="text-[#A6A6A6] py-1">{item.contactInfo.length > 150 ? `${item.contactInfo.slice(0, 150)}...` : item.contactInfo}...</p>
                            </div>
                            <div className="flex justify-end">
                            <BaseDialog
                                trigger={<span className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-gray-400 text-sm">Edit</span>}
                                className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                            >
                            <div className="flex flex-col gap-y-5">
                                <div className="flex flex-col gap-y-4">
                                    <Label className="text-lg font-medium">Contact Information Name</Label>
                                    <Input value={newContact.name ? newContact.name : item.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter contact name" />
                                </div>

                                <div className="flex flex-col gap-y-4">
                                    <Label className="text-lg font-medium">Contact Information For Seller</Label>
                                    <Textarea value={newContact.contactInfo ? newContact.contactInfo : item.contactInfo} onChange={(e) => setNewContact({ ...newContact, contactInfo: e.target.value })} className="w-full border-none bg-[#161616]" placeholder="Please describe your product" />
                                </div>

                                <div className="flex gap-x-4 justify-center my-3">
                                    <BaseButton title="Cancel" variant="secondary" onClick={cancelChanges} />
                                    <BaseButton title="Save" variant="primary" onClick={async () => await update(item._id)} />
                                </div>
                            </div>
                        </BaseDialog>
                            </div>
                        </div>
                    ))
                ) : null}

                <BaseDialog
                    trigger={
                        <div className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col relative justify-center cursor-pointer items-center rounded-md">
                            <div className="flex flex-col gap-y-6 items-center">
                                <div className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#FFFFFF4D] flex justify-center items-center">
                                    <Image src="icons/plus.svg" className="w-5 h-5" alt="" width={100} height={100} />
                                </div>
                                <p className="text-[#828282]">Add New Information</p>
                            </div>
                        </div>
                    }
                    className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                >
                    <div className="flex flex-col gap-y-5">
                        <div className="flex flex-col gap-y-4">
                            <Label className="text-lg font-medium">Contact Information Name</Label>
                            <Input onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter contact name" />
                        </div>

                        <div className="flex flex-col gap-y-4">
                            <Label className="text-lg font-medium">Contact Information For Seller</Label>
                            <Textarea onChange={(e) => setNewContact({ ...newContact, contactInfo: e.target.value })} className="w-full border-none bg-[#161616]" placeholder="Please describe your product" />
                        </div>

                        <div className="flex gap-x-4 justify-center my-3">
                            <BaseButton title="Cancel" variant="secondary" onClick={cancelChanges} />
                            <BaseButton title="Save" variant="primary" onClick={async () => await update()} />
                        </div>
                    </div>
                </BaseDialog>

            </div>
        </div>
    );
}