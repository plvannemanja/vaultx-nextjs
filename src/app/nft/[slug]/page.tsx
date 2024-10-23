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
import OthersDetails from '@/app/components/Modules/nft/others-details';
import { useToast } from '@/hooks/use-toast';
import { deliveryTime } from '@/lib/helper';
import { CreateSellService } from '@/services/createSellService';
import { FavoriteService } from '@/services/FavoriteService';
import NftServices from '@/services/nftService';
import { getAllNftActivitys } from '@/services/supplier';
import { Mail } from 'lucide-react';
import { useEffect } from 'react';

function PageDetail({ params }: { params: { slug: string } }) {
  const nftService = new NftServices();
  const favoriteService = new FavoriteService();
  const createSellService = new CreateSellService();
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
    setBids,
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

  const getBids = async () => {
    try {
      const {
        data: { bids },
      } = await createSellService.getNftBids({ nftId: params.slug });
      setBids(bids);
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
      getBids();
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
    <div className="flex flex-col gap-y-4 py-5 w-full container px-10">
      {data && (
        <>
          <div className="flex flex-col gap-y-6">
            <NFTMain fetchNftData={fetchNftData} />
            <NFTDescription />
            <BidList fetchNftData={fetchNftData} />
            <ActivityList />
            <OthersDetails data={data} />
          </div>
          <div className="w-11/12 pt-5 px-5 pb-[30px] mx-auto rounded-[12px] bg-[#DDF247] relative flex justify-center items-center overflow-hidden mt-[55px]">
            <div className="absolute -translate-y-1/2 top-1/2 -left-[108px] bg-white w-[189px] h-[189px] rounded-full z-[1]"></div>
            <div className="absolute -translate-y-1/2 top-1/2 -right-[108px] bg-white w-[189px] h-[189px] rounded-full z-[1]"></div>
            <div>
              <h3 className="text-[40px] font-monserrat leading-[130%] font-extrabold max-w-[780px] mx-auto text-center text-black">
                Join our newsletter to stay up to date on features and releases
              </h3>
              <div className="flex gap-4 max-w-[572px] mx-auto mt-[30px] relative h-full">
                <div className="flex items-center gap-2 bg-white min-w-[397px] p-1 px-3">
                  <Mail className="text-[#07171d]" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none bg-transparent border-b border-white/[8%] text-[#101012] flex-1"
                  />
                </div>
                <button className="bg-[#141413] rounded-md text-white py-[14px] px-[20px] min-w-[158px] manrope-font text-lg font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
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
