"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const marketPlaceLinks = [
  {
    name: "Appreciation",
    value: "appreciate",
    icon: "/icons/sidebar_ico_1.svg"
  },
  {
    name: "Curation",
    value: "curation",
    icon: "/icons/sidebar_ico_3.svg"
  },
  {
    name: "Magazine",
    value: "news",
    icon: "/icons/sidebar_ico_4.svg"
  },
  {
    name: "How to work",
    value: "howtowork",
    icon: "/icons/sidebar_ico_5.svg"
  }
]

const accountLinks = [
  {
    name: "My Profile",
    value: "myProfile",
    icon: "/icons/sidebar_ico_6.svg"
  },
  {
    name: "My favorite",
    value: "myFavorite",
    icon: "/icons/sidebar_ico_7.svg"
  },
  {
    name: "My Order",
    value: "myOrder",
    icon: "/icons/sidebar_ico_8.svg"
  },
  {
    name: "Settings",
    value: "settings",
    icon: "/icons/sidebar_ico_10.svg"
  },
  {
    name: "Help Center",
    value: "helpCenter",
    icon: "/icons/sidebar_ico_11.svg"
  }
]

export default function SideBar() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="bg-black fixed left-0 top-0 h-[100vh] z-20 w-[16rem]">
        <div className="px-10 py-5 mt-10 border-b-2 border-b-gray-700">
            <Image src="/logo.svg" width={120} height={120} alt="logo" />
        </div>
        <button className="flex items-center justify-center gap-x-2 my-5 py-3 px-3 bg-neon rounded-xl w-[80%] mx-auto">
          <span className="font-bold">Create</span>
          <Image src="/icons/file_plus.svg" width={20} height={20} alt="create" />
        </button>
        <div className="flex flex-col gap-y-3 text-white py-5 pl-8 sidebar_list max-h-[60vh] overflow-auto border-t-2 border-t-gray-700">
          <p className="font-medium opacity-40">Marketplace</p>
          {
            marketPlaceLinks.map((link, index) => {
              return (
                <div key={index} className="flex items-center gap-x-3 my-2 cursor-pointer hover:text-[#ddf247] relative"
                onMouseEnter={() => setHovered(link.value)}
                onMouseLeave={() => setHovered(null)}
                >
                  <Image src={link.icon} width={20} height={20} alt={link.name} className="hover:stroke-[#ddf247] hover:fill-[#ddf247]" />
                  <span>{link.name}</span>

                  {
                    hovered === link.value ?
                    <Image src="/icons/line_shape.svg" height={10} width={5} alt="line" className="absolute -left-8" />
                    : null
                  }
                </div>
              )
            })
          }

          <p className="font-medium opacity-40 mt-5">Account</p>
          {
            accountLinks.map((link, index) => {
              return (
                <div key={index} className="flex items-center gap-x-3 my-2 cursor-pointer hover:text-[#ddf247] relative"
                onMouseEnter={() => setHovered(link.value)}
                onMouseLeave={() => setHovered(null)}
                >
                  <Image src={link.icon} width={20} height={20} alt={link.name} className="hover:stroke-[#ddf247]" />
                  <span>{link.name}</span>

                  {
                    hovered === link.value ?
                    <Image src="/icons/line_shape.svg" height={10} width={5} alt="line" className="absolute -left-8" />
                    : null
                  }
                </div>
              )
            })
          }
        </div>
        <p className="pl-8 text-white opacity-45 text-xs mt-5">© 2024 MonsterX</p>
    </div>
  )
}
