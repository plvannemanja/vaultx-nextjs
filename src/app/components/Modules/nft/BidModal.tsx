import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import BaseButton from '../../ui/BaseButton';

export default function BidModal({
  title,
  update,
}: {
  title: string;
  update: (data: number) => void;
}) {
  const [value, setValue] = useState(0);
  const cancelChanges = () => {
    close();
  };

  return (
    <div className="flex flex-col gap-y-5 w-[24rem]">
      <Label className="text-lg font-medium">Place Bid</Label>
      <p>You are about to bid on {title}</p>

      {/* Wallet part */}

      <div className="flex flex-col gap-y-2">
        <Label>Price</Label>
        <Input
          placeholder="Price"
          className="w-full"
          type="number"
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-x-4 justify-center my-3 px-4">
        <BaseButton
          title="Cancel"
          variant="secondary"
          onClick={cancelChanges}
        />
        <BaseButton
          title="Next"
          variant="primary"
          onClick={() => update(value)}
        />
      </div>
    </div>
  );
}
