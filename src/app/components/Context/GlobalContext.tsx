'use client';

import { chain } from '@/lib/contract';
import { protocolFee } from '@/lib/helper';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from 'thirdweb/react';
import { SignUpModal } from '../Modules/SignUp';
import { Address } from 'thirdweb';
import { authenticationServices, getMedia } from '@/services/supplier';
import { createCookie } from '@/lib/cookie';
import { checksumAddress } from 'viem';

export interface Iimages {
  homeAutority: Array<{ image: string; link: string }>;
  bottomBaner: { image: string; link: string };
  appreciateTop: { image: string; link: string };
  curationTop: { image: string; link: string };
  mintingBanner: { image: string; link: string };
}

interface IGlobalContext {
  fee: number;
  user: any;
  fetchUser: () => void;
  mediaImages: Iimages | null;
  setMediaImages: (data: Iimages | null) => void;
}

interface GlobalProviderProps {
  children: ReactNode;
}

const globalContext = createContext<IGlobalContext | undefined>(undefined);

//context component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [fee, setFee] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [mediaImages, setMediaImages] = useState<Iimages | null>(null);

  const fetchProtocolFee = async () => {
    let fee = await protocolFee();
    setFee(Number(fee) / 100);
  };

  const fetchMedia = async () => {
    const images = await getMedia();
    setMediaImages(images);
  };

  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const activeAccount = useActiveAccount();

  const fetchUser = async () => {
    if (!activeAccount) return;

    try {
      const address = checksumAddress(activeAccount?.address) as Address;

      const { data } = await authenticationServices.connectWallet({
        wallet: address,
      });
      const connectedUser = data.user;
      const connectedToken = data.token;
      createCookie('user', JSON.stringify(connectedUser));
      createCookie('token', connectedToken);
      setUser(connectedUser);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (activeAccount?.address) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [activeAccount]);

  useEffect(() => {
    fetchProtocolFee();
    fetchMedia();
    if (activeAccount?.address) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (activeChain && activeChain.id !== chain.id) {
      switchChain(chain);
    }
  }, [activeChain]);
  return (
    <globalContext.Provider
      value={{
        fee,
        user,
        fetchUser,
        mediaImages,
        setMediaImages,
      }}
    >
      <SignUpModal />
      {children}
    </globalContext.Provider>
  );
};

// hook
export const useGlobalContext = () => {
  const context = useContext(globalContext);
  if (context === undefined)
    throw new Error('Global context must be used within Global Provider');
  return context;
};
