import { Label } from '@/components/ui/label';
import { NFTItemType } from '@/types';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { ChevronUpIcon, EyeIcon, Info } from 'lucide-react';
import Image from 'next/image';

type Props = {
  data: NFTItemType | null;
};

const OthersDetails = ({ data }: Props) => {
  return (
    <div className="w-full rounded-[20px] p-5 bg-dark flex flex-col gap-y-6 bg-[#232323]">
      <Disclosure as="div" defaultOpen={true}>
        {({ open }) => (
          <>
            <DisclosureButton className="flex w-full flex-col justify-between py-2 pb-3 text-left text-[18px] border-b border-white/[8%]">
              <div className="flex w-full justify-between">
                <span className="text-white flex items-center text-sm gap-2 font-extrabold content-center manrope-font">
                  <Info className="w-4 h-4" />
                  <span>Details</span>
                </span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-white/[53%]`}
                />
              </div>
            </DisclosureButton>
            <DisclosurePanel className="pb-2 rounded-b-lg">
              <div className="w-full flex flex-col gap-y-5">
                <div className="w-full py-3 flex gap-x-2 items-center text-white">
                  <Image
                    src="/icons/Base.svg"
                    alt="matic"
                    width={20}
                    height={32}
                    className="w-[1.2rem] h-8 fill-white"
                  />
                  <Label className="font-extrabold text-sm">Erc721</Label>
                </div>
              </div>
              <hr className="border-white/[8%]" />
              <div className="w-full flex flex-col gap-y-5">
                <div className="w-full py-3 flex gap-x-2 items-center text-white">
                  <Image
                    src="/icons/Base.svg"
                    alt="matic"
                    width={20}
                    height={32}
                    className="w-[1.2rem] h-8 fill-white"
                  />
                  <Label className="font-extrabold text-sm">
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
              <hr className="border-white/[8%]" />
              <div className="w-full flex flex-col gap-y-5">
                <div className="w-full py-3 flex gap-x-2 items-center text-white">
                  <EyeIcon width={20} height={20} />
                  <Label className="font-extrabold text-sm">
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
  );
};

export default OthersDetails;
