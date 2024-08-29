import React from 'react'

export default function ErrorModal({ data }: { data: Array<any> }) {
    return (
        <div className='flex flex-col gap-y-6 w-[28rem] p-6'>
            <div className='flex gap-x-3 items-center'>
                <img src="/icons/info.svg" className="w-10" />
                <p className='text-lg font-medium'>Error in creation found</p>
            </div>

            <div className='flex flex-col gap-y-2'>
                {
                    data.map((item: any, index: number) => {
                        return (
                            <div key={index}>
                                <p className='font-medium'>{index + 1}. {item.path[0].slice(0, 1).toUpperCase() + item.path[0].slice(1)} is invalid</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
