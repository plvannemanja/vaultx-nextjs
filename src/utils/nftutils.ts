import { contract } from '@/lib/contract';
import {
    prepareContractCall,
    sendTransaction,
    readContract,
    resolveMethod,
    prepareEvent,
    getContractEvents,
  } from 'thirdweb';
import { getData } from './uploadData';

export const getNftDataById = async (tokenId: number) => {
    const owner = await readContract({ 
        contract, 
        method: "ownerOf", 
        params: [BigInt(tokenId)] 
    });
    const tokenUri = await readContract({ 
    contract, 
    method: "tokenURI", 
    params: [BigInt(tokenId)] 
    });

    const tokenDetails = await readContract({ 
    contract, 
    method: "tokenDetails", 
    params: [BigInt(tokenId)] 
    });
    console.log("tokenDetails", tokenDetails);


    const uri = tokenUri.substring(tokenUri.lastIndexOf('/') + 1);
    const data = await getData(uri);
    console.log("token meta data", data);

    const collection = await readContract({ 
    contract, 
    method: "collections", 
    params: [(data as any).curationId] 
    });
    const nft = {
        tokenId: tokenId,
        active: true,
        artist: (data as any).artistName,
        attachments: (data as any).attachment,
        basicDetailsFilled: true,
        categoryDetails: [],
        certificates: [],
        cloudinaryUrl: (data as any).image,
        createdAt: "",
        curation: (data as any).curationId,
        curationInfo: [{name: collection[0], uri: collection[1], owner: collection[2]}],
        description: (data as any).productDescription,
        followers: 0,
        freeMinting: false,
        jsonHash: (data as any).image,
        lastPrice: 0,
        likes: 0,
        minted: true,
        mintedBy: "",
        name: (data as any).productName,
        onSale: true,
        owner: owner,
        ownerInfo: [{}],
        price: (Number(tokenDetails[3]) / 1e18).toFixed(2),
        saleId: 0,
        updatedAt: "",
        views: 0,
        royalty: tokenDetails[6],
        walletAddresses: [],
        attributes: (data as any).attributes
    };
    return nft;
}