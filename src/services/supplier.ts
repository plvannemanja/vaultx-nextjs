import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getCookie } from '../lib/cookie';

const server_uri =
  process.env.Next_PUBLIC_APP_BACKEND_URL || 'https://tapi.vault-x.io/api/v1';

const options = {
  baseURL: server_uri,
  headers: {
    authorization: 'Bearer ' + getCookie('token'),
  },
};

const api: AxiosInstance = axios.create(options);

interface NftDetails {
  // Define the structure of nftDetails object
}

interface CollectionData {
  // Define the structure of collection data object
}

interface LaunchpadDetails {
  // Define the structure of launchpadDetails object
}

interface UserData {
  // Define the structure of user data object
}

interface SaleData {
  // Define the structure of sale data object
}

// API calls for NFTs
export const nftServices = {
  createNft: (nftDetails: NftDetails): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/nft/create`, nftDetails);
  },
  getNftByUserAddress: async (
    limit: number,
    chain: string,
    address: string,
    cursor?: string,
  ): Promise<AxiosResponse<any>> => {
    if (cursor)
      return api.post(`${server_uri}/nft/nftByUserAddress`, {
        address,
        limit,
        cursur: cursor,
        chainId: chain,
      });
    return api.post(`${server_uri}/nft/nftByUserAddress`, {
      address,
      limit,
      chainId: chain,
    });
  },
  getNftByTokenId: async (
    chainId: string,
    address: string,
    tokenId: string,
  ): Promise<AxiosResponse<any>> => {
    return api.get(
      `${server_uri}/nft/singleNft/${chainId}/${address}/${tokenId}`,
    );
  },
  getListedNfts: async (
    limit: number,
    chainId: string,
    address: string,
    nftStatus: string,
    cursor?: string,
    sort?: string,
  ): Promise<AxiosResponse<any>> => {
    return api.post(`${server_uri}/nft/getListedNfts/`, {
      address,
      limit,
      chainId,
      nftStatus,
      cursor,
      sort,
    });
  },
  getBids: async (
    limit: number,
    chainId: string,
    cursor?: string,
  ): Promise<AxiosResponse<any>> => {
    return api.post(`${server_uri}/nft/getBids/`, {
      limit,
      chainId,
      cursor,
    });
  },
  getSingleListedNft: async (
    chainId: string,
    address: string,
    tokenId: string,
  ): Promise<AxiosResponse<any>> => {
    return api.get(
      `${server_uri}/nft/getSingleListedNft/${chainId}/${address}/${tokenId}`,
    );
  },
  getLengths: async (
    limit: number,
    chain: string,
    address: string,
  ): Promise<AxiosResponse<any>> => {
    return api.post(`${server_uri}/nft/getLengths/`, {
      address,
      limit,
      chainId: chain,
    });
  },
  getAllNfts: (skip: number, auctionId: string): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/nft/getAllExplore/${skip}/${auctionId}`),
  addLikes: (
    accessToken: string,
    nftId: string,
    userAddress: string,
  ): Promise<AxiosResponse<any>> => {
    api.defaults.headers.common['authorization'] = accessToken;
    return api.post(`${server_uri}/nft/addLikes`, {
      nftId,
      userAddress,
    });
  },
  removeLike: (
    accessToken: string,
    nftId: string,
    userAddress: string,
  ): Promise<AxiosResponse<any>> => {
    api.defaults.headers.common['authorization'] = accessToken;
    return api.post(`${server_uri}/nft/removeLike`, {
      nftId,
      userAddress,
    });
  },
  createListing: (nftDetails: NftDetails): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/nft/create-listing`, nftDetails);
  },
  transfer: (nftDetails: NftDetails): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/nft/transfer`, nftDetails);
  },
  nftRanking: (skip: number, days: number): Promise<AxiosResponse<any>> => {
    return api.get(`${server_uri}/nft/nftRanking/${days}/${skip}`);
  },
};

// API calls for collections
export const collectionServices = {
  create: (data: CollectionData): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/collection/create`, data, {
      headers: {
        authorization: 'Bearer ' + getCookie('token'),
      },
    }),
  update: (data: CollectionData): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/collection/updateCuration`, data, {
      headers: {
        authorization: 'Bearer ' + getCookie('token'),
      },
    }),
  getAllCollections: (data: CollectionData): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/collection/getAllCollections`, data),
  getTrendingCollections: (): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/nft/getTrendingCollections`),
  getCollectionById: (collectionId: string): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/collection/getCollectionById/${collectionId}`),
  getCollectionInfo: (collectionId: string): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/collection/getCollectionInfo/`, { collectionId }),
  getCollectionNfts: (data: CollectionData): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/collection/getCollectionNts/`, data),
  getUserCollections: (data: CollectionData): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/collection/getUserCollection`, data, {
      headers: {
        authorization: 'Bearer ' + getCookie('token'),
      },
    }),
  getUserCollectionsInfo: (): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/collection/getUserCollectionsInfo`),
  getCollectionByAddress: (
    chainId: string,
    address: string,
    limit: number,
    filter: string,
    sort: string,
    skip: number,
    cursor?: string,
  ): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/nft/getCollectionByAddress`, {
      address,
      limit,
      chainId,
      filter,
      sort,
      skip,
      cursor,
    }),
  getCollectionMetadata: (
    chainId: string,
    address: string,
  ): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/nft/collectionMetadata`, {
      address,
      chainId,
    }),
  getAllActivitiesCollection: (
    data: CollectionData,
  ): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/collection/getCollectionActivities/`, data),
  getSearch: (data: string): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/collection/search`, data),
};

// API calls for auctions
export const auctionServices = {
  placeBid: (bidDetails: any): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/auction/placeBid`, bidDetails);
  },
  buy: (
    nftId: string,
    endAuctionHash: string,
    userAddress: string,
    contractAddress: string,
    buyer_currency: string,
    txHash: string,
    bnbPrice: string,
  ): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/auction/buy`, {
      nftId,
      endAuctionHash,
      userAddress,
      contractAddress,
      buyer_currency,
      txHash,
      bnbPrice,
    });
  },
  getAllExplore: (
    limit: number,
    skip: number,
    chain: string,
    sort: string,
    filter: string,
  ): Promise<AxiosResponse<any>> =>
    api.get(
      `${server_uri}/auction/getAllExplore/${limit}/${skip}/${chain}/${sort}/${filter}`,
    ),
  endSaleApi: (
    nftId: string,
    endAuctionHash: string,
    bnbPrice: string,
    auctionOwner: string,
  ): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/auction/end`, {
      nftId,
      endAuctionHash,
      bnbPrice,
      auctionOwner,
    });
  },
  cancelAuction: (
    nftId: string,
    transactionHash: string,
  ): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/auction/cancel`, { nftId, transactionHash });
  },
  getAllAuctionNfts: (
    limit: number,
    skip: number,
  ): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/auction/getAllAuctionNfts`, { limit, skip });
  },
  getNftAuctionById: (auctionId: string): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.get(`${server_uri}/auction/getAuctionNft/${auctionId}`);
  },
  auctionRanking: (skip: number, days: number): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.get(`${server_uri}/auction/auctionRanking/${days}/${skip}`);
  },
};

// API calls for launchpads
export const launchpadServices = {
  create: (launchpadDetails: LaunchpadDetails): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/launchpad/create`, launchpadDetails);
  },
  update: (launchpadDetails: LaunchpadDetails): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/launchpad/update`, launchpadDetails);
  },
  getLaunchpads: (): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/launchpad/getLaunchpads`),
  getLaunchpadById: (launchpadId: string): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/launchpad/getLaunchpadById/${launchpadId}`),
};

// API calls for user profile
export const userServices = {
  createUser: (userDetails: UserData): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/user/create`, userDetails);
  },
  getUserProfile: (userId: string): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/user/getUserProfile/${userId}`),
  getUserNfts: (userId: string): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/user/getUserNfts/${userId}`),
  getAllUsers: (limit: number, skip: number): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/user/getAllUsers`, { limit, skip }),
};

// API calls for sales
export const saleServices = {
  createSale: (saleDetails: SaleData): Promise<AxiosResponse<any>> => {
    const token = getCookie('token');
    api.defaults.headers.common['authorization'] = token;
    return api.post(`${server_uri}/sale/create`, saleDetails);
  },
  getSaleById: (saleId: string): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/sale/getSaleById/${saleId}`),
  getAllSales: (limit: number, skip: number): Promise<AxiosResponse<any>> =>
    api.post(`${server_uri}/sale/getAllSales`, { limit, skip }),
  getUserSales: (userId: string): Promise<AxiosResponse<any>> =>
    api.get(`${server_uri}/sale/getUserSales/${userId}`),
};

export const getAllNftActivitys = async (data: any) => {
  return await axios.post(`${server_uri}/nft/getAllNftActivity`, data);
};

export const getAllUsersActivity = async () => {
  return await axios.get(`${server_uri}/user/getAllUsersActivity`, {
    headers: {
      authorization: 'Bearer ' + getCookie('token'),
    },
  });
};

export const getMedia = async () => {
  const res = await axios.get(`${server_uri}/homepage/get-media`);
  return res.data.media;
};

export const getSections = async () => {
  console.log('123');
  const res = await axios.get(`${server_uri}/homepage/get-sections`);
  return res.data;
};

export const getPrice = async (payload: any) => {
  const price = await axios.post(`${server_uri}/nft/matic-to-dolor`, payload);
  return price;
};

export const getContactsInfo = async () => {
  const token = getCookie('token');
  const contacts = await axios.get(`${server_uri}/info/get-contacts`, {
    headers: {
      authorization: 'Bearer ' + token,
    },
  });
  return contacts.data;
};

export const getSellerInfo = async () => {
  const token = getCookie('token');
  const seller = await axios.get(`${server_uri}/info/get-sellers`, {
    headers: {
      authorization: 'Bearer ' + token,
    },
  });
  return seller.data;
};

export const upsertContactInfo = async (payload: any) => {
  const token = getCookie('token');
  const contact = await axios.post(
    `${server_uri}/info/upsertContact`,
    payload,
    {
      headers: {
        authorization: 'Bearer ' + token,
      },
    },
  );
  return contact;
};

export const upsertSellerInfo = async (payload: any) => {
  const token = getCookie('token');
  const seller = await axios.post(`${server_uri}/info/upsertSeller`, payload, {
    headers: {
      authorization: 'Bearer ' + token,
    },
  });
  return seller;
};

export const getProperties = async () => {
  const token = getCookie('token');
  const properties = await axios.get(`${server_uri}/info/get-properties`, {
    headers: {
      authorization: 'Bearer ' + token,
    },
  });

  return properties.data;
};

export const upsertProperty = async (payload: any) => {
  const token = getCookie('token');
  const property = await axios.post(
    `${server_uri}/info/upsertProperty`,
    payload,
    {
      headers: {
        authorization: 'Bearer ' + token,
      },
    },
  );

  return property;
};
