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
import { FavoriteService } from '@/services/FavoriteService';
import NftServices from '@/services/nftService';
import { getAllNftActivitys } from '@/services/supplier';
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
    <div className="flex flex-col gap-y-4 py-5 w-full container px-10">
      {data && (
        <>
          <NFTMain fetchNftData={fetchNftData} />
          <NFTDescription />
          <BidList />
          <ActivityList />
          <OthersDetails data={data} />
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
