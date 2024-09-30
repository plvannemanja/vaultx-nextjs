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
import { useNFTDetail } from '../../Context/NFTDetailContext';
import { getExplorerURL } from '@/lib/helper';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export default function ActivityList() {
  const { activityList } = useNFTDetail();

  if (activityList.length === 0) return null;

  return (
    <>
      <div className="w-full rounded-[20px] px-4 py-3 bg-dark flex flex-col gap-y-6 bg-[#232323]">
        <Disclosure as="div" defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full flex-col justify-between py-2 text-left   text-lg font-medium text-[#fff] text-[18px] border-b border-[#FFFFFF08] ">
                <div className="flex w-full justify-between">
                <div className='text-[14px] font-medium text-[#fff] flex items-center gap-2'>
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
  <path d="M8.27328 12.4775C8.32558 12.5297 8.36707 12.5918 8.39538 12.66C8.42369 12.7283 8.43826 12.8015 8.43826 12.8754C8.43826 12.9494 8.42369 13.0226 8.39538 13.0908C8.36707 13.1591 8.32558 13.2212 8.27328 13.2734L6.02328 15.5234C5.97104 15.5757 5.909 15.6172 5.84072 15.6455C5.77243 15.6738 5.69923 15.6884 5.62531 15.6884C5.55139 15.6884 5.4782 15.6738 5.40991 15.6455C5.34162 15.6172 5.27958 15.5757 5.22734 15.5234L2.97734 13.2734C2.92508 13.2211 2.88363 13.1591 2.85534 13.0908C2.82706 13.0225 2.8125 12.9494 2.8125 12.8754C2.8125 12.8015 2.82706 12.7283 2.85534 12.6601C2.88363 12.5918 2.92508 12.5297 2.97734 12.4775C3.08289 12.3719 3.22605 12.3126 3.37531 12.3126C3.44922 12.3126 3.52241 12.3272 3.59069 12.3555C3.65898 12.3838 3.72102 12.4252 3.77328 12.4775L5.06281 13.7677V3.87544C5.06281 3.72626 5.12208 3.58318 5.22757 3.4777C5.33305 3.37221 5.47613 3.31294 5.62531 3.31294C5.7745 3.31294 5.91757 3.37221 6.02306 3.4777C6.12855 3.58318 6.18781 3.72626 6.18781 3.87544V13.7677L7.47734 12.4775C7.52958 12.4252 7.59162 12.3837 7.65991 12.3554C7.7282 12.3271 7.80139 12.3125 7.87531 12.3125C7.94923 12.3125 8.02243 12.3271 8.09072 12.3554C8.159 12.3837 8.22104 12.4252 8.27328 12.4775ZM15.0233 5.72747L12.7733 3.47747C12.721 3.42517 12.659 3.38369 12.5907 3.35538C12.5224 3.32707 12.4492 3.3125 12.3753 3.3125C12.3014 3.3125 12.2282 3.32707 12.1599 3.35538C12.0916 3.38369 12.0296 3.42517 11.9773 3.47747L9.72734 5.72747C9.6218 5.83302 9.5625 5.97618 9.5625 6.12544C9.5625 6.27471 9.6218 6.41786 9.72734 6.52341C9.83289 6.62896 9.97605 6.68826 10.1253 6.68826C10.2746 6.68826 10.4177 6.62896 10.5233 6.52341L11.8128 5.23318V15.1254C11.8128 15.2746 11.8721 15.4177 11.9776 15.5232C12.0831 15.6287 12.2261 15.6879 12.3753 15.6879C12.5245 15.6879 12.6676 15.6287 12.7731 15.5232C12.8786 15.4177 12.9378 15.2746 12.9378 15.1254V5.23318L14.2273 6.52341C14.3329 6.62896 14.476 6.68826 14.6253 6.68826C14.7746 6.68826 14.9177 6.62896 15.0233 6.52341C15.1288 6.41786 15.1881 6.27471 15.1881 6.12544C15.1881 5.97618 15.1288 5.83302 15.0233 5.72747Z" fill="white"/>
</svg>
                      </span> Item activity</div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-white`}
                  />
                </div>
              </DisclosureButton>
              <DisclosurePanel className=" pt-4 pb-2 text-sm text-white  rounded-b-lg">
                <Table>
                  {/* <TableCaption>A list of your item activity.</TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-[#818181]">
                        Event
                      </TableHead>
                      <TableHead className="text-[#818181] font-extrabold">Price</TableHead>
                      <TableHead className="text-[#818181] font-extrabold">From</TableHead>
                      <TableHead className="text-[#818181] font-extrabold">To</TableHead>
                      <TableHead className="text-[#818181] font-extrabold">Date</TableHead>
                      <TableHead className=" text-[#818181] font-extrabold">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityList.map((item: any, index: number) => {
                      item.fromWallet = item.from
                        ? item.from.wallet
                        : item?.fromWallet;
                      item.toWallet = item.to ? item.to.wallet : item?.toWallet;

                      return (
                        <TableRow key={index} className='broder-[#ffffff08]'>
                          <TableCell className="font-medium w-[14rem] broder-[#ffffff08]">
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
                            {item.price
                              ? `${item.price} ${item.currency ?? 'USD'}`
                              : '-/-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-x-2 items-center text-neon">
                              {item.from && item.from.username
                                ? item.from.username
                                : item.fromWallet
                                  ? trimString(item.fromWallet)
                                  : '-/-'}
                              {item.fromWallet && (
                                <a
                                  target="_blank"
                                  href={getExplorerURL(
                                    'address',
                                    item.fromWallet,
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
                              {item.to && item.to.username
                                ? item.to.username
                                : item.toWallet
                                  ? trimString(item.toWallet)
                                  : '-/-'}
                              {item.toWallet && (
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
