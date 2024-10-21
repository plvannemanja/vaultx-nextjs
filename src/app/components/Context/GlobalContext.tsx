'use client';

import { chain } from '@/lib/contract';
import { createCookie } from '@/lib/cookie';
import { protocolFee } from '@/lib/helper';
import { authenticationServices, getMedia } from '@/services/supplier';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Address } from 'thirdweb';
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from 'thirdweb/react';
import { checksumAddress } from 'viem';
import { SignUpModal } from '../Modules/SignUp';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);

  useEffect(() => {
    fetchProtocolFee();
    fetchMedia();
    if (activeAccount?.address) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeChain && activeChain.id !== chain.id) {
      switchChain(chain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
