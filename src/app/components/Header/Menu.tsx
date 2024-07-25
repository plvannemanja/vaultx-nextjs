import { client } from '@/app/client';
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
import { useEffect } from 'react';
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useDisconnect,
  useWalletBalance,
  useWalletImage,
  useWalletInfo,
} from 'thirdweb/react';
import { Data, Polygon } from '@3rdweb/chain-icons';
import { WalletId } from 'thirdweb/wallets';
import { shortenAddress } from 'thirdweb/utils';

interface MenuProps {
  user: any;
}

interface WalletDetailProps {
  walletId: WalletId | undefined;
  size: number;
}

const WalletImage = ({ walletId, size }: WalletDetailProps) => {
  const { data: walletImageData } = walletId
    ? useWalletImage(walletId)
    : { data: null, status: false };
  const { data: defaultImageData } =
    useWalletImage('io.metamask');
  if (walletImageData) {
    return (
      <Image
        width={size}
        height={size}
        src={walletImageData}
        alt="wallet_img"
        className="round-lg"
      />
    );
  }

  if (defaultImageData) {
    return (
      <Image
        width={size}
        height={size}
        src={defaultImageData}
        alt="wallet_img"
      />
    );
  }

  return null;
};

export function Menu({ user }: MenuProps) {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const activeChain = useActiveWalletChain();
	const { disconnect } = useDisconnect();
	const {data, isLoading, isError} = useWalletBalance({
		client,
	});
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-[159px] h-12 justify-start items-center gap-3 inline-flex text-white text-sm font-extrabold capitalize cursor-pointer">
          <Image
            className="shrink-0 aspect-square"
            width={40}
            height={40}
            src="/icons/default_profile.svg"
            alt="default_profile"
          />
          <div className="justify-start items-center gap-1.5 flex">
            <div>{user?.username ?? 'Themesflat'}</div>
            <DropdownIcon className="shrink-0 my-auto w-3 aspect-square" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[400px] relative bg-neutral-900 rounded-[20px] shadow !text-base">
        <DropdownMenuLabel>
          <div className="w-[109px] h-12 justify-start items-center gap-3 inline-flex text-white text-sm font-extrabold capitalize cursor-pointer">
            <Image
              className="shrink-0 aspect-square"
              width={40}
              height={40}
              src="/icons/default_profile.svg"
              alt="default_profile"
            />
            <div className="justify-start items-center gap-1.5 flex">
              <div>{user?.username ?? 'Themesflat'}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>My Profile</DropdownMenuItem>
        <DropdownMenuItem>My Favorite</DropdownMenuItem>
        <DropdownMenuItem>My Order</DropdownMenuItem>
        <DropdownMenuItem>
          Language
          <div className="w-[109px] h-8 absolute right-0 justify-start items-center gap-14 inline-flex">
            <div className="text-center text-white font-extrabold font-['Manrope'] capitalize">
              En
            </div>
            <div className="w-[18px] h-[18px] relative">
              <DropdownIcon className="shrink-0 my-auto w-3 aspect-square" />
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Help Center</DropdownMenuItem>
        <DropdownMenuItem>
					<div>
						<div className="w-[368px] mx-auto flex">
							<div className="justify-center w-full items-center">
								<div className="float-left">
									<div className="justify-start items-center gap-5 inline-flex">
										<WalletImage
											walletId={activeWallet?.id}
											size={50}
										></WalletImage>
										<div className="justify-start items-start">
											<div className="opacity-40 text-left text-white text-base font-medium font-manrope capitalize">
												{activeChain?.name}
											</div>
											<div className="text-left text-white text-base font-medium font-manrope capitalize">
												{activeAccount
													? shortenAddress(activeAccount?.address)
													: ''}
											</div>
										</div>
									</div>
								</div>
								<div className="float-right justify-center items-center gap-3 inline-flex my-auto">
									<div className="bg-white bg-opacity-10 rounded-[18px] w-10 h-10 items-center justify-center inline-flex cursor-pointer">
										<Copy size={20}></Copy>
									</div>
									<div className="bg-white bg-opacity-10 rounded-[18px] w-10 h-10 items-center justify-center inline-flex cursor-pointer">
										<Power size={20} onClick={() => {activeWallet && disconnect(activeWallet)}}></Power>
									</div>
								</div>
							</div>
						</div>
						<h3>{JSON.stringify(data)}</h3>
						<div className="w-[368px] h-[86px] pl-[15px] pr-[23px] pt-[23px] rounded-[15px] border border-white border-opacity-5 flex-col justify-end items-start gap-9 inline-flex">
								<div className="self-stretch justify-between items-center inline-flex">
									<div className="justify-start items-center gap-[17px] flex">
										<div className="w-10 h-10 relative">
											<Polygon className="text-white"></Polygon>
										</div>
										<div className="text-center text-white text-base font-extrabold font-manrope capitalize">
											{}Matic
										</div>
									</div>
									<div className="text-center text-neutral-400 text-base font-semibold font-manrope capitalize">
										$448.9
									</div>
								</div>
							</div>
					</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
