'use client';

import { useState } from 'react';
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export const prices = [
  {
    id: 1,
    label: 'Price: Low to High',
    param: 'price',
    paramValue: 1,
  },
  {
    id: 2,
    label: 'Price: High to Low',
    param: 'price',
    paramValue: -1,
  },
  {
    id: 3,
    label: 'Recently Minted',
    param: 'createdAt',
    paramValue: -1,
  },
  {
    id: 4,
    label: 'Recently Listed',
    param: 'updatedAt',
    paramValue: -1,
  },
  {
    id: 5,
    label: 'Most Favorited',
    param: 'likes',
    paramValue: -1,
  },
  {
    id: 6,
    label: 'Highest Last Sale',
    param: 'price',
    paramValue: -1,
  },
  {
    id: 7,
    label: 'NFC Minted',
    param: 'nfcMinted',
    paramValue: true,
  },
];

export default function SelectMenu({ data }: { data: any[] }) {
  const [selected, setSelected] = useState(prices[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative bg-dark text-white">
        <ListboxButton className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
          <span className="flex items-center">
            <span className="ml-3 block truncate text-white">
              {selected.label}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-white"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-dark py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {data.length > 0
            ? data.map((item: any, index) => (
                <ListboxOption
                  key={index}
                  value={item.id}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9"
                  onClick={() => setSelected(item)}
                >
                  <div className="flex items-center">
                    <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                      {item.label}
                    </span>
                  </div>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                    <CheckIcon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </ListboxOption>
              ))
            : null}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
