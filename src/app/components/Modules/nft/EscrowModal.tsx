'use client';

import { useState } from 'react';
import BasicLoadingModal from './BasicLoadingModal';
import { releaseEscrow } from '@/lib/helper';
import { useActiveAccount } from 'thirdweb/react';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { CreateSellService } from '@/services/createSellService';
import { useGlobalContext } from '../../Context/GlobalContext';

export default function EscrowModal({
  onClose,
  fetchNftData,
}: {
  onClose: () => void;
  fetchNftData: () => void;
}) {
  const [step, setStep] = useState(1);
  const { user } = useGlobalContext();
  const { NFTDetail } = useNFTDetail();
  const activeAccount = useActiveAccount();
  const saleService = new CreateSellService();
  const release = async () => {
    try {
      setStep(2);
      const { transactionHash, tokenId } = await releaseEscrow(
        NFTDetail.tokenId,
        activeAccount,
      );
      // add events
      let states = [];
      const escrowState = {
        nftId: NFTDetail._id,
        state: 'Escrow Payment Received',
        from: user._id,
        toWallet: NFTDetail?.owner.wallet,
        to: NFTDetail?.owner,
        actionHash: transactionHash,
        price: NFTDetail.price,
      };
      states.push(escrowState);

      const data = {
        nftId: NFTDetail._id,
        releaseHash: transactionHash,
        states,
      };
      await saleService.release(data);
      fetchNftData();
      setStep(3);
    } catch (error) {
      console.log(error);
      onClose();
    }
  };
  return (
    <>
      {step === 1 ? (
        <div className="w-[34rem] flex flex-col gap-y-4">
          <div className="flex gap-x-3 items-center">
            <img src="/icons/info.svg" className="w-12" />
            <p className="text-lg font-medium">Escrow Release Confirmation</p>
          </div>

          <p>
            <span className="text-lg font-medium">
              Did you receive the physical artwork without any issues?
            </span>
            <br />
            <br />
            When escrow is released, you will receive the NFT created by the
            artist in your wallet, and the purchase price you paid will be
            delivered to the artist.
            <br />
            <br />
            If you have properly received the physical artwork and there were no
            problems during the transaction, click the Escrow Release button
            below to complete the transaction.
          </p>

          <div className="flex justify-between">
            <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-light">
              <button
                className="w-full h-full"
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </button>
            </div>
            <div className="py-3 w-[48%] rounded-lg text-black font-semibold bg-neon">
              <button className="w-full h-full" onClick={() => release()}>
                Escrow Release
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {step === 2 && (
        <BasicLoadingModal message="Please wait while we releasing NFT" />
      )}
      {step === 3 ? (
        <div className="w-[34rem] flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2 justify-center text-center">
            <img src="/icons/success.svg" className="w-16 mx-auto" />
            <p className="text-lg font-medium">Escrow Release Success</p>
          </div>
        </div>
      ) : null}
    </>
  );
}