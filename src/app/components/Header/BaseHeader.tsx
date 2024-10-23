'use client';
import Logo from '@/components/Icon/Logo';
import WalletIcon from '@/components/Icon/WalletIcon';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { client, wallets } from '@/lib/client';
import { List } from 'lucide-react';
import Link from 'next/link';
import { useActiveAccount, useConnectModal } from 'thirdweb/react';
import { WalletAutoConnect } from '../theme-provider';
import Menu from './Menu';
import { Search } from './Search';

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

type Props = {
  isNFT?: boolean;
};

export function BaseHeader({ isNFT = false }: Props) {
  // const { user } = useGlobalContext();
  // const detailsModal = useWalletDetailsModal();
  const { connect } = useConnectModal();
  const activeAccount = useActiveAccount();
  // const router = useRouter();

  // function handleDetail() {
  //   detailsModal.open({ client });
  // }

  function handleConnect() {
    connect({ client, wallets });
  }

  return (
    <header
    // className="sticky top-0 z-50 left-0 w-full bg-[#161616]/95 backdrop-blur supports-[backdrop-filter]:bg-[#161616]/60"
    >
      <div className="container !px-3 xs:!px-5 sm:!px-0 h-[88px] w-full py-5 justify-between items-center flex">
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
                          <Menu />
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
          <div className="justify-start items-center gap-x-7 flex text-base text-white">
            <Link
              className="p-1 hover:cursor-pointer hover:text-[#DDF247] transition-all duration-200 font-medium"
              href="/dashboard/appreciate"
            >
              Appreciation
            </Link>
            <Link
              className="p-1 hover:cursor-pointer hover:text-[#DDF247] transition-all duration-200 font-medium"
              href="/dashboard/curation"
            >
              Curation
            </Link>
            <Link
              className="p-1 hover:cursor-pointer hover:text-[#DDF247] transition-all duration-200 font-medium"
              href="https://artistvaultx.wpcomstaging.com/"
              target="_blank"
            >
              Magazine
            </Link>
            <Link
              className="p-1 hover:cursor-pointer hover:text-[#DDF247] transition-all duration-200 font-medium"
              href="https://www.monsterx.io"
              target="_blank"
            >
              How it Works
            </Link>
          </div>
        </div>
        {!isNFT && <Search />}
        <div className="flex gap-3.5 self-stretch text-sm max-md:flex-wrap">
          {activeAccount ? (
            <>
              {isNFT && (
                <button
                  className={
                    'px-5 py-3 bg-[#DDF247] rounded-xl border border-[#DDF247] justify-center items-center gap-2 inline-flex cursor-pointer mr-2 self-center'
                  }
                >
                  <div className="text-neutral-900 text-sm font-semibold leading-normal">
                    Create RWA
                  </div>
                </button>
              )}
              <Menu />
            </>
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
          <WalletAutoConnect />
        </div>
      </div>
    </header>
  );
}
