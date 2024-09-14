import { getContract } from 'thirdweb';
import { baseSepolia, base } from 'thirdweb/chains';
import { client } from './client';

// get a contract
const isDev = process.env.NEXT_PUBLIC_ENV === 'development';

const addr = isDev
  ? process.env.NEXT_PUBLIC_APP_SEPOLIA_ADDRESS
  : process.env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS;

export const chain = isDev ? baseSepolia : base;
export const address = addr;

export const contract = getContract({
  client,
  chain,
  address: addr,
});
