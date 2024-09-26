'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

const categories = [
  {
    value: 'a',
    label: 'Test Category',
  },
  {
    value: 'b',
    label: 'Fine Art',
  },
  {
    value: 'c',
    label: 'Pop Art',
  },
  {
    value: 'd',
    label: 'Abstract Art',
  },
];

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
  const [search, setSearch] = useState<any>({
    search: '',
    price: {
      label: prices[0].label,
      value: prices[0].paramValue,
      active: false,
    },
    category: {
      label: categories[0].label,
      value: categories[0].value,
      active: false,
    },
  });

  useEffect(() => {
    if (setState) {
      setState(search);
    }
  }, [search.search, search.price.value, search.category.label]);

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-6 ">
      <div className="flex gap-x-2 items-center pl-4">
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
        <Label>Filter:</Label>
      </div>

      {!isCuration && (
        <div className="relative flex rounded-[12px] min-w-[18rem] justify-between items-center pl-[37px] px-3 py-2 bg-transparent text-white border border-[#FFFFFF1F]">
          <p className="text-sm w-[70%]">{search.category.label}</p>
          {search.category.active ? (
            <ChevronUpIcon
              className="h-7 w-7 text-[#ffffff30]"
              onClick={() => {
                setSearch({
                  ...search,
                  category: {
                    ...search.category,
                    active: !search.category.active,
                  },
                });
              }}
            />
          ) : (
            <ChevronDownIcon
            className="h-7 w-7 text-[#ffffff30]"
            onClick={() => {
                setSearch({
                  ...search,
                  category: {
                    ...search.category,
                    active: !search.category.active,
                  },
                });
              }}
            />
          )}

          {search.category.active && (
            <div className="absolute bg-dark p-3 rounded flex flex-col gap-y-3 min-w-[16rem] top-12 left-0 z-40">
              {categories.map((category, index: number) => (
                <span
                  key={index}
                  onClick={() => {
                    setSearch({
                      ...search,
                      category: {
                        label: category.label,
                        value: category.value,
                        active: false,
                      },
                    });
                    setState(category.value);
                  }}
                  className="text-sm cursor-pointer"
                >
                  {category.label}
                </span>
              ))}
            </div>
          )}
          <div className="absolute left-2 top-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.52148 4.0625C1.52148 3.13079 2.27727 2.375 3.20898 2.375H17.584C18.5157 2.375 19.2715 3.13079 19.2715 4.0625V5.3125C19.2715 6.10731 18.7215 6.7741 17.9815 6.95289L17.4994 15.154C17.4994 15.154 17.4994 15.154 17.4994 15.154C17.4601 15.8226 17.1667 16.4508 16.6794 16.9102C16.1921 17.3695 15.5478 17.6252 14.8782 17.625M16.4761 7L16.0019 15.066C15.9851 15.3525 15.8594 15.6218 15.6505 15.8186C15.4417 16.0155 15.1655 16.1251 14.8784 16.125H5.91482C5.6278 16.1251 5.3513 16.0155 5.14244 15.8186C4.93358 15.6218 4.80786 15.3525 4.79103 15.066L4.31687 7H16.4761ZM17.2649 5.5H3.52806C3.52414 5.49997 3.52022 5.49997 3.51628 5.5H3.20898C3.1057 5.5 3.02148 5.41579 3.02148 5.3125V4.0625C3.02148 3.95921 3.1057 3.875 3.20898 3.875H17.584C17.6873 3.875 17.7715 3.95921 17.7715 4.0625V5.3125C17.7715 5.41579 17.6873 5.5 17.584 5.5H17.2767C17.2728 5.49997 17.2688 5.49997 17.2649 5.5ZM2.81151 6.95289C2.07148 6.7741 1.52148 6.10731 1.52148 5.3125V4.0625M2.81151 6.95289L3.29361 15.154C3.29361 15.154 3.29361 15.154 3.29361 15.154C3.3329 15.8226 3.62624 16.4508 4.11357 16.9102C4.60084 17.3695 5.24521 17.6252 5.91482 17.625C5.91472 17.625 5.91492 17.625 5.91482 17.625H14.8782M7.97982 9.375C7.97982 8.96079 8.3156 8.625 8.72982 8.625H12.0632C12.4774 8.625 12.8132 8.96079 12.8132 9.375C12.8132 9.78921 12.4774 10.125 12.0632 10.125H8.72982C8.3156 10.125 7.97982 9.78921 7.97982 9.375Z" fill="white"/>
            </svg>
          </div>
        </div>
      )}

      <div className="relative flex rounded-[12px] min-w-[18rem] justify-between items-center pl-[37px] px-3 py-2 bg-transparent text-white border border-[#FFFFFF1F]">
        <p className="text-sm w-[70%]">{search.price.label}</p>
        {search.price.active ? (
          <ChevronUpIcon
          className="h-7 w-7 text-[#ffffff30]"
          onClick={() => {
              setSearch({
                ...search,
                price: { ...search.price, active: !search.price.active },
              });
            }}
          />
        ) : (
          <ChevronDownIcon
          className="h-7 w-7 text-[#ffffff30]"
          onClick={() => {
              setSearch({
                ...search,
                price: { ...search.price, active: !search.price.active },
              });
            }}
          />
        )}

        {search.price.active && (
          <div className="absolute bg-dark p-3 rounded flex flex-col gap-y-3 min-w-[16rem] top-12 left-0 z-40">
            {prices.map((price, index) => (
              <span
                key={index}
                onClick={() => {
                  setSearch({
                    ...search,
                    price: {
                      label: price.label,
                      value: price.paramValue,
                      active: false,
                    },
                  });
                  setState(price.value);
                }}
                className="text-sm cursor-pointer"
              >
                {price.label}
              </span>
            ))}
          </div>
        )}
        <div className="absolute left-2 top-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.77148 5.625C2.77148 5.21079 3.10727 4.875 3.52148 4.875H17.2715C17.6857 4.875 18.0215 5.21079 18.0215 5.625C18.0215 6.03921 17.6857 6.375 17.2715 6.375H3.52148C3.10727 6.375 2.77148 6.03921 2.77148 5.625ZM2.77148 10C2.77148 9.58579 3.10727 9.25 3.52148 9.25H17.2715C17.6857 9.25 18.0215 9.58579 18.0215 10C18.0215 10.4142 17.6857 10.75 17.2715 10.75H3.52148C3.10727 10.75 2.77148 10.4142 2.77148 10ZM2.77148 14.375C2.77148 13.9608 3.10727 13.625 3.52148 13.625H10.3965C10.8107 13.625 11.1465 13.9608 11.1465 14.375C11.1465 14.7892 10.8107 15.125 10.3965 15.125H3.52148C3.10727 15.125 2.77148 14.7892 2.77148 14.375Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="flex gap-x-2 items-center border border-[#FFFFFF1F] rounded-xl px-2 w-full">
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
          placeholder="Search by name..."
          className="w-full bg-transparent border-none outline-none focus:outline-none azeret-mono-font placeholder:text-[#FFFFFF87]"
          onChange={(e) =>
            setSearch({ ...search, search: (e.target as any).value })
          }
        />
      </div>
    </div>
  );
}
