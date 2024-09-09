"use client";

import React, { useState } from 'react'
import BaseButton from '../../ui/BaseButton';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';

export default function MintLoader() {
    const [step, setStep] = useState(1)

    return (
        <div className='w-[24rem]'>
            {
                step === 1 &&
                <div className='flex flex-col gap-y-4'>
                    <p className='text-lg font-medium'>
                        NFT Creation is in Progress
                    </p>
                    <p className='text-sm text-gray-500'>Transfer this token from your wallet to other wallet.</p>

                    <div className="flex flex-col gap-y-3">
                        <div className='flex gap-x-2 items-center'>
                            <img src='/icons/refresh.svg' alt='step1' className='w-10 h-10' />
                            <div>
                                <p>Upload NFTs</p>
                                <p className='text-gray-500 text-sm'>Uploading all media assets and metadata to IPFS</p>
                            </div>
                        </div>
                        <div className='flex gap-x-2 items-center'>
                            <img src='/icons/refresh.svg' alt='step1' className='w-10 h-10' />
                            <div>
                                <p>Mint</p>
                                <p className='text-gray-500 text-sm'>Sending transaction to create your NFT</p>
                            </div>
                        </div>
                        <div className='flex gap-x-2 items-center'>
                            <img src='/icons/refresh.svg' alt='step1' className='w-10 h-10' />
                            <div>
                                <p>Listing for sale</p>
                                <p className='text-gray-500 text-sm'>Sending transaction to list your NFT</p>
                            </div>
                        </div>
                    </div>

                </div>
            }
            {
                step === 2 && 
                <div className='flex flex-col gap-y-4'>
                    <div className='flex gap-x-2 items-center'>
                        <img src='/icons/info.svg' alt='step1' className='w-10 h-10' />
                        <p className='text-lg font-medium'>Caution</p>
                    </div>
                    <p>Do not disclose buyer shipping information to third parties! 
                        <br /><br />
                        To maintain the confidentiality of buyer information and ensure smooth transactions, please pay close attention to the following points:
                        <br /><br />
                        1. Confidentiality of Shipping Information: Buyer shipping information should remain confidential to sellers. Be cautious to prevent any external disclosures. 
                        <br /><br />
                        2. Tips for Safe Transactions: Handle buyer shipping information securely to sustain safe and transparent transactions. 
                        <br /><br />
                        3. Protection of Personal Information: As a seller, it is imperative to treat buyer personal information with utmost care. Avoid disclosing it to third parties.We kindly request your strict adherence to these guidelines to uphold transparency and trust in your transactions. Ensuring a secure transaction environment benefits everyone involved. 
                        <br /><br /><br />
                        Thank You</p>

                        <div className='flex items-center justify-center'>
                            <BaseButton title='I Agree' variant='primary' onClick={() => setStep(3)} />
                        </div>
                </div>
            }

            {
                step === 3 && 
                <div className='flex flex-col gap-y-4'>
                    <p className='text-neon text-lg font-medium'>Congratulations!</p>
                    <p>Your NFT is published successfully</p>

                    <div className='flex justify-between'>
                        <div className='py-3 w-[48%] rounded-lg text-black font-semibold bg-light'>
                            <button className='w-full h-full' onClick={() => { }}>View NFT</button>
                        </div>
                        <div className='py-3 w-[48%] rounded-lg text-black font-semibold bg-neon'>
                            <button className='w-full h-full' onClick={() => { }}>Close</button>
                        </div>
                    </div>
                    
                    <div className='p-4 border border-gray-300 rounded-md flex justify-between items-center w-full'>
                        <p>nft url</p>
                        <DocumentDuplicateIcon className='w-6 h-6 fill-[#ddf247]' />
                    </div>
                </div>

            }
        </div>
    )
}
