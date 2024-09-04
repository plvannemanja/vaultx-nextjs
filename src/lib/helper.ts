import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { chain, contract } from "./contract";
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
