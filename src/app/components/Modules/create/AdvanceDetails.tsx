'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@headlessui/react';
import { Label } from '@/components/ui/label';
import BaseButton from '../../ui/BaseButton';
import FileInput from '../../ui/FileInput';
import PropertiesTemplate from './PropertiesTemplate';
import { useCreateNFT } from '../../Context/CreateNFTContext';
import { PaymentSplitType } from '@/types';
import { BaseDialog } from '../../ui/BaseDialog';
import PropertiesInfo from '../Properties';

const category = ['Fine Art', 'Abstract Art', 'Pop Art', 'Test Category'];

export default function AdvanceDetails({
  handler,
  nextStep,
}: {
  handler: (data: any, error: any) => void;
  nextStep: (next?: boolean) => void;
}) {
  const {
    advancedOptions: options,
    setAdvancedOptions: setOptions,
    paymentSplits,
    setPaymentSplits,
    advancedDetails,
    setAdvancedDetails,
  } = useCreateNFT();

  // const [splits, setSplits] = useState<any>({
  //   address: '',
  //   percentage: 0,
  //   data: [],
  // });

  const [royalties, setRoyalties] = useState<
    Array<{ address: string; percentage: string }>
  >([{ address: '', percentage: '' }]);

  const [splits, setSplits] = useState<PaymentSplitType[]>([
    { paymentWallet: '', paymentPercentage: BigInt(0) },
  ]);
  // const [splits, setSplits] = useState([{ paymentWallet: '', paymentPercentage: '' }]);
  const [unlockableFiles, setUnlockableFiles] = useState<any>([]);

  const [formData, setFormData] = useState<any>({
    royaltyAddress: null,
    royalty: null,
    unlockable: null,
    category: null,
    address: null,
    percentage: null,
  });
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const handleFileChange = (file: any, index: number) => {
    const newFiles = unlockableFiles.map((item: any, i: number) => {
      if (i === index) {
        return file;
      }
      return item;
    });

    setUnlockableFiles(newFiles);
    setAdvancedDetails({
      ...advancedDetails,
      certificates: newFiles,
    });
  };

  const removeUnlockable = (index: number) => {
    const newFiles = unlockableFiles.filter(
      (item: any, i: number) => i !== index,
    );

    setUnlockableFiles(newFiles);
    setAdvancedDetails({
      ...advancedDetails,
      certificates: newFiles,
    });
  };
  const addRoyalty = () => {
    const newRoyalties = [...royalties, { address: '', percentage: '' }];
    setRoyalties(newRoyalties);
    updateAdvancedDetailsRoyalties(newRoyalties);
  };

  const removeRoyalty = (index: number) => {
    if (royalties.length > 1) {
      const newRoyalties = royalties.filter((_, i) => i !== index);
      setRoyalties(newRoyalties);
      updateAdvancedDetailsRoyalties(newRoyalties);
    }
  };

  const updateRoyalty = (
    index: number,
    field: 'address' | 'percentage',
    value: string | number,
  ) => {
    const newRoyalties = royalties.map((royalty, i) => {
      if (i === index) {
        return {
          ...royalty,
          [field]: field === 'percentage' ? Number(value) : value,
        };
      }
      return royalty;
    });
    setRoyalties(newRoyalties);
    updateAdvancedDetailsRoyalties(newRoyalties);
  };
  const addSplit = () => {
    setSplits([...splits, { paymentWallet: '', paymentPercentage: BigInt(0) }]);
  };

  const removeSplit = (index: number) => {
    if (splits.length > 1) {
      const newSplits = splits.filter((_, i) => i !== index);
      setSplits(newSplits);
      setPaymentSplits(newSplits);
    }
  };

  const updateSplit = (
    index: number,
    field: 'paymentWallet' | 'paymentPercentage',
    value: string | bigint,
  ) => {
    const newSplits = splits.map((split, i) => {
      if (i === index) {
        return {
          ...split,
          [field]: field === 'paymentPercentage' ? BigInt(value) : value,
        };
      }
      return split;
    });
    setSplits(newSplits);
    setPaymentSplits(newSplits);
  };
  // useEffect(() => {
  //   // Initialize royalties from advancedDetails if available
  //   if (advancedDetails.royaltyAddress && advancedDetails.royalty) {
  //     setRoyalties([{
  //       address: advancedDetails.royaltyAddress,
  //       percentage: advancedDetails.royalty.toString()
  //     }]);
  //   }
  // }, []);
  const updateAdvancedDetailsRoyalties = (
    newRoyalties: Array<{ address: string; percentage: number | string }>,
  ) => {
    setAdvancedDetails({
      ...advancedDetails,
      royalties: newRoyalties.map((royalty) => ({
        address: royalty.address,
        percentage: Number(royalty.percentage),
      })),
    });
  };

  const toggleSwitch = (e: any) => {
    switch (e) {
      case 'free':
        setOptions({
          freeMint: !options.freeMint,
        });
        break;
      case 'royalty':
        setOptions({
          royalties: !options.royalties,
        });
        break;
      case 'unlockable':
        setOptions({
          unlockable: !options.unlockable,
        });
        break;
      case 'category':
        setOptions({
          category: !options.category,
        });
        break;
      case 'split':
        setOptions({
          split: !options.split,
        });
        break;
      default:
        break;
    }
  };

  const cancelChanges = () => {
    nextStep(false);
  };

  const create = async () => {
    const err = [];
    if (!advancedDetails.attributes) {
      err.push({ path: ['Properties'] });
    }

    if (options.royalties && !advancedDetails.royalties) {
      err.push({ path: ['Royalties'] });
    }

    if (options.category && !advancedDetails.category) {
      err.push({ path: ['Category'] });
    }

    if (options.unlockable && !advancedDetails.unlockable) {
      err.push({ path: ['Unlockable Content'] });
    }

    if (options.split && !paymentSplits.length) {
      err.push({ path: ['Split Payments'] });
    }

    if (err.length > 0) {
      handler(null, JSON.stringify(err));
      return;
    }

    handler({}, null);
    nextStep(true);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-3 grid grid-cols-1 lg:grid-cols-3 flex-wrap">
        <div className="bg-dark px-3 py-2 grid-cols-1 sm:grid-cols-2 rounded-lg w-full flex justify-between items-center">
          <div className="w-full flex flex-col gap-y-2">
            <p className="font-medium">Free Minting</p>
            <p className="text-gray-500 azeret-mono-font">{`Free mint your nft. You don't need any gas fee `}</p>
          </div>
          <Switch
            id="free"
            checked={options.freeMint}
            onCheckedChange={() => toggleSwitch('free')}
          />
        </div>

        <div className="bg-dark px-3 py-2 grid-cols-3 rounded-lg w-full flex justify-between items-center">
          <div className="w-full flex flex-col gap-y-2">
            <p className="font-medium">Royalties</p>
            <p className="text-gray-500 azeret-mono-font">
              Earn a % on secondary sales
            </p>
          </div>
          <Switch
            id="royalty"
            checked={options.royalties}
            onCheckedChange={() => toggleSwitch('royalty')}
          />
        </div>

        <div className="bg-dark px-3 py-2 grid-cols-3 rounded-lg w-full flex justify-between items-center">
          <div className="w-full flex flex-col gap-y-2">
            <p className="font-medium">Unlockable Content</p>
            <p className="text-gray-500 azeret-mono-font">
              Only owner can view this content
            </p>
          </div>
          <Switch
            id="unlockable"
            checked={options.unlockable}
            onCheckedChange={() => toggleSwitch('unlockable')}
          />
        </div>

        <div className="bg-dark px-3 py-2 grid-cols-3 rounded-lg w-full flex justify-between items-center">
          <div className="w-full flex flex-col gap-y-2">
            <p className="font-medium">Category</p>
            <p className="text-gray-500 azeret-mono-font">
              Put this item into category
            </p>
          </div>
          <Switch
            id="category"
            checked={options.category}
            onCheckedChange={() => toggleSwitch('category')}
          />
        </div>

        <div className="bg-dark px-3 py-2 grid-cols-3 rounded-lg w-full flex justify-between items-center">
          <div className="w- flex flex-col gap-y-2">
            <p className="font-medium">Split Payments</p>
            <p className="text-gray-500 azeret-mono-font">
              Add multiple address to receive payments
            </p>
          </div>
          <Switch
            id="split"
            checked={options.split}
            onCheckedChange={() => toggleSwitch('split')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-5">
        {options.royalties && (
          <div className="flex flex-col gap-y-3">
            <p className="text-[20px] font-medium">Royalties</p>

            {royalties.map((royalty, index) => (
              <div key={index} className="grid grid-cols-12 gap-x-2">
                <div className="col-span-4">
                  <Input
                    className="border-none w-[500px] grid-cols-3 h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"
                    onChange={(e) =>
                      updateRoyalty(index, 'address', e.target.value)
                    }
                    placeholder="Address"
                    type="text"
                    value={royalty.address}
                  />
                </div>
                <div className="col-span-1 flex">
                  <div className="relative">
                    <Input
                      className="max-w-23 h-[52px] px-[12px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px]"
                      onChange={(e) =>
                        updateRoyalty(index, 'percentage', e.target.value)
                      }
                      placeholder="0"
                      min={0}
                      max={100}
                      type="number"
                      value={royalty.percentage}
                    />
                    <p className="absolute top-4 right-2 text-[#979797]">%</p>
                  </div>
                </div>
                <div className="col-span-2 flex">
                  {royalties.length > 1 && (
                    <button
                      className="h-[52px] mx-4"
                      onClick={() => removeRoyalty(index)}
                    >
                      <img
                        src="/icons/trash.svg"
                        alt=""
                        className="cursor-pointer w-6 h-6"
                      />
                    </button>
                  )}
                  {index === royalties.length - 1 && (
                    <div
                      className="flex cursor-pointer h-[52px] justify-center relative gap-y-1 items-center px-[14px] py-[16px] border-2 border-[#DDF247] rounded-md"
                      onClick={addRoyalty}
                    >
                      <img src="/icons/add-new.svg" className="w-6 h-6" />
                      <p className="text-center text-sm text-[#DDF247]">
                        Add New
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {options.unlockable && (
          <div className="flex flex-col gap-y-3">
            <p className="text-lg font-medium">Unlockable Content</p>
            <Textarea
              className="bg-[#232323] p-4 rounded-md azeret-mono-font"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  unlockable: (e.target as any).value,
                });
                setAdvancedDetails({
                  ...advancedDetails,
                  unlockable: (e.target as any).value,
                });
              }}
              rows={4}
              value={advancedDetails.unlockable}
              placeholder="Only the artwork owner can view this content and file. You may also attach a certificate of authenticity issued by a third party and a special image just for the buyer."
            />
            <div className="flex gap-x-4 items-center">
              <FileInput
                onFileSelect={(file: any) => handleFileChange(file, 0)}
                maxSizeInBytes={1024 * 1024}
              />
              <img
                src="/icons/trash.svg"
                alt="trash"
                className="w-6 h-6 cursor-pointer"
                onClick={() => removeUnlockable(0)}
              />
              <div
                className="flex gap-x-2 px-4 h-[52px] py-1 rounded-md items-center border-2 border-neon cursor-pointer"
                onClick={() => {
                  setUnlockableFiles([...unlockableFiles, null]);
                  setAdvancedDetails({
                    ...advancedDetails,
                    certificates: [...unlockableFiles, null],
                  });
                }}
              >
                <img src="/icons/add-new.svg" alt="plus" className="w-4 h-4" />
                <p className="text-neon">Add</p>
              </div>
            </div>
            {advancedDetails.certificates.map((item: any, index: number) => {
              return (
                <div className="flex gap-x-4 items-center" key={index}>
                  <FileInput
                    onFileSelect={(file: any) => handleFileChange(file, index)}
                    maxSizeInBytes={1024 * 1024}
                  />
                  <img
                    src="/icons/trash.svg"
                    alt="trash"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => removeUnlockable(index)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {options.category && (
          <div className="flex flex-col gap-y-2">
            <Label className="text-lg font-medium">Category</Label>
            <select
              aria-label="Select category"
              // className="h-10 rounded-md px-2 w-full"
              className="w-full border-none  h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"
              name="country"
              onChange={(e) => {
                setFormData({ ...formData, category: (e.target as any).value });
                setAdvancedDetails({
                  ...advancedDetails,
                  category: (e.target as any).value,
                });
              }}
              value={advancedDetails.category}
            >
              <option value="">Select</option>
              {category.map((item: any) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}

        {options.split && (
          <div className="flex flex-col gap-y-3">
            <p className="text-lg font-medium">Split Payments (%)</p>
            {splits.map((split, index) => (
              <div key={index} className="grid grid-cols-12 gap-x-2">
                <div className="col-span-4">
                  <Input
                    className="border-none w-[500px] grid-cols-3 h-[52px] px-[26px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px] inline-flex"
                    onChange={(e) =>
                      updateSplit(index, 'paymentWallet', e.target.value)
                    }
                    placeholder="Address"
                    type="text"
                    value={split.paymentWallet}
                  />
                </div>
                <div className="col-span-1 flex">
                  <div className="relative">
                    <Input
                      className="max-w-23 h-[52px] px-[12px] py-[15px] bg-[#232323] rounded-xl justify-start items-center gap-[30px]"
                      onChange={(e) => {
                        const value = BigInt(e.target.value); // Convert the input value to bigint
                        updateSplit(index, 'paymentPercentage', value);
                      }}
                      placeholder="0"
                      min={0}
                      max={100}
                      type="number"
                      value={split.paymentPercentage.toString()} // Convert bigint to string for display
                    />
                    <p className="absolute top-4 right-2 text-[#979797]">%</p>
                  </div>
                </div>
                <div className="col-span-2 flex">
                  {splits.length > 1 && (
                    <button
                      className="h-[52px] mx-4"
                      onClick={() => removeSplit(index)}
                    >
                      <img
                        src="/icons/trash.svg"
                        alt=""
                        className="cursor-pointer w-6 h-6"
                      />
                    </button>
                  )}
                  {index === splits.length - 1 && (
                    <div
                      className="flex cursor-pointer h-[52px] justify-center relative gap-y-1 items-center px-[14px] py-[16px] border-2 border-[#DDF247] rounded-md"
                      onClick={addSplit}
                    >
                      <img src="/icons/add-new.svg" className="w-6 h-6" />
                      <p className="text-center text-sm text-[#DDF247]">
                        Add New
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <PropertiesTemplate
          select={(e: any) => {
            setSelectedProperty(e);
            console.log(e);
          }}
        />

        <div className="flex gap-x-4 justify-center my-5">
          <BaseButton
            title="Previous"
            variant="secondary"
            onClick={cancelChanges}
          />
          <BaseButton title="Next" variant="primary" onClick={create} />
        </div>
      </div>
    </div>
  );
}
