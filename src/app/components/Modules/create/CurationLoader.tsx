import React from 'react';

export default function CurationLoader({
  status,
  edit,
}: {
  edit?: boolean;
  status: { error: boolean; loading: boolean };
}) {
  return (
    <div className="flex flex-col gap-y-6 w-[30rem] pt-[31px] px-[60px] pb-[75px]  justify-center mx-auto">
      {status.loading && (
        <img src="/icons/refresh.svg" className="w-20 h-20 mx-auto" />
      )}

      {!status.error && !status.loading ? (
        <img src="/icons/success.svg" className="w-28 h-28 mx-auto" />
      ) : null}

      {status.error ? (
        <p className="text-center text-[30px] text-[#fff] font-medium">
          Error {edit ? 'Updating' : 'Creating'} Curation
        </p>
      ) : (
        <p className="text-center text-[30px] text-[#fff] font-medium">
          {!status.loading
            ? `Your Cuation is  ${edit ? 'Updated' : 'Created'}`
            : 'Creating Your Collection Please Wait!'}
        </p>
      )}
    </div>
  );
}
