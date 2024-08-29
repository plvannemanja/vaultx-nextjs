import axios, { AxiosResponse } from 'axios';
import { getCookie } from '../lib/cookie';

const server_uri = process.env.NEXT_PUBLIC_APP_BACKEND_URL || 'https://tapi.vault-x.io/api/v1';

interface NftData {
  [key: string]: any; // Define this more strictly based on your actual data structure
}

interface NftServices {
  token: string | undefined;
  deleteNftDb(data: NftData): Promise<AxiosResponse<any>>;
  getNftByUserId(data: NftData): Promise<AxiosResponse<any>>;
  getNftMintedByUser(data: NftData): Promise<AxiosResponse<any>>;
  getNftById(id: string): Promise<AxiosResponse<any>>;
  getAllNfts(data: NftData): Promise<AxiosResponse<any>>;
  addView(data: NftData): Promise<AxiosResponse<any>>;
  getNftOfUser(data: NftData): Promise<AxiosResponse<any>>;
}

class NftServices {
  token: string | undefined;

  constructor() {
    this.token = getCookie('token') as string | undefined;
  }

  async deleteNftDb(data: NftData): Promise<AxiosResponse<any>> {
    return axios.post(`${server_uri}/nft/delete`, data, {
      headers: {
        authorization: 'Bearer ' + this.token,
      },
    });
  }

  async getNftByUserId(data: NftData): Promise<AxiosResponse<any>> {
    return axios.post(`${server_uri}/nft/getNftByUserId`, data, {
      headers: {
        authorization: 'Bearer ' + this.token,
      },
    });
  }

  async getNftMintedByUser(data: NftData): Promise<AxiosResponse<any>> {
    return axios.post(`${server_uri}/nft/getNftMintedByUser`, data, {
      headers: {
        authorization: 'Bearer ' + this.token,
      },
    });
  }

  async getNftById(id: string): Promise<AxiosResponse<any>> {
    return axios.get(`${server_uri}/nft/getNftById/${id}`);
  }

  async getAllNfts(data: NftData): Promise<AxiosResponse<any>> {
    return axios.post(`${server_uri}/nft/getAll`, data, {
      headers: {
        authorization: 'Bearer ' + this.token,
      },
    });
  }

  async addView(data: NftData): Promise<AxiosResponse<any>> {
    return axios.post(`${server_uri}/nft/add-view`, data);
  }

  async getNftOfUser(data: NftData): Promise<AxiosResponse<any>> {
    return axios.post(`${server_uri}/nft/getNftByUser`, data, {
      headers: {
        authorization: 'Bearer ' + this.token,
      },
    });
  }
}

export default NftServices;
