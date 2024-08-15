"use client"

import React, { useState } from 'react'
import ShippingInfo from '../ShippingInfo'
import ContactInfo from '../ContactInfo'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@headlessui/react'
import { Checkbox } from "@/components/ui/checkbox"
import BaseButton from '../../ui/BaseButton'
import { string, z } from "zod"


const detailsSchema = z.object({
    description: z.string(),
    accepted: z.boolean(),
});

export default function SellerInformation({ handler, nextStep }: { handler: (data: any, error: any) => void, nextStep: (next?: boolean) => void }) {
    const [formData, setFormData] = useState({
        shipping: null,
        contact: null,
        description: null,
        accepted: false
    })

    const handleShip = (data: any) => {
        setFormData({
            ...formData,
            shipping: data
        })
    }

    const handleContact = (data: any) => {
        setFormData({
            ...formData,
            contact: data
        })
    }

    const cancelChanges = () => {
        nextStep(false)
    }

    const create = () => {
        const result = detailsSchema.safeParse(formData)
        if (formData.accepted && result.success) {
            nextStep(true)
        } else {
            handler(formData, result.error?.message)
        }
    }

    return (
        <div className="flex flex-col gap-y-4">
            <ShippingInfo handler={handleShip} />
            <ContactInfo handler={handleContact} />

            <div className='bg-dark p-4 gap-y-4 rounded-lg flex flex-col'>
                <p>Shipment Information</p>
                <hr />
                <div className='flex gap-3'>
                    <div className='flex flex-col gap-y-2 max-w-[20rem]'>
                        <Label>Length(cm)</Label>
                        <Input type='number' placeholder="--" />
                    </div>
                    <div className='flex flex-col gap-y-2 max-w-[20rem]'>
                        <Label>Width(cm)</Label>
                        <Input type='number' placeholder="--" />
                    </div>
                    <div className='flex flex-col gap-y-2 max-w-[20rem]'>
                        <Label>Height(cm)</Label>
                        <Input type='number' placeholder="--" />
                    </div>
                    <div className='flex flex-col gap-y-2 max-w-[20rem]'>
                        <Label>Weight(kg)</Label>
                        <Input type='number' placeholder="--" />
                    </div>
                </div>
            </div>

            <div className='bg-dark p-4 gap-y-4 rounded-lg flex flex-col'>
                <p>Consent for collection and usage of personal information</p>
                <p className='text-gray-500'>Please read the following and check the appropriate boxes to indicate your consent:</p>
                <hr />
                <Textarea
                onClick={(e) => setFormData({
                    ...formData,
                    description: (e.target as any).value
                })}
                className='p-4 rounded-md' rows={4} placeholder='faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. ' />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="terms"
                checked={formData.accepted}
                onChange={() => setFormData({
                    ...formData,
                    accepted: true
                })}
                />
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I agree to all terms, privacy policy and fees
                </label>
            </div>

            <div className="flex gap-x-4 justify-center my-5">
                <BaseButton title="Previous" variant="secondary" onClick={cancelChanges} />
                <BaseButton title="Proceed To Create NFT" variant="primary" onClick={create} />
            </div>
        </div>
    )
}
