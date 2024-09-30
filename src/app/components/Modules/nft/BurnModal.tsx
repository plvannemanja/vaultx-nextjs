import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import BaseButton from '../../ui/BaseButton';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { burnNFT } from '@/lib/helper';
import { useActiveAccount } from 'thirdweb/react';
import NftServices from '@/services/nftService';
import { useRouter } from 'next/navigation';

export default function BurnModal({ onClose }: { onClose: () => void; }) {
  const { NFTDetail, nftId } = useNFTDetail();
  const activeAccount = useActiveAccount();
  const router = useRouter();
  const nftService = new NftServices();


  const handleBurn = async () => {
    try {
      if (NFTDetail?.minted === true) {
        await burnNFT(NFTDetail.tokenId, activeAccount);
      }
      await nftService.deleteNftDb({ nftId });
      router.push('/dashboard/appreciate');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col gap-y-5 w-full">
      <Label className="text-lg font-medium">Do you really want to burn this RWA?</Label>
      <p>Burning token will destroy/delete the token from contract permanently. You will not find this token anywhere.</p>

      <div className="flex gap-x-4 justify-center my-3 px-4">
        <BaseButton
          title="Confirm"
          variant="primary"
          onClick={() => { }}
        />
        <BaseButton
          title="Cancel"
          variant="secondary"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
