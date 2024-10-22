'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { acceptBid, cancelBid } from '@/lib/helper';
import { CreateSellService } from '@/services/createSellService';
import { IBid } from '@/types';
import { trimString } from '@/utils/helpers';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import BidIcon from '../../Icons/bid-icon';
import BaseButton from '../../ui/BaseButton';

export default function BidList({
  fetchNftData,
}: {
  fetchNftData: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { nftId, NFTDetail, bids, setBids, } = useNFTDetail();
  const { user } = useGlobalContext();
  const { toast } = useToast();
  const activeAccount = useActiveAccount();
  const createSellService = new CreateSellService();

  const cancel = async (bidInfo: IBid) => {
    if (bidInfo.bidCanceled || bidInfo.bidSuccess)
      return;
    toast({
      title: 'Cancelling Bid',
      duration: 5000,
    });

    try {
      const { transactionHash } = await cancelBid(
        NFTDetail?.tokenId,
        bidInfo.bidId,
        activeAccount,
      );
      const data = {
        id: bidInfo._id,
        bidId: bidInfo.bidId.toString(),
        nftId,
        transactionHash,
      };

      await createSellService.cancelBidOnNft(data);
      await fetchNftData();

      toast({
        title: 'Bid Cancelled',
        description: 'Refreshing Details',
        duration: 2000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error cancelling bid',
        description: 'Please try again later or contact support',
        duration: 5000,
      });
    }
  };

  const accept = async (bidInfo: IBid) => {
    if (bidInfo.bidCanceled || bidInfo.bidSuccess)
      return;
    toast({
      title: 'Accepting Bid',
      duration: 5000,
    });

    try {
      // blockchain response
      const { transactionHash } = await acceptBid(
        NFTDetail?.tokenId,
        bidInfo.bidId,
        activeAccount,
      )

      const data = {
        id: bidInfo._id,
        bidId: bidInfo.bidId,
        nftId,
        transactionHash,
      };

      await createSellService.acceptBid(data);
      await getBids();

      toast({
        title: 'Bid Cancelled',
        description: 'Refreshing Details',
        duration: 2000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error cancelling bid',
        description: 'Please try again later or contact support',
        duration: 5000,
      });
    }
  };

  const getBids = async () => {
    try {
      const {
        data: { bids },
      } = await createSellService.getNftBids({ nftId });
      setBids(bids);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (bids.length === 0) return null;

  return (
    <>
      <div className="w-full rounded-[20px] p-5 bg-dark flex flex-col gap-y-6 bg-[#232323]">
        <Disclosure as="div" defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full flex-col justify-between py-2 pb-4 text-left border-b border-[#353535]">
                <div className="flex w-full justify-between">
                  <div className="flex text-sm font-extrabold items-center gap-2">
                    <BidIcon />
                    <span>Bid Offers</span>
                  </div>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-[#989898]`}
                  />
                </div>
              </DisclosureButton>
              <DisclosurePanel className=" pt-4 pb-2 text-sm rounded-b-lg">
                <Table>
                  <TableCaption className="text-[#989898]">
                    A list of your Bid activity.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-[#989898]">
                        Price
                      </TableHead>
                      <TableHead className="text-[#989898]">
                        USD Price
                      </TableHead>
                      <TableHead className="text-[#989898]">
                        Placed On
                      </TableHead>
                      <TableHead className="text-[#989898]">From</TableHead>
                      <TableHead className="text-right text-[#989898]">
                        Confirmation
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bids.map((item: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium w-[14rem]">
                            <div className="flex gap-x-2 items-center">
                              {item.bidValue}
                            </div>
                          </TableCell>
                          <TableCell>
                            ${(2 * item?.bidValue).toLocaleString('en-US')}
                          </TableCell>
                          <TableCell>
                            {item?.createdAt
                              ? new Date(item?.createdAt)
                                .toLocaleString()
                                .slice(0, 10)
                              : '-/-'}
                          </TableCell>
                          <TableCell>
                            {item.bidder?.username
                              ? item.bidder?.username
                              : trimString(item.bidder?.wallet)}
                          </TableCell>
                          <TableCell>
                            {moment(item.createdAt).format('DD MMM, YY')}
                          </TableCell>
                          <TableCell className="text-right">
                            {item?.bidder?._id === user?._id ? (
                              <div className="py-3 min-w-24 rounded-lg text-black font-semibold bg-neon">
                                <button
                                  className="w-full h-full"
                                  onClick={async () => await cancel(item)}
                                >
                                  Cancel Bid
                                </button>
                              </div>
                            ) : user?._id === NFTDetail?.owner?._id ? (
                              <div className="py-3 min-w-24 rounded-lg text-black font-semibold bg-neon">
                                <button
                                  className="w-full h-full"
                                  onClick={async () => await accept(item)}
                                >
                                  {item.bidSuccess ? 'Accepted' : 'Accept'}
                                </button>
                              </div>
                            ) : (
                              <div className="py-3 min-w-24 rounded-lg text-black font-semibold bg-light">
                                <button
                                  className="w-full h-full"
                                  onClick={() => { }}
                                >
                                  Bidded
                                </button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
