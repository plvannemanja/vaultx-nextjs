"use client"

import React, { useEffect, useState } from "react"
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popOver"

const categories = [
    {
        value: "a",
        label: "Test Category",
    },
    {
        value: "b",
        label: "Fine Art",
    },
    {
        value: "c",
        label: "Pop Art",
    },
    {
        value: "d",
        label: "Abstract Art",
    }
]

export const prices = [
    {
        value: "e",
        label: "Price: Low to High",
        param: "price",
        paramValue: 1
    },
    {
        value: "f",
        label: "Price: High to Low",
        param: "price",
        paramValue: -1
    },
    {
        value: "g",
        label: "Recently Minted",
        param: "createdAt",
        paramValue: -1
    },
    {
        value: "h",
        label: "Recently Listed",
        param: "updatedAt",
        paramValue: -1
    },
    {
        value: "i",
        label: "Most Favorited",
        param: "likes",
        paramValue: -1
    },
    {
        value: "j",
        label: "Highest Last Sale",
        param: "price",
        paramValue: -1
    },
    {
        value: "k",
        label: "NFC Minted"
    }
]


export default function Filters({ setState } : { setState?: any }) {
    const [search, setSearch] = useState<any>({
        search: '',
        price: {
            label: prices[0].label,
            value: prices[0].paramValue,
            active: false
        },
        category: {
            label: categories[0].label,
            value: categories[0].value,
            active: false
        }
    })

    useEffect(() => {
        if (setState) {
            setState(search)
        }
    }, [search.search, search.price.value, search.category.label])

    return (
        <div className="flex flex-wrap md:flex-nowrap gap-4">
            <div className="flex gap-x-2 items-center">
                <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <Label>Filter</Label>
            </div>

            <div className="relative flex rounded min-w-[18rem] justify-between items-center px-3 py-2 bg-dark text-white">
                <p className="text-sm w-[70%]">{search.category.label}</p>
                {
                    search.category.active ? 
                    <ChevronUpIcon className="h-7 w-7" onClick={() => {
                        setSearch({ ...search, category: { ...search.category, active: !search.category.active } })
                    }} /> :
                    <ChevronDownIcon className="h-7 w-7" onClick={() => {
                        setSearch({ ...search, category: { ...search.category, active: !search.category.active } })
                    }} />
                }

                {
                    search.category.active &&
                    <div className="absolute bg-dark p-3 rounded flex flex-col gap-y-3 min-w-[16rem] top-12 left-0 z-40">
                    {
                        categories.map((category, index: number) => (
                        <span key={index} onClick={() => {
                            setSearch({ ...search, category: { label: category.label, value: category.value, active: false } })
                            setState(category.value)
                        }} className="text-sm cursor-pointer">{category.label}</span>
                        ))
                    }
                    </div>
                }
            </div>
            

            <div className="relative flex rounded min-w-[18rem] justify-between items-center px-3 py-2 bg-dark text-white">
                <p className="text-sm w-[70%]">{search.price.label}</p>
                {
                    search.price.active ? 
                    <ChevronUpIcon className="h-7 w-7" onClick={() => {
                        setSearch({ ...search, price: { ...search.price, active: !search.price.active } })
                    }} /> :
                    <ChevronDownIcon className="h-7 w-7" onClick={() => {
                        setSearch({ ...search, price: { ...search.price, active: !search.price.active } })
                    }} />
                }

                {
                    search.price.active &&
                    <div className="absolute bg-dark p-3 rounded flex flex-col gap-y-3 min-w-[16rem] top-12 left-0 z-40">
                    {
                        prices.map((price, index) => (
                        <span key={index} onClick={() => {
                            setSearch({ ...search, price: { label: price.label, value: price.paramValue, active: false } })
                            setState(price.value)
                        }} className="text-sm cursor-pointer">{price.label}</span>
                        ))
                    }
                    </div>
                }

            </div>

            <div className="flex gap-x-2 items-center border-2 rounded-xl px-2 w-full">
                <svg width="20px" height="20px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M17 17L21 21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>

                <input placeholder="Search by name..." className="w-full bg-transparent border-none outline-none focus:outline-none"
                onChange={(e) => setSearch({ ...search, search: (e.target as any).value })}
                />
            </div>
        </div>
    )
}
