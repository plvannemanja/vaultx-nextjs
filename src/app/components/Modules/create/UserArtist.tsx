import { useEffect, useRef, useState } from 'react';
import { useCreateNFT } from '../../Context/CreateNFTContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popOver';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserArtists } from '@/services/supplier';
import { PaymentSplitType } from '@/types';
import { useActiveAccount } from 'thirdweb/react';
import { BaseDialog } from '../../ui/BaseDialog';
import UserArtistModal from './UserArtistModal';

export default function UserArtist() {
  const activeAccount = useActiveAccount();
  const [open, setOpen] = useState(false);
  const {
    userArtists,
    setUserArtists,
    selectedArtist,
    setSelectedArtist,
    basicDetail,
    advancedDetails,
    setBasicDetail,
    setPaymentSplits,
    setAdvancedDetails,
    advancedOptions,
    setAdvancedOptions,
  } = useCreateNFT();

  const [edit, setEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const fetchUserArtists = async () => {
    const userArtists = await getUserArtists();
    setUserArtists(userArtists);
  };

  useEffect(() => {
    if (selectedArtist) {
      const userArtist = userArtists.filter(
        (item) => item._id === selectedArtist,
      )?.[0];
      if (userArtist) {
        // basic detail
        setBasicDetail({
          ...basicDetail,
          artistName: userArtist.name,
        });

        // royalty address
        setAdvancedDetails({
          ...advancedDetails,
          royaltyAddress: userArtist.royaltyAddress,
          royalty: userArtist.royalty,
        });

        // payment splits
        let paymentSplits: PaymentSplitType[] = [];
        paymentSplits.push({
          paymentWallet: activeAccount?.address,
          paymentPercentage: BigInt(userArtist.mySplit),
        });

        paymentSplits = paymentSplits.concat(
          userArtist.paymentSplits.map((item) => ({
            paymentWallet: item.paymentWallet,
            paymentPercentage: BigInt(item.paymentPercentage),
          })),
        );
        setPaymentSplits(paymentSplits);

        // set options
        setAdvancedOptions({
          ...advancedOptions,
          royalties: true,
          split: true,
        });
      }
    }
  }, [selectedArtist]);

  useEffect(() => {
    fetchUserArtists();
  }, []);
  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
      }}
    >
      <BaseDialog
        isOpen={edit}
        onClose={(val) => {
          setEdit(val);
        }}
        className="bg-[#111111] lg:min-w-[1400px] max-h-[80%] w-full overflow-y-auto overflow-x-hidden"
      >
        <UserArtistModal editUser={editUser} />
      </BaseDialog>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full bg-dark justify-between !h-13"
        >
          {selectedArtist
            ? userArtists.find((item) => item._id === selectedArtist)?.name
            : 'Search by artist name...'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-dark-900"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command className="w-full bg-dark-900">
          <CommandList>
            <CommandEmpty>There are no registered artists.</CommandEmpty>
            <CommandGroup>
              {userArtists &&
                userArtists.map((item, index) => (
                  <CommandItem
                    key={index}
                    value={item._id}
                    onSelect={() => {
                      setSelectedArtist(item._id);
                      setOpen(false);
                    }}
                    className="text-sm cursor-pointer flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          item._id === selectedArtist
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {item.name}
                    </div>
                    <Edit
                      onClick={() => {
                        setEditUser(item);
                        setTimeout(() => {
                          setEdit(true);
                        }, 200);
                      }}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
