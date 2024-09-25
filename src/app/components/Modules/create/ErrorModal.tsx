import React from 'react';
import BaseButton from '../../ui/BaseButton';

export default function ErrorModal({
  data,
  close,
  title,
}: {
  data: Array<any> | string;
  close: any;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-y-6 items-center content-center w-[100%] p-10">
      <div className="flex gap-x-3 items-center">
        <img src="/icons/info.svg" className="w-10" />
        <p className="text-[28px] font-medium">{title}</p>
      </div>

      <div className="flex flex-col gap-y-2 mb-[56px]">
        {Array.isArray(data) ? (
          data.map((item: any, index: number) => {
            return (
              <div key={index}>
                <p className="font-medium text-[#ffffff53] azeret-mono-font text-[22px]">
                  {index + 1}.{' '}
                  {item.path[0].slice(0, 1).toUpperCase() +
                    item.path[0].slice(1)}{' '}
                  is invalid
                </p>
              </div>
            );
          })
        ) : (
          <p className="font-medium text-[#ffffff53] azeret-mono-font text-[22px]">
            {data}
          </p>
        )}
      </div>
      <BaseButton
        title="I Agree"
        variant="primary"
        onClick={close}
        className="max-w-[210px]"
      />
    </div>
  );
}
