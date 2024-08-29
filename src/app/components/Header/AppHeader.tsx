'use client';
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
import { getCookie } from '@/lib/cookie';
import { client, wallets } from '@/app/client';
import Logo from '@/components/Icon/Logo';
import Link from 'next/link';
import {
  useWalletDetailsModal,
  useConnectModal,
  useActiveAccount,
  AutoConnect,
  ConnectButton,
} from 'thirdweb/react';
import { Search } from './Search';
import WalletIcon from '@/components/Icon/WalletIcon';
import { Address } from 'thirdweb';
import { authenticationServices, userServices } from '@/services/supplier';
import { createCookie } from '@/lib/cookie';
export default function AppHeader() {
  const [user, setUser] = useState<any>(null);
  const detailsModal = useWalletDetailsModal();
  const { connect } = useConnectModal();
  const activeAccount = useActiveAccount();
  function handleConnect() {
    connect({ client, wallets });
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
  // const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   const connectedUser = JSON.parse(getCookie('user'));
  //   console.log('connectedUser', connectedUser);
  //   setUser(connectedUser);
  // }, []);
  return (
    // <div className="flex justify-between lg:justify-end mt-6 px-3 items-center">
    //   <div className="lg:hidden">
    //     <Sheet>
    //       <SheetTrigger asChild>
    //         <List size={24} className="my-auto"></List>
    //       </SheetTrigger>
    //       <SheetContent side="left" className="bg-dark w-[18rem]">
    //         <SheetHeader className="text-left">
    //           <SheetDescription>
    //             <SideBar className="bg-transparent" />
    //           </SheetDescription>
    //         </SheetHeader>
    //       </SheetContent>
    //     </Sheet>
    //   </div>

    //   <Menu user={user} />
    // </div>

    <header className="container h-[52px] my-4 gap-1 justify-between items-center inline-flex px-4">
      <div className="hidden xl:block"></div>

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
        <AutoConnect wallets={wallets} client={client} timeout={10000} />
        {/* <ConnectButton
          client={client}
          appMetadata={{
            name: 'Monster App',
            url: 'https://tadmin.vault-x.io',
          }}
        /> */}
      </div>
    </header>
  );
}
