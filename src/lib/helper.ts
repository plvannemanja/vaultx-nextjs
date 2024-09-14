import {
  Address,
  getContractEvents,
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
  readContract,
  sendTransaction,
  waitForReceipt,
} from 'thirdweb';
import { address, chain, contract } from './contract';
import { Account } from 'thirdweb/wallets';
import { client } from './client';
import { IBuyerInfo, INFTVoucher, IRoyaltyDetails, ITokenDetail, PaymentSplitType } from '@/types';

export const createCollection = async (
  name: string,
  uri: string,
  account: Account,
) => {
  const transaction = await prepareContractCall({
    contract,
    method: 'function createCurationByCurator(string name, string uri)',
    params: [name, uri],
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account,
  });

  const receipt = await waitForReceipt({
    client,
    chain,
    transactionHash,
  });

  // get event log
  const createCollectionEvent = prepareEvent({
    signature:
      'event CreateCuration(string name, string uri, address curator, uint256 id)',
  });

  const events = parseEventLogs({
    logs: receipt.logs,
    events: [createCollectionEvent],
  });

  let ret = null;
  if (events.length > 0)
    ret = {
      tokenId: Number(events[0].args.id),
      transactionHash: events[0].transactionHash,
    };

  return ret;
};

export const isCurator = async (address: string) => {
  const data = await readContract({
    contract,
    method: 'function isCurator(address) view returns (bool)',
    params: [address],
  });

  return data;
};

export interface IListAsset {
  curationId: number;
  tokenURI: string;
  price: bigint;
  royaltyWallet: Address | '';
  royaltyPercentage: bigint;
  paymentSplits: Array<PaymentSplitType>;
  account: Account;
}

export const listAsset = async ({
  curationId,
  tokenURI,
  price,
  royaltyWallet,
  royaltyPercentage,
  paymentSplits,
  account,
}: IListAsset) => {
  const transaction = await prepareContractCall({
    contract,
    method:
      'function listAsset(uint256 curationId, string tokenURI, uint256 price, address royaltyWallet, uint256 royaltyPercentage, (address paymentWallet, uint256 paymentPercentage)[] paymentSplits)',
    params: [
      BigInt(curationId),
      tokenURI,
      BigInt(price),
      royaltyWallet,
      BigInt(royaltyPercentage),
      paymentSplits,
    ],
  });

  const { transactionHash } = await sendTransaction({
    transaction,
    account,
  });

  const receipt = await waitForReceipt({
    client,
    chain,
    transactionHash,
  });

  const AssetListedEvent = prepareEvent({
    signature: 'event AssetListed(uint256 indexed tokenId)',
  });

  const events = parseEventLogs({
    logs: receipt.logs,
    events: [AssetListedEvent],
  });
  return events
    ? {
      ...events[0].args,
      transactionHash,
    }
    : null;
};

export const protocolFee = async () => {
  const fee = await readContract({
    contract,
    method: 'function protocolFee() view returns (uint256)',
    params: [],
  });
  return fee;
};


export const tokenDetail = async (tokenId: bigint) => {
  const detail = await readContract({
    contract,
    method:
      'function tokenDetails(uint256) view returns (uint256 tokenId, uint256 curationId, address owner, uint256 price, uint256 shipTime, (address buyer, uint256 amount) buyerInfo, (address royaltyWallet, uint256 royaltyPercentage) royalty, uint8 status)',
    params: [BigInt(tokenId)],
  });

  const tokenDetail: ITokenDetail = {
    tokenId: Number(detail[0]),
    curationId: Number(detail[1]),
    owner: detail[2] as Address,
    usdAmount: detail[3],
    shipTime: detail[4],
    buyerInfo: detail[5] as IBuyerInfo,
    royalty: detail[6] as IRoyaltyDetails,
    status: Number(detail[7],)
  }
  return tokenDetail;
}

export const purchaseAsset = async (tokenId: bigint, account: Account) => {
  const detail = await tokenDetail(tokenId);

  // get 
  const transaction = await prepareContractCall({
    contract,
    method: "function purchaseAsset(uint256 tokenId) payable",
    params: [tokenId],
    value: BigInt(10),
  });

  const { transactionHash } = await sendTransaction({
    transaction,
    account
  });

  const receipt = await waitForReceipt({
    client,
    chain,
    transactionHash,
  });

  const AssetPurchasedEvent = prepareEvent({
    signature: "event AssetPurchased(uint256 indexed tokenId)"
  });

  const events = parseEventLogs({
    logs: receipt.logs,
    events: [AssetPurchasedEvent],
  });

  return events
    ? {
      ...events[0].args,
      transactionHash,
    }
    : null;
};


export const getVoucherSignature = async (NFTVoucher: INFTVoucher, account: Account) => {
  // Define the domain for EIP-712 signature
  const domain = {
    name: "MonsterXNFT-Voucher",
    version: "1",
    verifyingContract: address,
    chainId: chain.id,
  };

  // Define the types for the NFTVoucher
  const types = {
    NFTVoucher: [
      { name: "curationId", type: "uint256" },
      { name: "tokenURI", type: "string" },
      { name: "price", type: "uint256" },
      { name: "royaltyWallet", type: "address" },
      { name: "royaltyPercentage", type: "uint256" },
      { name: "paymentWallets", type: "address[]" },
      { name: "paymentPercentages", type: "uint256[]" },
    ],
  };

  const signature = await account.signTypedData({ domain, types, message: NFTVoucher, primaryType: "NFTVoucher" });
  NFTVoucher.signature = signature;
  // check signature
  const signerAddr = await readContract({
    contract,
    method: "function _verify((uint256 curationId, string tokenURI, uint256 price, address royaltyWallet, uint256 royaltyPercentage, address[] paymentWallets, uint256[] paymentPercentages, bytes signature) voucher) view returns (address)",
    params: [{ ...NFTVoucher, signature }]
  })
  if (signerAddr !== account.address)
    throw new Error("signature is not valid.");

  return NFTVoucher;
}