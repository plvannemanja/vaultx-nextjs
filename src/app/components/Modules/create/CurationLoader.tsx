import React from 'react';

export default function CurationLoader({
  status,
  edit,
}: {
  edit?: boolean;
  status: { error: boolean; loading: boolean };
}) {
  return (
    <div className="flex flex-col gap-y-6 w-[28rem] p-6 justify-center mx-auto">
      {
        status.loading &&
        <img src="/icons/refresh.svg" className="w-16 mx-auto" />
      }

      {
        (!status.error && !status.loading) ?
          <img src="/icons/success.svg" className="w-16 mx-auto" />
          : null
      }

      {status.error ? (
        <p className="text-center text-lg font-medium">
          Error {edit ? 'Updating' : 'Creating'} Curation
        </p>
      ) : (
        <p className="text-center text-lg font-medium">
          {!status.loading
            ? `Curation ${edit ? 'Updated' : 'Created'}`
            : 'Creating Your Collection Please Wait!'}
        </p>
      )}
    </div>
  );
}
