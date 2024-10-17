'use client';
import { CreateNFTProvider } from '@/app/components/Context/CreateNFTContext';
import { useGlobalContext } from '@/app/components/Context/GlobalContext';
import RestrictiveModal from '@/app/components/Modals/RestrictiveModal';
import Curation from '@/app/components/Modals/content/Curation';
import Rwa from '@/app/components/Modals/content/Rwa';
import CreateCuration from '@/app/components/Modules/CreateCuration';
import CreateNft from '@/app/components/Modules/CreateNft';
import { isCurator } from '@/lib/helper';
import { ensureValidUrl } from '@/utils/helpers';
import Image from 'next/image';
import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';

export default function Page() {
  const { mediaImages } = useGlobalContext();
  const [step, setStep] = useState<any>({
    active: false,
    stage: 1,
    type: null,
  });

  const [hovered, setHovered] = useState<any>(false);
  const [modal, setModal] = useState<any>({
    active: false,
    type: null,
  });

  const activeAccount = useActiveAccount();

  const processModal = (type: string) => {
    setModal({
      active: true,
      type: type,
    });
  };

  const checkCurator = async (type: 'curation' | 'nft') => {
    let hasAccess = false;
    if (activeAccount) {
      hasAccess = await isCurator(activeAccount?.address);
    }

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

  return (
    <>
      <RestrictiveModal
        closeButton={true}
        open={modal.active}
        // open={true}
        onClose={() => setModal({ active: false, type: null })}
      >
        {modal.type === 'curation' && <Curation />}
        {modal.type === 'nft' && <Rwa />}
      </RestrictiveModal>

      {!step.active && (
        <div className="flex px-4 justify-between w-full items-center lg:justify-between ">
          <div className="flex flex-col gap-y-10 w-full lg:w-[48%]">
            <div className="flex gap-x-4 items-center">
              <Image
                alt="add"
                height={100}
                width={100}
                src="/images/plus_file.svg"
                className="w-8 h-8"
              />
              <span className="text-3xl font-medium text-[#DDF247]">
                Create
              </span>
            </div>
            <div className="flex flex-col flex-wrap items-center justify-between md:flex-row ">
              <div className="flex flex-col gap-y-7 w-full">
                <div
                  className="cursor-pointer min-h-[131px] w-full max-w-[615px] flex flex-col gap-y-2 p-6 relative rounded-xl border border-white/[17%] bg-white/5 hover:bg-[#DDF247]  hover:text-black text-white"
                  onMouseEnter={() => setHovered('curation')}
                  onMouseLeave={() => setHovered(false)}
                  onClick={async () => await checkCurator('curation')}
                >
                  <svg
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 hover:fill-black"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#fff hover:fill-black"
                  >
                    <path
                      d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <div className="flex gap-x-4 w-11/12">
                    <Image
                      alt="add"
                      height={100}
                      width={100}
                      src={
                        hovered !== 'curation'
                          ? '/images/create-curation.svg'
                          : '/icons/curation_black.svg'
                      }
                      className="w-8 h-8 hover:fill-black"
                    />
                    <div className="flex flex-col gap-y-2">
                      <span
                        className={`text-[22px] ${hovered === 'curation' ? 'font-bold' : 'font-extrabold'}`}
                      >
                        Create Curation
                      </span>
                      <p
                        className={`w-[100%] azeret-mono-font text-sm ${hovered === 'curation' ? 'text-black' : 'text-[#959595]'}`}
                      >
                        Create your own Curation for becoming a pioneering
                        curator in the Web3 world.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="cursor-pointer flex flex-col gap-y-2 p-6 min-h-[131px] w-full max-w-[615px] relative rounded-xl border border-white/[17%] bg-white/5 hover:bg-[#ddf247] hover:text-black text-white transition-colors duration-200"
                  onMouseEnter={() => setHovered('nft')}
                  onMouseLeave={() => setHovered(false)}
                  onClick={async () => await checkCurator('nft')}
                >
                  <svg
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 hover:fill-black"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#fff hover:fill-black"
                  >
                    <path
                      d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <div className="flex gap-x-4 w-11/12">
                    <Image
                      alt="add"
                      height={100}
                      width={100}
                      src={
                        hovered !== 'nft'
                          ? '/images/create-nft.svg'
                          : '/icons/nft_black.svg'
                      }
                      className="w-8 h-8"
                    />
                    <div className="flex flex-col gap-y-2">
                      <span
                        className={`text-[22px] ${hovered === 'nft' ? 'font-bold' : 'font-extrabold'}`}
                      >
                        Create Artwork NFTs
                      </span>
                      <p
                        className={`w-[100%] azeret-mono-font  text-sm ${hovered === 'nft' ? 'text-black' : 'text-[#959595]'}`}
                      >
                        Transform your art into a RWA, with one simple tap.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="cursor-pointer flex flex-col gap-y-2 p-6 min-h-[131px] w-full max-w-[615px] relative rounded-xl border border-white/[17%] bg-white/5 hover:bg-[#ddf247] hover:text-black text-white transition-colors duration-200"
                  onMouseEnter={() => setHovered('mint')}
                  onMouseLeave={() => setHovered(false)}
                >
                  <svg
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 hover:fill-black"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#fff hover:fill-black"
                  >
                    <path
                      d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>

                  <div className="flex gap-x-4 w-11/12">
                    <Image
                      alt="add"
                      height={100}
                      width={100}
                      src={
                        hovered !== 'mint'
                          ? '/icons/nfc.svg'
                          : '/icons/nfc-hover.svg'
                      }
                      className="w-8 h-8"
                    />
                    <div className="flex flex-col gap-y-2">
                      <span
                        className={`text-[22px] ${hovered === 'mint' ? 'font-bold ' : 'font-extrabold'}`}
                      >
                        NFC-Powered RWA
                      </span>
                      <p
                        className={`w-[100%] azeret-mono-font  text-sm ${hovered === 'mint' ? 'text-black' : 'text-[#959595]'}`}
                      >
                        Digitize physical assets to blockchain entries in
                        minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex min-h-[calc(100vh-88px)] max-h-[calc(100vh-88px)] md:w-[49%] relative">
            {mediaImages?.mintingBanner.image && (
              <a
                href={ensureValidUrl(mediaImages?.mintingBanner.link)}
                target="_blank"
              >
                <Image
                  src={mediaImages?.mintingBanner.image}
                  alt="hero"
                  layout="fill"
                  objectFit="cover"
                ></Image>
              </a>
            )}
          </div>
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
