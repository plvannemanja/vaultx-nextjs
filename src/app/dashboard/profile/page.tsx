'use client';

import Tabs from '@/app/components/Modules/profile/Tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn, truncate } from '@/lib/utils';
import { FavoriteService } from '@/services/FavoriteService';
import { userServices } from '@/services/supplier';
import { trimString } from '@/utils/helpers';
import { Copy, Heart } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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

const desc = `Tellus est commodo nunc a montes. Tempus dolor convallis cras orci turpis sit aenean. Mi enim vitae proin facilisi. Sed tincidunt ullamcorper sed semper a. Rhoncus eu cras vel venenatis vel. Accumsan elit elementum viverra tellus lectus fermentum sapien. Porttitor tortor tristique cras sem leo in lacus. Etiam amet etiam at proin. Porttitor tortor tristique cras sem leo in lacus. Etiam amet etiam at proin.`;

export default function Page() {
  const searchParams = useSearchParams();
  const favoriteService = new FavoriteService();
  const [loadMore, setLoadMore] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [now, setNow] = useState(false);
  const [filterbadge, setFilterBadge] = useState(badges[0].value);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getTab = searchParams.get('tab');
    if (getTab) setFilterBadge(getTab);
  }, [searchParams]);

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

  const description = truncate(desc?.replace(/\r\n|\n/g, '<br />'), 300);

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
          <div>
            {user?.wallet && (
              <div
                className="flex gap-x-3 h-10 text-sm backdrop-blur-sm items-center p-3 rounded-xl text-white border border-white/[29%] cursor-pointer"
                onClick={() => copyAddr()}
              >
                {trimString(user?.wallet)}
                <Copy className="w-5 h-5" />
              </div>
            )}
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
                <Heart
                  className={cn(
                    'w-5 h-5',
                    liked ? 'fill-white' : 'stroke-white',
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col gap-y-6 justify-center items-center text-[24px] font-medium absolute w-full ${user ? 'bottom-[-84px]' : 'bottom-[-48px]'} bottom-[-48px]`}
        >
          <div className="rounded-full w-28 h-28 border-[3px] border-[#DDF247] flex items-center justify-center">
            <Image
              src={
                user?.avatar?.url ? user.avatar.url : '/images/work-default.png'
              }
              alt={user?.username}
              className="w-full h-full rounded-full object-cover"
              width={112}
              height={112}
            />
          </div>
          <span className="text-2xl manrope-font font-semibold">
            {user
              ? user?.username
                ? user?.username
                : trimString(user?.wallet)
              : null}
          </span>
        </div>
      </div>
      <div className="mt-[100px] w-full">
        <div className="w-full bg-[#232323] rounded-lg p-[15px] text-white/50 text-sm azeret-mono-font">
          {/* <p>
            Tellus est commodo nunc a montes. Tempus dolor convallis cras orci
            turpis sit aenean. Mi enim vitae proin facilisi. Sed tincidunt
            ullamcorper sed semper a. Rhoncus eu cras vel venenatis vel.
            Accumsan elit elementum viverra tellus lectus fermentum sapien.
            Porttitor tortor tristique cras sem leo in lacus. Etiam amet etiam
            at proin. Porttitor tortor tristique cras sem leo in lacus. Etiam
            amet etiam at proin.
          </p> */}
          <span
            className="text-[#ffffff53] text-sm font-normal azeret-mono-font"
            dangerouslySetInnerHTML={{
              __html: loadMore
                ? desc?.replace(/\r\n|\n/g, '<br />')
                : description,
            }}
          ></span>
          {description?.length > 300 ? (
            <span
              className="text-[#DDF247] cursor-pointer inline-block ml-3"
              onClick={() => setLoadMore((prev) => !prev)}
            >
              {loadMore ? 'View less' : 'View More'}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex gap-x-5 flex-wrap mt-10">
        {badges.map((badge, index) => {
          return (
            <Badge
              key={index}
              onClick={() => setFilterBadge(badge.value)}
              className={`px-3 py-3 rounded-xl font-extrabold text-[14px] border border-white/[12%] cursor-pointer ${
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
