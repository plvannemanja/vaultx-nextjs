'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@headlessui/react';
import { Label } from '@/components/ui/label';
import BaseButton from '../../ui/BaseButton';
import FileInput from '../../ui/FileInput';
import PropertiesTemplate from './PropertiesTemplate';
import { StepType } from '../CreateNft';
import { useActiveAccount } from 'thirdweb/react';
const category = ['Fine Art', 'Abstract Art', 'Pop Art', 'Test Category'];
type SplitItem =  {
  address: string;
  percentage: number;
}
export default function AdvanceDetails({
  //   handler,
  nextStep,
}: {
  //   handler: (data: any, error: any) => void;
  nextStep: (next?: boolean, data?: any, error?: any, type?: StepType) => void;
}) {

  const activeAccount = useActiveAccount();
  const [options, setOptions] = useState({
    freeMint: false,
    royalties: false,
    unlockable: false,
    category: false,
    split: false,
  });
  const [splits, setSplits] = useState<SplitItem[]>([{
    address: '',
    percentage: 0,
  }]);
  const [unlockableFiles, setUnlockableFiles] = useState<any>([]);
  const [formData, setFormData] = useState<any>({
    royaltyAddress: "0x0000000000000000000000000000000000000000",
    royalty: 0,
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
  };

  const removeUnlockable = (index: number) => {
    const newFiles = unlockableFiles.filter(
      (item: any, i: number) => i !== index,
    );

    setUnlockableFiles(newFiles);
  };

  const addSplit = () => {
    const newSplit = {
      address: '0x0000000000000000000000000000000000000000',
      percentage: 0,
    };

    setSplits([...splits, newSplit]);
  };

  const removeSplit = (index: number) => {
    const newSplits = splits.filter((item: any, i: number) => i !== index);

    setSplits([...newSplits]);
  };

  const setPaymentSplit = (
    index: number,
    key: keyof SplitItem,
    value: string,
  ) => {
    const updatedData = splits.map((item: any, i: number) =>
      i === index ? { ...item, [key]: value } : item,
    );

    setSplits([...updatedData]);
  };

  const toggleSwitch = (e: any) => {
    switch (e) {
      case 'free':
        setOptions({
          ...options,
          freeMint: !options.freeMint,
        });
        break;
      case 'royalty':
        setOptions({
          ...options,
          royalties: !options.royalties,
        });
        break;
      case 'unlockable':
        setOptions({
          ...options,
          unlockable: !options.unlockable,
        });
        break;
      case 'category':
        setOptions({
          ...options,
          category: !options.category,
        });
        break;
      case 'split':
        setOptions({
          ...options,
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
    console.log('formData', formData);
    // const err = [];
    // if (!selectedProperty) {
    //   err.push({ path: ['Properties'] });
    // }

    // if (options.royalties && !formData.royalty) {
    //   err.push({ path: ['Royalties'] });
    // }

    // if (options.catgory && !formData.category) {
    //   err.push({ path: ['Category'] });
    // }

    // if (options.unlockable && !formData.unlockable) {
    //   err.push({ path: ['Unlockable Content'] });
    // }

    // if (options.split && !splits.data.length) {
    //   err.push({ path: ['Split Payments'] });
    // }

    // if (err.length > 0) {
    //   handler(null, JSON.stringify(err));
    //   return;
    // }

    // const data = new FormData();
    // data.append('freeMinting', options.freeMint as any);
    // data.append('royalty', formData.royalty);
    // data.append('category', formData.category);
    // data.append('unlockableContent', formData.unlockable);
    // data.append(
    //   'attributes',
    //   JSON.stringify(
    //     selectedProperty.attributes ? selectedProperty.attributes : [],
    //   ),
    // );

    // for (let i = 0; i < unlockableFiles.length; i++) {
    //   data.append('certificates', unlockableFiles[i]);
    // }

    const errors: { path: string[] }[] = [];

    const addError = (field: string) => {
      errors.push({ path: [field] });
    };

    // Validation checks
    // if (!selectedProperty) addError('Properties');
    // if (options.royalties && !formData.royalty) addError('Royalties');
    // if (options.category && !formData.category) addError('Category');
    // if (options.unlockable && !formData.unlockable)
    //   addError('Unlockable Content');
    // if (options.split && splits.data.length === 0) addError('Split Payments');

    // // If there are errors, handle them and return early
    // if (errors.length > 0) {
    //   handler(null, JSON.stringify(errors));
    //   return;
    // }

    // Create the data object using spreading and direct assignment
    const data = {
      freeMinting: String(options.freeMint),
      royalty:
        options.royalties == true ? { receiver: formData.royaltyAddress, percentage: formData.royalty } :
        { receiver: activeAccount?.address, percentage: 0 },
      category: formData.category || '',
      unlockableContent: formData.unlockable || '',
      attributes: selectedProperty?.attributes || [],
      certificates: unlockableFiles, // Assuming this is a list of files
      splits: options.split == true? splits : [{address: activeAccount?.address, percentage: 100}],
    };

    // handler(data, null);
    nextStep(true, data, null, StepType.advanced);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="bg-dark px-3 py-2 rounded-lg w-[22rem] flex justify-between items-center">
          <div className="w-[75%] flex flex-col gap-y-2">
            <p className="font-medium">Free Minting</p>
            <p className="text-gray-500">
              Free mint your nft. You don&apos;t need any gas fee
            </p>
          </div>
          <Switch
            id="free"
            checked={options.freeMint}
            onCheckedChange={() => toggleSwitch('free')}
          />
        </div>

        <div className="bg-dark px-3 py-2 rounded-lg w-[22rem] flex justify-between items-center">
          <div className="w-[75%] flex flex-col gap-y-2">
            <p className="font-medium">Royalties</p>
            <p className="text-gray-500">Earn a % on secondary sales</p>
          </div>
          <Switch
            id="royalty"
            checked={options.royalties}
            onCheckedChange={() => toggleSwitch('royalty')}
          />
        </div>

        <div className="bg-dark px-3 py-2 rounded-lg w-[22rem] flex justify-between items-center">
          <div className="w-[75%] flex flex-col gap-y-2">
            <p className="font-medium">Unlockable Content</p>
            <p className="text-gray-500">Only owner can view this content</p>
          </div>
          <Switch
            id="unlockable"
            checked={options.unlockable}
            onCheckedChange={() => toggleSwitch('unlockable')}
          />
        </div>

        <div className="bg-dark px-3 py-2 rounded-lg w-[22rem] flex justify-between items-center">
          <div className="w-[75%] flex flex-col gap-y-2">
            <p className="font-medium">Category</p>
            <p className="text-gray-500">Put this item into category</p>
          </div>
          <Switch
            id="category"
            checked={options.category}
            onCheckedChange={() => toggleSwitch('category')}
          />
        </div>

        <div className="bg-dark px-3 py-2 rounded-lg w-[22rem] flex justify-between items-center">
          <div className="w-[75%] flex flex-col gap-y-2">
            <p className="font-medium">Split Payments</p>
            <p className="text-gray-500">
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
            <p className="text-lg font-medium">Royalties(%)</p>
            <div className="flex gap-x-2">
              <Input
                className="bg-dark max-w-[22rem]"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    royaltyAddress: (e.target as any).value,
                  })
                }
                placeholder="Address"
                type="text"
              />
              <Input
                className="bg-dark max-w-20"
                onChange={(e) =>
                  setFormData({ ...formData, royalty: (e.target as any).value })
                }
                placeholder="0"
                type="number"
              />
            </div>
          </div>
        )}

        {options.unlockable && (
          <div className="flex flex-col gap-y-3">
            <p className="text-lg font-medium">Unlockable Content</p>
            <Textarea
              className="bg-dark p-4 rounded-md"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unlockable: (e.target as any).value,
                })
              }
              rows={4}
              placeholder="Only the artwork owner can view this content and file. You may also attach a certificate of authenticity issued by a third party and a special image just for the buyer."
            />
            <div className="flex gap-x-4 items-center">
              <p>File Selected</p>
              <div
                className="flex gap-x-2 px-4 py-1 rounded-md items-center border-2 border-neon cursor-pointer"
                onClick={() => {
                  setUnlockableFiles([...unlockableFiles, null]);
                }}
              >
                <img src="icons/plus.svg" alt="plus" className="w-4 h-4" />
                <p className="text-neon">Add</p>
              </div>
            </div>
            {unlockableFiles.map((item: any, index: number) => {
              return (
                <div className="flex gap-x-4 items-center" key={index}>
                  <FileInput
                    onFileSelect={(file: any) => handleFileChange(file, index)}
                    key={index}
                    maxSizeInBytes={1024 * 1024}
                  />
                  <img
                    src="icons/trash.svg"
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
              className="h-10 rounded-md px-2 w-full"
              name="country"
              onChange={(e) =>
                setFormData({ ...formData, category: (e.target as any).value })
              }
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
            {/* <div className="flex gap-x-2">
              <Input
                className="bg-dark max-w-[22rem]"
                onChange={(e) =>
                  setFormData({ ...formData, address: (e.target as any).value })
                }
                placeholder="Address"
                type="text"
              />
              <Input
                className="bg-dark max-w-20"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    percentage: (e.target as any).value,
                  })
                }
                placeholder="%"
                type="number"
              />
              <div
                className="flex gap-x-2 px-4 py-1 rounded-md items-center border-2 border-neon cursor-pointer"
                onClick={addSplit}
              >
                <img src="icons/plus.svg" alt="plus" className="w-4 h-4" />
                <p className="text-neon">Add</p>
              </div>
            </div> */}
            <div className="flex flex-col gap-y-2">
              {splits.map((item: any, index: number) => (
                <div key={index} className="flex gap-x-2 items-center">
                  <Input
                    className="bg-dark max-w-[22rem]"
                    placeholder="Address"
                    type="text"
                    value={item.address}
                    onChange={(e) => {
                      setPaymentSplit(index, 'address', e.target.value);
                    }}
                  />
                  <Input
                    className="bg-dark max-w-20"
                    placeholder="%"
                    type="number"
                    value={item.percentage}
                    onChange={(e) => {
                      setPaymentSplit(index, 'percentage', e.target.value);
                    }}
                  />
                  {index === 0 ? (
                    <div
                      className="flex gap-x-2 px-4 py-1 rounded-md items-center border-2 border-neon cursor-pointer"
                      onClick={addSplit}
                    >
                      <img src="icons/plus.svg" alt="Add" className="w-4 h-4" />
                      <p className="text-neon">Add</p>
                    </div>
                  ) : (
                    <img
                      src="icons/trash.svg"
                      alt="Remove"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => removeSplit(index)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <PropertiesTemplate
          select={(e: any) => {
            setSelectedProperty(e);
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
