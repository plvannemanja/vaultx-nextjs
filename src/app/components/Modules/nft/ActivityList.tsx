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
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

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

  if (activityList.length === 0) return null;

  return (
    <>
      <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
        <Disclosure as="div" defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF80] ">
                <div className="flex w-full justify-between">
                  <span>Item activity</span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-white`}
                  />
                </div>
              </DisclosureButton>
              <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                <Table>
                  <TableCaption>A list of your item activity.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-[#818181]">
                        Event
                      </TableHead>
                      <TableHead className="text-[#818181]">Price</TableHead>
                      <TableHead className="text-[#818181]">From</TableHead>
                      <TableHead className="text-[#818181]">To</TableHead>
                      <TableHead className="text-[#818181]">Date</TableHead>
                      <TableHead className=" text-[#818181]">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityList.map((item: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium w-[14rem]">
                            <div className="flex gap-x-2 items-center azeret-mono-font">
                              {item.state}
                              {item.actionHash && (
                                <a
                                  target="_blank"
                                  href={getExplorerURL(
                                    'transaction',
                                    item?.actionHash,
                                  )}
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
                            {item.price ? item.price : '-/-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-x-2 items-center text-neon">
                              {item.from ? trimString(item.from.wallet) : '-/-'}
                              {item.from && (
                                <a
                                  target="_blank"
                                  href={getExplorerURL(
                                    'address',
                                    item.from?.wallet,
                                  )}
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
                                  href={getExplorerURL(
                                    'address',
                                    item.to?.wallet,
                                  )}
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
                          <TableCell className="">
                            {moment(item.createdAt).format('hh:mm A')}
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