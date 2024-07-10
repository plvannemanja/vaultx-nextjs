'use client';
import { client } from '@/app/client';
import Logo from '@/components/Icon/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createThirdwebClient } from 'thirdweb';
import { useWalletDetailsModal, useConnectModal } from 'thirdweb/react';
import { useConnect } from 'thirdweb/react';
import { createWallet, injectedProvider } from 'thirdweb/wallets';
import { Search } from './Search';
import WalletIcon from '@/components/Icon/WalletIcon';

export function BaseHeader() {
  const { connect, isConnecting, error } = useConnect();
  const detailsModal = useWalletDetailsModal();
  const connectModal = useConnectModal();

  function handleDetail() {
    detailsModal.open({ client });
  }

  function handleConnect() {
    connectModal.connect({ client });
  }

  return (
    <header className="flex container gap-1 justify-between items-center self-center px-5 w-full max-md:flex-wrap max-md:max-w-full">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex gap-5 justify-between self-stretch my-auto text-base font-medium text-white max-md:flex-wrap">
        <Link
          className="hover:font-bold hover:cursor-pointer"
          href="/dashboard?appreciate"
        >
          Appreciation
        </Link>
        <Link
          className="hover:font-bold hover:cursor-pointer"
          href="/dashboard?curation"
        >
          Curation
        </Link>
        <Link
          className="hover:font-bold hover:cursor-pointer"
          href="https://artistvaultx.wpcomstaging.com/"
          target="_blank"
        >
          Magazine
        </Link>
        <Link
          className="hover:font-bold hover:cursor-pointer"
          href="https://www.monsterx.io"
          target="_blank"
        >
          How it Works
        </Link>
      </div>
      <div className="flex gap-3.5 self-stretch text-sm max-md:flex-wrap">
        <Search />
        <div
          className="flex gap-2.5 justify-center items-center px-5 py-0.5 font-extrabold capitalize bg-yellow-300 rounded-lg text-neutral-900 max-md:px-5"
          onClick={handleConnect}
        >
          <div className="my-auto">Connect Wallet</div>
          <WalletIcon />
        </div>
      </div>
    </header>
  );
}
