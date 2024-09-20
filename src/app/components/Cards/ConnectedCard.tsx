import Image from 'next/image';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
export default function ConnectedCard() {
  const activeAccount = useActiveAccount();

  const activeChain = useActiveWalletChain();
  const address = activeAccount?.address
    ? activeAccount?.address.slice(0, 6) +
    '...' +
    activeAccount?.address.slice(-4)
    : 'Connect Wallet';
  return (
    <>
      <div className="lg:w-full h-[106px] px-10 py-[30px] bg-[#232323] rounded-[15px] border-2 border-dashed	 border-[#3a3a3a] flex justify-between items-center gap-[30px]">
        <div className="flex flex-row items-center gap-5">
          <div>
            <svg
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_717_11946)">
                <path
                  d="M53.4627 27C53.4627 41.6149 41.6149 53.4627 27 53.4627C12.3851 53.4627 0.537297 41.6149 0.537297 27C0.537297 12.3851 12.3851 0.537297 27 0.537297C41.6149 0.537297 53.4627 12.3851 53.4627 27Z"
                  stroke="white"
                  strokeWidth="1.07459"
                />
                <path
                  d="M35.5928 21.4194C34.9702 21.0566 34.1618 21.0566 33.4767 21.4194L28.6184 24.2106L25.3193 26.0297L20.461 28.8191C19.8383 29.1836 19.03 29.1836 18.3449 28.8191L14.4839 26.6355C13.8612 26.2727 13.4258 25.6061 13.4258 24.8771V20.5706C13.4258 19.8433 13.7988 19.1767 14.4839 18.8122L18.2808 16.6894C18.9052 16.3249 19.7152 16.3249 20.4003 16.6894L24.1972 18.8122C24.8215 19.1767 25.2569 19.8433 25.2569 20.5706V23.3617L28.556 21.4802V18.6907C28.5596 18.3284 28.4626 17.9722 28.2758 17.6618C28.089 17.3513 27.8197 17.0988 27.4979 16.9324L20.461 12.9296C19.8383 12.5651 19.03 12.5651 18.3449 12.9296L11.1832 16.9324C10.8613 17.0988 10.592 17.3513 10.4052 17.6618C10.2184 17.9722 10.1215 18.3284 10.1251 18.6907V26.757C10.1251 27.486 10.498 28.1526 11.1832 28.5171L18.3449 32.5198C18.9676 32.8826 19.7776 32.8826 20.461 32.5198L25.3193 29.7894L28.6184 27.9096L33.4767 25.1809C34.0994 24.8164 34.9077 24.8164 35.5928 25.1809L39.3914 27.3037C40.0158 27.6666 40.4495 28.3331 40.4495 29.0621V33.3686C40.4495 34.0959 40.0782 34.7625 39.3914 35.127L35.5945 37.3106C34.9702 37.6751 34.1602 37.6751 33.4767 37.3106L29.6782 35.1877C29.0538 34.8232 28.6184 34.1567 28.6184 33.4294V30.6382L25.3193 32.5198V35.3092C25.3193 36.0366 25.6923 36.7048 26.3774 37.0676L33.5392 41.0704C34.1618 41.4349 34.9702 41.4349 35.6553 41.0704L42.817 37.0676C43.4397 36.7048 43.8751 36.0382 43.8751 35.3092V27.243C43.8787 26.8807 43.7818 26.5245 43.595 26.214C43.4082 25.9036 43.1388 25.6511 42.817 25.4846L35.5945 21.4194H35.5928Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_717_11946">
                  <rect width="54" height="54" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className=" gap-[13px]">
            <p className="text-white text-lg font-extrabold">
              {address ?? 'Connect Wallet'}
            </p>
            <p className="text-gray-400 font-normal">{activeChain?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <button className="bg-transparent px-[16px] py-[14px] rounded-lg text-[#DDF247] bg-[rgba(221, 242, 71, 0.09)] font-bold border">
              Connected
            </button>
          </div>
          <div>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.71967 0.59467C1.01256 0.301777 1.48744 0.301777 1.78033 0.59467L5 3.81434L8.21967 0.59467C8.51256 0.301777 8.98744 0.301777 9.28033 0.59467C9.57322 0.887563 9.57322 1.36244 9.28033 1.65533L5.53033 5.40533C5.23744 5.69822 4.76256 5.69822 4.46967 5.40533L0.71967 1.65533C0.426777 1.36244 0.426777 0.887563 0.71967 0.59467Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
