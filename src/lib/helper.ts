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
import { PaymentSplitType } from '@/types';

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
  return events ? events[0].args : null;
};

export const protocolFee = async () => {
  const fee = await readContract({
    contract,
    method: 'function protocolFee() view returns (uint256)',
    params: [],
  });
  return fee;
};
