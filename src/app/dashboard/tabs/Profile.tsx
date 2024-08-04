"use client";

import { ComboboxDemo, prices } from "@/app/components/ui/Filters";
import { Badge } from "@/components/ui/badge";
import { trimString } from "@/utils/helpers";
import Image from "next/image";
import { useState } from "react";

const badges = [
    {
        label: "All",
        value: "a",
    },
    {
        label: "Owned",
        value: "b",
    },
    {
        label: "Created",
        value: "c",
    },
    {
        label: "Curation",
        value: "d",
    },
    {
        label: "Activity",
        value: "e",
    },
    {
        label: "Favorite",
        value: "f",
    },
    {
        label: "Order",
        value: "g",
    },
    {
        label: "Earn",
        value: "h",
    }
]

export default function Profile() {
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [now, setNow] = useState(false)
    const [filterbadge, setFilterBadge] = useState(badges[0].value)

    const walletAddr = 'dvkklsa@2...';

    const handleLike = async () => {
        try {
            setLiked(!liked)
            if (!liked === true) setLikes(likes + 1)
            else if (!liked === false) setLikes(likes - 1)
            setNow(true)
        } catch (error) {
            console.log(error)
        }
    }

    const copyAddr = () => {
        navigator.clipboard.writeText(walletAddr)
    }

    return (
        <div className="flex flex-col gap-y-4 px-4">
            <div className="relative">
                <Image src="/images/work-default.png" alt="hero" width={100} height={100} quality={100} className="w-full object-cover rounded-xl h-[340px]" />

                <div className="w-full absolute bottom-4 flex justify-between px-5 z-20">
                    <div className="flex gap-x-3 items-center p-3 rounded-xl text-white border-2 border-white cursor-pointer"
                        onClick={() => copyAddr()}
                    >
                        {trimString(walletAddr)}
                        <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                    <div className="flex w-[80px] pl-[15px] rounded-[30px] gap-x-3 p-3 border-2 items-center border-white bg-gray-600 cursor-pointer">
                        <span className="font-medium">{likes}</span>
                        <div
                            onClick={() => handleLike()}
                        >
                            <input
                                title="like"
                                type="checkbox"
                                className="sr-only"
                                checked={liked}
                            />
                            <div className="checkmark">
                                {
                                    liked ?
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff" strokeWidth="1.5"><path fillRule="evenodd" clipRule="evenodd" d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z" fill="#fff"></path></svg>
                                        :
                                        <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"></path></svg>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center absolute w-full bottom-[-48px]">
                    <img src="/images/work-default.png" alt="like" className="w-28 h-28 rounded-full object-cover border-neon border-2" />
                </div>
            </div>

            <div className="flex gap-x-3 flex-wrap mt-16">
                {
                    badges.map((badge, index) => {
                        return (
                            <Badge
                            key={index} 
                            onClick={() => setFilterBadge(badge.value)}
                            className={`p-3 rounded-2xl border-2 border-gray-500 cursor-pointer ${filterbadge === badge.value ? 
                                'bg-neon text-black hover:text-black hover:bg-[#ddf247]' : 'hover:bg-[#232323] bg-dark text-white'}`}
                            >{badge.label}</Badge>
                        )
                    })
                }
            </div>

            <div className="flex gap-x-4 my-4">
                <div className="flex gap-x-2 items-center border-2 rounded-xl px-2 w-full">
                    <svg width="20px" height="20px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M17 17L21 21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>

                    <input placeholder="Search by name or trait..." className="w-full bg-transparent border-none outline-none focus:outline-none" />
                </div>
                <ComboboxDemo data={prices} title="category" />
            </div>

        </div>
    )
}
