import { SearchIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

const SearchDropDown = ({ searchText }) => {
  const ButtonContainer = () => {
    return (
      <div className="w-full h-[81px] py-4 relative cursor-pointer">
        <div className="left-1 top-0 justify-start items-center gap-3.5 inline-flex">
          <div className="w-[66px] h-[66px] relative rounded-xl">
            <Image
              width={66}
              height={66}
              className="shrink-0 aspect-square"
              src="/icons/default_profile.svg"
              alt="default_profile"
            />
          </div>
          <div className="flex-col justify-start items-start gap-[5px] inline-flex">
            <div className="text-white text-sm font-semibold font-['Azeret Mono'] leading-snug">
              Maradona
            </div>
            <div className="text-white text-sm font-normal font-['Azeret Mono'] leading-snug">
              Garotto
            </div>
          </div>
        </div>
      </div>
    );
  };
  const TabContainer = () => (
    <div className="flex-col pb-2">
      <ButtonContainer />
      <ButtonContainer />
      <ButtonContainer />
    </div>
  );

  return (
    <Tabs
      className="absolute left-0 top-14 w-full pl-2 pr-[8.50px] pt-1.5 bg-neutral-800 rounded-xl flex-col justify-start items-start gap-[18px] inline-flex 
    z-10 text-white transition-transform duration-500 transform"
      defaultValue="artist"
    >
      <TabsList className="grid w-full grid-cols-4 text-white">
        <TabsTrigger value="artist">Artist</TabsTrigger>
        <TabsTrigger value="nft">NFTs</TabsTrigger>
        <TabsTrigger value="curation">Curation</TabsTrigger>
        <TabsTrigger value="user">Users</TabsTrigger>
      </TabsList>
      <TabsContent value="artist">
        <TabContainer />
      </TabsContent>
      <TabsContent value="nft">
        <TabContainer />
      </TabsContent>
      <TabsContent value="curation">
        <TabContainer />
      </TabsContent>
      <TabsContent value="user">
        <TabContainer />
      </TabsContent>
    </Tabs>
  );
};

export function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');

  function toggle(
    e:
      | React.FocusEvent<HTMLInputElement>
      | null
      | React.MouseEvent<HTMLInputElement>,
  ) {
    setOpen(e !== null && e.target === inputRef.current);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[500px] relative hidden xl:block" ref={searchRef}>
      <div className="min-w-[500px] h-[52px] px-6 py-4 bg-neutral-800 rounded-xl justify-start items-center gap-7 inline-flex text-white">
        <input
          ref={inputRef}
          className="flex-1 w-full bg-neutral-800 text-opacity-50 rounded-lg px-4 py-2 leading-snug focus:outline-none focus:border-bg-neutral-800"
          type="text"
          placeholder="Search artwork, collection..."
          onFocus={toggle}
          onClick={toggle}
        ></input>
        <SearchIcon size={16} className="cursor-pointer" />
      </div>
      {open && <SearchDropDown searchText={searchText} />}
    </div>
  );
}
