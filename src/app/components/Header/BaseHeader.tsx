'use client';
import { client, wallets } from '@/app/client';
import Logo from '@/components/Icon/Logo';
import Link from 'next/link';
import { useWalletDetailsModal, useConnectModal, useActiveAccount, AutoConnect } from 'thirdweb/react';
import { Search } from './Search';
import WalletIcon from '@/components/Icon/WalletIcon';
import { Address } from 'thirdweb';
import { authenticationServices, userServices } from '@/services/supplier';
import { createCookie } from '@/lib/cookie';
import { useEffect, useState } from 'react';
import { DropdownIcon } from '@/components/Icon/ProfileIcon';
import Image from 'next/image';

export function BaseHeader() {
  const [user, setUser] =useState<any>(null);
  const detailsModal = useWalletDetailsModal();
  const {connect} = useConnectModal();
  const activeAccount = useActiveAccount();

  function handleDetail() {
    detailsModal.open({ client });
  }

  function handleConnect() {
    connect({ client, wallets });
  }

  const login = async (address: Address) => {
    try {
      const {data} =
        await authenticationServices.connectWallet({
          wallet: address,
        })
      createCookie("user", JSON.stringify(data.user))
      createCookie("token", data.token)
      const {
        data: {user}
      } = await userServices.getSingleUser()
      setUser(user);
    } catch (error) {
      console.log({error})
    }
  }

  useEffect(() => {
    if(activeAccount?.address)
      login(activeAccount?.address as Address)
  }, [activeAccount]);

  return (
    <header className="flex container gap-1 justify-between items-center self-center px-5 w-full max-md:flex-wrap max-md:max-w-full">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex gap-5 justify-between self-stretch my-auto text-base font-medium text-white max-md:flex-wrap">
        <Link
          className="hover:font-bold hover:cursor-pointer hover:text-yellow-300"
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
      <div className="flex gap-3.5 self-stretch text-sm max-md:flex-wrap">
        <Search />
        {
         (activeAccount) ? (
          <div className="flex gap-3 text-sm font-extrabold text-white capitalize whitespace-nowrap">
            <Image className="shrink-0 aspect-square" width={40} height={40} src="/icons/default_profile.svg" alt="default_profile"/>
            <div className="flex gap-1.5 px-5 my-auto">
              <div>{user?.username}</div>
              <DropdownIcon className="shrink-0 my-auto w-3 aspect-square" />
            </div>
          </div>
         ) : (
          <div
            className="flex gap-2.5 justify-center items-center px-5 py-0.5 font-extrabold capitalize bg-yellow-300 rounded-lg text-neutral-900 max-md:px-5 cursor-pointer hover:bg-white hover:text-gray-900"
            onClick={handleConnect}
          >
            <div className="my-auto">Connect Wallet</div>
            <WalletIcon />
          </div>
         ) 
        }
        <AutoConnect
          wallets={wallets}
          client={client}
        />
      </div>
    </header>
  );
}
