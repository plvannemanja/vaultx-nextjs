'use client';

import Tabs from '@/app/components/Modules/profile/Tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FavoriteService } from '@/services/FavoriteService';
import { userServices } from '@/services/supplier';
import { trimString } from '@/utils/helpers';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const profileFilters = [
  {
    label: 'Price: Low To High',
    value: 1,
    param: 'price',
  },
  {
    label: 'Price: High To Low',
    value: -1,
    param: 'price',
  },
  {
    label: 'Recently Minted',
    value: -1,
    param: 'createdAt',
  },
  {
    label: 'Recently Listed',
    value: -1,
    param: 'updatedAt',
  },
  {
    label: 'Most Favorited',
    value: -1,
    param: 'likes',
  },
  {
    label: 'Highest Last Sale',
    value: -1,
    param: 'price',
  },
];

const badges = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Owned',
    value: 'owned',
  },
  {
    label: 'Created',
    value: 'created',
  },
  {
    label: 'Curation',
    value: 'curation',
  },
  {
    label: 'Activity',
    value: 'activity',
  },
  {
    label: 'Favorite',
    value: 'fav',
  },
  {
    label: 'Order',
    value: 'order',
  },
  {
    label: 'Earn',
    value: 'earn',
  },
];

export default function Page() {
  const favoriteService = new FavoriteService();

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [now, setNow] = useState(false);
  const [filterbadge, setFilterBadge] = useState(badges[0].value);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const handleLike = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLiked(event.target.checked);
      if (event.target.checked === true) setLikes(likes + 1);
      else if (event.target.checked === false) setLikes(likes - 1);
      setNow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(user?.wallet);
    toast({
      title: 'Copied to clipboard',
      duration: 2000,
    });
  };

  const fetchData = async () => {
    try {
      let user = await userServices.getSingleUser();

      let artistId = null;

      if (user.data && user.data.user) {
        setUser(user.data.user);
        artistId = user.data.user._id;
      }

      if (!artistId) return;

      const likedArtist = await favoriteService.getArtistsTotalLikes({
        artistId: artistId,
      });
      const reaction = await favoriteService.getUserReactionToArtist({
        artistId: artistId,
      });

      setLikes(likedArtist.data.totalLikedArtist);
      setLiked(reaction.data.favorite);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    toast({
      title: 'Loading Profile details',
      description: 'Please be patient',
      duration: 2000,
    });

    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-y-4 px-4">
      <div className="relative w-full h-[340px]">
        <Image
          src="/images/work-default.png"
          alt="hero"
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />

        <div className="w-full absolute bottom-4 flex justify-between px-5 z-20">
          <div
            className="flex gap-x-3 items-center p-3 rounded-xl text-white border border-[#FFFFFF4A] cursor-pointer"
            onClick={() => copyAddr()}
          >
            {user ? (user?.wallet ? trimString(user?.wallet) : null) : null}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
            >
              <path
                d="M8.66732 7.58333V16.25C8.66732 17.4466 9.63737 18.4167 10.834 18.4167H17.334M8.66732 7.58333V5.41667C8.66732 4.22005 9.63737 3.25 10.834 3.25H15.8019C16.0892 3.25 16.3648 3.36414 16.568 3.5673L21.35 8.34937C21.5532 8.55253 21.6673 8.82808 21.6673 9.1154V16.25C21.6673 17.4466 20.6973 18.4167 19.5006 18.4167H17.334M8.66732 7.58333H7.22287C5.62738 7.58333 4.33398 8.87673 4.33398 10.4722V20.5833C4.33398 21.78 5.30403 22.75 6.50065 22.75H14.4451C16.0406 22.75 17.334 21.4566 17.334 19.8611V18.4167"
                stroke="white"
                strokeWidth="2.16667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex w-[80px] px-[20px] py-[11px] rounded-[61px] gap-x-3 p-3 border items-center border-none bg-[#00000063] cursor-pointer">
            <span className="font-medium">{likes}</span>
            <div>
              <input
                title="like"
                type="checkbox"
                className="sr-only"
                checked={liked}
                onChange={handleLike}
              />
              <div className="checkmark">
                {liked ? (
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#fff"
                    strokeWidth="1.5"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z"
                      fill="#fff"
                    ></path>
                  </svg>
                ) : (
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
                      d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col gap-y-6 justify-center items-center text-[24px] font-medium absolute w-full ${user ? 'bottom-[-84px]' : 'bottom-[-48px]'} bottom-[-48px]`}
        >
          <div className="rounded-full w-29 h-29 border-neon border-2 flex items-center justify-center">
            <img
              src={
                user?.avatar?.url ? user.avatar.url : '/images/work-default.png'
              }
              alt="like"
              className="w-28 h-28 rounded-full object-cover "
            />
          </div>

          {user
            ? user?.username
              ? user?.username
              : trimString(user?.wallet)
            : null}
        </div>
      </div>
      <div className="text-white mt-[100px] w-full">
        <div className="w-full bg-[#232323] rounded-[12px] p-[15px] text-[#FFFFFF87] text-[14px]  azeret-mono-font">
          <p>
            Tellus est commodo nunc a montes. Tempus dolor convallis cras orci
            turpis sit aenean. Mi enim vitae proin facilisi. Sed tincidunt
            ullamcorper sed semper a. Rhoncus eu cras vel venenatis vel.
            Accumsan elit elementum viverra tellus lectus fermentum sapien.
            Porttitor tortor tristique cras sem leo in lacus. Etiam amet etiam
            at proin. Porttitor tortor tristique cras sem leo in lacus. Etiam
            amet etiam at proin.
          </p>
        </div>
      </div>

      <div className="flex gap-x-3 flex-wrap mt-[6rem]">
        {badges.map((badge, index) => {
          return (
            <Badge
              key={index}
              onClick={() => setFilterBadge(badge.value)}
              className={`px-[12px] py-[12px] rounded-[12px] font-extrabold text-[14px] border border-[#FFFFFF1F] cursor-pointer ${
                filterbadge === badge.value
                  ? 'bg-neon text-black hover:text-black hover:bg-[#ddf247]'
                  : 'hover:bg-[#232323] bg-transparent text-white'
              }`}
            >
              {badge.label}
            </Badge>
          );
        })}
      </div>

      <Tabs tab={filterbadge as any} />
    </div>
  );
}
