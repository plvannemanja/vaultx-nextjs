import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';

type Props = {
  isRwa?: boolean;
};

export default function ConnectedCard(props: Props) {
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
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.9529 54C41.8906 54 54 41.9117 54 27C54 12.0883 41.8906 0 26.9529 0C12.7809 0 1.15466 10.8808 0 24.7304H35.7501V29.2696H1.94168e-07C1.15466 43.1192 12.7809 54 26.9529 54Z" fill="white" />
            </svg>
          </div>
          <div className=" gap-[13px]">
            <p className="text-white text-lg font-extrabold">
              {address ?? 'Connect Wallet'}
            </p>
            <p className="text-white/[53%] font-normal">{activeChain?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div>
            <button className="px-4 py-3 rounded-xl text-sm text-[#DDF247] bg-[#DDF247]/[0.09] font-bold">
              Connected
            </button>
          </div>
          {props?.isRwa && (
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
          )}
        </div>
      </div>
    </>
  );
}
