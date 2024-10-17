'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Archive, ChevronDown, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const curationFilter = [
  {
    value: 'artworks',
    label: 'Number of Artworks',
  },
  {
    value: 'artists',
    label: 'Number of Artists',
  },
  {
    value: 'volume',
    label: 'Highest Volume',
  },
  {
    value: 'createdAt',
    label: 'New Curation',
  },
];

export default function CurationSearch({ setState }: { setState: any }) {
  const [search, setSearch] = useState<any>({
    search: '',
    filter: {
      value: null,
      label: null,
      active: false,
    },
  });

  useEffect(() => {
    setState({
      search: search.search,
      filter: search.filter.value,
    });
  }, [search.search, search.filter.label, search.filter.value]);
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-3 py-3">
      <div className="flex gap-x-2 items-center pl-0">
        <Filter className="w-4 h-4" />
        <Label className="font-extrabold text-xs">Filter:</Label>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex gap-x-1 rounded-[12px] min-w-[14rem] max-w-[16rem] h-full items-center p-3 py-[10px] bg-transparent text-white border border-white/[12%]">
          <div className="flex items-center flex-1 gap-x-2">
            <Archive className="w-4 h-4" />
            <span className="font-extrabold text-xs">
              {search.filter.label ? search.filter.label : 'New Curation'}
            </span>
          </div>
          {search.filter.active ? (
            <ChevronDown
              className="w-4 h-4 text-white/30"
              onClick={() => {
                setSearch({
                  ...search,
                  filter: { ...search.filter, active: !search.filter.active },
                });
              }}
            />
          ) : (
            <ChevronDownIcon
              className="w-4 h-4 text-white/30"
              onClick={() => {
                setSearch({
                  ...search,
                  filter: { ...search.filter, active: !search.filter.active },
                });
              }}
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[14rem] max-w-[16rem]">
          <DropdownMenuGroup>
            {curationFilter.map((item, index: number) => (
              <DropdownMenuItem
                onClick={() => {
                  setSearch({
                    ...search,
                    filter: {
                      label: item.label,
                      value: item.value,
                      active: false,
                    },
                  });
                  setState(item.value);
                }}
                key={index}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <div className="relative flex  min-w-[18rem] justify-between items-center px-3 py-2  text-white pl-4 bg-transparent rounded-[12px] border border-[#ffffff12]">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.3633 7.5L19.7383 18.132C19.7046 18.705 19.4532 19.2436 19.0355 19.6373C18.6177 20.031 18.0653 20.2502 17.4913 20.25H6.73528C6.16124 20.2502 5.60883 20.031 5.19111 19.6373C4.77339 19.2436 4.52196 18.705 4.48828 18.132L3.86328 7.5M10.1133 11.25H14.1133M3.48828 7.5H20.7383C21.3593 7.5 21.8633 6.996 21.8633 6.375V4.875C21.8633 4.254 21.3593 3.75 20.7383 3.75H3.48828C2.86728 3.75 2.36328 4.254 2.36328 4.875V6.375C2.36328 6.996 2.86728 7.5 3.48828 7.5Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <p className="text-sm w-[70%]">
          {search.filter.label ? search.filter.label : 'Recently Listed'}
        </p>
        {search.filter.active ? (
          <ChevronUpIcon
            className="h-7 w-7 text-[#ffffff12]"
            onClick={() => {
              setSearch({
                ...search,
                filter: { ...search.filter, active: !search.filter.active },
              });
            }}
          />
        ) : (
          <ChevronDownIcon
            className="h-7 w-7 text-[#ffffff12]"
            onClick={() => {
              setSearch({
                ...search,
                filter: { ...search.filter, active: !search.filter.active },
              });
            }}
          />
        )}

        {search.filter.active && (
          <div className="absolute bg-dark p-3 rounded flex flex-col gap-y-3 min-w-[16rem] top-12 left-0 z-40">
            {curationFilter.map((item, index) => (
              <span
                key={index}
                onClick={() => {
                  setSearch({
                    ...search,
                    filter: {
                      label: item.label,
                      value: item.value,
                      active: false,
                    },
                  });
                  setState(item.value);
                }}
                className="text-sm cursor-pointer"
              >
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div> */}
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
      {/* <div className="flex gap-x-2 items-center border border-[#ffffff12] rounded-xl px-2 w-full py-2 h-[52px]">
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#fff"
        >
          <path
            d="M17 17L21 21"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>

        <input
          value={search.search}
          onChange={(e) =>
            setSearch({ ...search, search: (e.target as any).value })
          }
          placeholder="Search by name..."
          className="w-full bg-transparent border-none outline-none focus:outline-none azeret-mono-font  placeholder:text-[#FFFFFF53] placeholder:"
        />
      </div> */}
    </div>
  );
}
