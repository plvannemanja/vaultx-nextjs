import { Address, prepareContractCall, readContract, sendTransaction, waitForReceipt } from "thirdweb";
import { address, chain, contract } from "./contract";
import { Account } from "thirdweb/wallets";
import { client } from "./client";


export const createCollection = async (name: string, uri: string, account: Account) => {
    const transaction = await prepareContractCall({
        contract,
        method: "function createCollectionByCurator(string name, string uri)",
        params: [name, uri]
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

    return receipt;
}

export const isCurator = async (address: string) => {
    const data = await readContract({
        contract,
        method: "function isCurator(address) view returns (bool)",
        params: [address]
    });

    return data;
}