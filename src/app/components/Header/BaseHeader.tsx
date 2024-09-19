'use client';
import { client, wallets } from '@/lib/client';
import Logo from '@/components/Icon/Logo';
import Link from 'next/link';
import {
  useWalletDetailsModal,
  useConnectModal,
  useActiveAccount,
} from 'thirdweb/react';
import { Search } from './Search';
import WalletIcon from '@/components/Icon/WalletIcon';
import { Address } from 'thirdweb';
import { authenticationServices, userServices } from '@/services/supplier';
import { createCookie } from '@/lib/cookie';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { List } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Menu from './Menu';
import { useRouter } from 'next/navigation';
import { WalletAutoConnect } from '../theme-provider';
import { checksumAddress } from 'viem';

const socials = [
  {
    link: '',
    image: '/icons/facebook-tag.svg',
  },
  {
    link: '',
    image: '/icons/linkedin.svg',
  },
  {
    link: '',
    image: '/icons/tiktok.svg',
  },
  {
    link: '',
    image: '/icons/instagram.svg',
  },
  {
    link: '',
    image: '/icons/youtube.svg',
  },
];

export function BaseHeader() {
  const [user, setUser] = useState<any>(null);
  const detailsModal = useWalletDetailsModal();
  const { connect } = useConnectModal();
  const activeAccount = useActiveAccount();
  const router = useRouter();

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

  return (
    <header className="container h-[52px] my-4 gap-1 justify-between items-center inline-flex px-4">
      <div className="flex gap-x-4 items-center">
        <div className="h-8 relative inline-flex gap-1.5 top-1">
          <div className="hidden max-xl:block">
            <Sheet>
              <SheetTrigger asChild>
                <List size={24} className="my-auto"></List>
              </SheetTrigger>
              <SheetContent side="left" className="bg-dark">
                <SheetHeader className="text-left space-y-10">
                  <SheetTitle>VaultX</SheetTitle>
                  <SheetDescription>
                    <div className="flex flex-col gap-y-4 text-white">
                      <Link href="/dashboard/appreciate">
                        <Label className="text-sm">Appreciation</Label>
                      </Link>

                      <Link href="/dashboard/curation">
                        <Label className="text-sm">Curation</Label>
                      </Link>

                      <Link
                        href="https://artistvaultx.wpcomstaging.com/"
                        target="_blank"
                      >
                        <Label className="text-sm">Magazine</Label>
                      </Link>

                      <Label className="text-sm">Artist</Label>
                    </div>
                    <hr className="my-4 bg-white" />
                    <Label className="text-sm text-white">How to work</Label>
                    <div className="flex mt-4 gap-3.5 self-stretch text-sm max-md:flex-wrap">
                      {activeAccount ? (
                        <Menu user={user} />
                      ) : (
                        <div
                          className="max-w-[200px] h-12 px-5 py-3 bg-[#DDF247] rounded-xl border border-[#DDF247] justify-center items-center gap-2 inline-flex hover:bg-white hover:text-gray-900 cursor-pointer"
                          onClick={handleConnect}
                        >
                          <div className="text-neutral-900 text-sm md:text-base font-semibold leading-normal">
                            Connect Wallet
                          </div>
                          <WalletIcon />
                        </div>
                      )}
                    </div>
                    {/* <div className="flex gap-x-2 my-4">
                      {socials.map((social, index) => {
                        return (
                          <Link key={index} href={social.link} target="_blank">
                            <img
                              src={social.image}
                              className="w-6 fill-white stroke-white"
                            />
                          </Link>
                        );
                      })}
                    </div> */}
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="hidden xl:block">
        <div className="justify-start items-center gap-8 flex text-base text-white">
          <Link
            className="hover:font-bold hover:cursor-pointer hover:text-[#DDF247] gap-1.5"
            href="/dashboard/appreciate"
          >
            Appreciation
          </Link>
          <Link
            className="hover:font-bold hover:cursor-pointer hover:text-[#DDF247]"
            href="/dashboard/curation"
          >
            Curation
          </Link>
          <Link
            className="hover:font-bold hover:cursor-pointer hover:text-[#DDF247]"
            href="https://artistvaultx.wpcomstaging.com/"
            target="_blank"
          >
            Magazine
          </Link>
          <Link
            className="hover:font-bold hover:cursor-pointer hover:text-[#DDF247]"
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
          <Menu user={user} />
        ) : (
          <div
            className="max-w-[200px] h-12 px-5 py-3 bg-[#DDF247] rounded-xl border border-[#DDF247] justify-center items-center gap-2 inline-flex hover:bg-white hover:text-gray-900 cursor-pointer"
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
    </header>
  );
}
