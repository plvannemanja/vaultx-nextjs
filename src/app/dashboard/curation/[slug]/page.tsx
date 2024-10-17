'use client';

import NftCard from '@/app/components/Cards/NftCard';
import { useGlobalContext } from '@/app/components/Context/GlobalContext';
import { BaseDialog } from '@/app/components/ui/BaseDialog';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { FavoriteService } from '@/services/FavoriteService';
import { collectionServices } from '@/services/supplier';
import { ensureValidUrl, getYouTubeVideoId, trimString } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

const badges = [
  {
    label: 'Items',
    value: 'items',
  },
  {
    label: 'Activity',
    value: 'activity',
  },
];

const profileFilters = [
  {
    label: 'Price: Low To High',
    value: 1,
    param: 'price',
  },
  {
    label: 'Price: High To Low',
    value: -1,
    param: 'price',
  },
  {
    label: 'Recently Minted',
    value: -1,
    param: 'mintingTime',
  },
  {
    label: 'Recently Listed',
    value: -1,
    param: 'updatedAt',
  },
  {
    label: 'Most Favorited',
    value: -1,
    param: 'likes',
  },
  {
    label: 'Highest Last Sale',
    value: -1,
    param: 'price',
  },
  {
    label: 'NFC Minted',
    value: -1,
    param: 'createdAt',
  },
];

export default function Page({ params }: { params: { slug: string } }) {
  const [filterbadge, setFilterBadge] = useState(badges[0].value);
  const favoriteService = new FavoriteService();
  const { user } = useGlobalContext();

  const [showLess, setShowLess] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [curation, setCuration] = useState<any>({});
  const [curationInfo, setCurationInfo] = useState<any>({});
  const [nfts, setNfts] = useState([]);
  const [now, setNow] = useState(false);
  const [filters, setFilters] = useState<any>({
    filterString: '',
    filter: {
      label: 'Recently Listed',
      param: 'updatedAt',
      value: -1,
    },
  });

  const [activities, setActivities] = useState<any[]>([]);

  const [debouncedFilter] = useDebounce(filters, 1000);

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

  const setMyLike = async () => {
    try {
      await favoriteService.handleLikeCollections({
        collectionId: params.slug,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(user?.wallet);
  };

  const fetchActivities = async () => {
    const {
      data: { activity },
    } = await collectionServices.getAllActivitiesCollection({
      collectionId: params.slug,
      searchInput: filters?.filterString
    });
    setActivities(activity);
  };

  const fetchNFTs = async () => {
    const {
      data: { nfts },
    } = await collectionServices.getCollectionNfts({
      collectionId: params.slug,
      [filters.filter.param]: filters.filter.value,
    });

    setNfts(nfts);
  };

  const fetchLikes = async () => {
    const {
      data: { totalLikedCollection },
    } = await favoriteService.getCollectionTotalLikes({
      collectionId: params.slug,
    });

    const {
      data: { favorite },
    } = await favoriteService.getUserReactionToCollection({
      collectionId: params.slug,
    });
    setLikes(totalLikedCollection);
    setLiked(favorite);
  };
  const fetchData = async () => {
    fetchActivities();
    fetchNFTs();
    fetchLikes();

    const curationRes = await collectionServices.getCollectionById(params.slug);
    const curationInfoRes = await collectionServices.getCollectionInfo(
      params.slug,
    );
    setCuration(curationRes.data.collection);
    setCurationInfo(curationInfoRes.data.collection);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  useEffect(() => {
    if (filterbadge === 'items') {
      fetchNFTs();
    } else if (filterbadge === 'activity') {
      fetchActivities();
    }
  }, [debouncedFilter, filterbadge])
  if (!curation) return null;

  return (
    <div className="flex flex-col gap-y-4 px-4 mx-4 my-4">
      <div
        className={cn(
          'relative w-full transition-all duration-500 ease-in-out',
          'h-[340px]',
        )}
      >
        {curation?.bannerImage && (
          <Image
            src={curation?.bannerImage}
            alt="hero"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        )}
        <div className="w-full absolute bottom-4 flex justify-between px-5 z-20">
          <div
            className="flex gap-x-3 items-center p-3 rounded-xl text-white border border-[#FFFFFF4A] cursor-pointer"
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
          <div className="flex gap-4">
            <div className="flex w-[80px] pl-[15px] rounded-[30px] gap-x-3 p-3 border-2 items-center border-white bg-gray-600 cursor-pointer">
              <span className="font-medium">{likes}</span>
              <div onClick={() => handleLike()}>
                <input
                  title="like"
                  type="checkbox"
                  className="sr-only"
                  checked={liked}
                  onChange={() => { }}
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
            {user?.wallet && user?.wallet === curation.owner?.wallet && (
              <div className="flex w-[80px] pl-[15px] rounded-[30px] gap-x-3 p-3 border-2 items-center border-white bg-gray-600 cursor-pointer">
                <Link href={`/dashboard/curation/edit/${params.slug}`}>
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
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-5 md:flex-row md:gap-x-4">
        <div className="w-full md:w-[60%] flex flex-col">
          <div className="my-5 flex flex-wrap md:gap-x-3">
            <div>
              <p
                className="text-[#ffffff53] text-[14px] font-normal azeret-mono-font"
                dangerouslySetInnerHTML={{
                  __html: curation.description?.replace(/\r\n|\n/g, '<br />'),
                }}
              ></p>
              <span className="text-[#DDF247]">More...</span>
            </div>
            <div className="flex  justify-between gap-4">
              {curation?.youtube?.length > 0 &&
                curation?.youtube.map((item: any, index: number) => {
                  const imageId = getYouTubeVideoId(item.url);

                  return (
                    <div className="flex flex-col gap-y-3" key={index}>
                      <BaseDialog
                        trigger={
                          <div className="relative cursor-pointer rounded-xl">
                            <img
                              src={`https://img.youtube.com/vi/${imageId}/0.jpg`}
                              className="w-full aspect-video rounded-2xl"
                            />
                            <img
                              src="/icons/play.svg"
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            />
                          </div>
                        }
                        className="bg-[#111111] lg:min-w-[1400px] max-h-[80%] w-full overflow-y-auto overflow-x-hidden"
                      >
                        <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
                          <iframe
                            width="979"
                            height="675"
                            src={`https://www.youtube.com/embed/${imageId}?autoplay=1`}
                            title="item.title"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="min-w-[979px] min-h-[675px]"
                          ></iframe>
                        </div>
                      </BaseDialog>
                      <p className="text-center font-medium">{item.title}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="w-full md:w-[38%] py-4">
          <div className="h-[250px] py-4 flex flex-col gap-y-4 border-2 border-white/20 rounded-lg">
            <div className="px-4 flex justify-between items-center">
              <span className="text-lg font-medium">Items</span>
              <span>{curationInfo?.nftCount}</span>
            </div>
            <hr />
            <div className="px-4 flex justify-between items-center">
              <span className="text-lg font-medium">Artist</span>
              <span>{curationInfo?.artistCount}</span>
            </div>
            <hr />
            <div className="px-4 flex justify-between items-center">
              <span className="text-lg font-medium">Owner</span>
              <span>{curationInfo?.ownerCount}</span>
            </div>
            <hr />
            <div className="px-4 flex justify-between items-center">
              <span className="text-lg font-medium">Volume Ranking</span>
              <span>{curationInfo?.totalVolume}</span>
            </div>
          </div>
          <div className="w-full h-20 px-20 py-5 bg-white/0 rounded-xl border border-white/20 flex justify-center items-center my-4">
            <div className="flex gap-8">
              <div className="w-8 h-8 flex justify-center items-center relative">
                <Link href={ensureValidUrl(curation?.twitter)}>
                  <Image
                    layout="fill"
                    alt="twitter"
                    src="/icons/twitter-x.svg"
                    objectFit="cover"
                  ></Image>
                </Link>
              </div>
              <div className="w-8 h-8 flex justify-center items-center relative">
                <Link href={ensureValidUrl(curation?.website)}>
                  <Image
                    layout="fill"
                    alt="twitter"
                    src="/icons/discord.svg"
                    objectFit="cover"
                  ></Image>
                </Link>
              </div>
              <div className="w-8 h-8 flex justify-center items-center relative">
                <Link href={ensureValidUrl(curation?.facebook)}>
                  <Image
                    layout="fill"
                    alt="twitter"
                    src="/icons/telegram.svg"
                    objectFit="cover"
                  ></Image>
                </Link>
              </div>
              <div className="w-8 h-8 flex justify-center items-center relative">
                <Link href={ensureValidUrl(curation?.instagram)}>
                  <Image
                    layout="fill"
                    alt="twitter"
                    src="/icons/discord.svg"
                    objectFit="cover"
                  ></Image>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'relative w-full transition-all duration-500 ease-in-out',
          showLess ? 'h-[200px]' : 'h-[340px]',
        )}
      >
        {curation?.descriptionImage?.[0] && (
          <Image
            src={curation?.descriptionImage?.[0]}
            alt="hero"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        )}
      </div>

      <div className="flex gap-x-3 flex-wrap mt-[6rem]">
        {badges.map((badge, index) => {
          return (
            <Badge
              key={index}
              onClick={() => setFilterBadge(badge.value)}
              className={`px-[12px] py-[12px] rounded-[12px] font-extrabold text-[14px] border border-[#FFFFFF1F] cursor-pointer ${filterbadge === badge.value
                ? 'bg-neon text-black hover:text-black hover:bg-[#ddf247]'
                : 'hover:bg-[#232323] bg-transparent text-white'
                }`}
            >
              {badge.label}
            </Badge>
          );
        })}
      </div>

      <div className="flex flex-col gap-y-4">
        {/* Filters logic */}
        <div className="flex gap-4 my-4">
          <div className="flex gap-x-2 items-center border border-[#FFFFFF1F] rounded-xl px-2 w-full">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#fff"
            >
              <path
                d="M17 17L21 21"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            <input
              placeholder="Search by name or trait..."
              className="w-full bg-transparent border-none outline-none focus:outline-none azeret-mono-font"
              value={filters.filterString}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFilters({
                  ...filters,
                  filterString: e.target.value,
                });
              }}
            />
          </div>

          <Select
            onValueChange={(value: string) => {
              const filteredProfile = profileFilters.filter(
                (profile) => profile.label === value,
              )?.[0];
              if (filteredProfile) {
                setFilters({
                  ...filters,
                  filter: profileFilters,
                });
              }
            }}
            // value={profileFilters[0].label}
            defaultValue={profileFilters?.[0].label}
          >
            <SelectTrigger className="relative flex rounded min-w-[18rem] max-w-[20rem] justify-between items-center px-3 py-2 bg-transparent text-white pl-[37px] border border-[#FFFFFF1F]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectGroup>
                {profileFilters.map((filter, index: number) => (
                  <SelectItem value={filter.label} key={index}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* User section */}
        {filterbadge === 'items' && nfts.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nfts.map((item: any, index: number) => {
              return (
                <Link key={index} href={`/nft/${item._id}`}>
                  <NftCard data={item} />
                </Link>
              );
            })}
          </div>
        ) : null}

        {/* Activity section */}
        {filterbadge === 'activity' && activities.length ? (
          <div>
            <Table>
              <TableCaption>A list of your recent activity.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-[14px] text-[#fff]">
                    Event
                  </TableHead>
                  <TableHead className="text-[14px] text-[#fff]">
                    Item
                  </TableHead>
                  <TableHead className="text-[14px] text-[#fff]">
                    Price
                  </TableHead>
                  <TableHead className="text-[14px] text-[#fff]">
                    From
                  </TableHead>
                  <TableHead className="text-[14px] text-[#fff]">To</TableHead>
                  <TableHead className="text-[14px] text-[#fff]">
                    Date
                  </TableHead>
                  <TableHead className="text-right text-[14px] text-[#fff]">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="azeret-mono-font text-[14px]">
                      {item.state}
                    </TableCell>
                    <TableCell className="flex items-center gap-x-3">
                      <img
                        src={item.nftId.cloudinaryUrl}
                        className="w-12 h-12 object-contain rounded aspect-square "
                      />
                      <span className="azeret-mono-font text-[14px]">
                        {item.nftId.name}
                      </span>
                    </TableCell>
                    <TableCell>{item?.price ? item?.price : '-/-'}</TableCell>
                    <TableCell className="azeret-mono-font text-[14px] text-[#DDF247]">
                      {item?.from?.username
                        ? item.from.username
                        : item?.from?.wallet
                          ? trimString(item.from.wallet)
                          : item?.fromWallet
                            ? trimString(item?.fromWallet)
                            : '-/-'}
                    </TableCell>
                    <TableCell className="azeret-mono-font text-[14px] text-[#DDF247]">
                      {item?.to?.username
                        ? item?.to?.username
                        : item?.to?.wallet
                          ? trimString(item.to.wallet)
                          : item?.toWallet
                            ? trimString(item?.toWallet)
                            : '-/-'}
                    </TableCell>
                    <TableCell className="azeret-mono-font text-[14px] text-[#fff]">
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleString().slice(0, 10)
                        : '-/-'}
                    </TableCell>
                    <TableCell className="text-right azeret-mono-font text-[14px] text-[#fff]">
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleTimeString()
                        : '-/-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
