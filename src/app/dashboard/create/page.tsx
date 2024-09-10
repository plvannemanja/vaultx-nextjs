'use client';

import CreateCuration from '@/app/components/Modules/CreateCuration';
import CreateNft from '@/app/components/Modules/CreateNft';
import { getMedia, userServices } from '@/services/supplier';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { contract } from '@/lib/contract';
import {
  prepareContractCall,
  sendTransaction,
  readContract,
  resolveMethod,
  prepareEvent,
  getContractEvents,
} from 'thirdweb';
import { useActiveAccount } from 'thirdweb/react';
import { isCurator } from '@/lib/helper';
import { CreateNFTProvider } from '@/app/components/Context/CreateNFTContext';
enum ModalType {
  Curation = 'curation',
  Rwa = 'rwa',
}

export default function Page() {
  // For banner image in the create section
  const [banner, setBanner] = useState({
    image: null,
    link: null,
  });
  const [step, setStep] = useState<any>({
    active: false,
    stage: 1,
    type: null,
  });

  const [hovered, setHovered] = useState<any>(false);

  const activeAccount = useActiveAccount();

  const processModal = (type: string) => {};

  const checkCurator = async (type: 'curation' | 'nft') => {
    let hasAccess = false;
    if (activeAccount) {
      hasAccess = await isCurator(activeAccount?.address);
    }

    // allow set curation to everyone
    hasAccess = true;

    if (!hasAccess) {
      processModal(type);
    } else {
      setStep({
        active: true,
        stage: 1,
        type: type,
      });
    }
  };

  useEffect(() => {
    const fetchMedia = async () => {
      const response = await getMedia();

      if (response && response.mintingBanner) {
        setBanner({
          image: response.mintingBanner.image,
          link: response.mintingBanner.link,
        });
      }
    };

    fetchMedia();
  }, []);

  return (
    <>
      {!step.active && (
        <div className="flex gap-4 px-4 justify-between w-full items-center lg:justify-between">
          <div className="flex flex-col gap-y-10 w-full lg:w-[48%]">
            <div className="flex gap-x-2 items-center">
              <Image
                alt="add"
                height={100}
                width={100}
                src="/images/plus_file.svg"
                className="w-10 h-10"
              />
              <span className="text-2xl font-medium text-neon">Create</span>
            </div>
            <div className="flex flex-col flex-wrap items-center justify-between md:flex-row">
              <div className="flex flex-col gap-y-3 w-full">
                <div
                  className="cursor-pointer w-full flex flex-col gap-y-2 p-5 relative rounded-xl border border-gray-300 bg-dark hover:bg-[#ddf247] hover:text-black text-white"
                  onMouseEnter={() => setHovered("curation")}
                  onMouseLeave={() => setHovered(false)}
                  onClick={async () => await checkCurator('curation')}
                >
                  <svg
                    className="bottom-[2.75rem] right-5 absolute"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#fff"
                  >
                    <path
                      d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>

                  <div className="flex gap-x-4 w-10/12">
                    <Image
                      alt="add"
                      height={100}
                      width={100}
                      src={hovered !== 'curation' ? "/images/create-curation.svg" : "/icons/curation_black.svg"}
                      className="w-8 h-8 hover:fill-black"
                    />
                    <div className="flex flex-col gap-y-2">
                      <span className="text-xl font-bold">
                        Create Curation
                      </span>
                      <p className={`text-sm ${hovered === 'curation' ? 'text-black' : 'text-gray-500'}`}>
                        Become an NFT tastemaker. Create your own Curation for
                        others to mint.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="cursor-pointer w-full flex flex-col gap-y-2 p-5 relative rounded-xl border border-gray-300 bg-dark hover:bg-[#ddf247] hover:text-black text-white"
                  onMouseEnter={() => setHovered("nft")}
                  onMouseLeave={() => setHovered(false)}
                  onClick={async () => await checkCurator('nft')}
                >
                  <svg
                    className="bottom-[2.75rem] right-5 absolute"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#fff"
                  >
                    <path
                      d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>

                  <div className="flex gap-x-4 w-10/12">
                    <Image
                      alt="add"
                      height={100}
                      width={100}
                      src={hovered !== 'nft' ? "/images/create-nft.svg" : "/icons/nft_black.svg"}
                      className="w-8 h-8"
                    />
                    <div className="flex flex-col gap-y-2">
                      <span className="text-xl font-bold">
                        Create Artwork NFTs
                      </span>
                      <p className={`w-[80%] text-sm ${hovered === 'nft' ? 'text-black' : 'text-gray-500'}`}>
                        Transform your art into a collectible, with one simple
                        tap.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="cursor-pointer w-full flex flex-col gap-y-2 p-5 relative rounded-xl border border-gray-300 bg-dark hover:bg-[#ddf247] hover:text-black text-white"
                onMouseEnter={() => setHovered("mint")}
                onMouseLeave={() => setHovered(false)}
                >
                  <svg
                    className="bottom-[2.75rem] right-5 absolute"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#fff"
                  >
                    <path
                      d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>

                  <div className="flex gap-x-4 w-10/12">
                    <Image
                      alt="add"
                      height={100}
                      width={100}
                      src={hovered !== 'mint' ? "/images/mint.png" : "/icons/mint_black.svg"}
                      className="w-8 h-8"
                    />
                    <div className="flex flex-col gap-y-2">
                      <span className="text-xl font-bold">
                        Mint NFTs Using NFC
                      </span>
                      <p className={`w-[80%] text-sm ${hovered === 'mint' ? 'text-black' : 'text-gray-500'}`}>
                        Bridging the physical and digital worlds: Mint NFTs with
                        a tap.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {banner.image && (
            <div
              className="w-full md:w-[49%]"
              onClick={() => {
                window.open(banner.link, '_blank');
              }}
            >
              <img src={banner.image} className="w-full" />
            </div>
          )}
        </div>
      )}
      {step.active && step.type === 'curation' && <CreateCuration />}
      {step.active && step.type === 'nft' && (
        <CreateNFTProvider>
          <CreateNft />
        </CreateNFTProvider>
      )}
    </>
  );
}
