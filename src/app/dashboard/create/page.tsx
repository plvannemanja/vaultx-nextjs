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
import RestrictiveModal from '@/app/components/Modals/RestrictiveModal';
import Curation from '@/app/components/Modals/content/Curation';
import Rwa from '@/app/components/Modals/content/Rwa';

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
        <div className="flex  px-4 justify-between w-full items-center lg:justify-between ">
          <div className="flex flex-col gap-y-10 w-full lg:w-[48%]">
            <div className="flex gap-x-2 items-center">
              <Image
                alt="add"
                height={100}
                width={100}
                src="/images/plus_file.svg"
                className="w-10 h-10"
              />
            <svg xmlns="http://www.w3.org/2000/svg" width="98" height="24" viewBox="0 0 98 24" fill="none">
              <path d="M90.433 23.1664C88.793 23.1664 87.353 22.8114 86.113 22.1014C84.873 21.3914 83.903 20.4064 83.203 19.1464C82.513 17.8864 82.168 16.4364 82.168 14.7964C82.168 13.0264 82.508 11.4914 83.188 10.1914C83.868 8.88141 84.813 7.86641 86.023 7.14641C87.233 6.42641 88.633 6.06641 90.223 6.06641C91.903 6.06641 93.328 6.46141 94.498 7.25141C95.678 8.03141 96.553 9.13641 97.123 10.5664C97.693 11.9964 97.908 13.6814 97.768 15.6214H94.183V14.3014C94.173 12.5414 93.863 11.2564 93.253 10.4464C92.643 9.63641 91.683 9.23141 90.373 9.23141C88.893 9.23141 87.793 9.69141 87.073 10.6114C86.353 11.5214 85.993 12.8564 85.993 14.6164C85.993 16.2564 86.353 17.5264 87.073 18.4264C87.793 19.3264 88.843 19.7764 90.223 19.7764C91.113 19.7764 91.878 19.5814 92.518 19.1914C93.168 18.7914 93.668 18.2164 94.018 17.4664L97.588 18.5464C96.968 20.0064 96.008 21.1414 94.708 21.9514C93.418 22.7614 91.993 23.1664 90.433 23.1664ZM84.853 15.6214V12.8914H95.998V15.6214H84.853Z" fill="#DDF247"/>
              <path d="M80.4053 22.7166C79.3353 22.9166 78.2853 23.0016 77.2553 22.9716C76.2353 22.9516 75.3203 22.7666 74.5103 22.4166C73.7003 22.0566 73.0854 21.4916 72.6654 20.7216C72.2954 20.0216 72.1003 19.3066 72.0803 18.5766C72.0603 17.8466 72.0503 17.0216 72.0503 16.1016V2.0166H75.6504V15.8916C75.6504 16.5416 75.6554 17.1116 75.6654 17.6016C75.6854 18.0916 75.7903 18.4916 75.9803 18.8016C76.3403 19.4016 76.9154 19.7366 77.7054 19.8066C78.4954 19.8766 79.3953 19.8366 80.4053 19.6866V22.7166ZM69.1104 9.3516V6.5166H80.4053V9.3516H69.1104Z" fill="#DDF247"/>
              <path d="M58.1546 23.1664C56.9846 23.1664 55.9946 22.9464 55.1846 22.5064C54.3746 22.0564 53.7596 21.4614 53.3396 20.7214C52.9296 19.9814 52.7246 19.1664 52.7246 18.2764C52.7246 17.4964 52.8546 16.7964 53.1146 16.1764C53.3746 15.5464 53.7746 15.0064 54.3146 14.5564C54.8546 14.0964 55.5546 13.7214 56.4146 13.4314C57.0646 13.2214 57.8246 13.0314 58.6946 12.8614C59.5746 12.6914 60.5246 12.5364 61.5446 12.3964C62.5746 12.2464 63.6496 12.0864 64.7696 11.9164L63.4796 12.6514C63.4896 11.5314 63.2396 10.7064 62.7296 10.1764C62.2196 9.64641 61.3596 9.38141 60.1496 9.38141C59.4196 9.38141 58.7146 9.55141 58.0346 9.89141C57.3546 10.2314 56.8796 10.8164 56.6096 11.6464L53.3096 10.6114C53.7096 9.24141 54.4696 8.14141 55.5896 7.31141C56.7196 6.48141 58.2396 6.06641 60.1496 6.06641C61.5896 6.06641 62.8546 6.30141 63.9446 6.77141C65.0446 7.24141 65.8596 8.01141 66.3896 9.08141C66.6796 9.65141 66.8546 10.2364 66.9146 10.8364C66.9746 11.4264 67.0046 12.0714 67.0046 12.7714V22.7164H63.8396V19.2064L64.3646 19.7764C63.6346 20.9464 62.7796 21.8064 61.7996 22.3564C60.8296 22.8964 59.6146 23.1664 58.1546 23.1664ZM58.8746 20.2864C59.6946 20.2864 60.3946 20.1414 60.9746 19.8514C61.5546 19.5614 62.0146 19.2064 62.3546 18.7864C62.7046 18.3664 62.9396 17.9714 63.0596 17.6014C63.2496 17.1414 63.3546 16.6164 63.3746 16.0264C63.4046 15.4264 63.4196 14.9414 63.4196 14.5714L64.5296 14.9014C63.4396 15.0714 62.5046 15.2214 61.7246 15.3514C60.9446 15.4814 60.2746 15.6064 59.7146 15.7264C59.1546 15.8364 58.6596 15.9614 58.2296 16.1014C57.8096 16.2514 57.4546 16.4264 57.1646 16.6264C56.8746 16.8264 56.6496 17.0564 56.4896 17.3164C56.3396 17.5764 56.2646 17.8814 56.2646 18.2314C56.2646 18.6314 56.3646 18.9864 56.5646 19.2964C56.7646 19.5964 57.0546 19.8364 57.4346 20.0164C57.8246 20.1964 58.3046 20.2864 58.8746 20.2864Z" fill="#DDF247"/>
              <path d="M43.2357 23.1664C41.5957 23.1664 40.1557 22.8114 38.9157 22.1014C37.6757 21.3914 36.7057 20.4064 36.0057 19.1464C35.3157 17.8864 34.9707 16.4364 34.9707 14.7964C34.9707 13.0264 35.3107 11.4914 35.9907 10.1914C36.6707 8.88141 37.6157 7.86641 38.8257 7.14641C40.0357 6.42641 41.4357 6.06641 43.0257 6.06641C44.7057 6.06641 46.1307 6.46141 47.3007 7.25141C48.4807 8.03141 49.3557 9.13641 49.9257 10.5664C50.4957 11.9964 50.7107 13.6814 50.5707 15.6214H46.9857V14.3014C46.9757 12.5414 46.6657 11.2564 46.0557 10.4464C45.4457 9.63641 44.4857 9.23141 43.1757 9.23141C41.6957 9.23141 40.5957 9.69141 39.8757 10.6114C39.1557 11.5214 38.7957 12.8564 38.7957 14.6164C38.7957 16.2564 39.1557 17.5264 39.8757 18.4264C40.5957 19.3264 41.6457 19.7764 43.0257 19.7764C43.9157 19.7764 44.6807 19.5814 45.3207 19.1914C45.9707 18.7914 46.4707 18.2164 46.8207 17.4664L50.3907 18.5464C49.7707 20.0064 48.8107 21.1414 47.5107 21.9514C46.2207 22.7614 44.7957 23.1664 43.2357 23.1664ZM37.6557 15.6214V12.8914H48.8007V15.6214H37.6557Z" fill="#DDF247"/>
              <path d="M24.1816 22.7165V6.51652H27.3766V10.4615L26.9866 9.95153C27.1866 9.41153 27.4516 8.92152 27.7816 8.48152C28.1216 8.03152 28.5266 7.66153 28.9966 7.37153C29.3966 7.10153 29.8366 6.89152 30.3166 6.74152C30.8066 6.58152 31.3066 6.48652 31.8166 6.45652C32.3266 6.41652 32.8216 6.43652 33.3016 6.51652V9.89152C32.8216 9.75152 32.2666 9.70652 31.6366 9.75652C31.0166 9.80652 30.4566 9.98152 29.9566 10.2815C29.4566 10.5515 29.0466 10.8965 28.7266 11.3165C28.4166 11.7365 28.1866 12.2165 28.0366 12.7565C27.8866 13.2865 27.8116 13.8615 27.8116 14.4815V22.7165H24.1816Z" fill="#DDF247"/>
              <path d="M11.168 23.1665C9.00801 23.1665 7.15801 22.6965 5.61801 21.7565C4.07801 20.8065 2.89301 19.4865 2.06301 17.7965C1.24301 16.1065 0.833008 14.1465 0.833008 11.9165C0.833008 9.6865 1.24301 7.7265 2.06301 6.0365C2.89301 4.3465 4.07801 3.0315 5.61801 2.0915C7.15801 1.1415 9.00801 0.666504 11.168 0.666504C13.658 0.666504 15.733 1.2915 17.393 2.5415C19.053 3.7815 20.218 5.4565 20.888 7.5665L17.243 8.5715C16.823 7.1615 16.108 6.0615 15.098 5.2715C14.088 4.4715 12.778 4.0715 11.168 4.0715C9.71801 4.0715 8.50801 4.3965 7.53801 5.0465C6.57801 5.6965 5.85301 6.6115 5.36301 7.7915C4.88301 8.9615 4.63801 10.3365 4.62801 11.9165C4.62801 13.4965 4.86801 14.8765 5.34801 16.0565C5.83801 17.2265 6.56801 18.1365 7.53801 18.7865C8.50801 19.4365 9.71801 19.7615 11.168 19.7615C12.778 19.7615 14.088 19.3615 15.098 18.5615C16.108 17.7615 16.823 16.6615 17.243 15.2615L20.888 16.2665C20.218 18.3765 19.053 20.0565 17.393 21.3065C15.733 22.5465 13.658 23.1665 11.168 23.1665Z" fill="#DDF247"/>
            </svg>            </div>
            <div className="flex flex-col flex-wrap items-center justify-between md:flex-row ">
              <div className="flex flex-col gap-y-7 w-full">
                <div
                  className="cursor-pointer min-h-[131px] w-full max-w-[615px] flex flex-col gap-y-2 p-6 relative rounded-xl border border-[#FFFFFF2B] bg-white/5 hover:bg-[#DDF247]  hover:text-black text-white"
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
                      <span className={`text-[22px] ${hovered === 'curation' ? 'font-bold ': 'font-extrabold'}`}>Create Curation</span>
                      <p
                        className={`w-[100%] font-azeret-mono azeret-mono-font  text-sm ${hovered === 'curation' ? 'text-black' : 'text-[#959595]'}`}

                        // className={`text-sm ${hovered === 'curation' ? 'text-black' : 'text-gray-500'}`}
                      >
                        {/* Become an NFT tastemaker. Create your own Curation for
                        others to mint. */}
                        Create your own Curation for becoming a pioneering curator in the Web3 world.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="cursor-pointer min-h-[131px] w-full max-w-[615px] flex flex-col gap-y-2 p-6 relative rounded-xl border border-[#FFFFFF2B] bg-white/5 hover:bg-[#ddf247] hover:text-black text-white"
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
                    <span className={`text-[22px] ${hovered === 'nft' ? 'font-bold': 'font-extrabold'}`}>
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
                  className="cursor-pointer min-h-[131px] w-full max-w-[615px] flex flex-col gap-y-2 p-6 relative rounded-xl border border-[#FFFFFF2B] bg-white/5 hover:bg-[#ddf247] hover:text-black text-white"
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
                    <span className={`text-[22px] ${hovered === 'mint' ? 'font-bold ': 'font-extrabold'}`}>
                        NFC-Powered RWA
                      </span>
                      <p
                      
                      className={`w-[100%] azeret-mono-font  text-sm ${hovered === 'mint' ? 'text-black' : 'text-[#959595]'}`}

                        // className={`w-[80%] text-sm ${hovered === 'mint' ? 'text-black' : 'text-gray-500'}`}
                      >
                        Digitize physical assets to blockchain entries in minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex min-h-[calc(100vh-88px)] max-h-[calc(100vh-88px)]  md:w-[49%]">
          {banner.image && (
            <div
              className="w-full"
              onClick={() => {
                window.open(banner.link, '_blank');
              }}
            >
              <img src={banner.image} className="w-full max-h-[100%]" />
            </div>
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
