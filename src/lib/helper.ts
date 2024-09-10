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
import { chain, contract } from './contract';
import { Account } from 'thirdweb/wallets';
import { client } from './client';
import { IBuyerInfo, IRoyaltyDetails, ITokenDetail, PaymentSplitType } from '@/types';

export const createCollection = async (
  name: string,
  uri: string,
  account: Account,
) => {
  const transaction = await prepareContractCall({
    contract,
    method: 'function createCollectionByCurator(string name, string uri)',
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
      'event CreateCollection(string name, string uri, address curator, uint256 id)',
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
  collectionId: number;
  tokenURI: string;
  price: bigint;
  royaltyWallet: Address | '';
  royaltyPercentage: bigint;
  paymentSplits: Array<PaymentSplitType>;
  account: Account;
}

export const listAsset = async ({
  collectionId,
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
      'function listAsset(uint256 collectionId, string tokenURI, uint256 price, address royaltyWallet, uint256 royaltyPercentage, (address paymentWallet, uint256 paymentPercentage)[] paymentSplits)',
    params: [
      BigInt(collectionId),
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
      'function tokenDetails(uint256) view returns (uint256 tokenId, uint256 collectionId, address owner, uint256 price, uint256 priceInMatic, (address buyer, uint256 amount) buyerInfo, (address royaltyWallet, uint256 royaltyPercentage) royalty, uint8 status)',
    params: [BigInt(tokenId)],
  });

  const tokenDetail: ITokenDetail = {
    tokenId: Number(detail[0]),
    collectionId: Number(detail[1]),
    owner: detail[2] as Address,
    usdAmount: detail[3],
    nativeAmount: detail[4],
    buyerInfo: detail[5] as IBuyerInfo,
    royalty: detail[6] as IRoyaltyDetails,
    status: Number(detail[7],)
  }
  return tokenDetail;
}

export const purchaseAsset = async (tokenId: bigint, account: Account) => {
  const detail = await tokenDetail(tokenId);

  const transaction = await prepareContractCall({
    contract,
    method: "function purchaseAsset(uint256 tokenId) payable",
    params: [tokenId],
    value: detail.nativeAmount,
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
