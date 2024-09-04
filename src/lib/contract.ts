import { getContract } from 'thirdweb';
import { sepolia, base } from 'thirdweb/chains';
import { client } from './client';

// get a contract
const isDev = process.env.NODE_ENV === 'development';
const addr = isDev ? process.env.NEXT_PUBLIC_APP_SEPOLIA_ADDRESS : process.env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS;
import { monsterNftAbi } from './abis/MonsterNFTAbi.js';

export const chain = isDev ? sepolia : base;
export const address = addr;

export const contract = getContract({
  client,
  chain,
  address: addr,
  abi: monsterNftAbi
});