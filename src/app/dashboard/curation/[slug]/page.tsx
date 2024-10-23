/* eslint-disable @next/next/no-img-element */
'use client';

import NftCard from '@/app/components/Cards/NftCard';
import { useGlobalContext } from '@/app/components/Context/GlobalContext';
import { BaseDialog } from '@/app/components/ui/BaseDialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, truncate } from '@/lib/utils';
import { FavoriteService } from '@/services/FavoriteService';
import { collectionServices } from '@/services/supplier';
import { ensureValidUrl, getYouTubeVideoId, trimString } from '@/utils/helpers';
import {
  Archive,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  Copy,
  Edit,
  Facebook,
  Heart,
  Instagram,
  Search,
  Twitter,
} from 'lucide-react';
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
    label: 'Price: high to low',
    value: -1,
    param: 'price',
  },
  {
    label: 'Price: low to high',
    value: 1,
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

const activityFilters = [
  {
    label: 'All',
    param: '',
  },
  {
    label: 'Minted',
    param: 'Minted',
  },
  {
    label: 'Listed',
    param: 'Listed',
  },
  {
    label: 'Unlisted',
    param: 'End Sale',
  },
  {
    label: 'Purchased',
    param: 'Purchased',
  },
  {
    label: 'In Escrow',
    param: 'In Escrow',
  },
  {
    label: 'Transfer',
    param: 'Transfer',
  },
  {
    label: 'Burn',
    param: 'Burn',
  },
  {
    label: 'Royalties',
    param: 'Royalties',
  },
  {
    label: 'Split Payments',
    param: 'Split Payments',
  },
];

export default function Page({ params }: { params: { slug: string } }) {
  const [loadMore, setLoadMore] = useState(false);
  const [filterbadge, setFilterBadge] = useState(badges[0].value);
  const favoriteService = new FavoriteService();
  const { user, mediaImages } = useGlobalContext();

  const [showLess, setShowLess] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [curation, setCuration] = useState<any>({});
  const [curationInfo, setCurationInfo] = useState<any>({});
  const [nfts, setNfts] = useState([]);
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

  const [debouncedLiked] = useDebounce(liked, 1000);

  const handleLike = async () => {
    try {
      setLiked(!liked);
      if (!liked === true) setLikes(likes + 1);
      else if (!liked === false) setLikes(likes - 1);
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

  useEffect(() => {
    if (debouncedLiked) {
      setMyLike();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLiked]);

  const copyAddr = () => {
    navigator.clipboard.writeText(curation.owner?.wallet);
  };

  const fetchActivities = async () => {
    const {
      data: { activity },
    } = await collectionServices.getAllActivitiesCollection({
      collectionId: params.slug,
      searchInput: filters?.filterString,
      filterInput: filters?.filter,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, filterbadge]);

  if (!curation) return null;

  const description = truncate(
    curation.description?.replace(/\r\n|\n/g, '<br />'),
    150,
  );

  return (
    <div className="flex flex-col gap-y-4 px-4 mx-4 my-4">
      <div
        className={cn(
          'relative w-full transition-all duration-500 ease-in-out',
          'h-[340px]',
        )}
      >
        {curation?.logo && (
          <Image
            src={curation?.logo}
            alt="hero"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        )}
        <div className="w-full absolute bottom-4 flex items-center justify-between px-5 z-20">
          {curation.owner?.wallet && (
            <div
              className="flex gap-x-3 h-10 text-sm backdrop-blur-sm items-center p-3 rounded-xl text-white border border-white/[29%] cursor-pointer"
              onClick={() => copyAddr()}
            >
              {trimString(curation.owner?.wallet)}
              <Copy className="w-5 h-5" />
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex px-5 py-3 backdrop-blur-sm h-12 rounded-full gap-x-3 p-3 border items-center border-[#151515]/30 bg-black/40 cursor-pointer">
              <span className="font-medium">{likes}</span>
              <div className="checkmark" onClick={() => handleLike()}>
                <Heart
                  className={cn(
                    'w-5 h-5',
                    liked ? 'fill-white' : 'stroke-white',
                  )}
                />
              </div>
            </div>
            {user?.wallet && user?.wallet === curation.owner?.wallet && (
              <Link href={`/dashboard/curation/edit/${params.slug}`}>
                <div className="flex px-5 py-3 gap-x-3 p-3 h-12 rounded-full border items-center border-[#151515]/30 bg-black/40 cursor-pointer">
                  <Edit className="w-5 h-5" />
                  <div className="text-white text-base font-medium">Edit</div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-5 md:flex-row md:gap-x-4">
        <div className="w-full md:w-[60%] flex flex-col">
          <div className="my-5 md:gap-x-3">
            <div>
              <p
                className="text-[#ffffff53] text-sm font-normal azeret-mono-font"
                dangerouslySetInnerHTML={{
                  __html: loadMore
                    ? curation.description?.replace(/\r\n|\n/g, '<br />')
                    : description,
                }}
              ></p>
              {description?.length > 150 ? (
                <span
                  className="text-[#DDF247] cursor-pointer"
                  onClick={() => setLoadMore((prev) => !prev)}
                >
                  {loadMore ? 'View less...' : 'More...'}
                </span>
              ) : null}
            </div>
            <div className="flex justify-between gap-4 mt-4">
              {curation?.youtube?.length > 0 &&
                curation?.youtube.map((item: any, index: number) => {
                  if (!item.title) return null;
                  const imageId = getYouTubeVideoId(item.url);
                  if (!imageId) return null;
                  return (
                    <div className="flex flex-col gap-y-3" key={index}>
                      <BaseDialog
                        trigger={
                          <div className="relative cursor-pointer rounded-xl">
                            <img
                              src={`https://img.youtube.com/vi/${imageId}/0.jpg`}
                              className="w-full aspect-video rounded-2xl object-cover"
                              alt="youtube"
                              width={300}
                              height={311}
                            />
                            <Image
                              src="/icons/play.svg"
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                              alt="play"
                              width={40}
                              height={40}
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
                      <p className="text-center text-2xl font-medium font-satoshi truncate">
                        {item.title}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-y-7 md:w-[38%] py-4">
          <div className="flex flex-col border bg-white/[1%] border-white/20 rounded-lg">
            <div className="px-4 py-4 flex justify-between items-center">
              <span className="text-lg font-medium azeret-mono-font text-[#96989B]">
                Items
              </span>
              <span className="font-bold">{curationInfo?.nftCount}</span>
            </div>
            <hr className="border-dashed border-white/10" />
            <div className="px-4 py-4 flex justify-between items-center">
              <span className="text-lg font-medium azeret-mono-font text-[#96989B]">
                Artist
              </span>
              <span className="font-bold">{curationInfo?.artistCount}</span>
            </div>
            <hr className="border-dashed border-white/10" />
            <div className="px-4 py-4 flex justify-between items-center">
              <span className="text-lg font-medium azeret-mono-font text-[#96989B]">
                Owner
              </span>
              <span className="font-bold">{curationInfo?.ownersCount}</span>
            </div>
            <hr className="border-dashed border-white/10" />
            <div className="px-4 py-4 flex justify-between items-center">
              <span className="text-lg font-medium azeret-mono-font text-[#96989B]">
                Volume Ranking
              </span>
              <span className="font-bold">{curationInfo?.totalVolume}</span>
            </div>
          </div>
          <div className="w-full h-20 px-20 py-4 rounded-xl border bg-white/[1%] border-white/20 flex justify-center items-center">
            <div className="flex gap-x-8">
              <div className="w-8 h-8 flex justify-center items-center border border-white rounded-full">
                <Link href={ensureValidUrl(curation?.twitter)}>
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_3474_12420)">
                      <path
                        d="M10.9183 18.3327C15.5207 18.3327 19.2516 14.6017 19.2516 9.99935C19.2516 5.39697 15.5207 1.66602 10.9183 1.66602C6.31592 1.66602 2.58496 5.39697 2.58496 9.99935C2.58496 14.6017 6.31592 18.3327 10.9183 18.3327Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.58496 10H19.2516"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.9183 18.3327C12.7593 18.3327 14.2516 14.6017 14.2516 9.99935C14.2516 5.39697 12.7593 1.66602 10.9183 1.66602C9.07734 1.66602 7.58496 5.39697 7.58496 9.99935C7.58496 14.6017 9.07734 18.3327 10.9183 18.3327Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.02539 4.22461C6.53343 5.73265 8.61676 6.6654 10.9179 6.6654C13.2191 6.6654 15.3025 5.73265 16.8105 4.22461"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.7031 15.4408C15.195 13.9327 13.1117 13 10.8105 13C8.50934 13 6.42601 13.9327 4.91797 15.4408"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3474_12420">
                        <rect
                          width="20"
                          height="20"
                          fill="white"
                          transform="translate(0.917969)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
              </div>
              <div className="w-8 h-8 flex justify-center items-center border border-white rounded-full">
                <Link href={ensureValidUrl(curation?.website)}>
                  <Twitter className="w-5 h-5 fill-white stroke-none" />
                </Link>
              </div>
              <div className="w-8 h-8 flex justify-center items-center border border-white rounded-full">
                <Link href={ensureValidUrl(curation?.facebook)}>
                  <Facebook className="w-5 h-5 fill-white stroke-none" />
                </Link>
              </div>
              <div className="w-8 h-8 flex justify-center items-center border border-white rounded-full">
                <Link href={ensureValidUrl(curation?.instagram)}>
                  <Instagram className="w-5 h-5 " />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div
          data-aos={showLess ? 'fade-up' : 'fade-down'}
          className={cn(
            'w-full transition-all duration-500 ease-in-out relative data-[aos="fade-up"]:h-[200px] data-[aos="fade-down"]:h-full data-[aos="fade-up"]:before:absolute data-[aos="fade-up"]:before:top-0 data-[aos="fade-up"]:before:left-0 data-[aos="fade-up"]:before:w-full data-[aos="fade-up"]:before:h-full data-[aos="fade-up"]:before:z-10 data-[aos="fade-up"]:before:bg-gradient-to-b data-[aos="fade-up"]:before:to-[#111] data-[aos="fade-up"]:before:from-[#111]/[23%] data-[aos="fade-up"]:before:content-[""] overflow-hidden',
            // showLess
            //   ? 'h-[200px] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:z-10 before:bg-gradient-to-b before:to-[#111] before:from-[#111]/[23%] before:content-[""]'
            //   : '',
            Array.isArray(curation?.descriptionImage) &&
            curation?.descriptionImage.length === 2 &&
            'flex space-x-4',
          )}
        >
          <div
            className={cn(showLess ? 'w-full h-full' : 'min-h-[340px] w-full')}
          >
            {Array.isArray(curation?.descriptionImage) &&
              curation?.descriptionImage.map((image, index) => (
                <div
                  className={cn(
                    'w-full',
                    curation?.descriptionImage?.length === 2 && 'md:w-1/2',
                  )}
                  key={index}
                >
                  <Image
                    src={image}
                    alt="hero"
                    className="rounded-xl w-full h-full"
                    width={960}
                    height={960}
                  />
                </div>
              ))}
          </div>
          {showLess ? (
            <ChevronsDown
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 text-[#DDF247] z-20"
              onClick={() => {
                setShowLess(!showLess);
              }}
            />
          ) : (
            <ChevronsUp
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 text-[#DDF247] z-20"
              onClick={() => {
                setShowLess(!showLess);
              }}
            />
          )}
        </div>
      </div>
      <div className="flex gap-x-3 flex-wrap mt-16">
        {badges.map((badge, index) => {
          return (
            <Badge
              key={index}
              onClick={() => setFilterBadge(badge.value)}
              className={`px-4 py-3 rounded-xl font-extrabold text-sm border border-white/[12%] cursor-pointer ${filterbadge === badge.value
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
          <div className="flex gap-x-2 items-center bg-[#232323]/[14%]  border border-white/[12%] rounded-xl px-6 py-[15px] w-full">
            <Search className="w-5 h-5 text-white" />
            <input
              placeholder="Search by name or trait..."
              className="w-full text-sm text-white/[53%] placeholder:text-white/[53%] placeholder:text-sm bg-transparent border-none outline-none focus:outline-none azeret-mono-font"
              value={filters.filterString}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFilters({
                  ...filters,
                  filterString: e.target.value,
                });
              }}
            />
          </div>
          {filterbadge === 'items' && (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex gap-x-1 rounded-[12px] min-w-[14rem] max-w-[16rem] h-full items-center p-3 py-[10px] bg-transparent text-white border border-white/[12%]">
                <div className="flex items-center flex-1 gap-x-2">
                  <Archive className="w-4 h-4" />
                  <span className="font-extrabold text-xs">
                    {filters?.filter
                      ? filters.filter.label
                      : profileFilters?.[0].label || 'Price: high to low'}
                  </span>
                </div>

                <ChevronDown className="w-4 h-4 text-white/30" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[14rem] max-w-[16rem]">
                <DropdownMenuGroup>
                  {profileFilters.map((item, index: number) => (
                    <DropdownMenuItem
                      onClick={() => {
                        const filteredProfile = profileFilters.filter(
                          (profile) => profile.label === item?.label,
                        )?.[0];
                        if (filteredProfile) {
                          setFilters({
                            ...filters,
                            filter: filteredProfile,
                          });
                        }
                      }}
                      key={index}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* {filterbadge === 'items' && (
            <Select
              onValueChange={(value: string) => {
                if (filterbadge === 'items') {
                  {
                    const filteredProfile = profileFilters.filter(
                      (profile) => profile.label === value,
                    )?.[0];
                    if (filteredProfile) {
                      setFilters({
                        ...filters,
                        filter: filteredProfile,
                      });
                    }
                  }
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
          )} */}
          {/* <Select
            onValueChange={(value: string) => {
              const filteredProfile = activityFilters.filter(
                (profile) => profile.label === value,
              )?.[0];
              if (filteredProfile) {
                setFilters({
                  ...filters,
                  filter: filteredProfile,
                });
              }
            }}
            // value={profileFilters[0].label}
            defaultValue={activityFilters?.[0].label}
          >
            <SelectTrigger className="relative flex rounded min-w-[18rem] max-w-[20rem] justify-between items-center px-3 py-2 bg-transparent text-white pl-[37px] border border-[#FFFFFF1F]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectGroup>
                {activityFilters.map((filter, index: number) => (
                  <SelectItem value={filter.label} key={index}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
          {filterbadge === 'activity' && (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex gap-x-1 rounded-[12px] min-w-[14rem] max-w-[16rem] h-full items-center p-3 py-[10px] bg-transparent text-white border border-white/[12%]">
                <div className="flex items-center flex-1 gap-x-2">
                  <Archive className="w-4 h-4" />
                  <span className="font-extrabold text-xs">
                    {filters?.filter
                      ? filters.filter.label
                      : activityFilters?.[0].label || 'Price: high to low'}
                  </span>
                </div>

                <ChevronDown className="w-4 h-4 text-white/30" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[14rem] max-w-[16rem]">
                <DropdownMenuGroup>
                  {activityFilters.map((item, index: number) => (
                    <DropdownMenuItem
                      onClick={() => {
                        const filteredProfile = activityFilters.filter(
                          (profile) => profile.label === item?.label,
                        )?.[0];
                        if (filteredProfile) {
                          setFilters({
                            ...filters,
                            filter: filteredProfile,
                          });
                        }
                      }}
                      key={index}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {/* User section */}
        {filterbadge === 'items' && nfts.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-4">
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
                  <TableHead className="w-[100px] text-sm text-white">
                    Event
                  </TableHead>
                  <TableHead className="text-sm text-white">Item</TableHead>
                  <TableHead className="text-sm text-white">Price</TableHead>
                  <TableHead className="text-sm text-white">From</TableHead>
                  <TableHead className="text-sm text-white">To</TableHead>
                  <TableHead className="text-sm text-white">Date</TableHead>
                  <TableHead className="text-right text-sm text-white">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="azeret-mono-font text-sm">
                      {item.state}
                    </TableCell>
                    <TableCell className="flex items-center gap-x-3">
                      <img
                        src={item.nftId.cloudinaryUrl}
                        alt={item.nftId.name}
                        className="w-12 h-12 object-contain rounded aspect-square"
                      />
                      <span className="azeret-mono-font text-sm font-semibold">
                        {item.nftId.name}
                      </span>
                    </TableCell>
                    <TableCell>{item?.price ? item?.price : '-/-'}</TableCell>
                    <TableCell className="azeret-mono-font text-sm text-[#DDF247]">
                      {item?.from?.username
                        ? item.from.username
                        : item?.from?.wallet
                          ? trimString(item.from.wallet)
                          : item?.fromWallet
                            ? trimString(item?.fromWallet)
                            : '-/-'}
                    </TableCell>
                    <TableCell className="azeret-mono-font text-sm text-[#DDF247]">
                      {item?.to?.username
                        ? item?.to?.username
                        : item?.to?.wallet
                          ? trimString(item.to.wallet)
                          : item?.toWallet
                            ? trimString(item?.toWallet)
                            : '-/-'}
                    </TableCell>
                    <TableCell className="azeret-mono-font text-sm text-white">
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleString().slice(0, 10)
                        : '-/-'}
                    </TableCell>
                    <TableCell className="text-right azeret-mono-font text-sm text-white">
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
