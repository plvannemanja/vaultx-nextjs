'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function EscrowRequestModal() {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');

  const releseEscrowRequest = async () => {
    // API call
    try {
      setStep(2);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[34rem]">
      {step === 1 && (
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-3">
            <img src="/icons/receipt.svg" className="w-12" />
            <p className="text-lg font-medium">Escrow Release Request</p>
          </div>

          <p>
            We are sad to see your Escrow Release request! However, please be
            informed that cancellations due to a change of mind are not in our
            terms and conditions. But if you have other reasons like shipping
            delays, product defects, and more, your cancellation request may be
            approved.
            <br />
            <br />
            Kindly explain the reasons for your cancellation in the field down
            below. After careful review, we will contact you with further
            details through the email and messenger ID that you provided. We
            value your feedback as it helps us deliver the best possible
            service. Thank You!
          </p>

          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-none bg-[#161616]"
                placeholder="Please describe your product"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
              <button className="w-full h-full" onClick={() => {}}>
                Cancel
              </button>
            </div>
            <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
              <button
                className="w-full h-full"
                onClick={async () => await releseEscrowRequest()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex w-full justify-center flex-col gap-y-4 text-center">
          <img src="/icons/success.svg" className="w-16 mx-auto" />
          <p className="text-lg font-medium">Application Success</p>
          <p className="text-gray-500">
            Your Request to release escrow request has been successfully
            received. We will carefully review it and contact you as soon as
            possible. Thank you for your patience.
          </p>
        </div>
      )}
    </div>
  );
}
