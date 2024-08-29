import React from 'react'

export default function CurationLoader({ status } : { status: { error: boolean, loading: boolean } }) {
  return (
    <div className='flex flex-col gap-y-6 w-[28rem] p-6 justify-center mx-auto'>
        <img src="/icons/refresh.svg" className='w-16 mx-auto' />

        {
            status.error ? 
            <p className='text-center text-lg font-medium'>Error Creating Curation</p>
            : 
            <p className='text-center text-lg font-medium'>{ !status.loading ? 'Curation Created' : 'Uploading Images...' }</p>
        }
    </div>
  )
}
