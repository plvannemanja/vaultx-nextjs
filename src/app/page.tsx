import { BaseHeader } from './components/Header/BaseHeader';
import BaseFooter from './components/Footer/BaseFooter';
import NFTList from './components/Dashboard/NFTList';
import { getSections } from '@/services/supplier';
import TrendingList from './components/Dashboard/TrendingList';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default async function Home() {
  const { section1, section2, section3, section4 } = await getData();
  return (
    <main className="font-manrope flex flex-col pt-4 bg-neutral-900">
      <BaseHeader />
      <div>
        <div className="flex justify-center">
          <TrendingList data={section2} />
        </div>
        <div className="flex justify-center">
          <NFTList />
        </div>
      </div>
      <BaseFooter />
    </main>
  );
}

async function getData() {
  try {
    const server_uri =
      process.env.Next_PUBLIC_APP_BACKEND_URL ||
      'https://tapi.vault-x.io/api/v1';

    // Fetch data from an API
    const { data } = await axios.get(`${server_uri}/homepage/get-sections`);

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      section1: null,
      section2: null,
      section3: null,
      section4: null,
    };
  }
}
