import { SearchIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { collectionServices, IGetSearchResponse } from '@/services/supplier';
import { CurationType, NFTItemType, UserType } from '@/types';
import { shortenAddress } from 'thirdweb/utils';

interface ISearchDropDownProps {
  searchText: string;
}

interface IButtonProps {
  type: "artist" | "nft" | "curation" | "user";
  url: string;
}

interface INFTButtonProps extends IButtonProps {
  img: string;
  price: number;
}

interface ICurationButtonProps extends IButtonProps {
  name: string;
  symbol: string;  
}

interface IUserButtonProps extends IButtonProps {
  img: string;
  name: string;
}

const SearchDropDown = ({ searchText }: ISearchDropDownProps) => {
  const [artists, setArtists] = useState<Array<Partial<NFTItemType>>>([]);
  const [nfts, setNFTs] = useState<Array<Partial<NFTItemType>>>([]);
  const [curations, setCurations] = useState<Array<Partial<CurationType>>>([]);
  const [users, setUsers] = useState<Array<Partial<UserType>>>([]);

  useEffect(() => {
    function getSearchResult () {
      collectionServices.getSearch({filterString: searchText})
        .then((searchResponse: IGetSearchResponse) => {
          if(searchResponse.success) {
            setArtists(searchResponse.artistsNfts);
            setNFTs(searchResponse.nfts);
            setCurations(searchResponse.curations);
            setUsers(searchResponse.users);
          }
        })
        .catch(err => {
          console.log("Error in search result", err);
        })
    }
  }, [searchText]);
  const ButtonContainer = (buttonInfo: INFTButtonProps | ICurationButtonProps | IUserButtonProps) => {
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

  const ArtistContainer = () => (
    <div className="flex-col pb-2">
      {artists.map(artist => (
        <ButtonContainer
          key={artist?._id}
          type="artist"
          url={`/dashboard/nft/${artist?._id}`}  
          img={artist?.cloudinaryUrl ?? ""} 
          price={artist?.price ?? 0}
        />
      ))}
    </div>
  );

  const NFTContainer = () => (
    <div className="flex-col pb-2">
      {nfts.map(nft => (
        <ButtonContainer
          key={nft?._id}
          type="nft"
          url={`/dashboard/nft/${nft?._id}`}
          img={nft?.cloudinaryUrl ?? ""}
          price={nft?.price ?? 0}
        />        
      ))}
    </div>
  );

  const CurationContainer = () => (
    <div className="flex-col pb-2">
      {curations.map(curation => (
        <ButtonContainer
          key={curation?._id}
          type="curation"
          url={`/dashboard/curation/${curation?._id}`}
          img={curation?.logo ?? ""}
          name={curation?.name ?? ""}
          symbol={curation?.symbol ?? ""}
        />  
      ))}
    </div>
  );

  const UserContainer = () => (
    <div className="flex-col pb-2">
      {users.map(user => (
        <ButtonContainer
          key={user?._id}
          type="user"
          url={`/dashboard/user/${user?._id}`}
          img={user?.avatar?.url ? user.avatar.url : 'assets/img/fox.svg'}
          name={user.username ?? user?.wallet ? shortenAddress(user?.wallet) : ""}
        />  
      ))}
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
        <ArtistContainer />
      </TabsContent>
      <TabsContent value="nft">
        <NFTContainer />
      </TabsContent>
      <TabsContent value="curation">
        <CurationContainer />
      </TabsContent>
      <TabsContent value="user">
        <UserContainer />
      </TabsContent>
    </Tabs>
  );
};

export function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedText] = useDebounce(searchText, 1000);
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
      {open && <SearchDropDown searchText={debouncedText} />}
    </div>
  );
}
