"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { List } from 'lucide-react';
import Menu from './Menu';
import SideBar from '../ui/SideBar';
import { useEffect, useState } from 'react';
import { createCookie, getCookie } from '@/lib/cookie';
import { WalletAutoConnect } from '../theme-provider';
import { useActiveAccount, useConnectModal } from 'thirdweb/react';
import WalletIcon from '@/components/Icon/WalletIcon';
import { client, wallets } from '@/lib/client';
import { authenticationServices } from '@/services/supplier';
import { Address } from 'thirdweb';
import { checksumAddress } from 'viem';

export default function AppHeader() {
  const [user, setUser] = useState<any>(null);
  const activeAccount = useActiveAccount();
  const { connect } = useConnectModal();

  const handleConnect = async () => {
    const result = await connect({ client, wallets });
    console.log(result)
  }

  const login = async (address: Address) => {
    try {
      const { data } = await authenticationServices.connectWallet({
        wallet: address,
      });
      const connectedUser = data.user;
      const connectedToken = data.token;
      console.log('data', data, connectedUser, connectedToken);
      createCookie('user', JSON.stringify(connectedUser));
      createCookie('token', connectedToken);
      setUser(connectedUser);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (activeAccount?.address) {
      const address = checksumAddress(activeAccount.address) as Address;
      login(address);
    }
  }, [activeAccount]);

  useEffect(() => {
    const connectedUser = JSON.parse(getCookie('user'));
    console.log('connectedUser', connectedUser);
    setUser(connectedUser);
  }, []);
  return (
    <div className="flex justify-between lg:justify-end mt-6 px-3 items-center">
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
          <Menu user={user} />
        ) : (
          <div
            className="max-w-[200px] h-12 px-5 py-3 bg-yellow-300 rounded-xl border border-yellow-300 justify-center items-center gap-2 inline-flex hover:bg-white hover:text-gray-900 cursor-pointer"
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
