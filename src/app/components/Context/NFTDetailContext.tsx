'use client';

import { IBid, INFTActivity, NFTItemType } from '@/types';
import { createContext, ReactNode, useContext, useState } from 'react';

interface INFTDetailContext {
  NFTDetail: null | NFTItemType;
  setNFTDetail: (data: null | NFTItemType) => void;
  nftId: null | string;
  setNftId: (data: string) => void;
  mainImage: null | string;
  setMainImage: (data: null | string) => void;
  likes: number;
  setLikes: (data: number) => void;
  liked: boolean;
  setLiked: (data: boolean) => void;
  type: string;
  setType: (data: string) => void;
  burnable: boolean;
  setBurnable: (data: boolean) => void;
  activityList: INFTActivity[];
  setActivityList: (data: INFTActivity[]) => void;
  bids: IBid[];
  setBids: (data: IBid[]) => void;
}

interface NFTDetailProviderProps {
  children: ReactNode;
}

// create a NFT detail context
const NFTDetailContext = createContext<INFTDetailContext | undefined>(
  undefined,
);

//context component
export const NFTDetailProvider: React.FC<NFTDetailProviderProps> = ({
  children,
}) => {
  const [NFTDetail, setNFTDetail] = useState<null | NFTItemType>(null);
  const [nftId, setNftId] = useState<null | string>(null);
  const [mainImage, setMainImage] = useState<null | string>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [type, setType] = useState('');
  const [burnable, setBurnable] = useState(false);
  const [activityList, setActivityList] = useState<INFTActivity[]>([]);
  const [bids, setBids] = useState<IBid[]>([]);

  return (
    <NFTDetailContext.Provider
      value={{
        NFTDetail,
        setNFTDetail,
        nftId,
        setNftId,
        mainImage,
        setMainImage,
        likes,
        setLikes,
        liked,
        setLiked,
        type,
        setType,
        burnable,
        setBurnable,
        activityList,
        setActivityList,
        bids,
        setBids,
      }}
    >
      {children}
    </NFTDetailContext.Provider>
  );
};

// hook
export const useNFTDetail = () => {
  const context = useContext(NFTDetailContext);
  if (context === undefined)
    throw new Error(
      'NFT Detail context must be used within NFT Detail Provider',
    );
  return context;
};
