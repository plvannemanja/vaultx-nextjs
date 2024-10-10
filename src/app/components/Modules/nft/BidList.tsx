'use client';

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
import { useToast } from '@/hooks/use-toast';
import { CreateSellService } from '@/services/createSellService';
import { useEffect, useState } from 'react';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { IBid } from '@/types';
import { trimString } from '@/utils/helpers';
import moment from 'moment';
import { useGlobalContext } from '../../Context/GlobalContext';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import BaseButton from '../../ui/BaseButton';
import { cancelBid } from '@/lib/helper';
import { useActiveAccount } from 'thirdweb/react';

export default function BidList() {
  const [loading, setLoading] = useState(false);
  const { nftId, NFTDetail } = useNFTDetail();
  const { user } = useGlobalContext();
  const { toast } = useToast();
  const [bids, setBids] = useState<IBid[]>([]);
  const activeAccount = useActiveAccount();
  const createSellService = new CreateSellService();

  const cancel = async (bidInfo: IBid) => {
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
        bidId: bidInfo.bidId.toString(),
        transactionHash,
      };

      await createSellService.cancelBidOnNft(data);
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

  const accept = async (bidInfo: IBid) => {
    toast({
      title: 'Cancelling Bid',
      duration: 5000,
    });

    try {
      // blockchain response
      const data = {
        bidId: bidInfo.bidId,
        nftId,
        transactionHash: '',
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
      debugger;
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
  }, []);

  if (bids.length === 0) return null;

  return (
    <>
      <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
        <Disclosure as="div" defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                <div className="flex w-full justify-between">
                  <span>Bid Offers</span>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-white`}
                  />
                </div>
              </DisclosureButton>
              <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                <Table>
                  <TableCaption>A list of your Bid activity.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Price</TableHead>
                      <TableHead>USD Price</TableHead>
                      <TableHead>Placed On</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead className="text-right">Confirmation</TableHead>
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
                              <div className="py-3 min-w-24 rounded-lg text-black font-semibold bg-light justify-between">
                                <BaseButton
                                  title="Accept"
                                  variant="primary"
                                  onClick={() => {
                                    setLoading(true);
                                    accept(item);
                                  }}
                                  loading={loading}
                                />
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
