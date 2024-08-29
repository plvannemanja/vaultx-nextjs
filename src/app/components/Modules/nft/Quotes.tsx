"use client";

import React, { useState } from 'react'
import { trimString } from '@/utils/helpers';

interface IQuotes {
    price: number;
}

export default function Quotes({ nft, fee, contractInfo }: { nft: IQuotes, fee: number, contractInfo: {address: string} }) {
    const [quoteDetail, setQuoteDetail] = useState<any>({
        usdAmount: 0,
        maticAmount: 0,
    });
    const [quoteCount, setQuoteCount] = useState(30);
    const [quotes, setQuotes] = useState(false)

    const checkQuotes = async () => {
    }

    const resetQuote = async () => {
    }


    return (
        <div className='p-3 text-white'>
            <h2 className='text-xl font-medium text-white'>
                Quantity of cryptocurrency required
            </h2>
            <p className='text-sm'>To purchase this artwork, you will need approximately the following amount of cryptocurrency.</p>
            <div className='mt-4 flex justify-between items-center my-3'>
                <span className='text-sm'>Sale Price (USD)</span>
                <span>${quoteDetail.usdAmount}</span>
            </div>
            <div className='p-4 rounded-md border-2 border-dashed border-[#3A3A3A]'>
                <div className='flex mb-3 gap-x-4'>
                    <img src='/icons/matic.png' className='w-10' />
                    <div className=''>
                        <p>Matic <span className='text-sm' style={{
                            color: 'rgba(255, 255, 255, 0.53)'
                        }}>Polygon Network</span></p>
                        <p>{trimString(contractInfo.address)}</p>
                    </div>
                </div>
                <hr />
                <div className='flex flex-col gap-y-4 mt-3'>
                    <div className='flex justify-between'>
                        <span>Cryptocurrency Price</span>
                        <span>{quoteDetail.maticAmount} Matic</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>Estimated Gas fee</span>
                        <span>{quoteDetail.gasFee} Matic</span>
                    </div>
                    <div className='flex items-center justify-center'>
                        <button className='text-white px-4 py-2 rounded-xl bg-[#535353]' disabled={quoteCount > 0}
                            onClick={resetQuote}>
                            {
                                (
                                    quoteCount ? <span>New Quotes in 0:{quoteCount}</span>
                                        : <span>New Quotes</span>
                                )
                            }

                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-between my-3'>
                <span className="text-sm">Marketplace fee</span>
                <span>{quoteDetail.fee}%</span>
            </div>
            <hr />
            <div className='flex justify-between my-3'>
                <span className="text-sm">The expected payment is</span>
                <span>{quoteDetail.expectedAmount} MATIC</span>
            </div>
            <button className='bg-[#DEE8E8] w-full my-3 py-2 text-center rounded-md text-black font-medium' onClick={() => setQuotes(false)}>Close</button>
        </div>
    )
}
