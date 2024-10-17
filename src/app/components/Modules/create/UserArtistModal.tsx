import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { isZodAddress } from '@/lib/utils';
import { getUserArtists, upsertUserArtist } from '@/services/supplier';
import { IUserArtist } from '@/types';
import { acceptedFormats, maxFileSize } from '@/utils/helpers';
import { DialogClose } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { z } from 'zod';
import { useCreateNFT } from '../../Context/CreateNFTContext';
import BaseButton from '../../ui/BaseButton';
import { BaseDialog } from '../../ui/BaseDialog';
import ErrorModal from './ErrorModal';

const paymentSplitSchema = z.object({
  paymentWallet: isZodAddress,
  paymentPercentage: z.number(),
});

const fileSchema = z.object({
  file: z.any(),
});

const userArtistSchema = z
  .object({
    name: z.string(),
    wallet: isZodAddress,
    confirmWallet: isZodAddress,
    royalty: z.number(),
    royaltyAddress: isZodAddress,
    mySplit: z.number(),
    paymentSplits: z.array(paymentSplitSchema),
  })
  .refine((data) => data.confirmWallet === data.wallet, {
    path: ['confirmWallet'],
    message: 'Confirm wallet does not match',
  })
  .refine(
    (data) => {
      // calculate sum
      const totalSplit = data.paymentSplits.reduce(
        (sum, current) => sum + current.paymentPercentage,
        data.mySplit,
      );
      if (totalSplit === 100) return true;
      return false;
    },
    {
      path: ['totalPercent'],
      message: 'Total percent should be 100',
    },
  );

export default function UserArtistModal({
  editUser,
}: {
  editUser: null | IUserArtist;
}) {
  const { toast } = useToast();
  const { setUserArtists } = useCreateNFT();
  const imageRef = useRef(null);
  const closeRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState<any>({
    _id: null,
    name: '',
    wallet: '',
    confirmWallet: '',
    royalty: '',
    royaltyAddress: '',
    mySplit: '',
  });

  const [errors, setErrors] = useState({
    active: false,
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [paymentSplits, setPaymentSplits] = useState<any[]>([null]);
  const activeAccount = useActiveAccount();

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (
      file.size < maxFileSize &&
      acceptedFormats.includes(`.${fileExtension}`)
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleButtonClick = () => {
    if (imageRef.current) {
      (imageRef.current as any).click();
    }
  };

  const addSplit = () => {
    setPaymentSplits([
      ...paymentSplits,
      { paymentWallet: '', paymentPercentage: BigInt(0) },
    ]);
  };

  const removeSplit = (index: number) => {
    if (paymentSplits.length > 1) {
      const newSplits = paymentSplits.filter((_, i) => i !== index);
      setPaymentSplits(newSplits);
    }
    if (paymentSplits.length == 1) {
      setPaymentSplits([null]);
    }
  };

  const updateSplit = (
    index: number,
    field: 'paymentWallet' | 'paymentPercentage',
    value: string | number,
  ) => {
    const newSplits = paymentSplits.map((split, i) => {
      if (i === index) {
        return {
          ...split,
          [field]: field === 'paymentPercentage' ? Number(value) : value,
        };
      }
      return split;
    });
    setPaymentSplits(newSplits);
  };

  const cancel = () => {
    if (closeRef.current) {
      closeRef.current.click();
    }
  };
  const create = async () => {
    // validate values
    const result = userArtistSchema.safeParse({
      ...formData,
      paymentSplits,
    });

    if (!result.success) {
      const message = JSON.parse(result.error.message);
      setErrors({
        active: true,
        data: message,
      });
      console.log(result.error.message);
      return;
    }

    if (!editUser || file) {
      const fileResult = fileSchema.safeParse({
        file,
      });

      if (!fileResult.success) {
        const message = JSON.parse(fileResult.error.message);
        setErrors({
          active: true,
          data: message,
        });
        console.log(fileResult.error.message);
        return;
      }
    }
    try {
      setLoading(true);
      const data = new FormData();
      data.append('id', formData._id ?? '');
      data.append('name', formData.name);
      data.append('wallet', formData.wallet);
      data.append('royaltyAddress', formData.royaltyAddress);
      data.append('royalty', formData.royalty);
      data.append('mySplit', formData.mySplit);
      data.append('paymentSplits', JSON.stringify(paymentSplits));
      if (file) data.append('file', file);

      await upsertUserArtist(data);

      const userArtists = await getUserArtists();
      setUserArtists(userArtists);
      cancel();
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to save artist',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (editUser) {
      debugger;
      setFormData({
        ...formData,
        _id: editUser._id,
        name: editUser.name,
        wallet: editUser.wallet,
        confirmWallet: editUser.wallet,
        royalty: editUser.royalty,
        royaltyAddress: editUser.royaltyAddress,
        mySplit: editUser.mySplit,
      });

      if (editUser.paymentSplits.length > 0) {
        setPaymentSplits(editUser.paymentSplits);
      }
      setImageSrc(editUser.image);
    }
  }, [editUser]);
  return (
    <div className="grid grid-cols-12 gap-4 h-auto relative bg-dark-900">
      {/* Header Section */}
      <div className="col-span-12 text-[#DEE8E8] max-w-[1000px] mx-auto flex-col justify-center items-center gap-4 inline-flex pt-8">
        <div className="text-center text-2xl font-extrabold">
          Registering affiliated artists
        </div>
        <p className="self-stretch text-center text-lg azeret-mono-font font-medium leading-normal">
          We use artist templates to avoid mistakes that can arise from
          repetitive artist information entry. Entering artist information can
          shorten the mint time.
        </p>
      </div>
      {/* Upload Artist Profile Image Section */}
      <div className="col-span-3 px-10 py-5 bg-dark-700 rounded-2xl border-2 border-dark-600 flex-col justify-center items-center gap-6 inline-flex border-dashed h-[450px]">
        {file || (editUser && imageSrc) ? (
          <div className="flex flex-col text-center gap-y-[23px]  ">
            {imageSrc && (
              <div className="width-[90%] object-cover mx-auto">
                <Image
                  src={imageSrc}
                  alt="logo"
                  layout="responsive"
                  width={100} // Required prop
                  height={100} // Required prop
                />
              </div>
            )}
            {file ? file.name : 'No files selected'}
          </div>
        ) : (
          <>
            <div className="relative w-16 h-16">
              <Image
                className="relative"
                src="/icons/upload.svg"
                width={66}
                height={66}
                alt="upload"
              ></Image>
            </div>
            <div className="self-stretch h-14 flex-col justify-center items-center gap-3 flex">
              <div className="self-stretch text-center text-white text-lg font-extrabold">
                Upload Artist Profile Image
              </div>
              <div className="self-stretch text-center text-gray-500 text-xs font-normal leading-tight">
                PNG, GIF, WEBP, MP4 or MP3. Max 50mb.
              </div>
            </div>
          </>
        )}
        <button
          className="w-44 !h-12 bg-light-200 rounded-lg justify-center items-center gap-2.5 inline-flex"
          onClick={handleButtonClick}
        >
          <p className="text-dark-900 text-sm font-extrabold capitalize">
            Browse file
          </p>
          <div className="w-4 h-4 relative">
            <Image
              src="/icons/arrow_ico.svg"
              alt="arrow"
              width={18}
              height={18}
            />
          </div>
        </button>
        <input
          className="hidden"
          type="file"
          ref={imageRef}
          onChange={handleFileChange}
          title="file"
        />
        {file && (
          <BaseButton
            title="Reset"
            variant="secondary"
            onClick={() => {
              setFile(null);
            }}
            className="!w-44 !h-12 bg-light-200 rounded-lg justify-center items-center"
          />
        )}
      </div>

      {/* Artist Information Section */}
      <div className="col-span-9 flex-col justify-start items-start gap-8 inline-flex w-full">
        <div className="self-stretch px-5 pt-5 pb-8 bg-dark-700 rounded-xl flex-col justify-start items-start gap-2 flex">
          <Label className="text-white text-base font-extrabold">
            Artist Name *
          </Label>
          <hr className="border-white opacity-20 my-4 w-full" />
          <Input
            value={formData.name ? formData.name : ''}
            onChange={(e) =>
              setFormData({ ...formData, name: (e.target as any).value })
            }
            className="w-full h-12 px-6 py-4 bg-dark-900 text-gray-500 text-sm font-normal rounded-xl"
            type="text"
            placeholder="Enter Artist Name"
          />
        </div>

        <div className="self-stretch px-5 pt-5 pb-8 bg-dark-700 rounded-xl flex-col justify-start items-start gap-2 flex">
          <div className="self-stretch flex items-center">
            <div className="text-white text-base font-extrabold">
              Artist Wallet Address *
            </div>
          </div>
          <hr className="border-white opacity-20 my-4 w-full" />
          <Input
            value={formData.wallet ? formData.wallet : ''}
            onChange={(e) =>
              setFormData({ ...formData, wallet: (e.target as any).value })
            }
            className="w-full border-none  h-12 px-6 py-4 bg-dark-900 text-gray-500 rounded-xl flex items-center gap-4"
            type="text"
            placeholder="Please enter the artist's wallet address"
          />
          <Input
            value={formData.confirmWallet ? formData.confirmWallet : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmWallet: (e.target as any).value,
              })
            }
            className="w-full border-none  h-12 px-6 py-4 bg-dark-900 text-gray-500 rounded-xl flex items-center gap-4"
            type="text"
            placeholder="Please enter the artist's wallet address again"
          />
        </div>

        <div className="self-stretch px-5 pt-5 pb-8 bg-dark-700 rounded-xl flex-col justify-start items-start gap-5 flex">
          <div className="self-stretch flex items-center">
            <div className="text-white text-base font-extrabold">
              Royalties (%) *
            </div>
          </div>
          <hr className="border-white opacity-20 my-4 w-full" />
          <div className="self-stretch flex items-center gap-3 grid-cols-6">
            <Input
              className="flex-grow h-12 px-6 py-4 bg-dark-900 rounded-xl flex items-center text-gray-500 text-sm font-normal col-span-4"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  royaltyAddress: e.target.value,
                })
              }
              placeholder="Please enter the percentage of royalties agreed upon with the artist in numbers."
              type="text"
              value={formData.royaltyAddress ?? ''}
            />

            <div>
              <Input
                className="h-12 px-5 py-4 bg-dark-900 rounded-xl flex items-center text-gray-600 text-xl font-bold col-span-1"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    royalty: Number(e.target.value) ?? 0,
                  });
                }}
                placeholder="%"
                min={0}
                max={100}
                type="number"
                value={formData.royalty.toString()}
              />
            </div>
            <div className="h-12 px-4 py-3 bg-transparent rounded-lg border-2 border-yellow-400 flex items-center gap-2.5">
              <div className="w-6 h-6 relative flex">
                <Image
                  src="/icons/add-new.svg"
                  alt="add-royalty"
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-center text-sm text-[#DDF247]">Add</p>
            </div>
          </div>
        </div>

        <div className="self-stretch px-5 pt-5 pb-8 bg-dark-700 rounded-xl flex-col justify-start items-start gap-5 flex">
          <div className="self-stretch flex items-center">
            <div className="text-white text-base font-extrabold">
              Split Payments (%) *
            </div>
          </div>
          <div className="text-gray-500 text-sm font-normal">
            The sum of all numbers (percentages) must equal 100%.
          </div>
          <div className="self-stretch flex items-start gap-3 w-full">
            <div className="w-2/12 h-12 px-6 py-4 bg-dark-800 rounded-xl flex items-center">
              <div className="text-gray-500 text-sm font-normal">
                My wallet address
              </div>
            </div>
            <div className="w-7/12 h-12 px-6 py-4 bg-dark-900 rounded-xl flex items-center">
              <div className="text-gray-500 text-sm font-normal">
                {activeAccount?.address}
              </div>
            </div>
            <div>
              <Input
                className="h-12 px-5 py-4 bg-dark-800 rounded-xl flex items-center text-gray-600 text-xl font-bold"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    mySplit: Number(e.target.value) ?? 0,
                  });
                }}
                placeholder="%"
                min={0}
                max={100}
                type="number"
                value={formData.mySplit.toString()}
              />
            </div>
          </div>
          {paymentSplits.map((split, index) => (
            <div className="self-stretch flex items-start gap-3" key={index}>
              <div className="w-2/12 h-12 px-6 py-4 bg-dark-800 rounded-xl flex items-center">
                <div className="text-gray-500 text-sm font-normal">
                  Artist wallet address
                </div>
              </div>
              <div className="w-7/12 px-0 py-0">
                <Input
                  className="h-12 bg-dark-900 rounded-xl flex items-center text-gray-500 text-sm font-normal"
                  onChange={(e) =>
                    updateSplit(index, 'paymentWallet', e.target.value)
                  }
                  placeholder="Please enter the split payment rate you wish to pay to others."
                  type="text"
                  value={split?.paymentWallet ?? ''}
                />
              </div>
              <div>
                <Input
                  className="h-12 px-5 py-4 bg-dark-800 rounded-xl flex items-center text-gray-600 text-xl font-bold"
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    updateSplit(index, 'paymentPercentage', value);
                  }}
                  placeholder="%"
                  min={0}
                  max={100}
                  type="number"
                  value={
                    split?.paymentPercentage
                      ? split.paymentPercentage.toString()
                      : ''
                  } // Convert bigint to string for display
                />
              </div>
              <div className="flex">
                {paymentSplits.length > 1 && (
                  <div className="h-12 py-3 mx-4">
                    <button
                      className="w-6 h-6"
                      onClick={() => removeSplit(index)}
                    >
                      <img
                        src="/icons/trash.svg"
                        alt=""
                        className="cursor-pointer w-6 h-6"
                      />
                    </button>
                  </div>
                )}
                {index === paymentSplits.length - 1 && (
                  <div
                    className="h-12 px-4 py-3 bg-transparent rounded-lg border-2 border-yellow-400 flex items-center gap-2.5"
                    onClick={addSplit}
                  >
                    <div className="w-6 h-6 relative flex">
                      <Image
                        src="/icons/add-new.svg"
                        alt="add-royalty"
                        width={24}
                        height={24}
                      />
                    </div>
                    <p className="text-center text-sm text-[#DDF247]">Add</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cancel and Submit Buttons */}
        <div className="flex gap-x-4 justify-center my-5 w-full">
          <DialogClose asChild={false}>
            <button className="hidden" ref={closeRef} />
          </DialogClose>
          <BaseButton title="Cancel" variant="secondary" onClick={cancel} />
          <BaseButton
            title="Save"
            variant="primary"
            onClick={create}
            loading={loading}
          />
        </div>

        <BaseDialog
          isOpen={errors.active}
          onClose={(val) => setErrors({ active: val, data: [] })}
          className="bg-black max-h-[80%] w-[617px] mx-auto overflow-y-auto overflow-x-hidden"
        >
          <ErrorModal
            title={'Error in creation found'}
            data={errors.data}
            close={() => {
              setErrors({ active: false, data: [] });
            }}
          />
        </BaseDialog>
      </div>
    </div>
  );
}
