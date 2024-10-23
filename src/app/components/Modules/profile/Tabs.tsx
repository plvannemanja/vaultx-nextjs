'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popOver';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getExplorerURL } from '@/lib/helper';
import { cn } from '@/lib/utils';
import { CreateSellService } from '@/services/createSellService';
import { FavoriteService } from '@/services/FavoriteService';
import NftServices from '@/services/nftService';
import { collectionServices, getAllUsersActivity } from '@/services/supplier';
import { trimString } from '@/utils/helpers';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Check, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import ArtistsCard from '../../Cards/ArtistsCard';
import CurationCard from '../../Cards/CurationCard';
import NftCard from '../../Cards/NftCard';
import FireIcon from '../../Icons/nft/fire';
import InEscrowIcon from '../../Icons/nft/InEscrow';
import ListIcon from '../../Icons/nft/list';
import ProjectIcon from '../../Icons/nft/project';
import PurchaseIcon from '../../Icons/nft/purchase';
import SparklesIcon from '../../Icons/nft/sparkless';
import SubscriptionIcon from '../../Icons/nft/subscription';
import TransferIcon from '../../Icons/nft/trasnfer';
import Unlisted from '../../Icons/nft/unlisted';

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

const earnFilters = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Royalties',
    value: 'Royalties',
  },
  {
    label: 'Split Payment',
    value: 'Split Payments',
  },
];

const curationFilters = [
  {
    label: 'Number of Artworks',
    value: -1,
    param: 'nftCount',
  },
  {
    label: 'Number of Artists',
    value: -1,
    param: 'artistCount',
  },
  {
    label: 'Highest Volume',
    value: -1,
    param: 'totalVolume',
  },
  {
    label: 'New Curation',
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

export enum ProfileTabs {
  All = 'all',
  Own = 'owned',
  Created = 'created',
  Curation = 'curation',
  Activity = 'activity',
  Favorite = 'fav',
  Order = 'order',
  Earn = 'earn',
}

export default function Tabs({ tab }: { tab: ProfileTabs }) {
  const favoriteService = new FavoriteService();
  const nftService = new NftServices();
  const createAndSellService = new CreateSellService();
  const { toast } = useToast();

  const router = useRouter();
  const [favType, setFavType] = useState<string>('nft');
  const [categoryActive, setCategoryActive] = useState(false);
  const [filters, setFilters] = useState<any>({
    searchInput: '',
    earnFilter: {
      label: earnFilters[0].label,
      value: earnFilters[0].value,
    },
    filter: {
      value: profileFilters[0].value,
      label: profileFilters[0].label,
      param: profileFilters[0].param,
    },
    curationFilter: {
      label: curationFilters[0].label,
      value: curationFilters[0].value,
    },
    activityFilter: activityFilters[0],
  });

  const [data, setData] = useState<any>({
    [ProfileTabs.All]: null,
    [ProfileTabs.Own]: null,
    [ProfileTabs.Created]: null,
    [ProfileTabs.Curation]: null,
    [ProfileTabs.Activity]: null,
    [ProfileTabs.Favorite]: null,
    [ProfileTabs.Order]: null,
    [ProfileTabs.Earn]: null,
  });

  const isEarn = useMemo(() => {
    if (tab === ProfileTabs.Earn) {
      return true;
    }

    return false;
  }, [tab]);

  const categoryTab = useMemo(() => {
    if (tab == ProfileTabs.Earn) return 'earnFilter';
    else if (tab == ProfileTabs.Curation) return 'curationFilter';
    else if (tab == ProfileTabs.Activity) return 'activityFilter';
    else if (tab == ProfileTabs.Favorite) {
      if (favType == 'artist' || favType == 'nft') {
        return 'filter';
      } else return 'curationFilter';
    }
    return 'filter';
  }, [tab, favType]);

  const categoryList = useMemo(() => {
    if (tab == ProfileTabs.Earn) return earnFilters;
    else if (tab == ProfileTabs.Curation) return curationFilters;
    else if (tab == ProfileTabs.Activity) return activityFilters;
    else if (tab == ProfileTabs.Favorite) {
      if (favType == 'artist' || favType == 'nft') {
        return profileFilters;
      } else return curationFilters;
    }
    return profileFilters;
  }, [tab, favType]);

  const [debouncedFilter] = useDebounce(filters, 1000);

  const fetchUser = async () => {
    try {
      const nft = await nftService.getNftByUserId({
        searchInput: filters.searchInput,
        filter: {
          [filters.filter.param]: filters.filter.value,
        },
      });

      setData({
        ...data,
        [ProfileTabs.All]: nft.data.nfts,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOwn = async () => {
    try {
      const response = await nftService.getNftByUserId({
        searchInput: filters.searchInput,
        filter: {
          [filters.filter.param]: filters.filter.value,
        },
      });

      if (response.data) {
        setData({
          ...data,
          [ProfileTabs.Own]: response.data.nfts,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCreated = async () => {
    try {
      const response = await nftService.getNftMintedByUser({
        searchInput: filters.searchInput,
        filter: {
          [filters.filter.param]: filters.filter.value,
        },
      });

      if (response.data) {
        setData({
          ...data,
          [ProfileTabs.Created]: response.data.nfts ? response.data.nfts : [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCuration = async () => {
    try {
      const response = await collectionServices.getUserCollections({
        searchInput: filters.searchInput,
        filter: {
          [filters.curationFilter.param]: filters.curationFilter.value,
        },
      });

      const collections = response.data.collection;
      const detailedInfo = await Promise.all(
        collections
          .filter((item: any) => item.active)
          .map(async (collection: any) => {
            return {
              ...collection,
              image: collection.bannerImage,
            };
          }),
      );

      setData({
        ...data,
        [ProfileTabs.Curation]: detailedInfo,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await getAllUsersActivity({
        searchInput: filters?.searchInput,
        filterInput: filters?.activityFilter,
      });

      if (response.data) {
        setData({
          ...data,
          [ProfileTabs.Activity]: response.data.data ? response.data.data : [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFav = async () => {
    try {
      const likedNft = await favoriteService.getUserLikedNfts({
        searchInput: filters.searchInput,
        filter: {
          [filters.filter.param]: filters.filter.value,
        },
      });
      const likedArtist = await favoriteService.getUserLikedArtists({
        searchInput: filters.searchInput,
      });
      const likedCuration = await favoriteService.getUserLikedCollections({
        searchInput: filters.searchInput,
      });

      const nfts = likedNft.data
        ? likedNft.data.nfts.map((item: any) => {
            return {
              ...item.nftId,
            };
          })
        : [];

      const artists = likedArtist.data
        ? likedArtist.data.artists.map((item: any) => {
            return {
              ...item.artistId,
            };
          })
        : [];

      let collections = likedCuration.data
        ? likedCuration.data.curations.map((item: any) => {
            return {
              ...item.collectionId,
            };
          })
        : [];

      const detailedInfo = await Promise.all(
        collections
          .filter((item: any) => item.active)
          .map(async (collection: any) => {
            const info = await collectionServices.getCollectionInfo(
              collection._id,
            );

            const extra = {
              nftCount: info.data.collection.nftCount,
              totalVolume: info.data.collection.totalVolume,
              artistCount: info.data.collection.artistCount,
            };

            return {
              ...extra,
              name: collection.name,
              image: collection.bannerImage,
            };
          }),
      );
      setData({
        ...data,
        [ProfileTabs.Favorite]: {
          likedNft: nfts,
          likedArtist: artists,
          likedCuration: detailedInfo,
        },
      });
      console.log({
        likedNft: nfts,
        likedArtist: artists,
        likedCuration: collections,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await createAndSellService.getOrders({
        filters: {
          [filters.filter.param]: filters.filter.value,
        },
        searchInput: filters.searchInput,
      });

      if (response.data) {
        setData({
          ...data,
          [ProfileTabs.Order]: response.data.nfts,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await createAndSellService.getEarnings({
        filter: filters.earnFilter.value,
      });

      if (response.data) {
        setData({
          ...data,
          [ProfileTabs.Earn]: response.data.earnings,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = () => {
    toast({
      title: 'Loading...',
    });

    if (tab === ProfileTabs.All) {
      fetchUser();
    }

    if (tab === ProfileTabs.Own) {
      fetchOwn();
    }

    if (tab === ProfileTabs.Created) {
      fetchCreated();
    }

    if (tab === ProfileTabs.Curation) {
      fetchCuration();
    }

    if (tab === ProfileTabs.Activity) {
      fetchActivity();
    }

    if (tab === ProfileTabs.Favorite) {
      fetchFav();
    }

    if (tab === ProfileTabs.Order) {
      fetchOrders();
    }

    if (tab === ProfileTabs.Earn) {
      fetchEarnings();
    }
  };
  useEffect(() => {
    fetchData();
  }, [tab, debouncedFilter]);

  const getIcon = (state: string) => {
    switch (state) {
      case 'Listed':
        return <ListIcon />;
      case 'Listed for Sale':
        return <ListIcon />;
      case 'Minted':
        return <SubscriptionIcon />;
      case 'Unlisted':
        return <Unlisted />;
      case 'Purchased':
        return <PurchaseIcon />;
      case 'Fee':
        return <PurchaseIcon />;
      case 'Burn':
        return <FireIcon />;
      case 'Transfer':
        return <TransferIcon />;
      case 'End Sale':
        return <FireIcon />;
      case 'Royalties':
        return <SparklesIcon />;
      case 'Split Payments':
        return <ProjectIcon />;
      case 'In Escrow':
        return <InEscrowIcon />;
      case 'Release escrow':
        return <InEscrowIcon />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/* Filters logic */}
      <div className="flex gap-4 my-4">
        <div className="flex gap-x-2 px-5 py-3 items-center border border-white/[12%] bg-[#232323]/[14%] rounded-xl w-full">
          <Search className="w-5 h-5 text-white" />
          <input
            placeholder="Search by name or trait..."
            className="w-full bg-transparent border-none outline-none focus:outline-none azeret-mono-font placeholder:text-sm placeholder:text-white/50 text-white/50"
            value={filters.searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFilters({
                ...filters,
                searchInput: e.target.value,
              });
            }}
          />
        </div>
        <div className="relative flex bg-[#232323]/[14%] rounded-xl min-w-[18rem] justify-between items-center border border-white/10">
          <Popover
            open={categoryActive}
            onOpenChange={(val) => {
              setCategoryActive(val);
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full font-extrabold text-sm justify-between bg-transparent m-0 border-0 hover:bg-transparent"
              >
                {filters[categoryTab]?.label}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[18rem] p-0">
              <Command className="w-full">
                <CommandList>
                  <CommandGroup>
                    {categoryList &&
                      categoryList.map((item, index) => (
                        <CommandItem
                          key={index}
                          value={item.label}
                          onSelect={() => {
                            setCategoryActive(false);
                            if (isEarn) {
                              setFilters({
                                ...filters,
                                earnFilter: {
                                  label: item.label,
                                  value: item.value,
                                  param: item.param,
                                },
                              });
                            } else {
                              setFilters({
                                ...filters,
                                [categoryTab]: {
                                  label: item.label,
                                  value: item.value,
                                  param: item.param,
                                },
                              });
                            }
                          }}
                          className="text-sm cursor-pointer"
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              filters[categoryTab]?.label === item.label
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* User section */}
      {tab === ProfileTabs.All && data?.[ProfileTabs.All] ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
          {data?.[ProfileTabs.All]?.length > 0 ? (
            data?.[ProfileTabs.All]?.map((item: any, index: number) => {
              return (
                <Link key={index} href={`/nft/${item._id}`}>
                  <NftCard data={item} />
                </Link>
              );
            })
          ) : (
            <div className="min-h-[70vh] flex justify-center items-center col-span-12 w-full">
              <span>No items to display</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Owned Section */}
      {tab === ProfileTabs.Own && data?.[ProfileTabs.Own] ? (
        <div className="grid grid-cols-12 flex-wrap justify-center gap-5 my-4">
          {data?.[ProfileTabs.Own]?.length > 0 ? (
            data?.[ProfileTabs.Own].map((item: any, index: number) => {
              return (
                <Link
                  className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-3"
                  key={index}
                  href={`/nft/${item._id}`}
                >
                  <NftCard data={item} />
                </Link>
              );
            })
          ) : (
            <div className="min-h-[70vh] flex justify-center items-center col-span-12 w-full">
              <span>No items to display</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Created section */}
      {tab === ProfileTabs.Created && data?.[ProfileTabs.Created] ? (
        <div className="grid grid-cols-12 flex-wrap justify-center gap-5 my-4">
          {data?.[ProfileTabs.Created]?.length > 0 ? (
            data?.[ProfileTabs.Created]?.map((item: any, index: number) => {
              return (
                <Link
                  className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-3"
                  key={index}
                  href={`/nft/${item._id}`}
                >
                  <NftCard data={item} />
                </Link>
              );
            })
          ) : (
            <div className="min-h-[70vh] flex justify-center items-center col-span-12 w-full">
              <span>No items to display</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Curation section */}
      {tab === ProfileTabs.Curation && data?.[ProfileTabs.Curation] ? (
        <div className="grid grid-cols-12 flex-wrap justify-center gap-5 my-4">
          {data?.[ProfileTabs.Curation]?.length > 0 ? (
            data?.[ProfileTabs.Curation]?.map((item: any, index: number) => {
              return (
                <Link
                  className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-3"
                  key={index}
                  href={`/dashboard/curation/${item._id}`}
                >
                  <CurationCard data={item} />
                </Link>
              );
            })
          ) : (
            <div className="min-h-[70vh] flex justify-center items-center col-span-12 w-full">
              <span>No items to display</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Activity section */}
      {tab === ProfileTabs.Activity && data?.[ProfileTabs.Activity] ? (
        <div>
          <Table>
            {/* <TableCaption>A list of your recent activity.</TableCaption> */}
            <TableHeader className="border-white/[8%]">
              <TableRow className="border-white/[8%]">
                <TableHead className="text-sm text-white font-extrabold">
                  Event
                </TableHead>
                <TableHead className="text-sm text-white font-extrabold">
                  Item
                </TableHead>
                <TableHead className="text-sm text-white font-extrabold">
                  Price
                </TableHead>
                <TableHead className="text-sm text-white font-extrabold">
                  From
                </TableHead>
                <TableHead className="text-sm text-white font-extrabold">
                  To
                </TableHead>
                <TableHead className="text-sm text-white font-extrabold">
                  Date
                </TableHead>
                <TableHead className="text-sm text-white font-extrabold">
                  Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.activity?.length > 0 ? (
                data?.activity?.map((item: any, index: number) => (
                  <TableRow className="border-white/[8%]" key={index}>
                    <TableCell className="azeret-mono-font text-sm">
                      <div className="flex gap-x-2 items-center">
                        {getIcon(item.state)}
                        {item.actionHash ? (
                          <a
                            target="_blank"
                            href={getExplorerURL(
                              'transaction',
                              item?.actionHash,
                            )}
                          >
                            {item.state}
                          </a>
                        ) : (
                          item.state
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-x-3">
                      <img
                        src={item.nftId.cloudinaryUrl}
                        className="w-12 h-12 object-contain rounded aspect-square "
                      />
                      <span className="azeret-mono-font font-semibold text-sm">
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
                    <TableCell className="azeret-mono-font text-sm text-white">
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleTimeString()
                        : '-/-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-white/[8%] hover:bg-transparent">
                  <TableCell className="text-white text-center " colSpan={7}>
                    <div className="min-h-[70vh] flex justify-center items-center w-full">
                      <span>No items to display</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : null}

      {/* Favorite section */}
      {tab === ProfileTabs.Favorite && data?.[ProfileTabs.Favorite] ? (
        <div className="flex flex-col gap-y-5">
          <div className="flex gap-x-5 my-3">
            <Label
              onClick={() => setFavType('nft')}
              className={cn(
                `font-extrabold`,
                favType === 'nft' ? 'text-neon underline' : '',
              )}
            >
              NFTS
            </Label>
            <Label
              onClick={() => setFavType('curation')}
              className={cn(
                `font-extrabold`,
                favType === 'curation' ? 'text-neon underline' : '',
              )}
            >
              Curation
            </Label>
            <Label
              onClick={() => setFavType('artist')}
              className={cn(
                `font-extrabold`,
                favType === 'artist' ? 'text-neon underline' : '',
              )}
            >
              Artist
            </Label>
          </div>

          <div className="flex gap-5 flex-wrap">
            {favType === 'nft' && data?.[ProfileTabs.Favorite]?.likedNft ? (
              data?.[ProfileTabs.Favorite]?.likedNft?.length > 0 ? (
                data?.[ProfileTabs.Favorite]?.likedNft?.map(
                  (item: any, index: number) => {
                    return <NftCard key={index} data={item} />;
                  },
                )
              ) : (
                <div className="min-h-[70vh] flex justify-center items-center w-full">
                  <span>No items to display</span>
                </div>
              )
            ) : null}

            {favType === 'curation' &&
            data?.[ProfileTabs.Favorite]?.likedCuration ? (
              data?.[ProfileTabs.Favorite]?.likedCuration?.length > 0 ? (
                data?.[ProfileTabs.Favorite]?.likedCuration?.map(
                  (item: any, index: number) => {
                    return <CurationCard key={index} data={item} />;
                  },
                )
              ) : (
                <div className="min-h-[70vh] flex justify-center items-center w-full">
                  <span>No items to display</span>
                </div>
              )
            ) : null}

            {favType === 'artist' &&
            data?.[ProfileTabs.Favorite]?.likedArtist ? (
              data?.[ProfileTabs.Favorite]?.likedArtist?.length > 0 ? (
                data?.[ProfileTabs.Favorite]?.likedArtist?.map(
                  (item: any, index: number) => {
                    return (
                      <ArtistsCard
                        key={index}
                        image={item.avatar ? item.avatar.url : ''}
                        title={item.username}
                      />
                    );
                  },
                )
              ) : (
                <div className="min-h-[70vh] flex justify-center items-center w-full">
                  <span>No items to display</span>
                </div>
              )
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Orders section */}
      {tab === ProfileTabs.Order ? (
        <div className="mt-8">
          <Table>
            {/* <TableCaption>A list of your recent Orders.</TableCaption> */}
            <TableHeader className="border-white/[8%]">
              <TableRow className="border-white/[8%]">
                <TableHead className="text-white text-sm">Id</TableHead>
                <TableHead className="text-white text-sm">Title</TableHead>
                <TableHead className="text-white text-sm">
                  Payment Date
                </TableHead>
                <TableHead className="text-white text-sm">
                  Escrow Period
                </TableHead>
                <TableHead className="text-white text-sm"> Status</TableHead>
                <TableHead className="text-white text-sm">
                  View Details
                </TableHead>
              </TableRow>
            </TableHeader>
            {data?.[ProfileTabs.Order] ? (
              <TableBody>
                {data?.[ProfileTabs.Order]?.length > 0 ? (
                  data?.[ProfileTabs.Order].map((item: any, index: number) => {
                    const day =
                      new Date().getTime() -
                      new Date(item?.saleId?.ItemPurchasedOn).getTime();
                    return (
                      <TableRow className="border-white/[8%]" key={index}>
                        <TableCell className="font-medium azeret-mono-font text-sm">
                          #{item._id}
                        </TableCell>
                        <TableCell className="flex items-center gap-x-3">
                          <img
                            src={item.cloudinaryUrl}
                            className="w-12 h-12 object-contain  aspect-square rounded"
                          />
                          <span className="font-medium azeret-mono-font text-sm text-white">
                            {item.name}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium azeret-mono-font text-sm text-white">
                          {item?.saleId?.ItemPurchasedOn
                            ? new Date(item?.saleId?.ItemPurchasedOn)
                                .toLocaleString()
                                .slice(0, 10)
                            : '-/-'}
                        </TableCell>
                        <TableCell className="font-medium azeret-mono-font text-sm text-white">
                          Day {Math.round(day / (1000 * 3600 * 24))}
                        </TableCell>
                        <TableCell className="font-medium azeret-mono-font text-sm text-white">
                          In Escrow
                        </TableCell>
                        <TableCell className="font-medium azeret-mono-font text-sm text-[#DDF247]">
                          <Link href={`/nft/${item._id}`}>View</Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-white/[8%] hover:bg-transparent">
                    <TableCell className="text-white text-center " colSpan={6}>
                      <div className="min-h-[70vh] flex justify-center items-center w-full">
                        <span>No items to display</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow className="border-white/[8%] hover:bg-transparent">
                  <TableCell className="text-white text-center" colSpan={6}>
                    No items to display
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
      ) : null}

      {/* Earn section */}
      {tab === ProfileTabs.Earn ? (
        <div>
          <Table>
            {/* <TableCaption>A list of your recent Orders.</TableCaption> */}
            <TableHeader className="border-white/[8%]">
              <TableRow className="border-white/[8%]">
                <TableHead className="text-sm text-white">
                  Transaction Number (ID)
                </TableHead>
                <TableHead className="text-sm text-white">Title</TableHead>
                <TableHead className="text-sm text-white"></TableHead>
                <TableHead className="text-sm text-white"></TableHead>
                <TableHead className="text-sm text-white">Status</TableHead>
                <TableHead className="text-sm text-white">
                  View Details
                </TableHead>
              </TableRow>
            </TableHeader>
            {data?.[ProfileTabs.Earn] ? (
              <TableBody>
                {data?.[ProfileTabs.Earn]?.length > 0 ? (
                  data?.[ProfileTabs.Earn]?.map((item: any, index: number) => {
                    return (
                      <TableRow className="border-white/[8%]" key={index}>
                        <TableCell className="font-medium text-[18px] text-white">
                          {item._id}
                        </TableCell>
                        <TableCell>
                          <img
                            src={item.nftId.cloudinaryUrl}
                            className="w-10 aspect-square rounded"
                          />
                          <span>{item.nftId.name}</span>
                        </TableCell>
                        <TableCell>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M12.6326 8.33517C12.4297 8.22135 12.1662 8.22135 11.9429 8.33517L10.3595 9.21082L9.28423 9.78153L7.70079 10.6566C7.49785 10.771 7.2344 10.771 7.0111 10.6566L5.75271 9.97158C5.54976 9.85776 5.40786 9.64864 5.40786 9.41994V8.06888C5.40786 7.8407 5.52941 7.63158 5.75271 7.51723L6.9902 6.85123C7.1937 6.73688 7.4577 6.73688 7.68099 6.85123L8.91849 7.51723C9.12199 7.63158 9.26389 7.8407 9.26389 8.06888V8.94453L10.3391 8.35423V7.47911C10.3403 7.36545 10.3087 7.2537 10.2478 7.1563C10.1869 7.05891 10.0992 6.97969 9.99428 6.92747L7.70079 5.6717C7.49785 5.55735 7.2344 5.55735 7.0111 5.6717L4.67691 6.92747C4.57202 6.97969 4.48425 7.05891 4.42337 7.1563C4.36248 7.2537 4.33088 7.36545 4.33206 7.47911V10.0097C4.33206 10.2384 4.45361 10.4475 4.67691 10.5619L7.0111 11.8176C7.21405 11.9315 7.47805 11.9315 7.70079 11.8176L9.28423 10.9611L10.3595 10.3713L11.9429 9.51523C12.1459 9.40088 12.4093 9.40088 12.6326 9.51523L13.8707 10.1812C14.0742 10.2951 14.2155 10.5042 14.2155 10.7329V12.0839C14.2155 12.3121 14.0945 12.5212 13.8707 12.6356L12.6332 13.3206C12.4297 13.435 12.1657 13.435 11.9429 13.3206L10.7049 12.6546C10.5014 12.5403 10.3595 12.3312 10.3595 12.103V11.2273L9.28423 11.8176V12.6928C9.28423 12.9209 9.40578 13.1306 9.62908 13.2444L11.9633 14.5002C12.1662 14.6145 12.4297 14.6145 12.653 14.5002L14.9872 13.2444C15.1901 13.1306 15.332 12.9215 15.332 12.6928V10.1622C15.3332 10.0485 15.3016 9.93676 15.2407 9.83936C15.1798 9.74197 15.092 9.66275 14.9872 9.61053L12.6326 8.33517Z"
                              fill="white"
                            />
                            <path
                              d="M18.832 10.0859C18.832 15.0565 14.8026 19.0859 9.83203 19.0859C4.86147 19.0859 0.832031 15.0565 0.832031 10.0859C0.832031 5.11538 4.86147 1.08594 9.83203 1.08594C14.8026 1.08594 18.832 5.11538 18.832 10.0859Z"
                              stroke="white"
                            />
                          </svg>{' '}
                          {item?.price} ETH
                        </TableCell>
                        <TableCell>
                          {item?.createdAt
                            ? new Date(item?.createdAt)
                                .toLocaleString()
                                .slice(0, 10)
                            : '-/-'}
                        </TableCell>
                        <TableCell>{item?.state}</TableCell>
                        <TableCell className="text-[#DDF247] text-[18px] font-medium">
                          <Link href={`/nft/${item._id}`}>View</Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-white/[8%] hover:bg-transparent">
                    <TableCell className="text-white text-center " colSpan={6}>
                      <div className="min-h-[70vh] flex justify-center items-center w-full">
                        <span>No items to display</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : null}
          </Table>
        </div>
      ) : null}
    </div>
  );
}
