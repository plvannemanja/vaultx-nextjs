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
import { trimString } from '@/utils/helpers';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { getAllNftActivitys } from '@/services/supplier';
import { INFTActivity } from '@/types';
import { getExplorerURL } from '@/lib/helper';

export default function ActivityList() {
  const { nftId } = useNFTDetail();
  const [activityList, setActivityList] = useState<INFTActivity[]>([]);

  const getAllNftActivity = async () => {
    try {
      const {
        data: { data },
      } = await getAllNftActivitys({ nftId });
      setActivityList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNftActivity();
  }, [nftId]);

  if (activityList.length === 0)
    return null;

  return (
    <div className="w-full flex flex-col gap-y-5 mt-5">
      <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
        <Label className="text-lg font-medium">Item activity</Label>
        <hr className="bg-white" />
        <Table>
          <TableCaption>A list of your item activity.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Event</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              activityList.map((item: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-[14rem]">
                      <div className="flex gap-x-2 items-center">
                        {item.state}
                        {
                          item.actionHash && (
                            <a
                              target="_blank"
                              href={getExplorerURL('transaction', item?.actionHash)}
                            >
                              <ArrowTopRightOnSquareIcon
                                width={20}
                                height={20}
                              />
                            </a>
                          )
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.price ? item.price : '-/-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-x-2 items-center text-neon">
                        {item.from ? trimString(item.from.wallet) : '-/-'}
                        {item.from && (
                          <a
                            target="_blank"
                            href={getExplorerURL('address', item.from?.wallet)}
                          >
                            <ArrowTopRightOnSquareIcon
                              width={20}
                              height={20}
                            />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-x-2 items-center text-neon">
                        {item.to ? trimString(item.to.wallet) : '-/-'}
                        {item.to && (
                          <a
                            target="_blank"
                            href={getExplorerURL('address', item.to?.wallet)}
                          >
                            <ArrowTopRightOnSquareIcon
                              width={20}
                              height={20}
                            />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {moment(item.createdAt).format('DD MMM, YY')}
                    </TableCell>
                    <TableCell className="text-right">
                      {moment(item.createdAt).format('hh:mm A')}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}