'use client';

import { useGlobalContext } from '@/app/components/Context/GlobalContext';
import {
  NFTDetailProvider,
  useNFTDetail,
} from '@/app/components/Context/NFTDetailContext';
import ActivityList from '@/app/components/Modules/nft/ActivityList';
import BidList from '@/app/components/Modules/nft/BidList';
import NFTDescription from '@/app/components/Modules/nft/NFTDescription';
import NFTMain from '@/app/components/Modules/nft/NFTMain';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { deliveryTime } from '@/lib/helper';
import { FavoriteService } from '@/services/FavoriteService';
import NftServices from '@/services/nftService';
import { getAllNftActivitys } from '@/services/supplier';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import {
  ArrowTopRightOnSquareIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';
import { EyeIcon } from 'lucide-react';
import { useEffect } from 'react';

function PageDetail({ params }: { params: { slug: string } }) {
  const nftService = new NftServices();
  const favoriteService = new FavoriteService();
  const { toast } = useToast();
  const { user } = useGlobalContext();
  const {
    NFTDetail: data,
    setNFTDetail: setData,
    setNftId,
    setLikes,
    setLiked,
    setType,
    setBurnable,
    setActivityList,
  } = useNFTDetail();

  const getArtitsLikes = async () => {
    try {
      const {
        data: { totalLikedNfts },
      } = await favoriteService.getNftTotalLikes({ nftId: data?._id });
      const {
        data: { favorite },
      } = await favoriteService.getUserReactionToNft({ nftId: data?._id });
      setLikes(totalLikedNfts);
      setLiked(favorite);
    } catch (error) {
      console.log(error);
    }
  };

  const userReaction = async () => {
    try {
      const response = await favoriteService.getUserReactionToNft({
        nftId: params.slug,
      });

      if (response.data) {
        setLiked(response.data.favorite);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNFTType = async (nft: any) => {
    let burnable = false;
    if (nft?.owner?.wallet?.toLowerCase() === user?.wallet?.toLowerCase()) {
      if (
        nft?.saleId?.saleStatus === 'Sold' ||
        nft?.saleId?.saleStatus === 'Cancelled' ||
        nft?.saleId?.saleStatus === 'NotForSale'
      ) {
        setType('resell');
        burnable = true;
      } else if (nft?.saleId?.saleStatus === 'CancellationRequested')
        setType('CancelRequested');
      else if (nft?.saleId?.saleStatus === 'Ordered') {
        const purchaseDate = new Date(nft?.saleId?.ItemPurchasedOn).getTime();

        // get release time - blockchain logic
        const time = await deliveryTime();
        if (purchaseDate + Number(time) > new Date().getTime())
          setType('anyoneRelease');
        else setType('inEscrow');
      } else if (nft?.saleId?.saleStatus === 'Dispute') {
        setType('dispute');
      } else {
        setType('remove');
      }
    } else if (user?.wallet) {
      if (
        nft?.saleId?.saleStatus === 'Sold' ||
        nft?.saleId?.saleStatus === 'Cancelled' ||
        nft?.saleId?.saleStatus === 'NotForSale'
      )
        setType('bid');
      else if (
        nft?.saleId?.saleStatus === 'CancellationRequested' ||
        nft?.saleId?.saleStatus === 'Ordered' ||
        nft?.saleId?.saleStatus === 'Dispute'
      ) {
        if (nft?.saleId?.saleWinner === user?._id) setType('release');
        else setType('NotForSale');
      } else if (nft?.saleId?.saleStatus === 'Active') setType('buy');
      else setType('bid');
    } else {
      setType('');
    }
    setBurnable(burnable);
  };

  const getAllNftActivity = async () => {
    try {
      const {
        data: { data },
      } = await getAllNftActivitys({ nftId: params.slug });
      setActivityList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNftData = async () => {
    try {
      // set NFT ID
      setNftId(params.slug);

      getArtitsLikes();
      userReaction();

      getAllNftActivity();

      const response = await nftService.getNftById(params.slug);

      setData(response.data.nft);
      if (response.data.nft) {
        await handleNFTType(response.data.nft);
      }
    } catch (error) {
      console.log(error);
      setData(null);
    }
  };

  useEffect(() => {
    fetchNftData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  useEffect(() => {
    if (user && data) {
      handleNFTType(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, data]);

  return (
    <div className="flex flex-col gap-y-4 py-10 w-full  container px-10">
      {data && (
        <>
          <NFTMain fetchNftData={fetchNftData} />
          <NFTDescription />
          <BidList />
          <ActivityList />
          <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
            <Disclosure as="div" defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left text-lg font-medium text-[#fff] text-[18px] border-b border-[#ffffff08] ">
                    <div className="flex w-full justify-between">
                      <span className="text-white flex items-center text-[14px] gap-2 content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M9.75 12H9V9H8.25M9 6H9.0075M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9Z"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Details
                      </span>
                      <ChevronUpIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-white`}
                      />
                    </div>
                  </DisclosureButton>
                  <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                    <div className="w-full flex flex-col gap-y-5">
                      <div className="w-full px-6 py-2 flex gap-x-2 items-center text-[#fff]">
                        <img
                          src="/icons/Base.svg"
                          alt="matic"
                          className="w-[1.2rem] h-8 fill-white"
                        />
                        <Label className="font-extrabold text-[14px]">
                          Erc721
                        </Label>
                      </div>
                    </div>
                    <div className="w-full h-[1px]  bg-[#ffffff08]"></div>
                    <div className="w-full flex flex-col gap-y-5">
                      <div className="w-full px-6 py-2 flex gap-x-2 items-center text-[#fff]">
                        <img
                          src="/icons/Base.svg"
                          alt="matic"
                          className="w-[1.2rem] h-8 fill-white"
                        />
                        <Label className="font-medium">
                          View on Polygon Scan
                        </Label>
                        <a href={data?.minted ? '?a=' : ''}>
                          <ArrowTopRightOnSquareIcon
                            width={20}
                            height={20}
                            className="fill-[#fff]"
                          />
                        </a>
                      </div>
                    </div>
                    <div className="w-full h-[1px]  bg-[#ffffff08]"></div>
                    <div className="w-full flex flex-col gap-y-5">
                      <div className="w-full px-6 py-2 flex gap-x-2 items-center text-[#fff]">
                        <EyeIcon width={20} height={20} />
                        <Label className="font-medium">
                          Open Original On IPFS
                        </Label>
                        <a target="_blank" href={data.uri}>
                          <ArrowTopRightOnSquareIcon
                            width={20}
                            height={20}
                            className="fill-[#fff]"
                          />
                        </a>
                      </div>
                    </div>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        </>
      )}
    </div>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <NFTDetailProvider>
      <PageDetail params={params} />
    </NFTDetailProvider>
  );
}
