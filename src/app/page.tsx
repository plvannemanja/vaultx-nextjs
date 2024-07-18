import { BaseHeader } from './components/Header/BaseHeader';
import BaseFooter from './components/Footer/BaseFooter';
import NFTList from './components/Dashboard/NFTList';
import TrendingList from './components/Dashboard/TrendingList';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import NewsCard from './components/ui/NewsCard';

export default async function Home() {
  const { section1, section2, section3, section4 } = await getData();
  return (
    <main className="flex flex-col bg-neutral-900">
      <BaseHeader />
      <div>
        <div className="flex justify-center">
          <TrendingList data={section2} />
        </div>
        <div className="flex justify-center">
          <NFTList />
        </div>
        <div className="flex justify-center w-full">
          <NewsCard
            heading={'News and Event'}
            description={section4?.description}
            data={section4?.box}
          />
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
