'use client';

import { FavoriteService } from '@/services/FavoriteService';
import { collectionServices } from '@/services/supplier';
import { useEffect, useRef, useState } from 'react';
import { getYouTubeVideoId, trimString } from '@/utils/helpers';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SearchWithDropDown from '@/app/components/Filters/SearchWithDropDown';
import NftCard from '@/app/components/Cards/NftCard';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useGlobalContext } from '@/app/components/Context/GlobalContext';
import { useRouter } from 'next/navigation';

interface IData {
  collection?: any;
  activity?: any;
  nft?: any;
  likes?: any;
  info?: any;
  userReacted?: any;
}

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const favoriteService = new FavoriteService();
  const { user } = useGlobalContext();

  const [data, setData] = useState<null | IData>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [now, setNow] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const [tab, setTab] = useState('items');
  const [filters, setFilters] = useState<any>({
    filterString: '',
    filter: {
      price: null,
    },
  });

  const [expandImage, setExpandImage] = useState(false);
  const [heightExpand, setHeightExpand] = useState(1000);

  const containerRef = useRef(null);

  const getImageDimensions = (imageUrl: any, callback: any) => {
    if (!containerRef.current) return;
    const containerWidth = (containerRef.current as any).offsetWidth;

    // @ts-ignore
    const img = new Image();

    img.onload = function () {
      const width = img.width;
      const height = img.height;

      const aspectRatio = width / height;
      if (containerWidth) {
        const newWidth = containerWidth;
        const newHeight = newWidth / aspectRatio;
        setHeightExpand(newHeight);

        callback(newWidth, newHeight);
      } else {
        callback(width, height);
      }
    };

    // Handle potential errors
    img.onerror = function () {
      console.error('Error loading the image.');
      callback(null, null);
    };

    // Set the image source to the provided URL
    img.src = imageUrl;
  };

  const handleLike = async () => {
    try {
      setLiked(!liked);
      if (!liked === true) setLikes(likes + 1);
      else if (!liked === false) setLikes(likes - 1);
      setNow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(user?.wallet);
  };

  useEffect(() => {
    const fetchData = async () => {
      const collection = await collectionServices.getCollectionById(
        params.slug,
      );
      // const activity = await collectionServices.getAllActivitiesCollection({
      //     collectionId: params.slug
      // })
      // const nft = await collectionServices.getCollectionNfts({
      //     collectionId: params.slug,
      //     filter: {},
      //     filterString: ''
      // })
      // const likes = await favoriteService.getCollectionTotalLikes({
      //     collectionId: params.slug
      // })

      setData({
        collection: collection.data.collection,
      });
    };

    fetchData();
  }, [params.slug]);
  return (
    <div className="flex flex-col gap-y-4 px-4">
      {data && (
        <>
          <div className="relative">
            <Image
              src={data.collection.bannerImage}
              alt="hero"
              width={100}
              height={100}
              quality={100}
              className="w-full object-cover rounded-xl h-[340px]"
            />

            <div className="w-full absolute bottom-4 flex justify-between px-5 z-20">
              <div
                className="flex gap-x-3 items-center p-3 rounded-xl text-white border-2 border-white cursor-pointer"
                onClick={() => copyAddr()}
              >
                {trimString(user?.wallet)}
                <svg
                  width="24px"
                  height="24px"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#fff"
                >
                  <path
                    d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              <div className="inline-block">
                <div className="flex w-[80px] pl-[15px] rounded-[30px] gap-x-3 p-3 border-2 items-center border-white bg-gray-600 cursor-pointer">
                  <span className="font-medium">{likes}</span>
                  <div onClick={() => handleLike()}>
                    <input
                      title="like"
                      type="checkbox"
                      className="sr-only"
                      checked={liked}
                    />
                    <div className="checkmark">
                      {liked ? (
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          color="#fff"
                          strokeWidth="1.5"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z"
                            fill="#fff"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          width="24px"
                          height="24px"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          color="#fff"
                        >
                          <path
                            d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                {
                  (user?.wallet === data.collection.owner) && (
                    <div className="flex w-[80px] pl-[15px] rounded-[30px] gap-x-3 p-3 border-2 items-center border-white bg-gray-600 cursor-pointer">
                      <div onClick={() => router.push(`/dashboard/curation/edit/${params.slug}`)}>
                        <svg
                          width="27"
                          height="26"
                          viewBox="0 0 27 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.9515 5.41667H6.53483C5.33821 5.41667 4.36816 6.38672 4.36816 7.58334V19.5C4.36816 20.6966 5.33821 21.6667 6.53483 21.6667H18.4515C19.6481 21.6667 20.6182 20.6966 20.6182 19.5V14.0833M19.0861 3.8846C19.9322 3.03847 21.3041 3.03847 22.1502 3.8846C22.9964 4.73074 22.9964 6.1026 22.1502 6.94873L12.849 16.25H9.78483L9.78483 13.1859L19.0861 3.8846Z"
                            stroke="white"
                            strokeWidth="2.16667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="text-white text-base font-medium">Edit</div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-5 md:flex-row md:gap-x-4">
            <div className="w-full md:w-[60%] flex flex-col">
              <div className="text-sm">
                <span>
                  {!showLess
                    ? `${data.collection.description.slice(0, 400)}`
                    : data.collection.description}{' '}
                </span>
                <span
                  className="text-neon"
                  onClick={() => setShowLess(!showLess)}
                >
                  {showLess ? 'less' : 'More...'}
                </span>
              </div>
              <div className="my-5 flex flex-wrap md:gap-x-3">
                {data.collection.youtube.length > 0
                  ? data.collection.youtube.map((item: any, index: number) => {
                    const imageId = getYouTubeVideoId(item.url);

                    return (
                      <div
                        className="flex flex-col gap-y-3 w-[20rem]"
                        key={index}
                      >
                        <div
                          className="relative cursor-pointer"
                          onClick={() => {
                            window.open(item.url, '_blank');
                          }}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${imageId}/0.jpg`}
                            className="w-full aspect-video"
                          />
                          <img
                            src="/icons/play.svg"
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          />
                        </div>
                        <p className="text-center font-medium">
                          {item.title}
                        </p>
                      </div>
                    );
                  })
                  : null}
              </div>
            </div>
            <div className="w-full md:w-[38%] h-[250px] py-4 flex flex-col gap-y-4 border-2 border-gray-500 rounded-lg">
              <div className="px-4 flex justify-between items-center">
                <span className="text-lg font-medium">Items</span>
                <span>15</span>
              </div>
              <hr />
              <div className="px-4 flex justify-between items-center">
                <span className="text-lg font-medium">Artist</span>
                <span>15</span>
              </div>
              <hr />
              <div className="px-4 flex justify-between items-center">
                <span className="text-lg font-medium">Owner</span>
                <span>15</span>
              </div>
              <hr />
              <div className="px-4 flex justify-between items-center">
                <span className="text-lg font-medium">Volume Ranking</span>
                <span>15</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
