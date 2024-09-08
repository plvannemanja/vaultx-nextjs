'use client';

import { client } from '@/lib/client';
import { DropdownIcon } from '@/components/Icon/ProfileIcon';
import { Button } from '@/components/ui/button';
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
import { Data, Polygon } from '@3rdweb/chain-icons';
import { WalletId } from 'thirdweb/wallets';
import { shortenAddress } from 'thirdweb/utils';
import { useEffect } from 'react';
import { chain } from '@/lib/contract';

interface MenuProps {
  user: any;
}

interface WalletDetailProps {
  walletId: WalletId;
  size: number;
}
const WalletImage = ({ walletId, size }: WalletDetailProps) => {
  // Always call the hooks unconditionally
  const walletImage = useWalletImage(walletId || 'walletConnect');
  const { data: walletImageData } = walletImage;

  // Fallback image if walletImageData is not available
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
// const WalletImage = ({ walletId: number, size }: WalletDetailProps) => {
//   // if(!walletId) return null;
//   const walletImage = useWalletImage(walletId);
//   // const { data: walletImageData } = walletId
//   //   ? walletImage
//   //   : { data: null, status: false };
//     const { data: walletImageData } = walletImage;

//   const { data: defaultImageData } =     useWalletImage('io.metamask');

//   if (walletImageData) {
//     return (
//       <Image
//         width={size}
//         height={size}
//         src={walletImageData}
//         alt="wallet_img"
//         className="rounded-full"
//       />
//     );
//   }

//   if (defaultImageData) {
//     return (
//       <Image
//         width={size}
//         height={size}
//         src={defaultImageData}
//         alt="wallet_img rounded-full"
//       />
//     );
//   }

//   return null;
// };

export default function Menu({ user }: MenuProps) {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const activeChain = useActiveWalletChain();
  const { disconnect } = useDisconnect();
  const { data, isLoading, isError } = useWalletBalance({
    client,
    address: activeAccount?.address,
    chain: chain,
  });
  useEffect(() => {
    console.log(user);
  }, [user]);
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
        <DropdownMenuItem className="my-1">My Profile</DropdownMenuItem>
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
                  <Copy
                    size={20}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        activeAccount?.address || '',
                      );
                    }}
                  ></Copy>
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
                  <Polygon className="text-white"></Polygon>
                </div>
                <div className="text-center text-white text-base font-extrabold capitalize">
                  {}Matic
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
