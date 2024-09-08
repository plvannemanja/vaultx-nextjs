"use client";

import { useState } from "react";

export default function EscrowModal() {
    const [step, setStep] = useState(1);

    return (
        <>
            {
                step === 1 ?
                    <div className="w-[34rem] flex flex-col gap-y-4">
                        <div className="flex gap-x-3 items-center">
                            <img src="/icons/info.svg" className="w-12" />
                            <p className='text-lg font-medium'>Escrow Release Confirmation</p>
                        </div>

                        <p>
                            <span className="text-lg font-medium">
                                Did you receive the physical artwork without any issues?
                            </span>

                            <br /><br />

                            When escrow is released, you will receive the NFT created by the artist in your wallet, and the purchase price you paid will be delivered to the artist.
                            <br /><br />
                            If you have properly received the physical artwork and there were no problems during the transaction, click the Escrow Release button below to complete the transaction.
                        </p>

                        <div className='flex justify-between'>
                            <div className='py-3 w-[48%] rounded-lg text-black font-semibold bg-light'>
                                <button className='w-full h-full' onClick={() => { }}>Cancel</button>
                            </div>
                            <div className='py-3 w-[48%] rounded-lg text-black font-semibold bg-neon'>
                                <button className='w-full h-full' onClick={() => setStep(2)}>Escrow Release</button>
                            </div>
                        </div>
                    </div> : null
            }
            {
                step === 2 ?
                    <div className='w-[34rem] flex flex-col gap-y-4'>
                        <div className='flex flex-col gap-y-2 justify-center text-center'>
                            <img src='/icons/success.svg' className='w-16 mx-auto' />
                            <p className='text-lg font-medium'>Escrow Release Success</p>
                        </div>
                    </div> : null
            }
        </>

    )
}
