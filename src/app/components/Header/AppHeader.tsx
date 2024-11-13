'use client';

import dynamic from 'next/dynamic';
import WalletIcon from '@/components/Icon/WalletIcon';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { client, wallets } from '@/lib/client';
import { List } from 'lucide-react';
import { useActiveAccount, useConnectModal } from 'thirdweb/react';
import { useGlobalContext } from '../Context/GlobalContext';
import { WalletAutoConnect } from '../theme-provider';
import SideBar from '../ui/SideBar';
import Menu from './Menu';

export default function AppHeader() {
  const { user } = useGlobalContext();
  const activeAccount = useActiveAccount();
  const { connect } = useConnectModal();

  const MoonPayBuyWidget = dynamic(
    () => import('@moonpay/moonpay-react').then((mod) => mod.MoonPayBuyWidget),
    { ssr: false },
  );

  const handleConnect = async () => {
    const result = await connect({ client, wallets });
    console.log(result);
  };

  return (
    <div className="flex justify-between lg:justify-end px-3 py-4 items-center">
      {/* <PayEmbed client={client} />
      <ConnectButton client={client} /> */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <List size={24} className="my-auto"></List>
          </SheetTrigger>
          <SheetContent side="left" className="bg-dark w-[18rem]">
            <SheetHeader className="text-left">
              <SheetDescription>
                <SideBar className="bg-transparent" />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex gap-3.5 self-stretch text-sm max-md:flex-wrap">
        {activeAccount ? (
          <Menu />
        ) : (
          <div
            className="max-w-[200px] h-12 px-5 py-3 bg-[#DDF247] rounded-xl border border-[#DDF247] justify-center items-center gap-2 inline-flex cursor-pointer"
            onClick={handleConnect}
          >
            <div className="text-neutral-900 text-sm md:text-base font-semibold leading-normal">
              Connect Wallet
            </div>
            <WalletIcon />
          </div>
        )}
      </div>
      <WalletAutoConnect />
    </div>
  );
}
