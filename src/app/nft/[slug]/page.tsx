'use client';

import NftServices from '@/services/nftService';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { userServices } from '@/services/supplier';
import { FavoriteService } from '@/services/FavoriteService';
import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import { EyeIcon } from 'lucide-react';
import { CreateSellService } from '@/services/createSellService';
import { useToast } from '@/hooks/use-toast';
import {
  NFTDetailProvider,
  useNFTDetail,
} from '@/app/components/Context/NFTDetailContext';
import ActivityList from '@/app/components/Modules/nft/ActivityList';
import BidList from '@/app/components/Modules/nft/BidList';
import NFTDescription from '@/app/components/Modules/nft/NFTDescription';
import NFTMain from '@/app/components/Modules/nft/NFTMain';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

function PageDetail({ params }: { params: { slug: string } }) {
  const nftService = new NftServices();
  const favoriteService = new FavoriteService();
  const createSellService = new CreateSellService();
  const { toast } = useToast();

  const {
    NFTDetail: data,
    setNFTDetail: setData,
    setNftId,
    setLikes,
    setLiked,
    type,
    setType,
  } = useNFTDetail();
  const [user, setUser] = useState(null);

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

  const getUser = async () => {
    try {
      const user = await userServices.getSingleUser();

      if (user.data && user.data.user) {
        setUser(user.data.user);
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const handleNFTType = async (nft: any, userData: any) => {
    if (nft?.owner?.wallet?.toLowerCase() === userData.wallet?.toLowerCase()) {
      if (
        nft?.saleId?.saleStatus === 'Sold' ||
        nft?.saleId?.saleStatus === 'Cancelled' ||
        nft?.saleId?.saleStatus === 'NotForSale'
      )
        setType('resell');
      else if (nft?.saleId?.saleStatus === 'CancellationRequested')
        setType('CancelRequested');
      else if (nft?.saleId?.saleStatus === 'Ordered') {
        const purchaseDate = new Date(nft?.saleId?.ItemPurchasedOn).getTime();

        // get release time - blockchain logic
        // const time = await releaseTime()
        const time = new Date().getTime(); // temporary edit
        if (purchaseDate + time <= new Date().getTime())
          setType('EscrowReleaseRequest');
        else setType('inEscrow');
      } else {
        setType('remove');
      }
    } else {
      if (
        nft?.saleId?.saleStatus === 'Sold' ||
        nft?.saleId?.saleStatus === 'Cancelled' ||
        nft?.saleId?.saleStatus === 'NotForSale'
      )
        setType('bid');
      else if (
        nft?.saleId?.saleStatus === 'CancellationRequested' ||
        nft?.saleId?.saleStatus === 'Ordered'
      ) {
        if (nft?.saleId?.saleWinner === userData?._id) setType('release');
        else setType('NotForSale');
      } else if (nft?.saleId?.saleStatus === 'Active') setType('buy');
      else setType('bid');
    }
  };

  const fetchNftData = async () => {
    try {
      // set NFT ID
      setNftId(params.slug);

      const response = await nftService.getNftById(params.slug);

      await getArtitsLikes();
      await userReaction();

      setData(response.data.nft);
      if (response.data.nft) {
        const user = await getUser();
        if (user.data && user.data.user) {
          setUser(user.data.user);
          await handleNFTType(response.data.nft, user.data.user);
        }
      }
    } catch (error) {
      console.log(error);
      setData(null);
    }
  };

  useEffect(() => {
    fetchNftData();
  }, [params.slug]);
  return (
    <div className="flex flex-col gap-y-4 py-20 w-full px-10 lg:px-20">
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
                  <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#fff] ">
                    <div className="flex w-full justify-between">
                      <span className="text-white flex items-center gap-2 content-center">
                        <InformationCircleIcon width={20} height={20} />
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
                          src="/icons/ether.svg"
                          alt="matic"
                          className="w-[1.2rem] h-8 fill-white"
                        />
                        <Label className="font-extrabold text-[14px]">
                          Erc721
                        </Label>
                      </div>
                    </div>
                    <hr />
                    <div className="w-full flex flex-col gap-y-5">
                      <div className="w-full px-6 py-2 flex gap-x-2 items-center text-[#fff]">
                        <img
                          src="/icons/ether.svg"
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
                    <hr />
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
