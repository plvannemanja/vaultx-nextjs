"use client"

import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { ArrowUpTrayIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import { CreateSellService } from '@/services/createSellService';

// 1GB file size
const maxFileSize = 1 * 1024 * 1024 * 1024; // 1GB in bytes
const acceptedFormats = ['.png', '.gif', '.webp', '.mp4', '.mp3'];

interface ICancelOrderModal {
    id: string;
}

export default function CancelOrderModal({ id }) {
    const [step, setStep] = useState(1);
    const [description, setDescription] = useState('');
    const [numberOfInputs, setNumberOfInputs] = useState(1)
    const [discriptionImage, setDiscriptionImage] = useState([])

    const discriptionImageRef = useRef<HTMLInputElement>(null);
    const salesService = new CreateSellService()

    const submit = async () => {
        try {
            const formData = new FormData()
            formData.append("nftId", id)
            formData.append("request", description)
            for (const file of discriptionImage) {
                formData.append("files", file)
            }

            // blockchain logic

            // await salesService.cancelRequest(formData) 

            setStep(2)
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='w-[38rem]'>
            <style jsx>{`
                .upload__file__with__name {
                    display: flex;
                    align-items: center;
                    border-radius: 12px;
                    background: var(--Text-in-Bg, #161616);
                    justify-content: space-between;
                }

                #custom-button {
                    padding: 10px;
                    cursor: pointer;
                    width: 174px;
                    border: 0;
                    border-radius: 14px;
                    background: var(--Light, #dee8e8);
                    color: var(--Text-in-Bg, #161616);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 800;
                    line-height: normal;
                    text-transform: capitalize;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 0 0 auto;
                    justify-content: center;
                    transition: 0.3s all;
                }
            `}</style>

            {
                step === 2 &&
                <div className='flex w-full justify-center flex-col gap-y-4 text-center'>
                    <img src='/icons/success.svg' className='w-16 mx-auto' />
                    <p className='text-lg font-medium'>Application Success</p>
                    <p className='text-gray-500'>Your Request to release escrow request has been successfully received. We will carefully review it and contact you as soon as possible. Thank you for your patience.</p>
                </div>
            }

            {
                step === 1 &&
                <div className='flex flex-col gap-y-4'>
                    <div className='flex flex-col gap-y-2 items-center'>
                        <img src='/icons/success.svg' className='w-16 mx-auto' />
                        <p className='text-lg font-medium'>Order Cancellation Request</p>
                    </div>

                    <p>
                        We are sad to see your cancellation request! However, please be informed that cancellations due to a change of mind are not in our terms and conditions. But if you have other reasons like shipping delays, product defects, and more, your cancellation request may be approved.
                        <br /><br />
                        Kindly explain the reasons for your cancellation in the field down below. After careful review, we will contact you with further details through the email and messenger ID that you provided. We value your feedback as it helps us deliver the best possible service. Thank You!
                    </p>

                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border-none bg-[#161616]"
                        placeholder="Reason for cancellation"
                    />

                    <div className='flex flex-col gap-y-4 mt-2'>
                        <div className="flex items-center justify-between">
                            <p>Attachments</p>
                            <PlusCircleIcon className="w-6 cursor-pointer" onClick={() => {
                                setNumberOfInputs(numberOfInputs + 1)
                            }} />
                        </div>
                        <p className='text-sm text-gray-500'>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                        <div className='flex flex-wrap gap-3 justify-between'>
                            {
                                _.times(numberOfInputs).map((_, index) => {
                                    return (
                                        <div className="pb-2 w-full">
                                            <div className="upload__file__with__name">
                                                <input
                                                    type="file"
                                                    id="discription-image"
                                                    ref={discriptionImageRef}
                                                    style={{ display: "none" }}
                                                    onChange={e => {
                                                        console.log('adding new file')
                                                        const newFile = e.target.files[0];
                                                        setDiscriptionImage([...discriptionImage, newFile])
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    id="custom-button"
                                                    onClick={() => {
                                                        discriptionImageRef &&
                                                            (discriptionImageRef.current as any).click()
                                                    }}
                                                >
                                                    Upload{" "}
                                                    <span>
                                                        <ArrowUpTrayIcon className='w-5' />
                                                    </span>
                                                </button>
                                                <span id="custom-text">
                                                    {discriptionImage[index]
                                                        ? discriptionImage[index].name
                                                        : "Choose File"}
                                                </span>
                                                <img
                                                    src="/icons/trash.svg"
                                                    className='w-6 mr-3'
                                                    onClick={() => {
                                                        if (numberOfInputs > 1) {
                                                            setNumberOfInputs(numberOfInputs - 1)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <div className='py-3 w-[48%] rounded-lg text-black font-semibold bg-light'>
                            <button className='w-full h-full' onClick={() => { }}>Cancel</button>
                        </div>
                        <div className='py-3 w-[48%] rounded-lg text-black font-semibold bg-neon'>
                            <button className='w-full h-full' onClick={async () => await submit()}>Submit</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
