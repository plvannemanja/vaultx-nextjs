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

type ShippingAddressType = {
  _id: string;
  name: string;
  email: string;
  country: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
  };
  phoneNumber: number;
  contactInformation: string;
  concent: string;
  termAccepted: boolean;
  nftId: NFTItemType;
};

type ActivityStatusType =
  | 'Listed'
  | 'Minted'
  | 'Bid Placed'
  | 'Listed for Sale'
  | 'Added Funds in Escrow'
  | 'Purchased'
  | 'End Sale'
  | 'In Escrow'
  | 'Transfer'
  | 'Fee'
  | 'Royaltes'
  | 'Split Payments'
  | 'Release escrow'
  | 'Burn'
  | 'Bid Accepted'
  | 'Transferred'
  | 'Unlisted'
  | 'Cancel Bid'
  | 'Dispute Registered'
  | 'Order Canceled';

type SaleStatusType =
  | 'NotForSale'
  | 'Active'
  | 'Ordered'
  | 'Dispute'
  | 'CancellationRequested'
  | 'Sold'
  | 'Cancelled';

type DisputeType = {
  _id: string;
  buyer: UserType;
  seller: UserType;
  nft: NFTItemType;
  sale: SaleType;
  reason: string;
  resolved: boolean;
};

type SaleType = {
  _id: string;
  saleStatus: SaleStatusType;
  saleStartOn: Date;
  saleStartTxnHash: string;
  ItemPurchasedOn: Date;
  ItemPUrchasedTxnHash: String;
  saleEndedOn: Date;
  saleEndTxnHash: string;
  saleCancelledOn: Date;
  saleCancelTxnHash: string;
  requestEscrowReleaseTxnHash: string;
  nftId: NFTItemType;
  sellerId?: UserType;
  active: boolean;
  released: boolean;
  saleWinner?: UserType;
  itemDelivered: boolean;
  sellerShippingId: Omit<ShippingAddressType, 'nftId'> & { nftId: string };
  buyerShippingId: Omit<ShippingAddressType, 'nftId'> & { nftId: string };
  cancelRequest: string;
  cancleAttachment: string[];
  requestEscrowRelease: boolean;
  requestEscrowId?: Omit<DisputeType, 'nft' | 'sale'> & {
    nft: string;
    sale: string;
  };
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
  curation: string | Partial<CurationType>;
  lastPrice: number;
  price: number;
  artist: string;
  attachments: Array<string>;
  basicDetailsFilled: boolean;
  certificates: Array<string>;
  freeMinting: boolean;
  onSale: boolean;
  saleId: Omit<SaleType, 'nftId'> & { nftId: string };
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
  mintHash: string;
  tokenId: number;
  voucher: string;
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
  tokenId: number;
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
  paymentWallet: string;
  paymentPercentage: bigint;
};

export interface IBasicDetailFormData {
  productName: string | null;
  productDescription: string | null;
  artistName: string | null;
  price: any;
  curation: any;
  file: File | null;
  imageSrc: string;
  attachments: File[] | null;
  curations: any[] | null;
}

export interface IBasicDetail {
  data: FormData;
  formData: any;
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
  unlockableContent: string | null;
  certificates: any[];
  propertyTemplateId: string | null;
  attributes: any[];
}

export interface ISellerInfo {
  shipping: any | null;
  contact: any | null;
  shippingId: string | null;
  contactId: string | null;
  accepted: boolean;
  width: string | null;
  height: string | null;
  length: string | null;
  weight: string | null;
}

export interface IBuyerInfo {
  buyer: Address;
  amount: bigint;
}

export interface IRoyaltyDetails {
  royaltyWallet: Address;
  royaltyPercentage: bigint;
}

export enum TokenStatusEnum {
  NotListed,
  Listed,
  Escrowed,
}

export interface ITokenDetail {
  tokenId: number;
  curationId: number;
  owner: Address;
  usdAmount: bigint;
  shipTime: bigint;
  buyerInfo: IBuyerInfo;
  royalty: IRoyaltyDetails;
  status: TokenStatusEnum;
}

export interface INFTVoucher {
  curationId: bigint;
  tokenURI: string;
  price: bigint;
  royaltyWallet: Address;
  royaltyPercentage: bigint;
  paymentWallets: Address[];
  paymentPercentages: bigint[];
  signature?: `0x${string}`;
}

export interface INFTActivity {
  _id: string;
  nftId: NFTItemType;
  state: ActivityStatusType;
  createdAt: Date;
  updatedAt: Date;
  actionHash?: `0x${string}`;
  from?: UserType;
  to?: UserType;
  price: number;
}

export interface IBid {
  _id: string;
  nftId: NFTItemType;
  bidId: number;
  bidValue: number;
  bidder: UserType;
  bidHash: `0x${string}`;
  bidSuccess: boolean;
  bidCanceled: boolean;
  biddderShippingId: string;
}
