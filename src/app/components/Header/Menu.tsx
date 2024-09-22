'use client';

import { client } from '@/lib/client';
import { DropdownIcon } from '@/components/Icon/ProfileIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Power } from 'lucide-react';
import Image from 'next/image';
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useDisconnect,
  useWalletBalance,
  useWalletImage,
} from 'thirdweb/react';
import { TokenIcon } from '@web3icons/react';
import { WalletId } from 'thirdweb/wallets';
import { useEffect, useState } from 'react';
import { chain } from '@/lib/contract';
import { useGlobalContext } from '../Context/GlobalContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { debug } from 'console';
import { useRouter } from 'next/navigation';


interface WalletDetailProps {
  walletId: WalletId;
  size: number;
}
const WalletImage = ({ walletId, size }: WalletDetailProps) => {
  // Always call the hooks unconditionally
  const walletImage = useWalletImage(walletId || 'walletConnect');
  const { data: walletImageData } = walletImage;

  const { data: defaultImageData } = useWalletImage('io.metamask');

  const imageData = walletImageData || defaultImageData;

  if (imageData) {
    return (
      <Image
        width={size}
        height={size}
        src={imageData}
        alt="wallet_img"
        className="rounded-full"
      />
    );
  }

  return null;
};

export default function Menu() {
  const [copied, setCopied] = useState(false);
  const [copyDelayed, setCopyDelayed] = useState(false);
  const [copyHover, setCopyHover] = useState(false);
  const { user } = useGlobalContext();
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const activeChain = useActiveWalletChain();
  const { disconnect } = useDisconnect();
  const { data, isLoading, isError } = useWalletBalance({
    client,
    address: activeAccount?.address,
    chain: chain,
  });

  const router = useRouter();
  useEffect(() => {
    console.log(user);
  }, [user]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(activeAccount?.address);
      setCopied(true);
      setCopyDelayed(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setCopyDelayed(false), 2500);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-[159px] h-12 justify-start items-center gap-3 inline-flex text-white text-sm font-extrabold capitalize cursor-pointer">
          <Image
            className="shrink-0 rounded-full object-cover w-10 h-10"
            width={40}
            height={40}
            src={
              user?.avatar?.url ? user.avatar.url : '/icons/default_profile.svg'
            }
            alt="user_profile"
          />
          <div className="justify-start items-center gap-1.5 flex">
            <div>{user?.username ?? 'Themesflat'}</div>
            <DropdownIcon className="shrink-0 my-auto w-3 aspect-square" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[325px] p-4 relative bg-neutral-900 rounded-[20px] shadow !text-base">
        <DropdownMenuLabel>
          <div className="w-[109px] h-12 justify-start items-center gap-3 inline-flex text-white text-sm font-extrabold capitalize cursor-pointer">
            <Image
              className="shrink-0 rounded-full object-cover h-10 w-10"
              width={40}
              height={40}
              src={
                user?.avatar?.url
                  ? user.avatar.url
                  : '/icons/default_profile.svg'
              }
              alt="default_profile"
            />
            <div className="justify-start items-center gap-1.5 flex">
              <div>{user?.username ?? 'Themesflat'}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="my-1" onSelect={(event: Event) => {
          router.push('/dashboard/profile');
        }}>My Profile</DropdownMenuItem>
        <DropdownMenuItem className="my-1">My Favorite</DropdownMenuItem>
        <DropdownMenuItem className="my-1">My Order</DropdownMenuItem>
        <DropdownMenuItem className="my-1">
          Language
          <div className="w-[109px] h-8 absolute right-0 justify-start items-center gap-14 inline-flex">
            <div className="text-center text-white font-extrabold capitalize">
              En
            </div>
            <div className="relative w-4">
              <DropdownIcon className="shrink-0 my-auto w-3 aspect-square" />
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Help Center</DropdownMenuItem>
        <div className="w-full mt-4">
          <div className="mx-auto flex">
            <div className="justify-center w-full items-center">
              <div className="float-left">
                <div className="justify-start items-center gap-5 inline-flex">
                  <WalletImage
                    walletId={activeWallet?.id || 'walletConnect'}
                    size={50}
                  ></WalletImage>
                  <div className="justify-start items-start">
                    <div className="opacity-40 text-left text-white text-base font-medium capitalize">
                      {activeChain?.name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="float-right justify-center items-center gap-3 inline-flex my-auto">
                <div className="bg-white bg-opacity-10 rounded-[18px] w-10 h-10 items-center justify-center inline-flex cursor-pointer hover:bg-gray-500">
                  <TooltipProvider>
                    <Tooltip open={copyHover || copied}>
                      <TooltipTrigger >
                        <Copy
                          size={20}
                          onMouseEnter={() => { setCopyHover(true) }}
                          onMouseLeave={() => { setCopyHover(false) }}
                          onClick={() => { copyText() }}
                        ></Copy>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copyDelayed ? 'Copied' : 'Click to copy'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="bg-white bg-opacity-10 rounded-[18px] w-10 h-10 items-center justify-center inline-flex cursor-pointer hover:bg-gray-500">
                  <Power
                    size={20}
                    onClick={() => {
                      activeWallet && disconnect(activeWallet);
                      window.location.href = '/';
                    }}
                  ></Power>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 mt-3 w-full rounded-lg border border-white border-opacity-5 flex-col justify-end items-start gap-9 inline-flex">
            <div className="self-stretch justify-between items-center inline-flex">
              <div className="justify-start items-center gap-[17px] flex">
                <div className="w-5 h-5 relative">
                  <TokenIcon symbol='base' className='text-white'></TokenIcon>
                </div>
                <div className="text-center text-white text-base font-extrabold capitalize">
                  {` ${activeChain.nativeCurrency?.symbol}`}
                </div>
              </div>
              <div className="text-center text-neutral-400 text-base font-semibold capitalize">
                {data
                  ? Number(
                    Number(data?.value) /
                    Math.pow(10, Number(data?.decimals)),
                  ).toFixed(2)
                  : 0}
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
