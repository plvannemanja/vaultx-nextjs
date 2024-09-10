'use client';

import { NFTItemType } from '@/types';
import { createContext, ReactNode, useContext, useState } from 'react';


interface INFTDetailContext {
  NFTDetail: null | NFTItemType;
  setNFTDetail: (data: null | NFTItemType) => void;
}

interface NFTDetailProviderProps {
  children: ReactNode;
}

// create a NFT detail context
const NFTDetailContext = createContext<INFTDetailContext | undefined>(undefined);

//context component
export const NFTDetailProvider: React.FC<NFTDetailProviderProps> = ({
  children,
}) => {
  const [NFTDetail, setNFTDetail] = useState<null | NFTItemType>(null);

  return (
    <NFTDetailContext.Provider
      value={{
        NFTDetail,
        setNFTDetail,
      }} >
      {children}
    </NFTDetailContext.Provider >
  )
}

// hook
export const useNFTDetail = () => {
  const context = useContext(NFTDetailContext);
  if (context === undefined)
    throw new Error(
      'NFT Detail context must be used within NFT Detail Provider',
    );
  return context;
}