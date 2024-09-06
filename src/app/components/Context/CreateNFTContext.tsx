'use client';

import {
  IAdvancedDetailFormData,
  IAdvancedDetailOption,
  IBasicDetailFormData,
  PaymentSplitType,
} from '@/types';
import { createContext, ReactNode, useContext, useState } from 'react';

interface NFTContextType {
  basicDetail: IBasicDetailFormData;
  setBasicDetail: (data: Partial<IBasicDetailFormData>) => void;
  advancedOptions: IAdvancedDetailOption;
  setAdvancedOptions: (data: Partial<IAdvancedDetailOption>) => void;
  advancedDetails: IAdvancedDetailFormData;
  setAdvancedDetails: (data: Partial<IAdvancedDetailFormData>) => void;
  paymentSplits: Array<PaymentSplitType>;
  setPaymentSplits: (data: Array<PaymentSplitType>) => void;
}

interface CreateNFTProviderProps {
  children: ReactNode;
}

// create a NFT Context
const CreateNFTContext = createContext<NFTContextType | undefined>(undefined);

// context component
export const CreateNFTProvider: React.FC<CreateNFTProviderProps> = ({
  children,
}) => {
  const [basicDetail, setBasicDetail] = useState<IBasicDetailFormData>({
    productName: null,
    productDescription: null,
    artistName: null,
    price: 0,
    curation: null,
    file: null,
  });

  const setPartialBasicDetail = (data: Partial<IBasicDetailFormData>) => {
    setBasicDetail({
      ...basicDetail,
      ...data,
    });
  };
  const [options, setOptions] = useState<IAdvancedDetailOption>({
    freeMint: false,
    royalties: false,
    unlockable: false,
    category: false,
    split: false,
  });

  const setAdvancedOptions = (data: Partial<IAdvancedDetailOption>) => {
    setOptions({
      ...options,
      ...data,
    });
  };

  const [advancedDetails, setAdvancedDetails] =
    useState<IAdvancedDetailFormData>({
      royaltyAddress: null,
      royalty: null,
      unlockable: null,
      category: null,
      address: null,
      percentage: null,
    });

  const setPartialAdvancedDetails = (
    data: Partial<IAdvancedDetailFormData>,
  ) => {
    setAdvancedDetails({
      ...advancedDetails,
      ...data,
    });
  };

  const [paymentSplits, setPaymentSplits] = useState<Array<PaymentSplitType>>();

  return (
    <CreateNFTContext.Provider
      value={{
        basicDetail,
        setBasicDetail: setPartialBasicDetail,
        advancedOptions: options,
        setAdvancedOptions,
        advancedDetails,
        setAdvancedDetails: setPartialAdvancedDetails,
        paymentSplits,
        setPaymentSplits(data) {
          setPaymentSplits(data);
        },
      }}
    >
      {children}
    </CreateNFTContext.Provider>
  );
};

// hook
export const useCreateNFT = () => {
  const context = useContext(CreateNFTContext);
  if (context === undefined)
    throw new Error(
      'create NFT context must be used within Create NFT Provider',
    );
  return context;
};
