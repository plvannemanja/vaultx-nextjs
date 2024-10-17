'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { CategoryService } from '@/services/catergoryService';
import { AlignLeft, Archive, ChevronDown, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export const prices = [
  {
    value: 'e',
    label: 'Price: Low to High',
    param: 'price',
    paramValue: 1,
  },
  {
    value: 'f',
    label: 'Price: High to Low',
    param: 'price',
    paramValue: -1,
  },
  {
    value: 'g',
    label: 'Recently Minted',
    param: 'createdAt',
    paramValue: -1,
  },
  {
    value: 'h',
    label: 'Recently Listed',
    param: 'updatedAt',
    paramValue: -1,
  },
  {
    value: 'i',
    label: 'Most Favorited',
    param: 'likes',
    paramValue: -1,
  },
  {
    value: 'j',
    label: 'Highest Last Sale',
    param: 'price',
    paramValue: -1,
  },
  {
    value: 'k',
    label: 'NFC Minted',
  },
];

export default function Filters({
  setState,
  isCuration = false,
}: {
  setState?: any;
  isCuration?: boolean;
}) {
  const [categories, setCategories] = useState<any[]>([
    {
      name: 'Category',
      _id: null,
    },
  ]);

  const [search, setSearch] = useState<any>({
    search: '',
    price: {
      label: prices[0].label,
      value: prices[0].paramValue,
      active: false,
    },
    category: {
      label: categories[0].name,
      value: categories[0].name,
      active: false,
    },
  });

  const fetchCategories = async () => {
    try {
      const categoryService = new CategoryService();
      const {
        data: { categories },
      } = await categoryService.getAllCategories(0, 0);
      setCategories([{ name: 'Category', _id: null }, ...categories]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (setState) {
      setState(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.search, search.price.value, search.category.label]);

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-3 py-3">
      <div className="flex gap-x-2 items-center pl-0">
        <Filter className="w-4 h-4" />
        <Label className="font-extrabold text-xs">Filter:</Label>
      </div>
      {!isCuration && (
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex gap-x-1 rounded-[12px] min-w-[14rem] max-w-[16rem] h-full items-center p-3 py-[10px] bg-transparent text-white border border-white/[12%]">
            <div className="flex items-center flex-1 gap-x-2">
              <Archive className="w-4 h-4" />
              <span className="font-extrabold text-xs">
                {search.category.label}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[14rem] max-w-[16rem]">
            <DropdownMenuGroup>
              {categories.map((category, index: number) => (
                <DropdownMenuItem
                  onClick={() => {
                    setSearch({
                      ...search,
                      category: {
                        label: category.name,
                        value: category.name,
                      },
                    });
                    setState(search);
                  }}
                  key={index}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu
      // onValueChange={(value: string) => {
      //   const filteredPrice = prices.filter(
      //     (price) => price.value === value,
      //   )?.[0];
      //   if (filteredPrice) {
      //     setSearch({
      //       ...search,
      //       price: {
      //         label: filteredPrice.param,
      //         value: filteredPrice.paramValue,
      //       },
      //     });
      //     setState(search);
      //   }
      // }}
      >
        <DropdownMenuTrigger className="relative flex gap-x-1 rounded-[12px] min-w-[14rem] max-w-[16rem] h-full items-center p-3 py-[10px] bg-transparent text-white border border-white/[12%]">
          <div className="flex items-center flex-1 gap-x-2">
            <AlignLeft className="w-4 h-4" />
            <span className="font-extrabold text-xs">
              {search?.price?.label}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/30" />
        </DropdownMenuTrigger>
        {/* <DropdownMenuTrigger className="relative flex rounded-[12px] h-full min-w-[14rem] max-w-[16rem] justify-between items-center pl-[37px] px-3 py-2 bg-transparent text-white border border-[#FFFFFF1F]">
          <AlignLeft />
          <SelectValue placeholder="Sort by..." />
        </DropdownMenuTrigger> */}
        <DropdownMenuContent className="min-w-[14rem] max-w-[16rem]">
          <DropdownMenuGroup>
            {prices.map((price, index: number) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  const filteredPrice = prices.filter(
                    (p) => p.value === price.value,
                  )?.[0];
                  console.log(filteredPrice);
                  if (filteredPrice) {
                    setSearch({
                      ...search,
                      price: {
                        label: filteredPrice.label,
                        value: filteredPrice.paramValue,
                      },
                    });
                    setState(search);
                  }
                }}
              >
                {price.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex gap-x-2 items-center border bg-[#232323]/[14%] border-white/[12%] rounded-xl p-3 py-[10px] w-full">
        <Search className="w-4 h-4" />
        <input
          placeholder="Search by name or trait..."
          className="w-full bg-transparent border-none outline-none focus:outline-none placeholder:text-white/[53%] text-white/[53%] text-xs font-AzeretMono"
          onChange={(e) =>
            setSearch({ ...search, search: (e.target as any).value })
          }
        />
      </div>
    </div>
  );
}
