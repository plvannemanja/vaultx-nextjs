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
import { useState } from 'react';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { IBid } from '@/types';
import { trimString } from '@/utils/helpers';
import moment from 'moment';
import { useGlobalContext } from '../../Context/GlobalContext';

export default function BidList() {
  const { nftId } = useNFTDetail();
  const { user } = useGlobalContext();
  const { toast } = useToast();
  const [bids, setBids] = useState<IBid[]>([]);
  const createSellService = new CreateSellService();

  const cancelBid = async () => {
    toast({
      title: 'Cancelling Bid',
      duration: 5000,
    });

    try {
      // blockchain response
      const data = {
        bidId: '',
        transactionHash: '',
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

  if (bids.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-y-5 mt-5">
      <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
        <Label className="text-lg font-medium">Bid Offers</Label>
        <hr className="bg-white" />
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
                      ? new Date(item?.createdAt).toLocaleString().slice(0, 10)
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
                          onClick={async () => await cancelBid()}
                        >
                          Cancel Bid
                        </button>
                      </div>
                    ) : (
                      <div className="py-3 min-w-24 rounded-lg text-black font-semibold bg-light">
                        <button className="w-full h-full" onClick={() => {}}>
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
      </div>
    </div>
  );
}
