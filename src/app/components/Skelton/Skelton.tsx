import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <>
        <div className="grid grid-cols-12 w-full gap-4">
            <div className="flex flex-col space-y-3 col-span-4">
                <Skeleton className="h-[300px] w-[100%] rounded-xl" />
                <Skeleton className="h-4 w-[100%]" />
                <div className="space-y-2 gap-4 flex flex-row">
                    <Skeleton className="h-10 w-[100%] mt-2" />
                    <Skeleton className="h-10 w-[100%]" />
                    <Skeleton className="h-10 w-[100%]" />
                </div>
            </div>
            <div className="flex flex-col space-y-3 col-span-4">
                <Skeleton className="h-[300px] w-[100%] rounded-xl" />
                <Skeleton className="h-4 w-[100%]" />
                <div className="space-y-2 gap-4 flex flex-row">
                    <Skeleton className="h-10 w-[100%] mt-2" />
                    <Skeleton className="h-10 w-[100%]" />
                    <Skeleton className="h-10 w-[100%]" />
                </div>
            </div>
            <div className="flex flex-col space-y-3 col-span-4">
                <Skeleton className="h-[300px] w-[100%] rounded-xl" />
                <Skeleton className="h-4 w-[100%]" />
                <div className="space-y-2 gap-4 flex flex-row">
                    <Skeleton className="h-10 w-[100%] mt-2" />
                    <Skeleton className="h-10 w-[100%]" />
                    <Skeleton className="h-10 w-[100%]" />
                </div>
            </div>
           
        
        </div>
    </>
   
  )
}
