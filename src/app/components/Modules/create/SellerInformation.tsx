"use client"

import React, { useState } from 'react'
import ShippingInfo from '../ShippingInfo'
import ContactInfo from '../ContactInfo'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@headlessui/react'
import BaseButton from '../../ui/BaseButton'

export default function SellerInformation({ handler, nextStep }: { handler: (data: any, error: any) => void, nextStep: (next?: boolean) => void }) {
    const [formData, setFormData] = useState({
        shipping: null,
        contact: null,
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
        const err = []
        if (!formData.shipping) {
            err.push({ path: ['Shipping Information'] })
        }

        if (!formData.contact) {
            err.push({ path: ['Contact Information'] })
        }

        if (!formData.accepted) {
            err.push({ path: ['Consent for collection and usage of personal information'] })
        }

        if (err.length > 0) {
            handler(null, JSON.stringify(err))
            return
        }

        console.log(formData)

        handler(formData, null)
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
                    disabled={true}
                    className='p-4 rounded-md' rows={4} placeholder='faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. ' />
            </div>

            <div className="flex items-center space-x-2">
                <input id="terms"
                    type="checkbox"
                    checked={formData.accepted}
                    onChange={() => setFormData({
                        ...formData,
                        accepted: !formData.accepted
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
