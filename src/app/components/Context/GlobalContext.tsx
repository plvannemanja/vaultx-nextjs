'use client';

import { protocolFee } from '@/lib/helper';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';


interface IGlobalContext {
  fee: number,
}

interface GlobalProviderProps {
  children: ReactNode;
}

const globalContext = createContext<IGlobalContext | undefined>(undefined);

//context component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({
  children,
}) => {
  const [fee, setFee] = useState<number>(0);

  const fetchProtocolFee = async () => {
    let fee = await protocolFee();
    setFee(Number(fee) / 100);
  };

  useEffect(() => {
    fetchProtocolFee();
  }, []);

  return (
    <globalContext.Provider
      value={{
        fee
      }} >
      {children}
    </globalContext.Provider >
  )
}

// hook
export const useGlobalContext = () => {
  const context = useContext(globalContext);
  if (context === undefined)
    throw new Error(
      'Global context must be used within Global Provider',
    );
  return context;
}