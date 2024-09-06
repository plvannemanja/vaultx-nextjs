'use client';

import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { Label } from '@/components/ui/label';

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
      value: curationFilter[0].value,
      label: curationFilter[0].label,
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
    <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
      <div className="flex gap-x-2 items-center">
        <svg
          width="24px"
          height="24px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#fff"
        >
          <path
            d="M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <Label>Filter</Label>
      </div>

      <div className="relative flex rounded min-w-[18rem] justify-between items-center px-3 py-2 bg-dark text-white">
        <p className="text-sm w-[70%]">{search.filter.label}</p>
        {search.filter.active ? (
          <ChevronUpIcon
            className="h-7 w-7"
            onClick={() => {
              setSearch({
                ...search,
                filter: { ...search.filter, active: !search.filter.active },
              });
            }}
          />
        ) : (
          <ChevronDownIcon
            className="h-7 w-7"
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
      </div>

      <div className="flex gap-x-2 items-center border-2 rounded-xl px-2 w-full py-2">
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
          className="w-full bg-transparent border-none outline-none focus:outline-none"
        />
      </div>
    </div>
  );
}
