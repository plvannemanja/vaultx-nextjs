import {
  Address,
  getContractEvents,
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
  readContract,
  sendTransaction,
  waitForReceipt,
  ZERO_ADDRESS,
} from 'thirdweb';
import { address, chain, contract, explorer } from './contract';
import { Account } from 'thirdweb/wallets';
import { client } from './client';
import {
  IBuyerInfo,
  INFTVoucher,
  IRoyaltyDetails,
  ITokenDetail,
  PaymentSplitType,
} from '@/types';
import { formatEther, parseEther } from 'viem';
import { bigint } from 'zod';

export const createCollection = async (
  name: string,
  uri: string,
  account: Account,
) => {
  debugger;
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

  const ListedEvent = prepareEvent({
    signature: 'event Listed(uint256 indexed tokenId)',
  });

  const events = parseEventLogs({
    logs: receipt.logs,
    events: [ListedEvent],
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
    status: Number(detail[7]),
  };
  return tokenDetail;
};

export const purchaseAsset = async (
  tokenId: bigint,
  amount: bigint,
  account: Account,
) => {
  const detail = await tokenDetail(tokenId);

  // get
  const transaction = await prepareContractCall({
    contract,
    method: 'function purchaseAsset(uint256 tokenId) payable',
    params: [tokenId],
    value: amount,
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

  const AssetPurchasedEvent = prepareEvent({
    signature: 'event AssetPurchased(uint256 indexed tokenId)',
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

export const getVoucherSignature = async (
  NFTVoucher: Omit<INFTVoucher, 'signature'>,
  account: Account,
) => {
  // Define the domain for EIP-712 signature
  const domain = {
    name: 'MonsterXNFT-Voucher',
    version: '1',
    verifyingContract: address,
    chainId: chain.id,
  };

  // Define the types for the NFTVoucher
  const types = {
    NFTVoucher: [
      { name: 'curationId', type: 'uint256' },
      { name: 'tokenURI', type: 'string' },
      { name: 'price', type: 'uint256' },
      { name: 'royaltyWallet', type: 'address' },
      { name: 'royaltyPercentage', type: 'uint256' },
      { name: 'paymentWallets', type: 'address[]' },
      { name: 'paymentPercentages', type: 'uint256[]' },
    ],
  };

  const signature = await account.signTypedData({
    domain,
    types,
    message: NFTVoucher,
    primaryType: 'NFTVoucher',
  });

  // check signature
  const signerAddr = await readContract({
    contract,
    method:
      'function _verify((uint256 curationId, string tokenURI, uint256 price, address royaltyWallet, uint256 royaltyPercentage, address[] paymentWallets, uint256[] paymentPercentages, bytes signature) voucher) view returns (address)',
    params: [{ ...NFTVoucher, signature }],
  });
  if (signerAddr !== account.address)
    throw new Error('signature is not valid.');

  return signature;
};

export const purchaseAssetBeforeMint = async (
  voucher: Omit<INFTVoucher, 'signature'> & { signature: `0x${string}` },
  amount: bigint,
  account: Account,
) => {
  const transaction = await prepareContractCall({
    contract,
    method:
      'function purchaseAssetBeforeMint((uint256 curationId, string tokenURI, uint256 price, address royaltyWallet, uint256 royaltyPercentage, address[] paymentWallets, uint256[] paymentPercentages, bytes signature) voucher) payable',
    params: [voucher],
    value: amount,
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

  const TransferEvent = prepareEvent({
    signature:
      'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  });

  const events = parseEventLogs({
    logs: receipt.logs,
    events: [TransferEvent],
  });

  return events
    ? {
        ...events[0].args,
        transactionHash,
      }
    : null;
};
export const getExplorerURL = (
  type: 'address' | 'transaction',
  value: string,
) => {
  if (type === 'address') return `${explorer}address/${value}`;
  if (type === 'transaction') return `${explorer}tx/${value}`;
  return '';
};

export const getTokenAmount = async (
  usdAmount: string,
  unit: 'Ether' | 'Wei' = 'Ether',
) => {
  const tokenAmount = await readContract({
    contract,
    method:
      'function getTokenAmount(uint256 usdAmount, address token) view returns (uint256)',
    params: [parseEther(usdAmount), ZERO_ADDRESS],
  });

  if (unit === 'Ether') return formatEther(tokenAmount);

  return tokenAmount;
};

export const unlistAsset = async (tokenId: number, account: Account) => {
  const transaction = await prepareContractCall({
    contract,
    method: 'function unlistAsset(uint256 tokenId)',
    params: [BigInt(tokenId)],
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account,
  });
  return transactionHash;
};

export const resaleAsset = async (
  tokenId: number,
  price: bigint,
  account: Account,
) => {
  // check if approved for all
  const isApproved = await isApprovedForAll(
    account.address as Address,
    contract.address as Address,
  );
  if (!isApproved)
    await setApprovedForAll(contract.address as Address, true, account);
  const transaction = await prepareContractCall({
    contract,
    method: 'function reSaleAsset(uint256 tokenId, uint256 price)',
    params: [BigInt(tokenId), price],
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account,
  });

  await waitForReceipt({
    client,
    chain,
    transactionHash,
  });
  return transactionHash;
};

export const setApproveToken = async (
  tokenId: number,
  address: Address,
  account: Account,
) => {
  const transaction = await prepareContractCall({
    contract,
    method: 'function approve(address to, uint256 tokenId)',
    params: [address, BigInt(tokenId)],
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account,
  });

  await waitForReceipt({
    client,
    chain,
    transactionHash,
  });

  return transactionHash;
};

export const setApprovedForAll = async (
  operator: Address,
  approved: boolean,
  account: Account,
) => {
  const transaction = await prepareContractCall({
    contract,
    method: 'function setApprovalForAll(address operator, bool approved)',
    params: [operator, approved],
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account,
  });

  await waitForReceipt({
    client,
    chain,
    transactionHash,
  });
  return transactionHash;
};

export const isApprovedForAll = async (owner: Address, operator: Address) => {
  const data = await readContract({
    contract,
    method:
      'function isApprovedForAll(address owner, address operator) view returns (bool)',
    params: [owner, operator],
  });
  return data;
};

export const releaseEscrow = async (tokenId: number, account: Account) => {
  const transaction = await prepareContractCall({
    contract,
    method: 'function releaseEscrow(uint256 tokenId) payable',
    params: [BigInt(tokenId)],
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

  const escrowReleasedEvent = prepareEvent({
    signature: 'event EscrowReleased(uint256 indexed tokenId)',
  });
  const events = await parseEventLogs({
    logs: receipt.logs,
    events: [escrowReleasedEvent],
  });

  return events
    ? {
        ...events[0].args,
        transactionHash,
      }
    : null;
};
