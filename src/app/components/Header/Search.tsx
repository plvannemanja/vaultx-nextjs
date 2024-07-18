import { SearchIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const SearchDropDown = ({searchText}) => {
  return (
    <Tabs className="absolute left-0 top-14 w-full pl-2 pr-[8.50px] pt-1.5 bg-neutral-800 rounded-xl flex-col justify-end items-end gap-[18px] inline-flex 
    text-white transition-transform duration-500 transform"
    >
      <TabsList className="grid w-full grid-cols-4 text-white">
        <TabsTrigger value="artist">Artist</TabsTrigger>
        <TabsTrigger value="nft">NFTs</TabsTrigger>
        <TabsTrigger value="curation">Curation</TabsTrigger>
        <TabsTrigger value="user">Users</TabsTrigger>
      </TabsList>
      <TabsContent value="artist">123</TabsContent>
      <TabsContent value="nft">123</TabsContent>
      <TabsContent value="curation">1234</TabsContent>
      <TabsContent value="user">12345</TabsContent>
    </Tabs>
  )
}

export function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState<string>('');

  function toggle(e: React.FocusEvent<HTMLInputElement> | null | React.MouseEvent<HTMLInputElement>) {
    setOpen(e!== null && e.target === inputRef.current);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div className='w-[500px] relative hidden xl:block' ref={searchRef}>
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
