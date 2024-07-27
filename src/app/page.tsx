import { BaseHeader } from './components/Header/BaseHeader';
import BaseFooter from './components/Footer/BaseFooter';
import NFTList from './components/Dashboard/NFTList';
import { collectionServices, getMedia } from '@/services/supplier';
import TrendingList from './components/Dashboard/TrendingList';
import axios from 'axios';
import NewsCard from './components/ui/NewsCard';
import ArtistsCard from './components/Cards/ArtistsCard';
import { Label } from '@/components/ui/label';
import ExceptionalCard from './components/Cards/ExceptionalCard';
import OwlCarousel from './components/Carousels/OwlCarousel';

const createTitleComp = (title: string, color: Array<{ word: number, color: string }>) => {
  return (
    <h1 className='text-2xl font-medium lg:text-4xl lg:font-bold text-center'>
      {title.split(' ').map((word, index) => {
        const colorIndex = color.findIndex((item) => item.word === index + 1);
        return (
          <span key={index} style={{
            color: colorIndex !== -1 ? color[colorIndex].color : 'white'
          }}>{word} </span>
        );
      })}
    </h1>
  );
}

export default async function Home() {
  const { section1, section2, section3, section4, images, curations } = await getData();
  return (
    <main className="flex flex-col pt-4 bg-neutral-900">
      <BaseHeader />
      <OwlCarousel>
        {images.homeAutority?.filter((item: any) => item.image).map((item: any, i: number) => {
          return (
            <div
              key={i}
              className="hero__content__blk md:p-20 p-8 h-full relative min-h-[500px] md:min-h-[600px] mmd:min-h-[700px]"
            >
              <a
                href={item.link ? item.link : "#"}
                target="_blank">
                <img
                  src={item.image}
                  className="absolute z-0 left-0 right-0 top-0 bottom-0 object-cover w-full h-full"
                  alt=""
                />
              </a>
              <div className="h-1/4 bg-gradient-to-b from-transparent via-[#121211aa] to-[#121211] absolute bottom-0 left-0 right-0 z-10"></div>
            </div>
          );
        })}
      </OwlCarousel>
      <div className="py-20 w-full px-10 lg:px-20">
        <div className="flex flex-col gap-y-2 justify-center text-center items-center my-10 text-white flex-wrap">
          {
            section1.title ? createTitleComp(section1.title, section1.color) : null
          }
          {
            section1.description ? <Label className="text-sm md:text-lg">{section1.description}</Label> : null
          }
        </div>
        <div className="flex md:gap-8 flex-wrap gap-5 justify-center">
          {
            section1.box.length > 0 ?
              section1.box.map((item: any, index: number) => {
                return (
                  <ArtistsCard
                    key={index}
                    image={item.image}
                    title={item.title}
                    subtitle1={item.subtitle1}
                    subtitle2={item.subtitle2}
                  />
                )
              }) : null
          }
        </div>
      </div>
      <div className="py-20">
        <div className="flex justify-center">
          <TrendingList data={section2} />
        </div>
        <div className="py-20">
          <div className="flex flex-col gap-y-2 justify-center text-center items-center my-10 text-white flex-wrap">
            {
              section3.title ? createTitleComp(section3.title, section3.color) : null
            }
            {
              section3.description ? <Label className="text-sm md:text-lg text-gray-300">{section3.description}</Label> : null
            }
          </div>
          <div className="flex md:gap-8 flex-wrap gap-5 justify-start">
            {
              curations.length > 0 ?
                curations.map((item: any, index: number) => {
                  return (
                    <ExceptionalCard
                      key={index}
                      logo={item.logo}
                      name={item.name}
                    />
                  )
                }) : null
            }
          </div>
        </div>
        <div className="flex justify-center">
          <NFTList />
        </div>
      </div>
      <div className="py-20">
        <NewsCard
          heading={createTitleComp(section4.title, section4.color)}
          description={section4.description}
          data={section4.box}
        />
      </div>
      <div className="py-10 flex justify-center items-center">
        <a target='_blank' href={images.bottomBaner ? images.bottomBaner.link : ''} className='w-full'>
          <img src={images.bottomBaner ? images.bottomBaner.image : ''} alt="newsletter" className="w-full" />
        </a>
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
    const images = await getMedia();
    let curations: any[] = [];

    if (data.section3 && data.section3.box.length > 0) {
      await data.section3.box.forEach(async (item: string) => {
        const { data: { collection } } = await collectionServices.getCollectionById(item.split("/")[5])
        console.log(collection)

        if (collection) {
          curations.push(collection)
        }
      })
    }

    return {
      ...data,
      images: images,
      curations: curations
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      section1: null,
      section2: null,
      section3: null,
      section4: null,
      images: null,
      curations: null
    };
  }
}
