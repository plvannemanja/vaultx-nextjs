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
import { useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react';

interface IGlobalContext {
  fee: number;
  user: any;
  setUser: (data: any) => void;
}

interface GlobalProviderProps {
  children: ReactNode;
}

const globalContext = createContext<IGlobalContext | undefined>(undefined);

//context component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [fee, setFee] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const fetchProtocolFee = async () => {
    let fee = await protocolFee();
    setFee(Number(fee) / 100);
  };

  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  useEffect(() => {
    fetchProtocolFee();
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
        setUser,
      }}
    >
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
