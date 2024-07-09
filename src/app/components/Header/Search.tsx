import { SearchIcon } from "lucide-react";

export function Search() {
    return (
        <div className="flex flex-auto gap-5 px-7 py-1.5 w-[400px] rounded-xl bg-neutral-800 leading-[160%] text-white max-md:flex-wrap max-md:px-5 items-center justify-center">
            <input className="flex-1 w-full bg-neutral-800 text-opacity-50 rounded-lg px-4 py-2 leading-tight focus:outline-none focus:border-bg-neutral-800" type="text" placeholder="Search artwork, collection..."></input>
            <SearchIcon size={16} />
        </div>
    )
}