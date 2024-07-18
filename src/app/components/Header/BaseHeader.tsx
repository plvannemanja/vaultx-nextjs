'use client';
import { client, wallets } from '@/app/client';
import Logo from '@/components/Icon/Logo';
import Link from 'next/link';
import {
  useWalletDetailsModal,
  useConnectModal,
  useActiveAccount,
  AutoConnect,
} from 'thirdweb/react';
import { Search } from './Search';
import WalletIcon from '@/components/Icon/WalletIcon';
import { Address } from 'thirdweb';
import { authenticationServices, userServices } from '@/services/supplier';
import { createCookie } from '@/lib/cookie';
import { useEffect, useState } from 'react';
import { DropdownIcon } from '@/components/Icon/ProfileIcon';
import Image from 'next/image';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function BaseHeader() {
  const [user, setUser] = useState<any>(null);
  const detailsModal = useWalletDetailsModal();
  const { connect } = useConnectModal();
  const activeAccount = useActiveAccount();

  function handleDetail() {
    detailsModal.open({ client });
  }

  function handleConnect() {
    connect({ client, wallets });
  }

  const login = async (address: Address) => {
    try {
      const { data } = await authenticationServices.connectWallet({
        wallet: address,
      });
      createCookie('user', JSON.stringify(data.user));
      createCookie('token', data.token);
      const {
        data: { user },
      } = await userServices.getSingleUser();
      setUser(user);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (activeAccount?.address) login(activeAccount?.address as Address);
  }, [activeAccount]);

  return (
    <header className="container h-[52px] my-4 gap-1 justify-between items-center inline-flex">
      <div className='h-8 relative inline-flex gap-1.5'>
        <div className='hidden max-xl:block'>
          <Sheet>
            <SheetTrigger asChild>
              <List size={24}></List>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <input id="name" value="Pedro Duarte" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <input id="username" value="@peduarte" className="col-span-3" />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className='hidden xl:block'>
        <div className="justify-start items-center gap-10 flex text-base text-white font-manrope">
          <Link
            className="hover:font-bold hover:cursor-pointer hover:text-yellow-300 gap-1.5"
            href="/dashboard?appreciate"
          >
            Appreciation
          </Link>
          <Link
            className="hover:font-bold hover:cursor-pointer hover:text-yellow-300"
            href="/dashboard?curation"
          >
            Curation
          </Link>
          <Link
            className="hover:font-bold hover:cursor-pointer hover:text-yellow-300"
            href="https://artistvaultx.wpcomstaging.com/"
            target="_blank"
          >
            Magazine
          </Link>
          <Link
            className="hover:font-bold hover:cursor-pointer hover:text-yellow-300"
            href="https://www.monsterx.io"
            target="_blank"
          >
            How it Works
          </Link>
        </div>
      </div>

      <Search />
      <div className="flex gap-3.5 self-stretch text-sm max-md:flex-wrap">
        {activeAccount ? (
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
        ) : (
          <div
            className="w-[187px] h-12 px-5 py-3 bg-yellow-300 rounded-xl border border-yellow-300 justify-center items-center gap-2 inline-flex hover:bg-white hover:text-gray-900 cursor-pointer"
            onClick={handleConnect}
          >
            <div className="text-neutral-900 text-base font-semibold font-['Manrope'] leading-normal">Connect Wallet</div>
            <WalletIcon />
          </div>
        )}
        <AutoConnect wallets={wallets} client={client} />
      </div>
    </header>
  );
}
