import { Address } from 'thirdweb';

type AvatarType = {
  url: string;
};

type BannerType = {
  url: string;
};

type AttributeType = {
  type: string;
  value: string;
  _id: string;
};

type ShippingInformationType = {
  lengths: number;
  width: number | null;
  height: number | null;
  weight: number | null;
};

type YoutubeType = {
  _id: string;
  title: string;
  url: string;
};

export type NFTItemType = {
  shippingInformation: Partial<ShippingInformationType>;
  _id: string;
  name: string;
  jsonHash: string;
  description: string;
  mintedBy: Partial<UserType>;
  owner: Partial<UserType>;
  cloudinaryUrl: string;
  curation: string;
  lastPrice: number;
  price: number;
  artist: string;
  attachments: Array<string>;
  basicDetailsFilled: boolean;
  certificates: Array<string>;
  freeMinting: boolean;
  onSale: boolean;
  saleId: {
    sellerShippingId: {
      country: string;
    };
  };
  views: number;
  followers: number;
  minted: boolean;
  likes: number;
  active: boolean;
  attributes: AttributeType[];
  walletAddresses: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  advancedDetailsFilled: boolean;
  royalty: number;
  shipmentDetailsFilled: boolean;
  uri: string;
  category: {
    name: string;
  };
};

export type CurationType = {
  _id: string;
  name: string;
  symbol: string;
  description: string;
  instagram: string;
  facebook: string;
  twitter: string;
  website: string;
  youtube: Array<Partial<YoutubeType>>;
  owner: string;
  descriptionImage: Array<string>;
  logo: string;
  volume: number;
  likes: number;
  active: boolean;
  bannerImage: string;
  createdAt: string;
  updatedAt: string;
};

export type UserType = {
  avatar: AvatarType;
  banner: BannerType;
  isAdmin: boolean;
  _id: string;
  wallet: string;
  userType: number;
  bio: string;
  instagram: string;
  facebook: string;
  twitter: string;
  Website: string;
  active: boolean;
  isCurator: boolean;
  lies: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  email: string;
  username: string;
};

export type PaymentSplitType = {
  paymentWallet: Address;
  paymentPercentage: bigint;
};

export interface IBasicDetailFormData {
  productName: string | null;
  productDescription: string | null;
  artistName: string | null;
  price: any;
  curation: any;
  file: File | null;
}

export interface IBasicDetail {
  data: FormData;
  formData: IBasicDetail;
  error: any;
}

export interface IAdvancedDetailOption {
  freeMint: boolean;
  royalties: boolean;
  unlockable: boolean;
  category: boolean;
  split: boolean;
}

export interface IAdvancedDetailFormData {
  royaltyAddress: string | null;
  royalty: number;
  unlockable: string | null;
  category: any;
  address: string | null;
  percentage: number;
}
